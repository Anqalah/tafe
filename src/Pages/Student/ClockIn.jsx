import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../config/axios";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/Layouts/StudentLayout";
import LocationMap from "../../components/Elements/LocationMap/LocationMap";

const ClockIn = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    getUser();
    startVideo();
  }, []);

  const getUser = async () => {
    try {
      const response = await axiosInstance.get("/me");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
      setMessage("Failed to load user data.");
    }
  };

  const startVideo = () => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing webcam: ", error);
          setMessage("Unable to access camera.");
        });
    }
  };

  const captureImageAndLocation = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video) {
      setMessage("Camera not found.");
      return;
    }

    // Ambil gambar dari video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setImageSrc(canvas.toDataURL("image/png"));

    // Ambil lokasi
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setMessage("Unable to retrieve location.");
        }
      );
    } else {
      setMessage("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude || !imageSrc) {
      setMessage("Please ensure all fields are filled.");
      return;
    }

    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("facePhotoClockIn", dataURLtoBlob(imageSrc));

    try {
      const response = await axiosInstance.post(
        `/attendances/clockin/${user.uuid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.msg);
      navigate("/attendances/clockin-results/");
    } catch (error) {
      console.error("Error during submission:", error);
      setMessage(error.response?.data?.msg || "An error occurred");
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ab[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <StudentLayout>
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Clock In Siswa</h2>

        {imageSrc == null && (
          <>
            <div className="mb-4">
              <video
                ref={videoRef}
                autoPlay
                className="w-full border border-gray-300 rounded"
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
            <button
              type="button"
              onClick={captureImageAndLocation}
              className="w-full bg-blue-500 text-white p-2 rounded mb-4"
            >
              Ambil Foto & Lokasi
            </button>
          </>
        )}

        {imageSrc && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Foto Wajah:</h3>
            <img
              src={imageSrc}
              alt="Captured face"
              className="w-full border border-gray-300 rounded"
            />
          </div>
        )}

        {latitude && longitude && (
          <div className="mb-4">
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
          </div>
        )}

        {latitude && longitude && (
          <LocationMap latitude={latitude} longitude={longitude} />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {imageSrc !== null && (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Clock In
            </button>
          )}
          {message && <p className="text-red-500">{message}</p>}
        </form>
      </div>
    </StudentLayout>
  );
};

export default ClockIn;
