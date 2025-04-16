import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../Elements/Button";
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import AuthLayout from "../Layouts/AuthLayouts";
import axiosInstance from "../../config/axios";

const FaceVerificationRegister = () => {
  const videoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [verificationToken, setVerificationToken] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      setVerificationToken(token);
    } else {
      navigate("/register", { state: { error: "Sesi verifikasi tidak valid" } });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setError("Gagal mengakses kamera: " + error.message);
      }
    };

    initCamera();
    return () => {
      videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const captureFace = useCallback(async () => {
    try {
      if (!videoRef.current) return;
      const canvas = document.createElement("canvas");
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.85);

      const response = await axiosInstance.post("/register/complete", {
        verification_token: verificationToken,
        face_image: imageData,
      });
      if (response.data.success) {
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Gagal verifikasi wajah");
    }
  }, [navigate, verificationToken]);

  const handleBackClick = async () => {
    try {
      await axiosInstance.delete(`/register/${verificationToken}`);
    } catch (error) {
      console.error("Gagal menghapus data pending:", error);
    } finally {
      navigate("/register");
    }
  };

  return (
    <AuthLayout type="verification" title="Verifikasi Wajah">
      <div className="space-y-8">
        {error && <div className="text-red-500 text-center p-2 bg-red-50 rounded">{error}</div>}
        <div className="flex items-center justify-between px-4">
          <Link to="/register" onClick={handleBackClick} className="flex items-center text-gray-700 hover:text-yellow-500 transition-colors group">
            <ArrowLeftIcon className="w-6 h-6 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Kembali</span>
          </Link>
        </div>
        <div className="relative bg-gradient-to-br from-blue-900/10 to-yellow-500/5 rounded-3xl p-1 shadow-xl">
          <div className="relative overflow-hidden rounded-2xl aspect-video">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent p-6">
              <Button onClick={captureFace} className="w-full py-4 text-lg hover:scale-[1.02] transition-transform">
                <div className="text-blue-900 hover:text-yellow-500 transition-colors group flex items-center justify-center gap-3">
                  <CameraIcon className="w-6 h-6" />
                  <span>Selesaikan Verifikasi</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default FaceVerificationRegister;
