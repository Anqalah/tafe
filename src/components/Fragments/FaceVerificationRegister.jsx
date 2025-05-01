import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import Button from "../Elements/Button/index";
import AuthLayout from "../Layouts/AuthLayouts";
import axiosInstance from "../../config/axios";
import { Modal } from "../Elements/Modals/Modal";

const FaceVerificationRegister = () => {
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [modal, setModal] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Extract token from URL
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

  // Initialize camera
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

  const handleFaceCapture = async () => {
    if (!verificationToken || isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      showModal("loading", "Memverifikasi wajah...");
      // Capture face image
      const faceImageBlob = await captureFaceImage();
      // Submit to backend
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
      // Bisa tampilkan notifikasi jika diperlukan
    } finally {
      navigate("/register");
    }
  };

  return (
    <AuthLayout type="verification" title="Verifikasi Wajah">
      <div className="space-y-6 max-w-md mx-auto">
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center text-primary hover:text-secondary transition-colors "
          disabled={isSubmitting}
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Kembali ke formulir pendaftaran
        </button>

        {/* Instructions */}
        <div className="text-center text-sm p-4 rounded-lg mb-4 bg-primary bg-opacity-10 text-primary">
          <p className="font-medium">
            Pastikan wajah Anda terlihat jelas dengan pencahayaan yang cukup
          </p>
          <p>Jangan menggunakan kacamata atau penutup wajah</p>
        </div>

        {/* Camera Preview */}
        <div className="relative rounded-xl overflow-hidden aspect-video shadow-md bg-neutral-bg border-2 border-primary">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Capture Button */}
        <Button
          onClick={handleFaceCapture}
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center transition-colors ${
            isSubmitting
              ? "text-primary/50"
              : "text-primary hover:text-secondary"
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="animate-pulse">Memproses...</span>
            </>
          ) : (
            <>
              <CameraIcon className="w-5 h-5" />
              <span>Ambil Foto dan Verifikasi</span>
            </>
          )}
        </Button>
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
