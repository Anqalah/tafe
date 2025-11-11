import {
  CameraIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../config/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axios from "axios";
import AlertAttendancesModal from "../../components/Elements/Modals/AlertAttendancesModal";
import PreviewModal from "../../components/Elements/Modals/PreviewModal";
import LoadingModal from "../../components/Elements/Modals/LoadingModal";

const ClockOut = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  const { user: authUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const flaskURL = "http://localhost:5000";
  // const flaskURL = "https://taml.onrender.com";

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axiosInstance.get("/me");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setAlertMessage("Gagal mengambil data pengguna.");
        setAlertType("error");
      }
    };

    getUser();
    startVideo();

    return () => stopVideo();
  }, []);

  const startVideo = () => {
    stopVideo();
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing webcam: ", error);
          setAlertMessage(
            "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin."
          );
          setAlertType("error");
        });
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const captureImageAndLocation = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video || !video.videoWidth) {
      setAlertMessage("Kamera belum siap. Silakan coba lagi.");
      setAlertType("error");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    setTimeout(() => {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const imageData = canvas.toDataURL("image/png");
        setImageSrc(imageData);
      } catch (err) {
        console.error("Error converting image:", err);
        setAlertMessage("Gagal mengambil gambar. Coba lagi.");
        setAlertType("error");
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLatitude(pos.coords.latitude);
            setLongitude(pos.coords.longitude);
            setShowPreviewModal(true);
          },
          (err) => {
            console.error("Error getting location:", err);
            setShowPreviewModal(true); // tetap buka preview
          }
        );
      } else {
        setAlertMessage("Browser Anda tidak mendukung Geolocation.");
        setAlertType("error");
        setShowPreviewModal(true);
      }
    }, 100);
  };

  const verifyFace = async (studentId, imageBlob) => {
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("image", imageBlob, "face.png");

      const res = await axios.post(`${flaskURL}/verify`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });
      return res.data;
    } catch (error) {
      let details = "Verifikasi wajah gagal";
      if (error.response)
        details += `: ${error.response.status} - ${error.response.data?.error}`;
      else if (error.request)
        details += ": Tidak ada respons dari server";
      else details += `: ${error.message}`;
      throw new Error(details);
    }
  };

  const clockOutToNode = async (data) => {
    try {
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
    } catch (error) {
      let msg = "Presensi gagal";
      if (error.response)
        msg += `: ${error.response.data.msg || error.response.statusText}`;
      else if (error.request)
        msg += ": Tidak ada respons dari server presensi";
      else msg += `: ${error.message}`;
      throw new Error(msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlertMessage("");

    if (!latitude || !longitude || !imageSrc || !user?.uuid) {
      setAlertMessage("Mohon pastikan semua data tersedia.");
      setAlertType("error");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(imageSrc);
      const imageBlob = await res.blob();

      const verify = await verifyFace(user.uuid, imageBlob);

      if (!verify.verified) {
        throw new Error(
          `Wajah tidak cocok (akurasi: ${(verify.confidence * 100).toFixed(2)}%)`
        );
      }

      const result = await clockOutToNode({
        studentId: user.uuid,
        latitude,
        longitude,
        confidence: verify.confidence,
        imageBlob,
      });

      setAlertMessage(result.msg || "Presensi berhasil!");
      setAlertType("success");
      setShowPreviewModal(false);

      setTimeout(() => {
        navigate(`/attendances/clockout-results/${authUser?.id}`);
      }, 2000);
    } catch (err) {
      console.error("Clock-out error:", err);
      setAlertMessage(err.message);
      setAlertType("error");
      setShowPreviewModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setTimeout(() => startVideo(), 100);
  };

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <ClockIcon className="w-8 h-8" />
            Clock Out
          </h2>
          <p className="text-gray-600 mt-2">Lakukan presensi keluar Anda</p>
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
              Ambil Foto & Lokasi
            </button>
          </div>
        )}

        <PreviewModal
          show={showPreviewModal}
          type="clockOut"
          imageSrc={imageSrc}
          latitude={latitude}
          longitude={longitude}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          handleClose={handleClosePreviewModal}
        />

        <LoadingModal
          isOpen={isLoading}
          message="Memproses presensi..."
        />

        {alertMessage && (
          <AlertAttendancesModal
            message={alertMessage}
            onClose={() => setAlertMessage("")}
            type={alertType}
          />
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </StudentLayout>
  );
};

export default ClockOut;
