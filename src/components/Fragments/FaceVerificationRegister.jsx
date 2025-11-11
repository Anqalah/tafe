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

  // Kirim ke backend utama Node.js
  const handleFaceCapture = async () => {
    if (!verificationToken || isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      showModal("loading", "Mendaftarkan wajah...");

      const faceImageBlob = await captureFaceImage();
      await submitFaceVerification(faceImageBlob);

      showModal("success", "Pendaftaran wajah berhasil!");
      navigateToLogin();
    } catch (err) {
      handleVerificationError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kirim foto + token ke backend
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
  };

  const handleVerificationError = (err) => {
    const msg = err.response?.data?.error || err.message || "Verifikasi gagal";
    showModal("error", msg);
    setError(msg);
  };

  const showModal = (type, message) => setModal({ show: true, type, message });
  const navigateToLogin = () => setTimeout(() => navigate("/login"), 2000);

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
        </div>
      </div>
    </AuthLayout>
  );
};

export default FaceVerificationRegister;
