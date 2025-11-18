import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axiosFastAPI from "../../config/axiosFastAPI";
import axiosInstance from "../../config/axios";
import StudentLayout from "../../components/Layouts/StudentLayout";
import FacePreviewPanel from "../../components/Elements/Face/FacePreviewPanel";
import EmbeddingCard from "../../components/Elements/Face/EmbeddingCard";
import SimilarityInfo from "../../components/Elements/Face/SimilarityInfo";
import LogsPanel from "../../components/Elements/Face/LogsPanel";
import FaceUpdateActions from "../../components/Elements/Face/FaceUpdateActions";
import Webcam from "react-webcam";

// Icons
import {
  CameraIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

// ---------------- CAMERA BOX ----------------
function CameraBox({ webcamRef, onCapture, loading }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "user",
              width: 1280,
              height: 720,
            }}
            className="w-full h-full object-cover"
            mirrored
          />
        </div>

        {/* Camera frame decoration */}
        <div className="absolute inset-0 border-2 border-white/30 rounded-2xl pointer-events-none"></div>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>

      <button
        onClick={onCapture}
        disabled={loading}
        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-semibold"
      >
        <CameraIcon className="w-5 h-5" />
        {loading ? "Memproses..." : "Ambil Foto"}
      </button>

      <div className="text-center text-sm text-gray-500 max-w-md">
        <InformationCircleIcon className="w-4 h-4 inline mr-1" />
        Pastikan wajah terlihat jelas dengan pencahayaan yang baik
      </div>
    </div>
  );
}

// ---------------- PAGE ----------------
export default function UpdateFace() {
  const webcamRef = useRef(null);

  // STATE
  const [capturedImage, setCapturedImage] = useState(null);
  const [oldFaceImage, setOldFaceImage] = useState(null);
  const [oldEmbedding, setOldEmbedding] = useState(null);
  const [newEmbedding, setNewEmbedding] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [distance, setDistance] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("camera");
  const [cameraKey, setCameraKey] = useState(Date.now());

  const user = useSelector((state) => state.auth.user);
  const studentId = user?.uuid;

  // Progress steps
  const steps = [
    {
      id: 1,
      name: "Ambil Foto",
      status: stage === "camera" ? "current" : "complete",
    },
    {
      id: 2,
      name: "Verifikasi",
      status:
        stage === "preview"
          ? "current"
          : stage === "camera"
          ? "upcoming"
          : "complete",
    },
    {
      id: 3,
      name: "Konfirmasi",
      status: similarity !== null ? "current" : "upcoming",
    },
  ];

  // LOG helper
  const log = (m) =>
    setLogs((p) => [
      ...p,
      {
        id: Date.now(),
        message: typeof m === "string" ? m : JSON.stringify(m),
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

  // -------- FETCH OLD FACE IMAGE --------
  useEffect(() => {
    if (user?.face_image) {
      setOldFaceImage(user.face_image);
    }
  }, [user]);

  // -------- FETCH OLD EMBEDDING --------
  useEffect(() => {
    const fetchOld = async () => {
      try {
        log("📡 Mengambil embedding lama...");
        const res = await axiosFastAPI.get("/summary");

        if (res.data?.[studentId]) {
          setOldEmbedding(res.data[studentId].centroid);
          log("✅ Embedding lama ditemukan.");
        } else {
          log("ℹ️ Tidak ada embedding lama.");
        }
      } catch (e) {
        log("❌ Gagal mengambil embedding lama.");
      }
    };

    if (studentId) fetchOld();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  // -------- EMBEDDING WITH FASTAPI (preview) --------
  const processEmbedding = async (imageSrc) => {
    const src = imageSrc || capturedImage;
    if (!src) return;

    try {
      setLoading(true);
      log("🚀 Memulai proses embedding...");

      const blob = await fetch(src).then((r) => r.blob());
      const fd = new FormData();
      fd.append("file", blob, "face.jpg");
      fd.append("studentId", studentId);

      const res = await axiosFastAPI.post("/update_face", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status !== "success") {
        toast.error("Embedding gagal");
        log("❌ FastAPI mengembalikan status tidak sukses.");
        return;
      }

      const emb = res.data.embedding;
      setNewEmbedding(emb);

      // Compute similarity
      const sim = cosineSimilarity(oldEmbedding, emb);
      const dist = euclideanDistance(oldEmbedding, emb);

      setSimilarity(sim);
      setDistance(dist);

      log("✅ Embedding baru berhasil dibuat.");
      log(`📊 Similarity: ${(sim * 100).toFixed(1)}%`);
      log(`📊 Distance: ${dist.toFixed(4)}`);
    } catch (err) {
      toast.error("Gagal memproses embedding");
      log("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------- CAPTURE (sekaligus proses embedding) --------
  const handleCapture = async () => {
    if (!webcamRef.current || loading) return;

    const img = webcamRef.current.getScreenshot();
    if (!img) return toast.error("Gagal mengambil foto");

    setCapturedImage(img);
    setNewEmbedding(null);
    setSimilarity(null);
    setDistance(null);
    setLogs([]);

    setStage("preview");
    log("📸 Foto berhasil diambil.");

    // 💡 langsung proses embedding setelah capture
    await processEmbedding(img);
  };

  // -------- CONFIRM UPDATE --------
  const handleConfirm = async () => {
    if (!capturedImage || !newEmbedding) return;

    try {
      setLoading(true);
      log("📡 Mengirim foto baru ke sistem...");

      const blob = await fetch(capturedImage).then((r) => r.blob());

      // --- 1. Update foto di NodeJS ---
      const fdNode = new FormData();
      fdNode.append("face_image", blob, "face.jpg");

      await axiosInstance.patch(`/students/${studentId}`, fdNode, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      log("✅ Foto berhasil diperbarui di database.");

      // Ambil data student terbaru
      try {
        const fresh = await axiosInstance.get(`/students/${studentId}`);
        if (fresh.data?.face_image) {
          setOldFaceImage(fresh.data.face_image);
          log("🔄 Data wajah terbaru berhasil diambil.");
        }
      } catch (e) {
        console.warn("Gagal refresh data student:", e.message);
      }

      // --- 2. Update summary FastAPI ---
      try {
        const fdEnroll = new FormData();
        fdEnroll.append("studentId", studentId);
        fdEnroll.append("file", blob, "face.jpg");

        await axiosFastAPI.post("/enroll", fdEnroll, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        log("✅ Embedding berhasil diperbarui di sistem AI.");
        setOldEmbedding(newEmbedding);
      } catch (e) {
        console.error("Gagal update embedding:", e.message);
        log("⚠️ Gagal memperbarui embedding, tetapi foto sudah terupdate.");
      }

      toast.success("Wajah & embedding berhasil diperbarui!");
      resetFlow();
    } catch (err) {
      toast.error("Gagal update foto");
      log("❌ Error update: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------- RESET FLOW --------
  const resetFlow = () => {
    setCapturedImage(null);
    setNewEmbedding(null);
    setSimilarity(null);
    setDistance(null);
    setLogs([]);
    setStage("camera");
    setCameraKey(Date.now());
  };

  // -------- UTILS: similarity math --------
  const cosineSimilarity = (a, b) => {
    if (!a || !b) return null;

    let dot = 0,
      na = 0,
      nb = 0;

    for (let i = 0; i < 128; i++) {
      const x = parseFloat(a[i]);
      const y = parseFloat(b[i]);
      if (isNaN(x) || isNaN(y)) continue;
      dot += x * y;
      na += x * x;
      nb += y * y;
    }

    if (na === 0 || nb === 0) return null;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  };

  const euclideanDistance = (a, b) => {
    if (!a || !b) return null;

    let s = 0;
    for (let i = 0; i < 128; i++) {
      const x = parseFloat(a[i]);
      const y = parseFloat(b[i]);
      if (isNaN(x) || isNaN(y)) continue;
      const d = x - y;
      s += d * d;
    }
    return Math.sqrt(s);
  };

  // -------- UI --------
  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* HEADER */}
            <div className="text-center space-y-3">
              <motion.h1
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                Update Data Wajah
              </motion.h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Perbarui data wajah Anda untuk meningkatkan akurasi sistem
                presensi
              </p>
            </div>

            {/* PROGRESS STEPS */}
            {stage !== "camera" && (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between relative">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                          step.status === "complete"
                            ? "bg-green-500 border-green-500 text-white"
                            : step.status === "current"
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-300 text-gray-500"
                        }`}
                      >
                        {step.status === "complete" ? (
                          <CheckCircleIcon className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-semibold">
                            {step.id}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium ${
                          step.status === "current"
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  ))}
                  {/* Progress line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{
                        width:
                          stage === "preview"
                            ? "50%"
                            : similarity !== null
                            ? "100%"
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN - Camera & Preview */}
              <div className="space-y-8">
                {/* CAMERA */}
                {stage === "camera" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                  >
                    <CameraBox
                      key={cameraKey}
                      webcamRef={webcamRef}
                      onCapture={handleCapture}
                      loading={loading}
                    />
                  </motion.div>
                )}

                {/* PREVIEW PANEL */}
                {stage === "preview" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                      <CameraIcon className="w-5 h-5 text-blue-600" />
                      Preview Wajah
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FacePreviewPanel
                        title="Wajah Lama"
                        image={getFaceImageURL(oldFaceImage)}
                        type="old"
                      />
                      <FacePreviewPanel
                        title="Wajah Baru"
                        image={capturedImage}
                        type="new"
                      />
                    </div>
                  </motion.div>
                )}

                {/* SIMILARITY INFO */}
                {stage === "preview" && newEmbedding && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                  >
                    <SimilarityInfo
                      similarity={similarity}
                      distance={distance}
                    />
                  </motion.div>
                )}
              </div>

              {/* RIGHT COLUMN - Technical Info */}
              <div className="space-y-8">
                {/* EMBEDDING CARDS */}
                {stage === "preview" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DocumentDuplicateIcon className="w-5 h-5 text-indigo-600" />
                        Data Embedding
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        <EmbeddingCard
                          title="Embedding Lama"
                          embedding={oldEmbedding}
                          type="old"
                        />
                        <EmbeddingCard
                          title="Embedding Baru"
                          embedding={newEmbedding}
                          type="new"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ACTIONS */}
                {stage === "preview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                  >
                    <FaceUpdateActions
                      onConfirm={handleConfirm}
                      onReset={resetFlow}
                      loading={loading || !newEmbedding}
                      similarity={similarity}
                    />
                  </motion.div>
                )}

                {/* LOGS PANEL */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl shadow-2xl p-6"
                >
                  <LogsPanel logs={logs} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </StudentLayout>
  );
}

// -------- UTILS URL FACE IMAGE --------
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
