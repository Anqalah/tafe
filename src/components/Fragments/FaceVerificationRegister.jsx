import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import Button from "../Elements/Button";
import AuthLayout from "../Layouts/AuthLayouts";
import axiosInstance from "../../config/axios";
import { Modal } from "../Elements/Modals/Modal";

const FaceVerificationRegister = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [modal, setModal] = useState({ show: false, type: "", message: "" });

  // 👉 hasil embedding dari backend
  const [embeddingResult, setEmbeddingResult] = useState(null);
  // 👉 countdown & timeout untuk auto-redirect
  const [redirectCountdown, setRedirectCountdown] = useState(15);
  const [redirectTimeoutId, setRedirectTimeoutId] = useState(null);

  // Ambil token dari URL (?token=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) {
      navigate("/register", {
        state: { error: "Token verifikasi tidak valid" },
      });
      return;
    }
    setVerificationToken(token);
  }, [location.search, navigate]);

  // Buka kamera
  useEffect(() => {
    let stream = null;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 1280, height: 720 },
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError("Gagal mengakses kamera: " + err.message);
      }
    };
    initCamera();
    return () => stream && stream.getTracks().forEach((t) => t.stop());
  }, []);

  // Saat embeddingResult ter-set, mulai hitung mundur & jadwalkan redirect
  useEffect(() => {
    if (!embeddingResult) return;

    // reset countdown ke 15 tiap kali popup muncul
    setRedirectCountdown(15);

    // interval untuk update angka detik di UI
    const intervalId = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // timeout: auto pindah ke login setelah 15 detik
    const timeoutId = setTimeout(() => {
      navigate("/login");
    }, 15000);
    setRedirectTimeoutId(timeoutId);

    // bersihkan interval & timeout kalau komponen unmount / popup hilang
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [embeddingResult, navigate]);

  // Tangkap satu frame wajah dari kamera
  const captureFaceImage = async () => {
    const canvas = canvasRef.current || document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  };

  const showModal = (type, message) => setModal({ show: true, type, message });

  // Kirim foto + token ke backend utama Node.js
  const submitFaceVerification = async (faceImageBlob) => {
    const formData = new FormData();
    formData.append("face_image", faceImageBlob, "face.jpg");
    formData.append("verification_token", verificationToken);

    const res = await axiosInstance.post("/register/complete", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!res.data.success) {
      throw new Error(res.data.error || "Aktivasi akun gagal");
    }

    // 👉 kembalikan seluruh payload (termasuk embeddingResult)
    return res.data;
  };

  const handleVerificationError = (err) => {
    const msg = err.response?.data?.error || err.message || "Verifikasi gagal";
    showModal("error", msg);
    setError(msg);
  };

  // Tangkap wajah & kirim ke backend
  const handleFaceCapture = async () => {
    if (!verificationToken || isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      showModal("loading", "Mendaftarkan wajah...");

      const faceImageBlob = await captureFaceImage();
      const result = await submitFaceVerification(faceImageBlob);

      // 👉 simpan hasil embedding jika tersedia
      if (result.embeddingResult) {
        setEmbeddingResult(result.embeddingResult);
      }

      // tampilkan modal success (boleh tetap, tapi tidak redirect di sini)
      showModal("success", "Pendaftaran wajah berhasil!");
    } catch (err) {
      handleVerificationError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tutup popup embedding & langsung pindah ke login
  const handleEmbeddingPopupClose = () => {
    if (redirectTimeoutId) {
      clearTimeout(redirectTimeoutId);
    }
    setEmbeddingResult(null);
    navigate("/login");
  };

  const handleBackClick = async () => {
    try {
      if (verificationToken)
        await axiosInstance.delete(`/register/${verificationToken}`);
    } catch (err) {
      console.error("Gagal hapus registrasi:", err.message);
    } finally {
      navigate("/register");
    }
  };

  return (
    <AuthLayout title="Verifikasi Wajah" type="verification">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <button
            onClick={handleBackClick}
            disabled={isSubmitting}
            className="flex items-center text-[#2A4365] hover:text-[#D4AF37]"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Kembali ke formulir
          </button>

          {error && (
            <div className="bg-red-100 text-red-800 p-3 mt-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-center mt-4">
            <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden border-2 border-[#2A4365]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              onClick={handleFaceCapture}
              disabled={isSubmitting}
              variant="primary"
              className="w-full max-w-md flex items-center justify-center gap-2 py-3"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Memproses...</span>
              ) : (
                <>
                  <CameraIcon className="w-5 h-5" />
                  <span>Ambil Foto & Daftarkan Wajah</span>
                </>
              )}
            </Button>
          </div>

          <Modal
            show={modal.show}
            type={modal.type}
            message={modal.message}
            onClose={() => setModal({ ...modal, show: false })}
          />

          {/* 👉 POPUP EMBEDDING DI TENGAH LAYAR */}
          {embeddingResult && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="mx-4 w-full max-w-md rounded-2xl bg-slate-900 text-slate-100 shadow-2xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                    <span className="text-emerald-400 text-2xl">✅</span>
                  </div>
                </div>

                <h2 className="text-center text-lg font-semibold text-emerald-300">
                  Pendaftaran Wajah Berhasil
                </h2>
                <p className="mt-2 text-center text-xs text-slate-300">
                  Wajah Anda sudah terdaftar di sistem presensi. Anda akan
                  dialihkan ke halaman login dalam{" "}
                  <span className="font-semibold text-emerald-300">
                    {redirectCountdown}
                  </span>{" "}
                  detik, atau klik tombol di bawah untuk melanjutkan sekarang.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg bg-slate-800/80 px-2 py-1.5">
                    <p className="text-slate-400">Dimensi Embedding</p>
                    <p className="font-mono text-emerald-300">
                      {embeddingResult.embedding_dim ?? "-"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 px-2 py-1.5">
                    <p className="text-slate-400">Total Embedding</p>
                    <p className="font-mono text-emerald-300">
                      {embeddingResult.n_embeddings ?? 1}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 px-2 py-1.5">
                    <p className="text-slate-400">Waktu Proses</p>
                    <p className="font-mono text-emerald-300">
                      {embeddingResult.total_time ?? 0}s
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 px-2 py-1.5">
                    <p className="text-slate-400">Mode</p>
                    <p className="font-mono text-emerald-300">
                      {embeddingResult.append_mode
                        ? "Append (tambah sample)"
                        : "Enroll baru"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] text-slate-400 mb-1">
                    Contoh nilai embedding (8 dimensi pertama)
                  </p>
                  <code className="block max-h-20 overflow-x-auto rounded-lg bg-slate-950/70 px-2 py-1.5 text-[10px] font-mono text-emerald-200">
                    {Array.isArray(embeddingResult.last_embedding_sample)
                      ? `[${embeddingResult.last_embedding_sample
                          .map((v) => Number(v).toFixed(4))
                          .join(", ")}]`
                      : "Tidak tersedia"}
                  </code>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleEmbeddingPopupClose}
                    className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-400"
                  >
                    Tutup & ke Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default FaceVerificationRegister;
