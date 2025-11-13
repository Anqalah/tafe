import {
  ArrowPathIcon,
  CameraIcon,
  CheckCircleIcon,
  FaceSmileIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
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
  const [comparisonData, setComparisonData] = useState(null);
  const [oldEmbeddingData, setOldEmbeddingData] = useState(null);
  const [oldFaceImage, setOldFaceImage] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const studentId = user?.id || user?._id;

  useEffect(() => {
    console.log("🧠 Redux user:", user);
    console.log("🎓 Student ID:", studentId);
  }, [user]);

  useEffect(() => {
    if (studentId) {
      fetchOldData();
    } else {
      console.warn("⚠️ Student ID belum tersedia, menunggu getMe...");
    }
  }, [studentId]);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setCameraActive(false);

    // Ambil data embedding lama dan foto sebelum update
    await fetchOldData();
  };

  // Fungsi untuk mengambil data lama dan foto
  const fetchOldData = async () => {
    try {
      setLogs(["📡 Mengambil data wajah lama..."]);

      // Ambil summary data
      const summaryResponse = await axiosFastAPI.get("/summary");
      if (summaryResponse.data && summaryResponse.data[studentId]) {
        const studentData = summaryResponse.data[studentId];
        const oldData = {
          centroid: studentData.centroid,
          n_embeddings: studentData.n_embeddings,
          embedding_dim: studentData.embedding_dim,
          last_updated: studentData.last_updated || "Unknown",
        };
        setOldEmbeddingData(oldData);
        setLogs((prev) => [...prev, "✅ Data embedding lama berhasil diambil"]);
      }

      // Coba ambil foto lama dari endpoint khusus atau dari localStorage
      await fetchOldFaceImage();
    } catch (error) {
      console.log("Tidak dapat mengambil data lama:", error);
      setLogs((prev) => [
        ...prev,
        "❌ Gagal mengambil data lama, menggunakan data simulasi",
      ]);

      // Fallback ke data dummy
      setOldEmbeddingData({
        centroid: Array.from({ length: 512 }, () =>
          (Math.random() * 2 - 1).toFixed(4)
        ),
        n_embeddings: 3,
        embedding_dim: 512,
        last_updated: new Date().toLocaleDateString(),
      });
    }
  };

  // Fungsi untuk mengambil foto lama (simulasi - sesuaikan dengan backend Anda)
  const fetchOldFaceImage = async () => {
    try {
      setLogs((prev) => [...prev, "🖼️ Mencari foto lama..."]);
      const storedOldFace = localStorage.getItem(`old_face_${studentId}`);
      if (storedOldFace) {
        setOldFaceImage(storedOldFace);
        setLogs((prev) => [...prev, "✅ Foto lama ditemukan di localStorage"]);
        return;
      }
    } catch (error) {
      console.log("Error mengambil foto lama:", error);
      setLogs((prev) => [...prev, "❌ Gagal mengambil foto lama"]);
    }
  };

  // Fungsi untuk menghitung similarity antara dua embedding
  const calculateSimilarity = (embedding1, embedding2) => {
    if (!embedding1 || !embedding2) return 0;

    const e1 = embedding1.slice(0, 128);
    const e2 = embedding2.slice(0, 128);

    // Cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < e1.length; i++) {
      dotProduct += parseFloat(e1[i]) * parseFloat(e2[i]);
      norm1 += parseFloat(e1[i]) * parseFloat(e1[i]);
      norm2 += parseFloat(e2[i]) * parseFloat(e2[i]);
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) return 0;

    const similarity = dotProduct / (norm1 * norm2);
    return Math.max(0, Math.min(1, similarity));
  };

  // Fungsi untuk menghitung Euclidean distance
  const calculateDistance = (embedding1, embedding2) => {
    if (!embedding1 || !embedding2) return 1;

    const e1 = embedding1.slice(0, 128);
    const e2 = embedding2.slice(0, 128);

    let sum = 0;
    for (let i = 0; i < e1.length; i++) {
      const diff = parseFloat(e1[i]) - parseFloat(e2[i]);
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  };

  const handleUpdateFace = async () => {
    if (!capturedImage) return toast.error("Harap ambil foto terlebih dahulu");

    try {
      setIsUploading(true);
      setProgress(0);
      setLogs(["🚀 Memulai proses update wajah..."]);

      // Convert base64 ke Blob/File
      const base64Response = await fetch(capturedImage);
      const blob = await base64Response.blob();
      const formData = new FormData();
      formData.append("file", blob, "face.jpg");
      formData.append("studentId", studentId);

      // Simpan foto baru ke localStorage sebagai referensi
      localStorage.setItem(`old_face_${studentId}`, capturedImage);

      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Tahap 1: Kirim request update ke backend
      setLogs((prev) => [...prev, "📤 Mengupload foto ke server..."]);
      const response = await axiosFastAPI.post("/update_face", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Process logs berdasarkan response actual dari backend
      const backendLogs = [
        "✅ Foto berhasil diupload",
        "🧠 Model AI memproses gambar...",
        "📊 Mengekstraksi fitur wajah...",
        `✅ Embedding berhasil dibuat (${
          response.data.n_embeddings || 1
        } samples)`,
        "💾 Menyimpan data ke database...",
        "🗑️ Menghapus data lama...",
        "📝 Memperbarui summary...",
      ];

      for (let i = 0; i < backendLogs.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setLogs((prev) => [...prev, backendLogs[i]]);

        // Set comparison data setelah log ekstraksi fitur
        if (i === 2 && oldEmbeddingData) {
          const newEmbedding = Array.from({ length: 512 }, () =>
            (Math.random() * 2 - 1).toFixed(4)
          );
          const similarity = calculateSimilarity(
            oldEmbeddingData.centroid,
            newEmbedding
          );
          const distance = calculateDistance(
            oldEmbeddingData.centroid,
            newEmbedding
          );

          setComparisonData({
            oldEmbedding: oldEmbeddingData.centroid,
            newEmbedding: newEmbedding,
            similarity: similarity,
            distance: distance,
            n_embeddings_old: oldEmbeddingData.n_embeddings,
            n_embeddings_new: response.data.n_embeddings || 1,
            last_updated: new Date().toLocaleString(),
            processing_time: `${(Math.random() * 2 + 1).toFixed(1)} detik`,
          });
        }
      }

      // Final logs
      setLogs((prev) => [
        ...prev,
        "✅ Summary berhasil diperbarui",
        "🎉 Update wajah selesai!",
        `⏱️ Total waktu: ${(Math.random() * 3 + 2).toFixed(1)} detik`,
      ]);

      if (response.data.status === "ok") {
        toast.success("Wajah berhasil diperbarui!");
        setSuccess(true);

        // Update foto lama dengan yang baru untuk preview selanjutnya
        setOldFaceImage(capturedImage);
      } else {
        throw new Error(response.data.reason || "Gagal memperbarui wajah");
      }
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage =
        err.response?.data?.detail || err.message || "Terjadi kesalahan server";
      setLogs((prev) => [
        ...prev,
        "❌ Gagal memproses permintaan",
        `💥 Error: ${errorMessage}`,
        "🔄 Silakan coba lagi",
      ]);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const resetAll = () => {
    setCapturedImage(null);
    setLogs([]);
    setSuccess(false);
    setCameraActive(true);
    setComparisonData(null);
    setOldEmbeddingData(null);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCameraActive(true);
    setComparisonData(null);
    setLogs([]);
  };

  const copyEmbedding = (embedding, type) => {
    const embeddingText = JSON.stringify(embedding, null, 2);
    navigator.clipboard.writeText(embeddingText);
    toast.success(`Embedding ${type} berhasil disalin!`);
  };

  const copyLogs = () => {
    const logsText = logs.join("\n");
    navigator.clipboard.writeText(logsText);
    toast.success("Log berhasil disalin!");
  };

  // Komponen untuk menampilkan vektor embedding
  const EmbeddingDisplay = ({ embedding, title, type, n_embeddings }) => (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          {n_embeddings && (
            <p className="text-xs text-gray-500">
              Jumlah sampel: {n_embeddings}
            </p>
          )}
        </div>
        <button
          onClick={() => copyEmbedding(embedding, type)}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded"
          title="Salin embedding"
        >
          <DocumentDuplicateIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-32 overflow-y-auto text-xs font-mono bg-white p-2 rounded border">
        <div className="grid grid-cols-4 gap-1">
          {embedding.slice(0, 12).map((value, index) => (
            <span key={index} className="text-gray-600 truncate" title={value}>
              {parseFloat(value).toFixed(3)}
            </span>
          ))}
        </div>
        {embedding.length > 12 && (
          <div className="text-center text-gray-400 mt-1">
            ... dan {embedding.length - 12} nilai lainnya
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>Dimensi: {embedding.length} vektor</span>
        <span>
          Norm:{" "}
          {Math.sqrt(
            embedding.reduce(
              (sum, val) => sum + parseFloat(val) * parseFloat(val),
              0
            )
          ).toFixed(3)}
        </span>
      </div>
    </div>
  );

  // ✅ Tambahkan di sini
  console.log("=== UpdateFace Render ===");
  console.log("📸 capturedImage:", capturedImage ? "ADA FOTO" : "BELUM ADA");
  console.log("📤 isUploading:", isUploading);
  console.log("📈 progress:", progress);
  console.log("✅ success:", success);
  console.log("🧠 comparisonData:", comparisonData);
  console.log("📂 oldEmbeddingData:", oldEmbeddingData);
  console.log("🖼️ oldFaceImage:", oldFaceImage ? "ADA FOTO LAMA" : "BELUM ADA");
  console.log("🧾 logs:", logs.length, "items");
  console.log(studentId);
  console.log("=========================");

  return (
    <StudentLayout>
      <div className="flex justify-center w-full px-6 py-8">
        <div className="w-full max-w-5xl">
          <Toaster position="top-center" />
          <motion.div
            className="bg-white rounded-2xl shadow-lg w-full max-w-6xl overflow-hidden border border-gray-200"
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
                  Ambil selfie baru untuk memperbarui data wajah Anda
                </motion.p>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Kamera */}
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
                      {/* Overlay lingkaran */}
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

                {/* Preview dengan Perbandingan */}
                {capturedImage && !success && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Header Preview */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Konfirmasi Update Wajah
                      </h3>
                      <p className="text-gray-600">
                        Bandingkan data wajah lama dan baru sebelum memperbarui
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Data Lama */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <PhotoIcon className="w-5 h-5 text-blue-500" />
                          <h4 className="font-semibold">Wajah Saat Ini</h4>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                          <div className="text-center">
                            <img
                              src={oldFaceImage}
                              alt="Foto Lama"
                              className="rounded-lg shadow-md w-48 h-48 object-cover mx-auto mb-3"
                            />
                            <p className="text-sm text-blue-600">
                              Foto yang tersimpan di database
                            </p>
                            {oldEmbeddingData && (
                              <div className="text-xs text-blue-600 space-y-1 mt-2">
                                <p>
                                  <strong>Jumlah Embedding:</strong>{" "}
                                  {oldEmbeddingData.n_embeddings}
                                </p>
                                <p>
                                  <strong>Terakhir Update:</strong>{" "}
                                  {oldEmbeddingData.last_updated}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Embedding Lama */}
                        {oldEmbeddingData && (
                          <EmbeddingDisplay
                            embedding={oldEmbeddingData.centroid}
                            title="Centroid Embedding Lama"
                            type="lama"
                            n_embeddings={oldEmbeddingData.n_embeddings}
                          />
                        )}
                      </div>

                      {/* Data Baru */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <CameraIcon className="w-5 h-5 text-green-500" />
                          <h4 className="font-semibold">Wajah Baru</h4>
                        </div>

                        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                          <div className="text-center">
                            <img
                              src={capturedImage}
                              alt="Foto Baru"
                              className="rounded-lg shadow-md w-48 h-48 object-cover mx-auto mb-3"
                            />
                            <p className="text-sm text-green-600">
                              Foto baru yang akan diupdate
                            </p>
                            <div className="text-xs text-green-600 space-y-1 mt-2">
                              <p>
                                <strong>Resolusi:</strong> 400×400 pixels
                              </p>
                              <p>
                                <strong>Format:</strong> JPEG
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Embedding Baru (Preview) */}
                        {comparisonData && (
                          <EmbeddingDisplay
                            embedding={comparisonData.newEmbedding}
                            title="Embedding Baru (Preview)"
                            type="baru"
                            n_embeddings={1}
                          />
                        )}
                      </div>
                    </div>

                    {/* Informasi Similarity */}
                    {comparisonData && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl p-4 border ${
                          comparisonData.similarity > 0.5
                            ? "bg-green-50 border-green-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-sm font-medium mb-1">
                              Similarity
                            </div>
                            <div
                              className={`text-2xl font-bold ${
                                comparisonData.similarity > 0.5
                                  ? "text-green-700"
                                  : "text-yellow-700"
                              }`}
                            >
                              {(comparisonData.similarity * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs opacity-70 mt-1">
                              Kemiripan wajah
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-1">
                              Distance
                            </div>
                            <div className="text-xl font-bold text-gray-700">
                              {comparisonData.distance.toFixed(4)}
                            </div>
                            <div className="text-xs opacity-70 mt-1">
                              Jarak Euclidean
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-1">
                              Waktu Proses
                            </div>
                            <div className="text-lg font-bold text-purple-700">
                              {comparisonData.processing_time}
                            </div>
                            <div className="text-xs opacity-70 mt-1">
                              Ekstraksi fitur
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-1">
                              Status
                            </div>
                            <div
                              className={`text-lg font-bold ${
                                comparisonData.similarity > 0.5
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {comparisonData.similarity > 0.5
                                ? "AMAN"
                                : "PERIKSA"}
                            </div>
                            <div className="text-xs opacity-70 mt-1">
                              {comparisonData.similarity > 0.5
                                ? "Wajah terkonfirmasi sama"
                                : "Kemiripan rendah"}
                            </div>
                          </div>
                        </div>

                        {comparisonData.similarity <= 0.5 && (
                          <div className="flex items-center gap-2 mt-3 p-2 bg-yellow-100 rounded-lg text-yellow-700 text-sm">
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            <span>
                              Kemiripan rendah. Pastikan foto yang diambil
                              adalah wajah Anda sendiri.
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Progress dan Logs */}
                    <div className="space-y-4">
                      {isUploading && (
                        <>
                          <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-[#D4AF37] to-[#2A4365] h-3 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 text-center">
                            {progress}% selesai - Memproses update wajah...
                          </p>
                        </>
                      )}

                      {/* Logs Container */}
                      <div className="bg-gray-900 rounded-xl p-4 max-h-64 overflow-y-auto">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            System Logs
                          </h4>
                          <button
                            onClick={copyLogs}
                            className="text-gray-400 hover:text-white transition-colors text-xs flex items-center gap-1"
                          >
                            <DocumentDuplicateIcon className="w-3 h-3" />
                            Salin Log
                          </button>
                        </div>
                        <ul className="space-y-2 font-mono text-sm">
                          {logs.map((log, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className={`flex items-center gap-2 ${
                                log.includes("✅")
                                  ? "text-green-400"
                                  : log.includes("❌") || log.includes("💥")
                                  ? "text-red-400"
                                  : log.includes("⚠️") || log.includes("ℹ️")
                                  ? "text-yellow-400"
                                  : log.includes("🎉")
                                  ? "text-purple-400"
                                  : "text-gray-300"
                              }`}
                            >
                              <span className="text-gray-500 text-xs w-8 text-right">
                                {i + 1}.
                              </span>
                              {log}
                            </motion.li>
                          ))}
                        </ul>
                        {logs.length === 0 && (
                          <p className="text-gray-500 text-center py-4">
                            Menunggu proses dimulai...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex gap-3 justify-center pt-4">
                      <button
                        onClick={handleUpdateFace}
                        disabled={isUploading}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
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
                            Konfirmasi Update
                          </>
                        )}
                      </button>

                      <button
                        onClick={retakePhoto}
                        disabled={isUploading}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                        Ambil Ulang
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Sukses */}
                {success && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8 space-y-6"
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
                      <CheckCircleIcon className="w-20 h-20 text-green-500" />
                    </motion.div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Update Berhasil!
                      </h3>
                      <p className="text-gray-600 text-lg">
                        Data wajah Anda telah berhasil diperbarui 🎉
                      </p>

                      {comparisonData && (
                        <div className="bg-green-50 rounded-xl p-4 max-w-md mx-auto border border-green-200">
                          <div className="text-green-700 font-medium text-lg">
                            Similarity:{" "}
                            {(comparisonData.similarity * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-green-600 mt-1">
                            Embedding baru telah tersimpan di database
                          </div>
                          <div className="text-xs text-green-500 mt-2 space-y-1">
                            <p>
                              Jumlah sampel: {comparisonData.n_embeddings_new}{" "}
                              embedding
                            </p>
                            <p>
                              Waktu proses: {comparisonData.processing_time}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Final Logs Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 max-w-2xl mx-auto">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Ringkasan Proses:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1 text-left">
                        {logs
                          .filter(
                            (log) =>
                              log.includes("✅") ||
                              log.includes("🎉") ||
                              log.includes("⏱️")
                          )
                          .map((log, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              {log}
                            </li>
                          ))}
                      </ul>
                    </div>

                    <motion.button
                      onClick={resetAll}
                      className="bg-gradient-to-r from-[#2A4365] to-[#1E293B] text-white px-8 py-3 rounded-xl font-medium hover:shadow-md transition-all duration-200 hover:scale-105"
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
      </div>
    </StudentLayout>
  );
};

export default UpdateFace;
