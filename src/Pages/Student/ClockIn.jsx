import {
  CameraIcon,
  ClockIcon,
  XMarkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LocationMap from "../../components/Elements/LocationMap/LocationMap";
import AlertAttendancesModal from "../../components/Elements/Modals/AlertAttendancesModal";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";

const ClockIn = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
      if (!showPreviewModal) {
        setImageSrc(null);
        setLatitude(null);
        setLongitude(null);
      }
    };
  }, []);

  const startVideo = () => {
    // Hentikan stream yang ada terlebih dahulu
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: "user" },
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

    // Pastikan video sedang diputar
    if (video.paused || video.ended) {
      setMessage("Kamera tidak aktif. Silakan refresh halaman.");
      return;
    }

    // Set ukuran canvas sama dengan video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Tambahkan delay kecil untuk memastikan frame siap
    setTimeout(() => {
      const context = canvas.getContext("2d");

      // Gambar frame video ke canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        // Konversi ke data URL
        const imageData = canvas.toDataURL("image/png");
        setImageSrc(imageData);
      } catch (error) {
        console.error("Error converting image:", error);
        setMessage("Gagal mengambil gambar. Silakan coba lagi.");
        return;
      }

      // Ambil lokasi
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setShowPreviewModal(true);
          },
          (error) => {
            console.error("Error getting location: ", error);
            // Tetap tampilkan modal meski lokasi gagal
            setShowPreviewModal(true);
          }
        );
      } else {
        setMessage("Browser Anda tidak mendukung Geolocation.");
        setShowPreviewModal(true);
      }
    }, 100); // Delay 100ms
  };

  const verifyFace = async (studentId, imageBlob) => {
    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("image", imageBlob, "face.png");

      // Kirim ke Flask
      const response = await axios.post(`${flaskURL}/verify`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });
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

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setImageSrc(null);
    setLatitude(null);
    setLongitude(null);
    setMessage("");
    setTimeout(() => {
      startVideo();
    }, 100);
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

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="aspect-video relative bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="w-full mt-4 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        )}

        {/* Camera Section */}
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
              onClick={() => {
                captureImageAndLocation();
                setShowPreviewModal(true);
              }}
              className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <CameraIcon className="w-5 h-5" />
              Ambil Foto & Lokasi
            </button>
          </div>
        )}

        {/* Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl  max-w-4xl mx-auto overflow-hidden flex flex-col transform transition-all duration-300 scale-[0.98] hover:scale-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-5 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-6 h-6 text-white/90" />
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Preview Clock In
                    </h3>
                  </div>
                  <button
                    onClick={handleClosePreviewModal}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <XMarkIcon className="w-7 h-7 text-white/90 hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 flex-1 flex flex-col overflow-auto ">
                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-primary/30 border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ClockIcon className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium animate-pulse">
                      Memproses presensi...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-2 gap-8">
                      {/* Foto */}
                      <div className="flex flex-col">
                        <div className="flex items-center mb-4">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            <CameraIcon className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-semibold text-gray-800">
                            Foto Presensi
                          </h4>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center max-h-[60vh]">
                          <img
                            src={imageSrc}
                            alt="Foto presensi"
                            className="object-contain max-h-full w-auto"
                          />
                        </div>
                      </div>

                      {/* Map */}
                      <div className="flex flex-col">
                        <div className="flex items-center mb-4">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            <MapPinIcon className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-semibold text-gray-800">
                            Lokasi Presensi
                          </h4>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 relative max-h-[60vh]">
                          <LocationMap
                            latitude={latitude}
                            longitude={longitude}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden flex flex-col gap-2">
                      {/* Foto */}
                      <div className="flex flex-col h-[35vh]">
                        <div className="flex items-center mb-2">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            <CameraIcon className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-semibold text-gray-800">
                            Foto Presensi
                          </h4>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                          <img
                            src={imageSrc}
                            alt="Foto presensi"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>

                      {/* Map */}
                      <div className="flex flex-col h-[35vh]">
                        <div className="flex items-center mb-3">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            <MapPinIcon className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-semibold text-gray-800">
                            Lokasi Presensi
                          </h4>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 relative">
                          <LocationMap
                            latitude={latitude}
                            longitude={longitude}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <form onSubmit={handleSubmit} className="mt-4">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 font-medium shadow-md hover:shadow-lg transition-transform duration-150"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Memproses...
                          </>
                        ) : (
                          <>
                            <ClockIcon className="w-5 h-5" />
                            Konfirmasi Clock In
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message Alert */}
        {message && (
          <AlertAttendancesModal
            message={message.replace("error:", "").replace("success:", "")}
            onClose={() => setMessage("")}
            type={
              message.startsWith("error:")
                ? "error"
                : message.startsWith("success:")
                ? "success"
                : "info"
            }
          />
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </StudentLayout>
  );
};

export default ClockIn;
