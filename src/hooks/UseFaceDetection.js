// src/hooks/useFaceDetection.js
import { useEffect, useRef, useState } from "react";

const useFaceDetection = (videoRef, enabled = true) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [detections, setDetections] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [lastBlinkTime, setLastBlinkTime] = useState(0);
  const [facePreviewUrl, setFacePreviewUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const faceDetectionRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const blinkThreshold = 0.25;
  const EAR_CONSEC_FRAMES = 2; // minimal frame mata tertutup untuk hitung blink

  // Landmark mata (MediaPipe Face Mesh)
  const LEFT_EYE = [
    362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384,
    398,
  ];
  const RIGHT_EYE = [
    33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246,
  ];

  const calculateEAR = (landmarks, indices) => {
    if (!landmarks || landmarks.length < 478) return 0;
    const p = indices.map((i) => landmarks[i]);
    if (p.length < 16) return 0;
    const A = Math.hypot(p[1].x - p[5].x, p[1].y - p[5].y);
    const B = Math.hypot(p[2].x - p[4].x, p[2].y - p[4].y);
    const C = Math.hypot(p[0].x - p[8].x, p[0].y - p[8].y);
    return (A + B) / (2.0 * C);
  };

  const detectBlink = (ear) => {
    const now = Date.now();
    if (ear < blinkThreshold && now - lastBlinkTime > 1000) {
      setBlinkCount((prev) => prev + 1);
      setLastBlinkTime(now);
      return true;
    }
    return false;
  };

  const cropFaceFromVideo = (video, detection) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const bbox = detection.boundingBox;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const x = Math.max(0, Math.floor(bbox.xMin * vw));
    const y = Math.max(0, Math.floor(bbox.yMin * vh));
    const w = Math.min(vw - x, Math.floor(bbox.width * vw));
    const h = Math.min(vh - y, Math.floor(bbox.height * vh));

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(video, x, y, w, h, 0, 0, w, h);

    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.9);
    });
  };

  const drawOverlay = (video, detections) => {
    if (!contextRef.current || !videoRef.current) return;
    const ctx = contextRef.current;
    const canvas = canvasRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    detections.forEach((detection) => {
      const bbox = detection.boundingBox;
      const x = bbox.xMin * canvas.width;
      const y = bbox.yMin * canvas.height;
      const w = bbox.width * canvas.width;
      const h = bbox.height * canvas.height;

      ctx.strokeStyle = isLive ? "#00FF00" : "#FFA500";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      if (isLive) {
        ctx.fillStyle = "#00FF00";
        ctx.font = "16px Arial";
        ctx.fillText("✅ LIVE", x + 5, y - 10);
      }
    });

    // Status UI
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial";
    ctx.fillText(
      `Wajah: ${detections.length ? "✅ Terdeteksi" : "❌ Tidak terdeteksi"}`,
      10,
      30
    );
    ctx.fillText(`Blinks: ${blinkCount} / 3`, 10, 55);
    ctx.fillText(
      `Liveness: ${isLive ? "✅ Aktif" : "⏳ Kedipkan mata"}`,
      10,
      80
    );
  };

  useEffect(() => {
    if (!enabled || !videoRef.current) return;

    let animationFrameId;
    const init = async () => {
      try {
        const mp = await import("@mediapipe/face_detection");
        const detector = new mp.FaceDetection({
          locateFaces: true,
          model: "short",
          selfieMode: true,
        });

        detector.setOptions({ minDetectionConfidence: 0.5 });
        faceDetectionRef.current = detector;

        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        contextRef.current = canvas.getContext("2d");
        canvasRef.current = canvas;

        detector.onResults((results) => {
          setIsProcessing(false);
          if (!results.detections || results.detections.length === 0) {
            setDetections([]);
            setIsLive(false);
            drawOverlay(video, []);
            return;
          }

          const detection = results.detections[0];
          setDetections([detection]);

          // Update preview
          cropFaceFromVideo(video, detection).then((blob) => {
            const url = URL.createObjectURL(blob);
            setFacePreviewUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return url;
            });
          });

          // Blink detection
          if (detection.landmarks) {
            const leftEAR = calculateEAR(detection.landmarks, LEFT_EYE);
            const rightEAR = calculateEAR(detection.landmarks, RIGHT_EYE);
            const ear = (leftEAR + rightEAR) / 2.0;

            if (detectBlink(ear) && blinkCount + 1 >= 3) {
              setIsLive(true);
            }

            drawOverlay(video, [detection]);
          }
        });

        setIsLoaded(true);

        const animate = () => {
          if (video.readyState >= 2) {
            setIsProcessing(true);
            detector.send({ image: video }).catch(console.error);
          }
          animationFrameId = requestAnimationFrame(animate);
        };
        animate();
      } catch (err) {
        console.error("MediaPipe init failed:", err);
        setIsLoaded(false);
      }
    };

    init();
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (faceDetectionRef.current) faceDetectionRef.current.close();
      if (facePreviewUrl) URL.revokeObjectURL(facePreviewUrl);
    };
  }, [videoRef, enabled]);

  const reset = () => {
    setBlinkCount(0);
    setIsLive(false);
    setFacePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
  };

  return {
    isLoaded,
    detections,
    isLive,
    blinkCount,
    facePreviewUrl,
    isProcessing,
    reset,
  };
};

export default useFaceDetection;
