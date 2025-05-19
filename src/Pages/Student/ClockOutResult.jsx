import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import StudentLayout from "../../components/Layouts/StudentLayout";
import {
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const ClockOutResults = () => {
  const { id } = useParams();
  const [ClockOutData, setClockOutData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axiosInstance.get(`/attendances/${id}`);
        setClockOutData(response.data); // Bisa array atau objek tergantung respons
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setMessage(error.response?.data?.msg || "Gagal memuat data kehadiran.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAttendance();
  }, [id]);

  const renderDetailItem = (icon, label, value, isWarning = false) => (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div
        className={`p-2 rounded-full ${
          isWarning ? "bg-accent/10" : "bg-primary/10"
        }`}
      >
        {React.cloneElement(icon, {
          className: `w-5 h-5 ${isWarning ? "text-accent" : "text-primary"}`,
        })}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p
          className={`font-medium ${
            isWarning ? "text-accent" : "text-gray-800"
          }`}
        >
          {value || "-"}
        </p>
      </div>
    </div>
  );

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <ClockIcon className="w-8 h-8" />
            Detail Presensi
          </h2>
          <div></div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data presensi...</p>
          </div>
        ) : message ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
            <XCircleIcon className="w-5 h-5 flex-shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          ClockOutData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDetailItem(
                  <CalendarIcon />,
                  "Tanggal Presensi",
                  new Date(ClockOutData.Date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                )}

                {renderDetailItem(
                  <ClockIcon />,
                  "Waktu Clock Out",
                  new Date(ClockOutData.clockOut).toLocaleTimeString("id-ID")
                )}

                {renderDetailItem(
                  <MapPinIcon />,
                  "Lokasi Clock Out",
                  ClockOutData.LocationClockOut
                )}
              </div>

              {ClockOutData.facePhotoClockOut && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-primary mb-4">
                    <CheckCircleIcon className="w-5 h-5" />
                    Foto Clock Out
                  </h3>
                  <img
                    src={ClockOutData.facePhotoClockOut}
                    alt="Clock-out"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>
    </StudentLayout>
  );
};

export default ClockOutResults;
