import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhotoIcon,
  XCircleIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../assets/logo/logo.png";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";

const ClockInResults = () => {
  const { id } = useParams();
  const [clockInData, setClockInData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [mapComponents, setMapComponents] = useState(null);
  const navigate = useNavigate();

  // Custom Icon
  const customIcon = L.icon({
    iconUrl: Logo,
    iconSize: [45, 45],
    iconAnchor: [22, 44],
    popupAnchor: [0, -40],
  });

  // Load Map Components
  useEffect(() => {
    const loadMapComponents = async () => {
      const { MapContainer, TileLayer, Marker, Popup } = await import(
        "react-leaflet"
      );
      setMapComponents({ MapContainer, TileLayer, Marker, Popup });
    };
    loadMapComponents();
  }, []);

  // Map Component
  const MapComponent = ({ position }) => {
    if (!mapComponents)
      return <div className="p-4 text-center">Memuat peta...</div>;

    const { MapContainer, TileLayer, Marker, Popup } = mapComponents;

    return (
      <MapContainer
        center={position}
        zoom={17}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="w-full h-full rounded-xl shadow-sm z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={position}
          icon={customIcon}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup>
            <div className="text-center space-y-2">
              <img src={Logo} className="w-12 h-12 mx-auto" />
              <h4 className="font-semibold text-primary">Lokasi Clock-In</h4>
              <p className="text-sm">
                {position[0].toFixed(6)}, {position[1].toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    );
  };

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axiosInstance.get(`/attendances/${id}`);
        setClockInData(response.data);
      } catch (error) {
        setMessage(error.response?.data?.msg || "Gagal memuat data kehadiran.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAttendance();
  }, [id]);

  // Utility
  const processCoordinates = (locationString) => {
    if (!locationString) return null;
    const c = locationString.split(",").map(Number);
    return c.length === 2 && !isNaN(c[0]) && !isNaN(c[1]) ? c : null;
  };

  const renderDetailItem = (icon, label, value) => (
    <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="p-3 bg-primary/10 rounded-xl">
        {React.cloneElement(icon, { className: "w-6 h-6 text-primary" })}
      </div>

      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <StudentLayout>
      <div className="max-w-6xl sm:p-6 lg:p-8">
        {/* Header */}
        <button
          onClick={() => navigate("/student/dashboard")}
          className="flex items-center text-primary hover:text-primary/80 rounded-lg hover:bg-gray-50 "
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Kembali ke Dashboard</span>
        </button>

        {/* Loading */}
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className=" bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        ) : message ? (
          <div className=" bg-red-50/80 border border-red-200 rounded-2xl flex items-center gap-4 text-red-700">
            <XCircleIcon className="w-8 h-8" />
            <div>
              <h3 className="font-semibold text-lg">Gagal Memuat Data</h3>
              <p>{message}</p>
            </div>
          </div>
        ) : (
          clockInData && (
            <div className="space-y-6">
              {/* Header Success */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-2 rounded-full">
                  <CheckCircleIcon className="w-6 h-6 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    Clock In Berhasil
                  </span>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {renderDetailItem(
                  <CalendarIcon />,
                  "Tanggal",
                  new Date(clockInData.Date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                )}

                {renderDetailItem(
                  <ClockIcon />,
                  "Waktu",
                  new Date(clockInData.ClockIn).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )}

                {renderDetailItem(
                  <FaceSmileIcon />,
                  "Similarity Score",
                  `${clockInData.confidence}%`
                )}
              </div>

              {/* Photos + Map */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Photo */}
                {clockInData.facePhotoClockIn && (
                  <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <PhotoIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Foto Clock-In
                      </h3>
                    </div>

                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={clockInData.facePhotoClockIn}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                )}

                {/* Map */}
                <div className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPinIcon className="w-4 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Lokasi Clock-In
                    </h3>
                  </div>

                  <div
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-gray-200
                 "
                  >
                    {clockInData.LocationClockIn
                      ? (() => {
                          const coordinates = processCoordinates(
                            clockInData.LocationClockIn
                          );
                          return coordinates ? (
                            <MapComponent position={coordinates} />
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-red-50 text-red-600 p-6">
                              <XCircleIcon className="w-12 h-12 mb-4" />
                              <p className="font-medium">
                                Format lokasi tidak valid
                              </p>
                            </div>
                          );
                        })()
                      : null}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </StudentLayout>
  );
};

export default ClockInResults;
