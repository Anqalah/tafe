// src/pages/Attendances/ClockOut.jsx
import { CameraIcon, ClockIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AlertAttendancesModal from "../../components/Elements/Modals/AlertAttendancesModal";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";
import axiosFastAPI from "../../config/axiosFastAPI";
import PreviewModal from "../../components/Elements/Modals/PreviewModal";
import LoadingModal from "../../components/Elements/Modals/LoadingModal";
import { toast } from "react-hot-toast";

const ClockOut = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [user, setUser] = useState(null);
  const [verification, setVerification] = useState(null); // hasil /verify FastAPI

  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ------------ helper URL foto embedding ------------
  const getFaceImageURL = (path) => {
    if (!path) return null;
    let clean = String(path).replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;

    const base = (
      axiosInstance.defaults.baseURL || "http://localhost:8000"
    ).replace(/\/+$/, "");
    clean = clean.replace(/^\/+/, "");
    return `${base}/${clean}`;
  };

  // ------------ init user & kamera ------------
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get("/me");
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setMessage("Gagal mengambil data pengguna.");
      }
    };

    getUser();
    startVideo();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startVideo = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
        setMessage("Tidak dapat mengakses kamera. Pastikan Anda memberi izin.");
      });
  };

  // ------------ verify ke FastAPI (sama seperti ClockIn) ------------
  const verifyFace = async (imageBlob, studentId) => {
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("file", imageBlob, "face.png");
      formData.append("liveness", "true");

      const res = await axiosFastAPI.post("/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 90000,
      });

      console.log("ClockOut verification result:", res.data);
      return res.data;
    } catch (err) {
      console.error("Verification error (axios):", err);

      if (err.response && err.response.data) {
        console.error("Server response:", err.response.data);
        const msg =
          err.response.data.reason ||
          err.response.data.error ||
          "Verifikasi gagal";
        toast.error(msg);
        throw new Error(
          err.response.data.reason ||
            err.response.data.detail ||
            "Verifikasi wajah gagal, coba lagi."
        );
      }

      toast.error("Koneksi ke server verifikasi gagal.");
      throw new Error("Verifikasi wajah gagal, coba lagi.");
    }
  };

  // ------------ kirim clock out ke Node ------------
  const clockOutToNode = async (data) => {
    const formData = new FormData();
    formData.append("studentId", data.studentId);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("confidence", data.confidence);
    formData.append("type", "clockOut");
    formData.append("foto", data.imageBlob, "face.png");

    const res = await axiosInstance.post("/attendances", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 15000,
    });
    return res.data;
  };

  // ------------ capture + lokasi + verify (langsung show preview) ------------
  const captureImageAndLocation = async () => {
    if (!videoRef.current) {
      toast.error("Kamera tidak siap.");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video.videoWidth) {
      toast.error("Kamera belum aktif. Coba lagi.");
      return;
    }

    // capture frame
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setImageSrc(imageData);

    const getLocation = () =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

    try {
      setIsLoading(true);
      setMessage("Memverifikasi wajah...");

      // lokasi
      try {
        const pos = await getLocation();
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      } catch (locErr) {
        console.error("Location error:", locErr);
        toast.error("Tidak dapat mengambil lokasi");
      }

      // blob
      const blob = await (await fetch(imageData)).blob();

      // verify
      const verificationResult = await verifyFace(blob, authUser?.uuid);
      setVerification({
        ...verificationResult,
        imageBlob: blob,
      });

      setShowPreviewModal(true);
    } catch (err) {
      console.error("ClockOut capture/verify error:", err);
      setAlertMessage(err.message || "Terjadi kesalahan saat verifikasi.");
      setAlertType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------ konfirmasi clock out dari preview ------------
  const handleConfirmClockOut = async () => {
    if (!verification || !verification.match) {
      toast.error("Wajah belum terverifikasi, ambil foto ulang.");
      return;
    }

    if (!latitude || !longitude || !imageSrc) {
      toast.error("Lokasi atau foto belum tersedia. Ambil foto ulang.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("Menyimpan presensi...");

      const result = await clockOutToNode({
        studentId: verification.studentId,
        latitude,
        longitude,
        confidence: verification.confidence,
        imageBlob: verification.imageBlob,
      });

      toast.success("Clock out berhasil!");
      setAlertMessage(result.msg || "Presensi berhasil!");
      setAlertType("success");
      setShowPreviewModal(false);

      setTimeout(() => {
        navigate(`/attendances/clockout-results/${authUser?.id}`);
      }, 1200);
    } catch (err) {
      console.error("Clock-out error:", err);
      toast.error(err.message);
      setAlertMessage(err.message || "Terjadi kesalahan saat presensi.");
      setAlertType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------ retake foto ------------
  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setImageSrc(null);
    setLatitude(null);
    setLongitude(null);
    setMessage("");
    setVerification(null);
    startVideo();
  };

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto p-2 space-y-2">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <ClockIcon className="w-8 h-8" />
            Clock Out
          </h2>
          <p className="text-gray-600 mt-2">Lakukan presensi keluar anda</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-2 text-sm flex items-center gap-2">
          <CameraIcon className="w-5 h-5 text-amber-600" />
          <span>
            Pastikan wajah terlihat jelas dengan pencahayaan yang cukup.
          </span>
        </div>

        {!isLoading && !imageSrc && (
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="aspect-[9/8] md:aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={captureImageAndLocation}
              className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <CameraIcon className="w-5 h-5" />
              Ambil Foto
            </button>
          </div>
        )}

        {/* PREVIEW MODAL shared dengan ClockIn */}
        <div className="relative z-[9999]">
          <PreviewModal
            show={showPreviewModal}
            type="clockOut"
            imageSrc={imageSrc}
            embeddingImage={getFaceImageURL(user?.face_image)}
            latitude={latitude}
            longitude={longitude}
            isLoading={isLoading}
            verification={verification}
            onConfirm={handleConfirmClockOut}
            onRetake={handleClosePreviewModal}
          />
        </div>

        <LoadingModal
          isOpen={isLoading}
          message={
            message.startsWith("Memverifikasi")
              ? "Memverifikasi wajah..."
              : message.startsWith("Menyimpan")
              ? "Menyimpan presensi..."
              : "Memproses..."
          }
        />

        {alertMessage && (
          <AlertAttendancesModal
            message={alertMessage}
            onClose={() => setAlertMessage(null)}
            type={alertType}
          />
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </StudentLayout>
  );
};

export default ClockOut;
