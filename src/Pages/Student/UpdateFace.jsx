import {
  ArrowPathIcon,
  CameraIcon,
  CheckCircleIcon,
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
import axiosInstance from "../../config/axios";

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
  // ⚠️ PENTING: selalu utamakan uuid agar sesuai dengan enroll
  const studentId = user?.uuid || user?.id || user?._id;

  useEffect(() => {
    console.log("🧠 Redux user:", user);
    console.log("🎓 Student ID (dipakai ke FastAPI):", studentId);
  }, [user, studentId]);

  useEffect(() => {
    if (studentId) {
      fetchOldData();
      fetchOldFaceImage();
    } else {
      console.warn("⚠️ Student ID belum tersedia, menunggu getMe...");
    }
  }, [studentId]);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      toast.error("Gagal mengambil foto. Coba lagi.");
      return;
    }

    setCapturedImage(imageSrc);
    setCameraActive(false);

    // data lama sudah di-fetch di useEffect, jadi di sini
    // cukup pakai oldEmbeddingData kalau sudah ada
    if (oldEmbeddingData) {
      setComparisonData({
        oldEmbedding: oldEmbeddingData.centroid,
        n_embeddings_old: oldEmbeddingData.n_embeddings,
        n_embeddings_new: 0,
        last_updated: oldEmbeddingData.last_updated,
      });
    }
  };

  const fetchOldData = async () => {
    if (!studentId) return null;

    try {
      setLogs((prev) => [...prev, "📡 Mengambil data wajah lama..."]);

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
        return oldData;
      }

      setLogs((prev) => [
        ...prev,
        "ℹ️ Belum ada embedding lama tersimpan untuk akun ini.",
      ]);
      setOldEmbeddingData(null);
      return null;
    } catch (error) {
      console.log("Tidak dapat mengambil data lama:", error);
      setLogs((prev) => [...prev, "❌ Gagal mengambil data lama dari server."]);
      setOldEmbeddingData(null);
      return null;
    }
  };

  const fetchOldFaceImage = async () => {
    try {
      setLogs((prev) => [...prev, "🖼️ Mengambil foto lama dari backend..."]);
      if (user?.face_image) {
        setOldFaceImage(user.face_image);
        setLogs((prev) => [
          ...prev,
          "✅ Foto lama berhasil diambil dari server",
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          "ℹ️ Belum ada foto wajah yang tersimpan di server.",
        ]);
      }
    } catch (error) {
      console.log("Error mengambil foto lama:", error);
      setLogs((prev) => [...prev, "❌ Gagal mengambil foto lama dari server"]);
    }
  };

  // Cosine similarity
  const calculateSimilarity = (embedding1, embedding2) => {
    if (!embedding1 || !embedding2) return null;

    const e1 = embedding1.slice(0, 128);
    const e2 = embedding2.slice(0, 128);

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < e1.length; i++) {
      const v1 = parseFloat(e1[i]);
      const v2 = parseFloat(e2[i]);
      if (Number.isNaN(v1) || Number.isNaN(v2)) continue;
      dotProduct += v1 * v2;
      norm1 += v1 * v1;
      norm2 += v2 * v2;
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) return null;

    const similarity = dotProduct / (norm1 * norm2);
    return Math.max(0, Math.min(1, similarity));
  };

  // Euclidean distance
  const calculateDistance = (embedding1, embedding2) => {
    if (!embedding1 || !embedding2) return null;

    const e1 = embedding1.slice(0, 128);
    const e2 = embedding2.slice(0, 128);

    let sum = 0;
    for (let i = 0; i < e1.length; i++) {
      const v1 = parseFloat(e1[i]);
      const v2 = parseFloat(e2[i]);
      if (Number.isNaN(v1) || Number.isNaN(v2)) continue;
      const diff = v1 - v2;
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  };

  const handleUpdateFace = async () => {
    if (!capturedImage) {
      toast.error("Harap ambil foto terlebih dahulu");
      return;
    }
    if (!studentId) {
      toast.error("ID mahasiswa tidak ditemukan");
      return;
    }

    try {
      setIsUploading(true);
      setProgress(20);
      setLogs((prev) => [...prev, "🚀 Memulai proses update wajah..."]);

      const base64Response = await fetch(capturedImage);
      const blob = await base64Response.blob();
      const formData = new FormData();
      formData.append("file", blob, "face.jpg");
      formData.append("studentId", studentId);

      const response = await axiosFastAPI.post("/update_face", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      console.log("update_face response:", data);
      setProgress(70);

      if (data.status === "success") {
        toast.success(data.message);

        setSuccess(true);
        setLogs((prev) => [
          ...prev,
          "✅ Embedding baru berhasil dihitung & disimpan",
        ]);

        // simpan foto baru sebagai "foto lama" untuk sesi berikutnya
        try {
          localStorage.setItem(`old_face_${studentId}`, capturedImage);
        } catch (e) {
          console.warn("Gagal menyimpan foto ke localStorage:", e);
        }
        setOldFaceImage(capturedImage);

        const newEmbedding = data.embedding;

        if (Array.isArray(newEmbedding)) {
          const nextComparison = {
            ...(comparisonData || {}),
            newEmbedding,
            n_embeddings_new: 1,
            last_updated: new Date().toLocaleString(),
            processing_time: data.total_time ? `${data.total_time} detik` : "-",
          };

          if (oldEmbeddingData?.centroid) {
            const similarity = calculateSimilarity(
              oldEmbeddingData.centroid,
              newEmbedding
            );
            const distance = calculateDistance(
              oldEmbeddingData.centroid,
              newEmbedding
            );

            nextComparison.oldEmbedding = oldEmbeddingData.centroid;
            nextComparison.n_embeddings_old = oldEmbeddingData.n_embeddings;
            nextComparison.similarity = similarity;
            nextComparison.distance = distance;
          }

          setComparisonData(nextComparison);
        } else {
          console.warn("⚠️ newEmbedding bukan array:", newEmbedding);
        }

        setProgress(100);
        return;
      }

      const msg = data.message || data.reason || "Gagal memperbarui wajah";
      toast.error(msg);
      setLogs((prev) => [...prev, `❌ ${msg}`]);
      setProgress(0);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.reason ||
        err.message ||
        "Terjadi kesalahan server";
      toast.error(msg);
      setLogs((prev) => [...prev, `❌ ${msg}`]);
      setProgress(0);
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
    setProgress(0);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCameraActive(true);
    setComparisonData(null);
    setLogs([]);
    setProgress(0);
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

  const EmbeddingDisplay = ({ embedding, title, type, n_embeddings }) => {
    if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
      return (
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
          </div>
          <p className="text-xs text-gray-500">Embedding belum tersedia.</p>
        </div>
      );
    }

    const norm = Math.sqrt(
      embedding.reduce((sum, val) => {
        const f = parseFloat(val);
        if (Number.isNaN(f)) return sum;
        return sum + f * f;
      }, 0)
    );

    return (
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
            {embedding.slice(0, 12).map((value, index) => {
              const f = parseFloat(value);
              return (
                <span
                  key={index}
                  className="text-gray-600 truncate"
                  title={String(value)}
                >
                  {Number.isNaN(f) ? "NaN" : f.toFixed(3)}
                </span>
              );
            })}
          </div>
          {embedding.length > 12 && (
            <div className="text-center text-gray-400 mt-1">
              ... dan {embedding.length - 12} nilai lainnya
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>Dimensi: {embedding.length} vektor</span>
          <span>Norm: {norm.toFixed(3)}</span>
        </div>
      </div>
    );
  };

  const ComparisonPopup = ({
    open,
    onClose,
    oldFaceImage,
    newFaceImage,
    similarity,
    distance,
    oldEmbedding,
    newEmbedding,
  }) => {
    if (!open) return null;

    const hasMetrics =
      typeof similarity === "number" && typeof distance === "number";
    const simPercent = hasMetrics ? (similarity * 100).toFixed(1) : null;
    const distText = hasMetrics ? distance.toFixed(4) : "–";

    const statusColor = hasMetrics
      ? similarity > 0.5
        ? "text-green-600"
        : "text-yellow-600"
      : "text-gray-600";

    const statusText = !hasMetrics
      ? "Belum tersedia"
      : similarity > 0.5
      ? "Konsisten"
      : "Perlu dicek";

    const statusDesc = !hasMetrics
      ? "Belum ada embedding lama untuk dibandingkan."
      : similarity > 0.5
      ? "Embedding baru masih konsisten dengan wajah lama."
      : "Perbedaan cukup besar, pastikan ini benar wajah Anda.";

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="bg-white w-full max-w-5xl mx-4 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#2A4365] to-[#D4AF37] text-white flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Perbandingan Wajah Lama & Baru
              </h3>
              <p className="text-xs text-white/80">
                Sistem membandingkan embedding wajah lama dengan embedding wajah
                yang baru Anda ambil.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-sm px-3 py-1 rounded-lg border border-white/30 hover:bg-white/10"
            >
              Tutup
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Foto Lama vs Baru */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <PhotoIcon className="w-4 h-4 text-blue-500" />
                  Wajah Lama (Tersimpan)
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center">
                  {oldFaceImage ? (
                    <img
                      src={oldFaceImage}
                      alt="Foto Lama"
                      className="w-40 h-40 rounded-lg object-cover shadow-md mb-2"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500 mb-2">
                      Tidak ada foto lama
                    </div>
                  )}
                  <p className="text-xs text-blue-700">
                    Wajah yang saat ini tersimpan di database.
                  </p>
                </div>

                <EmbeddingDisplay
                  embedding={oldEmbedding}
                  title="Embedding Lama (Centroid)"
                  type="lama"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CameraIcon className="w-4 h-4 text-green-500" />
                  Wajah Baru (Hasil Update)
                </p>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex flex-col items-center">
                  {newFaceImage ? (
                    <img
                      src={newFaceImage}
                      alt="Foto Baru"
                      className="w-40 h-40 rounded-lg object-cover shadow-md mb-2"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500 mb-2">
                      Belum ada foto baru
                    </div>
                  )}
                  <p className="text-xs text-green-700">
                    Wajah terbaru yang baru saja Anda ambil.
                  </p>
                </div>

                <EmbeddingDisplay
                  embedding={newEmbedding}
                  title="Embedding Baru"
                  type="baru"
                />
              </div>
            </div>

            {/* Ringkasan Similarity */}
            <div className="mt-2 rounded-xl border bg-gray-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Similarity (Cosine)
                  </p>
                  <p className={`text-2xl font-bold ${statusColor}`}>
                    {simPercent ? `${simPercent}%` : "–"}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Semakin tinggi, semakin mirip
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Distance (Euclidean)
                  </p>
                  <p className="text-xl font-bold text-gray-700">{distText}</p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Semakin kecil, semakin dekat
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Interpretasi
                  </p>
                  <p className={`text-lg font-bold ${statusColor}`}>
                    {statusText}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">{statusDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-[#2A4365] text-white hover:bg-[#1f3550] transition-colors"
            >
              Tutup Perbandingan
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const handleUpdateFace = async () => {
    if (!capturedImage) return toast.error("Harap ambil foto terlebih dahulu");
    if (!studentUuid) return toast.error("ID mahasiswa tidak ditemukan");

    try {
      setIsUploading(true);
      setProgress(10);
      setLogs(["🚀 Memulai proses update wajah..."]);

      // === 1) Kirim ke FastAPI untuk update embedding ===
      const base64Response = await fetch(capturedImage);
      const blob = await base64Response.blob();

      const formDataFastApi = new FormData();
      formDataFastApi.append("file", blob, "face.jpg");
      formDataFastApi.append("studentId", studentUuid);

      const fastApiRes = await axiosFastAPI.post(
        "/update_face",
        formDataFastApi,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const fastApiData = fastApiRes.data;
      setProgress(50);
      setLogs((prev) => [
        ...prev,
        "✅ Embedding baru berhasil dihitung FastAPI",
      ]);

      if (fastApiData.status !== "success") {
        const msg =
          fastApiData.message || fastApiData.reason || "Update embedding gagal";
        toast.error(msg);
        setLogs((prev) => [...prev, `❌ ${msg}`]);
        setIsUploading(false);
        setProgress(0);
        return;
      }

      // === 2) Kirim ke backend Node untuk ganti face_image di DB ===
      const formDataNode = new FormData();
      formDataNode.append("face_image", blob, "face.jpg"); // ⬅️ nama field sama dengan controller
      formDataNode.append("dummy", "1"); // kalau mau ada body lain

      const nodeRes = await axiosInstance.patch(
        `/students/${studentId}/face`,
        formDataNode,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const nodeData = nodeRes.data;
      if (nodeData.face_image) {
        setOldFaceImage(nodeData.face_image); // update tampilan foto lama jadi foto baru
        setLogs((prev) => [
          ...prev,
          "✅ Foto wajah di database berhasil diperbarui",
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          "⚠️ Foto di database tidak dapat diperbarui (tanpa error fatal).",
        ]);
      }

      setProgress(90);
      toast.success(fastApiData.message || "Update wajah berhasil");
      setSuccess(true);

      // === 3) Update data perbandingan seperti sebelumnya ===
      const newEmbedding = fastApiData.embedding;

      if (Array.isArray(newEmbedding)) {
        const nextComparison = {
          ...(comparisonData || {}),
          newEmbedding,
          n_embeddings_new: 1,
          last_updated: new Date().toLocaleString(),
          processing_time: fastApiData.total_time
            ? `${fastApiData.total_time} detik`
            : "-",
        };

        if (oldEmbeddingData?.centroid) {
          const similarity = calculateSimilarity(
            oldEmbeddingData.centroid,
            newEmbedding
          );
          const distance = calculateDistance(
            oldEmbeddingData.centroid,
            newEmbedding
          );

          nextComparison.oldEmbedding = oldEmbeddingData.centroid;
          nextComparison.n_embeddings_old = oldEmbeddingData.n_embeddings;
          nextComparison.similarity = similarity;
          nextComparison.distance = distance;
        }

        setComparisonData(nextComparison);
      }

      setProgress(100);
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan server";
      toast.error(msg);
      setLogs((prev) => [...prev, `❌ ${msg}`]);
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };
  // debug log
  console.log("=== UpdateFace Render ===");
  console.log("📸 capturedImage:", capturedImage ? "ADA FOTO" : "BELUM ADA");
  console.log("📤 isUploading:", isUploading);
  console.log("📈 progress:", progress);
  console.log("✅ success:", success);
  console.log("🧠 comparisonData:", comparisonData);
  console.log("📂 oldEmbeddingData:", oldEmbeddingData);
  console.log("🖼️ oldFaceImage:", oldFaceImage ? "ADA FOTO LAMA" : "BELUM ADA");
  console.log("🧾 logs:", logs.length, "items");
  console.log("studentId:", studentId);
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
                            {oldFaceImage ? (
                              <img
                                src={oldFaceImage}
                                alt="Foto Lama"
                                className="rounded-lg shadow-md w-48 h-48 object-cover mx-auto mb-3"
                              />
                            ) : (
                              <div className="rounded-lg shadow-inner w-48 h-48 mx-auto mb-3 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                Belum ada foto lama
                              </div>
                            )}
                            <p className="text-sm text-blue-600">
                              Foto yang tersimpan di perangkat / database
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

                        {comparisonData?.newEmbedding && (
                          <EmbeddingDisplay
                            embedding={comparisonData.newEmbedding}
                            title="Embedding Baru (Preview)"
                            type="baru"
                            n_embeddings={comparisonData.n_embeddings_new || 1}
                          />
                        )}
                      </div>
                    </div>

                    {/* Informasi Similarity */}
                    {comparisonData &&
                      typeof comparisonData.similarity === "number" &&
                      typeof comparisonData.distance === "number" && (
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
                              initial={{ width: "0%" }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.4 }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 text-center">
                            {progress}% selesai - Memproses update wajah...
                          </p>
                        </>
                      )}

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
                          {typeof comparisonData.similarity === "number" && (
                            <div className="text-green-700 font-medium text-lg">
                              Similarity:{" "}
                              {(comparisonData.similarity * 100).toFixed(1)}%
                            </div>
                          )}
                          <div className="text-sm text-green-600 mt-1">
                            Embedding baru telah tersimpan di server
                          </div>
                          <div className="text-xs text-green-500 mt-2 space-y-1">
                            <p>
                              Jumlah sampel baru:{" "}
                              {comparisonData.n_embeddings_new} embedding
                            </p>
                            <p>
                              Waktu proses: {comparisonData.processing_time}
                            </p>
                          </div>
                        </div>
                      )}
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

      {/* Popup Perbandingan Wajah Lama & Baru */}
      <AnimatePresence>
        {comparisonData && capturedImage && (
          <ComparisonPopup
            open={true}
            onClose={() => setComparisonData(null)}
            oldFaceImage={oldFaceImage}
            newFaceImage={capturedImage}
            similarity={comparisonData.similarity}
            distance={comparisonData.distance}
            oldEmbedding={oldEmbeddingData?.centroid}
            newEmbedding={comparisonData.newEmbedding}
          />
        )}
      </AnimatePresence>
    </StudentLayout>
  );
};

export default UpdateFace;
