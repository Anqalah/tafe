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

const ClockIn = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { user: authUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosInstance.get("/me");
        setUser(response.data);
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
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
        setMessage("Tidak dapat mengakses kamera. Pastikan Anda memberi izin.");
      });
  };

  const captureImageAndLocation = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      toast.error("Kamera tidak siap.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setImageSrc(imageData);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setShowPreviewModal(true);
      },
      (err) => {
        console.error("Location error:", err);
        toast.error("Tidak dapat mengambil lokasi");
        setShowPreviewModal(true);
      }
    );
  };

  const verifyFace = async (imageBlob, studentId) => {
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("file", imageBlob, "face.png");
      // kirim sebagai string "true" supaya backend Form(bool) bisa parse lebih andal
      formData.append("liveness", "true");

      const res = await axiosFastAPI.post("/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 90000, // beri waktu lebih lama jika perlu
      });

      console.log("Verification result:", res.data);
      return res.data;
    } catch (err) {
      console.error("Verification error (axios):", err);

      if (err.response && err.response.data) {
        console.error("Server response:", err.response.data);
        toast.error(
          err.response.data.reason ||
            err.response.data.error ||
            "Verifikasi gagal"
        );
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

  const clockInToNode = async (data) => {
    const formData = new FormData();
    formData.append("studentId", data.studentId);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("confidence", data.confidence);
    formData.append("type", "clockIn");
    formData.append("foto", data.imageBlob, "face.png");
  
    const res = await axiosInstance.post("/attendances", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 15000,
    });
    return res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    if (!latitude || !longitude || !imageSrc || !user?.uuid) {
      toast.error("Pastikan wajah & lokasi sudah terdeteksi.");
      setIsLoading(false);
      return;
    }

    try {
      const blob = await (await fetch(imageSrc)).blob();
      setMessage("Memverifikasi wajah...");

      const verification = await verifyFace(blob, authUser?.uuid);
      if (!verification.match) {
        throw new Error(
          `Wajah tidak cocok (akurasi: ${(
            verification.confidence * 100
          ).toFixed(2)}%)`
        );
      }

      setMessage("Menyimpan presensi...");

      const result = await clockInToNode({
        studentId: verification.studentId,
        latitude,
        longitude,
        confidence: verification.confidence,
        imageBlob: blob,
      });

      toast.success("Presensi berhasil!");
      setAlertMessage(result.msg || "Presensi berhasil!");
      setAlertType("success");

      setTimeout(() => {
        navigate(`/attendances/clockin-results/${authUser?.id}`);
      }, 1500);
    } catch (err) {
      console.error("Clock-in error:", err);
      toast.error(err.message);
      setAlertMessage(err.message || "Terjadi kesalahan saat presensi.");
      setAlertType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setImageSrc(null);
    setLatitude(null);
    setLongitude(null);
    setMessage("");
    startVideo();
  };

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto p-2 space-y-2">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <ClockIcon className="w-8 h-8" />
            Clock In
          </h2>
          <p className="text-gray-600 mt-2">Lakukan presensi harian anda</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 text rounded-lg px-4 py-2 text-sm flex items-center gap-2">
          <CameraIcon className="w-5 h-5 text-amber-600 items" />
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
              onClick={() => captureImageAndLocation()}
              className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <CameraIcon className="w-5 h-5" />
              Ambil Foto
            </button>
          </div>
        )}

        <div className="relative z-[9999]">
          <PreviewModal
            show={showPreviewModal}
            type="clockIn"
            imageSrc={imageSrc}
            latitude={latitude}
            longitude={longitude}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            handleClose={handleClosePreviewModal}
            message={message}
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

export default ClockIn;
