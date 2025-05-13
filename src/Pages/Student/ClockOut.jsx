import {
  CameraIcon,
  MapPinIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../config/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/Layouts/StudentLayout";
import LocationMap from "../../components/Elements/LocationMap/LocationMap";

const ClockOut = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [message, setMessage] = useState("");

  const { isError, user: authUser } = useSelector((state) => state.auth);
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
  }, []);

  const startVideo = () => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing webcam: ", error);
          setMessage("Tidak dapat mengakses kamera.");
        });
    }
  };

  const captureImageAndLocation = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video) {
      setMessage("Kamera tidak ditemukan.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setImageSrc(canvas.toDataURL("image/png"));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
          if (error.code === 1) {
            setMessage("Izin lokasi ditolak. Silakan aktifkan izin lokasi.");
          } else if (error.code === 2) {
            setMessage("Lokasi tidak tersedia. Pastikan GPS aktif.");
          } else if (error.code === 3) {
            setMessage("Permintaan lokasi timeout. Coba lagi.");
          } else {
            setMessage("Gagal mengambil lokasi.");
          }
        }
      );
    } else {
      setMessage("Browser tidak mendukung Geolocation.");
    }
  };

  const clockOut = async ({ studentId, latitude, longitude, imageSrc }) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], "facePhoto.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("type", "clockOut");
      formData.append("foto", file);

      const res = await axiosInstance.post("/attendances", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      console.error(
        "Clock-Out error:",
        error.response?.data?.msg || error.message
      );
      throw new Error(error.response?.data?.msg || "Clock-Out failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude || !imageSrc || !user?.uuid) {
      setMessage("Mohon pastikan semua data tersedia.");
      return;
    }

    try {
      const result = await clockOut({
        studentId: user.uuid,
        latitude,
        longitude,
        imageSrc,
      });

      setMessage(result.msg);
      navigate(`/attendances/clockout-results/${authUser?.id}`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <ClockIcon className="w-8 h-8" />
            Clock Out
          </h2>
          <p className="text-gray-600 mt-2">Lakukan presensi harian anda</p>
        </div>

        {/* Camera Section */}
        {!imageSrc && (
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
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

        {/* Preview Section */}
        {imageSrc && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Preview Presensi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo Preview */}
                <div className="space-y-2">
                  <img
                    src={imageSrc}
                    alt="Foto presensi"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <CameraIcon className="w-4 h-4" />
                    Foto Presensi
                  </p>
                </div>

                {/* Location Preview */}
                <div className="space-y-2">
                  <div className="h-48 rounded-lg border border-gray-200 overflow-hidden">
                    <LocationMap
                      latitude={latitude}
                      longitude={longitude}
                      onMapClick={() => {}}
                    />
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span>
                      {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <ClockIcon className="w-5 h-5" />
                Konfirmasi Clock Out
              </button>
            </form>
          </div>
        )}

        {/* Message Alert */}
        {message && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </StudentLayout>
  );
};

export default ClockOut;
