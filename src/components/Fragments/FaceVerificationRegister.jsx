import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import Button from "../Elements/Button/index";
import AuthLayout from "../Layouts/AuthLayouts";
import axiosInstance from "../../config/axios";
import { Modal } from "../Elements/Modals/Modal";

const FaceVerificationRegister = () => {
  // Refs and state (same as before)
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [modal, setModal] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Effect hooks (same as before)
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

  useEffect(() => {
    let stream = null;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Gagal mengakses kamera: " + err.message);
      }
    };
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handler functions (same as before)
  const handleFaceCapture = async () => {
    if (!verificationToken || isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      showModal("loading", "Memverifikasi wajah...");
      const faceImageBlob = await captureFaceImage();
      await submitFaceVerification(faceImageBlob);
      showModal("success", "Verifikasi berhasil! Akun Anda telah aktif.");
      navigateToLogin();
    } catch (err) {
      handleVerificationError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const captureFaceImage = async () => {
    const canvas = canvasRef.current || document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.85);
    });
  };

  const submitFaceVerification = async (faceImageBlob) => {
    const formData = new FormData();
    formData.append("face_image", faceImageBlob, "face_capture.jpg");
    formData.append("verification_token", verificationToken);
    const response = await axiosInstance.post("/register/complete", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (!response.data.success) {
      throw new Error(response.data.error || "Verifikasi gagal");
    }
  };

  const navigateToLogin = () => {
    setTimeout(() => {
      navigate("/login", {
        state: {
          success: "Registrasi berhasil! Silakan login dengan akun Anda.",
        },
      });
    }, 2000);
  };

  const handleVerificationError = (error) => {
    const errorMessage =
      error.response?.data?.error || "Gagal verifikasi wajah";
    showModal("error", errorMessage);
    setError(errorMessage);
  };

  const showModal = (type, message) => {
    setModal({
      show: true,
      type,
      message,
    });
  };

  const handleBackClick = async () => {
    if (!verificationToken) {
      navigate("/register");
      return;
    }
    try {
      await axiosInstance.delete(`/register/${verificationToken}`);
    } catch (err) {
      console.error("Gagal menghapus data registrasi:", err.message);
    } finally {
      navigate("/register");
    }
  };

  return (
    <AuthLayout title="Verifikasi Wajah" type="verification">
      <div className="space-y-6 w-full">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center text-[#2A4365] hover:text-[#D4AF37] transition-colors"
          disabled={isSubmitting}
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Kembali ke formulir pendaftaran
        </button>

        {/* Title and Instructions */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[#F0F4F8] border border-[#2A4365]/20">
            <p className="text-[#2A4365] font-medium">
              Pastikan wajah Anda terlihat jelas dengan pencahayaan yang cukup
            </p>
            <p className="text-[#2A4365]">
              Jangan menggunakan kacamata atau penutup wajah
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Camera Preview - Responsive */}
        <div className="flex justify-center">
          <div className="relative rounded-xl overflow-hidden w-full max-w-md aspect-square md:aspect-[4/3] shadow-md bg-gray-100 border-2 border-[#2A4365]">
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

        {/* Capture Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleFaceCapture}
            disabled={isSubmitting}
            className="w-full max-w-md flex items-center justify-center gap-2 py-3"
            variant="primary"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Memproses...</span>
            ) : (
              <>
                <CameraIcon className="w-5 h-5" />
                <span>Ambil Foto dan Verifikasi</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Modal Component */}
      <Modal
        show={modal.show}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </AuthLayout>
  );
};

export default FaceVerificationRegister;
