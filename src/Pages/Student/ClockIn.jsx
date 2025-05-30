import {
  CameraIcon,
  MapPinIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../config/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/Layouts/StudentLayout";
import LocationMap from "../../components/Elements/LocationMap/LocationMap";
import axios from "axios";

const ClockIn = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startVideo = () => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "user",
          },
        })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing webcam: ", error);
          setMessage(
            "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin."
          );
        });
    }
  };

  const captureImageAndLocation = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setMessage("Kamera tidak siap. Silakan coba lagi.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setImageSrc(canvas.toDataURL("image/png"));

    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
          if (error.code === 1) {
            setMessage(
              "Izin lokasi ditolak. Silakan aktifkan izin lokasi di browser Anda."
            );
          } else if (error.code === 2) {
            setMessage(
              "Lokasi tidak tersedia. Pastikan GPS aktif dan coba di area terbuka."
            );
          } else if (error.code === 3) {
            setMessage("Permintaan lokasi timeout. Silakan coba lagi.");
          } else {
            setMessage("Gagal mengambil lokasi. Kode error: " + error.code);
          }
        },
        {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true,
        }
      );
    } else {
      setMessage("Browser Anda tidak mendukung Geolocation.");
    }
  };

  const verifyFace = async (studentId, imageBlob) => {
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("image", imageBlob, "face.png");

      // Kirim ke Flask
      const response = await axios.post(
        "http://localhost:5000/verify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );
      console.log("Verification response:", response.data);
      return response.data;
    } catch (error) {
      let errorDetails = "Verifikasi wajah gagal";

      if (error.response) {
        errorDetails += `: ${error.response.status} - ${
          error.response.data?.error || "No error details"
        }`;
        console.error("Server response:", error.response.data);
      } else if (error.request) {
        errorDetails += ": Tidak ada respons dari server";
        console.error("No response received:", error.request);
      } else {
        errorDetails += `: ${error.message}`;
      }

      console.error("Full error details:", {
        config: error.config,
        message: error.message,
        stack: error.stack,
      });

      throw new Error(errorDetails);
    }
  };

  const clockInToNode = async (data) => {
    try {
      const formData = new FormData();
      formData.append("studentId", data.studentId);
      formData.append("latitude", data.latitude);
      formData.append("longitude", data.longitude);
      formData.append("confidence", data.confidence);
      formData.append("type", "clockIn");
      formData.append("foto", data.imageBlob, "face.png");

      const res = await axiosInstance.post("/attendances", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 15000,
      });

      return res.data;
    } catch (error) {
      console.error("Clock-in error:", error);

      let errorMsg = "Presensi gagal";
      if (error.response) {
        errorMsg += `: ${error.response.data.msg || error.response.statusText}`;
      } else if (error.request) {
        errorMsg += ": Tidak ada respons dari server presensi";
      } else {
        errorMsg += `: ${error.message}`;
      }

      throw new Error(errorMsg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!latitude || !longitude || !imageSrc || !user?.uuid) {
      setMessage("Mohon pastikan semua data tersedia.");
      setIsLoading(false);
      return;
    }

    try {
      // Konversi data URL ke Blob
      const response = await fetch(imageSrc);
      const imageBlob = await response.blob();

      // 1. Verifikasi wajah ke Flask
      setMessage("Memverifikasi wajah...");
      const verification = await verifyFace(user.uuid, imageBlob);

      if (!verification.verified) {
        throw new Error(
          `Wajah tidak dikenali (akurasi: ${(
            verification.confidence * 100
          ).toFixed(2)}%)`
        );
      }

      // 2. Jika verifikasi berhasil, kirim presensi ke Node.js
      setMessage("Menyimpan presensi...");
      const result = await clockInToNode({
        studentId: user.uuid,
        latitude,
        longitude,
        confidence: verification.confidence,
        imageBlob,
      });

      setMessage("success:" + result.msg);
      setTimeout(() => {
        navigate(`/attendances/clockin-results/${authUser?.id}`);
      }, 2000);
    } catch (error) {
      setMessage("error:" + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <ClockIcon className="w-8 h-8" />
            Clock In
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
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={captureImageAndLocation}
              className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isLoading}
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
                className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <ClockIcon className="w-5 h-5" />
                )}
                Konfirmasi Clock In
              </button>
            </form>
          </div>
        )}

        {/* Message Alert */}
        {message && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              message.startsWith("error:")
                ? "bg-red-50 text-red-700"
                : message.startsWith("success:")
                ? "bg-green-50 text-green-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {message.startsWith("error:") ? (
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
            ) : message.startsWith("success:") ? (
              <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ClockIcon className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.replace("error:", "").replace("success:", "")}</span>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </StudentLayout>
  );
};

export default ClockIn;
