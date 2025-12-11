import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Webcam from "react-webcam";
import EmbeddingCard from "../../components/Elements/Face/EmbeddingCard";
import FacePreviewPanel from "../../components/Elements/Face/FacePreviewPanel";
import FaceUpdateActions from "../../components/Elements/Face/FaceUpdateActions";
import SimilarityInfo from "../../components/Elements/Face/SimilarityInfo";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";
import axiosFastAPI from "../../config/axiosFastAPI";
import { getFaceImageURL } from "../../utils/getFaceImageURL";

// Icons
import {
  CameraIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

// ---------------- CAMERA BOX ----------------
function CameraBox({ webcamRef, onCapture, loading }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-full max-w-md h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-gradient-to-br from-blue-50 to-indigo-100 mx-auto">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg/jpg"
            className="w-full h-full object-cover"
            mirrored
          />
        </div>
      </div>

      <button
        onClick={onCapture}
        disabled={loading}
        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-semibold"
      >
        <CameraIcon className="w-5 h-5" />
        {loading ? "Memproses..." : "Ambil Foto"}
      </button>
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
  const [successModal, setSuccessModal] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const studentId = user?.uuid;

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
    const fetchStudentData = async () => {
      if (!studentId) return;
      try {
        setLoading(true); // untuk spinner loading
        const res = await axiosInstance.get(`/students/${studentId}`);
        const data = res.data;
        if (data?.face_image) {
          setOldFaceImage(getFaceImageURL(data.face_image));
        } else {
          setOldFaceImage(null);
          toast.warning("Foto wajah lama tidak ditemukan.");
        }

        // Jika Anda butuh data lain (nama, jurusan, dll), ambil di sini
      } catch (e) {
        console.error("Gagal mengambil data mahasiswa:", e);
        toast.error("Gagal memuat data wajah lama.");
        setOldFaceImage(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [studentId]);

  // -------- FETCH OLD EMBEDDING --------
  useEffect(() => {
    const fetchOldEmbedding = async () => {
      if (!studentId) return;

      try {
        log("📡 Mengambil embedding lama dari sistem AI...");
        const res = await axiosFastAPI.get("/summary");

        if (res.data && typeof res.data === "object") {
          const studentData = res.data[studentId];

          if (studentData && studentData.centroid) {
            setOldEmbedding(studentData.centroid);
            log("✅ Embedding lama ditemukan.");
          } else {
            setOldEmbedding(null);
            log(
              "⚠️ Embedding lama tidak tersedia. Anda akan membuat embedding baru."
            );
          }
        } else {
          setOldEmbedding(null);
          log("❌ Format respons /summary tidak valid.");
        }
      } catch (e) {
        console.error("Gagal mengambil embedding:", e);
        log("❌ Gagal mengambil embedding lama.");
        setOldEmbedding(null);
        // Biarkan proses jalan, tapi beri tahu user
        toast(
          "Embedding lama tidak ditemukan. Update tetap bisa dilanjutkan.",
          {
            icon: "ℹ️",
            duration: 4000,
          }
        );
      }
    };

    fetchOldEmbedding();
  }, [studentId]);

  // -------- EMBEDDING WITH FASTAPI (preview) --------
  const processEmbedding = async (imageSrc) => {
    const src = imageSrc || capturedImage;
    if (!src) return;

    try {
      setLoading(true);

      const blob = await fetch(src).then((r) => r.blob());
      const fd = new FormData();
      fd.append("file", blob, "face.jpg");
      fd.append("studentId", studentId);

      const res = await axiosFastAPI.post("/update_face", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status !== "success") {
        toast.error("Embedding gagal");
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

      // --- 1. UPDATE FOTO DI NODEJS ---
      const fdNode = new FormData();
      fdNode.append("face_image", blob, "face.jpg");
      await axiosInstance.patch(`/students/${studentId}`, fdNode, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // --- 2. UPDATE FASTAPI & AMBIL EMBEDDING BARU ---
      try {
        const fdFastAPI = new FormData();
        fdFastAPI.append("studentId", studentId);
        fdFastAPI.append("file", blob, "face.jpg");

        const res = await axiosFastAPI.post("/update_face", fdFastAPI, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.status === "success") {
          const newEmb = res.data.embedding;
          setNewEmbedding(newEmb);
          if (res.data.face_crop_base64) {
            setOldFaceImage(
              `data:image/jpeg;base64,${res.data.face_crop_base64}`
            );
          }

          log("✅ Embedding baru berhasil diperbarui.");
        } else {
          log("⚠️ FastAPI update_face gagal, tetapi foto sudah terupdate.");
        }
      } catch (e) {
        console.error("Gagal update embedding:", e.message);
        log("⚠️ Gagal memperbarui embedding, tetapi foto sudah terupdate.");
      }

      // TOAST BERHASIL
      setSuccessModal(true);
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
      <div className="max-w-6xl mx-auto justify-center items-center">
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
                className="text-3xl text-primary font-bold"
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

            {/* MAIN CONTENT AREA */}
            <div
              className={
                stage === "camera"
                  ? "flex justify-center items-center min-h-[70vh]"
                  : "grid grid-cols-1 lg:grid-cols-2 gap-8"
              }
            >
              {/* LEFT COLUMN - Camera & Preview */}
              <div className="space-y-8">
                {/* CAMERA */}
                {stage === "camera" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100
               flex items-center justify-center min-h-[60vh]"
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
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* ---- SUCCESS MODAL ---- */}
      <AnimatePresence>
        {successModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white px-8 py-10 rounded-2xl shadow-2xl text-center max-w-sm w-full"
            >
              <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />

              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Berhasil Diperbarui!
              </h2>
              <p className="text-gray-600 mb-6">
                Wajah dan embedding Anda telah diperbarui di sistem.
              </p>

              <button
                onClick={() => {
                  setSuccessModal(false);
                  window.location.reload();
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StudentLayout>
  );
}
