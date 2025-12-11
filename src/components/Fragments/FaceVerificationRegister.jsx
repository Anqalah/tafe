import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import Button from "../Elements/Button";
import AuthLayout from "../Layouts/AuthLayouts";
import axiosInstance from "../../config/axios";
import RegisterSuccessModal from "../Elements/Modals/RegisterSuccessModal";
import ErrorModal from "../Elements/Modals/ErrorModal";
import LoadingModal from "../Elements/Modals/LoadingModal";

const FaceVerificationRegister = () => {
  const videoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [modal, setModal] = useState({
    show: false,
    type: "loading",
    message: "",
  });
  const [embeddingResult, setEmbeddingResult] = useState(null);
  const [faceImageUrl, setFaceImageUrl] = useState("");

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

  // Kamera
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

  const captureFace = async () => {
    const video = videoRef.current;
    if (!video) throw new Error("Video element tidak tersedia");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Gagal membuat Blob"));
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const submitFaceVerification = async (faceImageBlob) => {
    const formData = new FormData();
    formData.append("face_image", faceImageBlob, "face.jpg");
    formData.append("verification_token", verificationToken);

    const res = await axiosInstance.post("/register/complete", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!res.data?.success) {
      const errorMsg = res.data?.error || "Registrasi gagal";
      throw new Error(errorMsg);
    }

    return res.data;
  };

  const handleVerificationError = (err) => {
    let msg = "Verifikasi gagal";
    const data = err.response?.data;

    if (data?.code === "NO_FACE_DETECTED") {
      msg = data.error;
    } else if (data?.error) {
      msg = data.error;
    }
    setModal({ show: true, type: "error", message: msg });
    setIsSubmitting(false);
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

  const handleFaceCapture = async () => {
    if (!verificationToken || isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setModal({ show: true, type: "loading", message: "Mendeteksi wajah..." });

    try {
      const faceImageBlob = await captureFace();
      setModal({
        show: true,
        type: "loading",
        message: "Mendaftarkan wajah...",
      });

      const result = await submitFaceVerification(faceImageBlob);

      setModal({ show: false });

      // ✅ Siapkan data sukses
      const faceCropBase64 = result.data?.face_crop_base64;
      if (!faceCropBase64) {
        throw new Error("Foto wajah tidak tersedia dari server");
      }
      setFaceImageUrl(`data:image/jpeg;base64,${faceCropBase64}`);
      setEmbeddingResult(result.embeddingResult);

      setTimeout(() => {
        setModal({ show: true, type: "success" });
      }, 50);

      // Redirect otomatis setelah 10 detik (di-handle oleh Modal useEffect)
      setTimeout(() => {
        navigate("/login");
      }, 10000);
    } catch (err) {
      handleVerificationError(err);
    } finally {
      setIsSubmitting(false);
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
            </div>
          </div>

          <div className="bg-primary rounded-xl text-secondary mt-4 flex justify-center">
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
                  <span>Daftarkan Wajah</span>
                </>
              )}
            </Button>
          </div>

          <LoadingModal
            isOpen={modal.show && modal.type === "loading"}
            message={modal.message}
          />

          <RegisterSuccessModal
            show={modal.show && modal.type === "success"}
            embeddingResult={embeddingResult}
            faceImageUrl={faceImageUrl}
            onClose={() => {
              setModal({ ...modal, show: false });
              navigate("/login");
            }}
          />

          <ErrorModal
            isOpen={modal.show && modal.type === "error"}
            onClose={() => setModal({ ...modal, show: false })}
            title="Verifikasi Gagal"
            message={modal.message || "Terjadi kesalahan. Silakan coba lagi."}
          />
        </div>
      </div>
    </AuthLayout>
  );
};

export default FaceVerificationRegister;
