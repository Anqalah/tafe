import {
  ArrowPathIcon,
  CameraIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
import axiosFastAPI from "../../config/axiosFastAPI";
import StudentLayout from "../../components/Layouts/StudentLayout";

const UpdateFace = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [success, setSuccess] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);

  // Ambil user_id dari Redux
  const user = useSelector((state) => state.user);
  const user_id = user?.id || user?._id;

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setCameraActive(false);
  };

  const handleUpdateFace = async () => {
    if (!capturedImage) return toast.error("Harap ambil foto terlebih dahulu");

    try {
      setIsUploading(true);
      setLogs(["🔹 Memulai proses update wajah..."]);

      // Convert base64 to file
      const blob = await fetch(capturedImage).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, "face.jpg");
      formData.append("user_id", user_id);

      const response = await axiosFastAPI.post("/update_face", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      // Simulasi log proses embedding
      const simulatedLogs = [
        "📸 Foto wajah berhasil diunggah",
        "🧠 Mengekstraksi fitur wajah...",
        "⚙️ Membuat face embedding...",
        "💾 Menyimpan data ke database...",
        "✅ Wajah berhasil diperbarui!",
      ];

      for (let i = 0; i < simulatedLogs.length; i++) {
        await new Promise((res) => setTimeout(res, 600));
        setLogs((prev) => [...prev, simulatedLogs[i]]);
      }

      if (response.data.success) {
        toast.success("Wajah berhasil diperbarui!");
        setSuccess(true);
      } else {
        toast.error(response.data.message || "Gagal memperbarui wajah");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Terjadi kesalahan server");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const resetAll = () => {
    setCapturedImage(null);
    setLogs([]);
    setSuccess(false);
    setCameraActive(true);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCameraActive(true);
  };

  return (
    <StudentLayout>
      <div className="w-full h-full flex items-center justify-center p-4">
        <Toaster
          position="top-center"
          toastOptions={{
            className: "bg-white text-gray-800 font-medium",
            style: {
              background: "white",
              color: "#1f2937",
            },
          }}
        />

        <motion.div
          className="bg-white rounded-2xl shadow-lg w-full max-w-4xl overflow-hidden border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2A4365] to-[#D4AF37] p-6 relative">
            <div className="text-center text-white">
              <motion.h2
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Update Wajah
              </motion.h2>
              <motion.p
                className="text-white/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Ambil foto selfie untuk memperbarui data wajah Anda
              </motion.p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* 📷 Kamera View */}
              {!capturedImage && !success && cameraActive && (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center space-y-6"
                >
                  <div className="relative">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="rounded-xl border-2 border-gray-200 shadow-md w-full max-w-sm"
                      videoConstraints={{
                        facingMode: "user",
                        width: 400,
                        height: 400,
                      }}
                    />
                    {/* Face Guide Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-2 border-[#D4AF37] rounded-full border-dashed opacity-60"></div>
                    </div>
                    <motion.div
                      className="absolute inset-0 border-2 border-[#D4AF37] rounded-full mx-auto my-auto w-48 h-48 opacity-40"
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  <motion.button
                    onClick={handleCapture}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#E8C44F] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CameraIcon className="w-5 h-5" />
                    Ambil Foto
                  </motion.button>
                </motion.div>
              )}

              {/* 🖼️ Preview & Processing View */}
              {capturedImage && !success && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col lg:flex-row gap-6 items-center justify-center"
                >
                  {/* Preview Image */}
                  <div className="flex-1 flex justify-center">
                    <div className="relative">
                      <img
                        src={capturedImage}
                        alt="Preview Wajah"
                        className="rounded-xl shadow-md border-2 border-gray-200 w-64 h-64 object-cover"
                      />
                    </div>
                  </div>

                  {/* Progress & Actions */}
                  <div className="flex-1 space-y-4 max-w-md">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Konfirmasi Foto
                      </h3>

                      {/* Progress Bar */}
                      {isUploading && (
                        <div className="space-y-3">
                          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-[#D4AF37] to-[#2A4365] h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 text-center">
                            {progress}% selesai
                          </p>

                          {/* Logs */}
                          <div className="bg-gray-50 rounded-xl p-3 max-h-32 overflow-y-auto">
                            <ul className="space-y-1 text-xs">
                              {logs.map((log, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center gap-2 text-gray-600"
                                >
                                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                                  {log}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateFace}
                        disabled={isUploading}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isUploading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-md hover:scale-105"
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="w-4 h-4" />
                            Konfirmasi & Update
                          </>
                        )}
                      </button>

                      <button
                        onClick={retakePhoto}
                        disabled={isUploading}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                        Ulangi
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ✅ Success View */}
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <CheckCircleIcon className="w-16 h-16 text-green-500" />
                    </div>
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      Update Berhasil!
                    </h3>
                    <p className="text-gray-600">
                      Data wajah Anda telah berhasil diperbarui
                    </p>
                  </div>

                  <motion.button
                    onClick={resetAll}
                    className="bg-gradient-to-r from-[#2A4365] to-[#1E293B] text-white px-6 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200 hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Selesai
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </StudentLayout>
  );
};

export default UpdateFace;
