import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhotoIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";
import Logo from "../../assets/logo/logo.png";

const ClockOutResults = () => {
  const { id } = useParams();
  const [clockOutData, setClockOutData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [mapComponents, setMapComponents] = useState(null);
  const navigate = useNavigate();

  // Konfigurasi custom icon marker
  const customIcon = L.icon({
    iconUrl: Logo,
    iconSize: [45, 45],
    iconAnchor: [22, 44],
    popupAnchor: [0, -40],
  });

  useEffect(() => {
    const loadMapComponents = async () => {
      const { MapContainer, TileLayer, Marker, Popup } = await import(
        "react-leaflet"
      );
      setMapComponents({ MapContainer, TileLayer, Marker, Popup });
    };
    loadMapComponents();
  }, []);

  // Komponen peta dinamis
  const MapComponent = ({ position }) => {
    if (!mapComponents)
      return <div className="p-4 text-center">Memuat peta...</div>;

    const { MapContainer, TileLayer, Marker, Popup } = mapComponents;
    return (
      <MapContainer
        center={position}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        className="rounded-xl shadow-sm z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={position}
          icon={customIcon}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup className="custom-popup">
            <div className="text-center space-y-2">
              <img src={Logo} alt="Marker" className="w-12 h-12 mx-auto mb-2" />
              <h4 className="font-semibold text-primary">Lokasi Clock-Out</h4>
              <p className="text-sm text-secondary">
                {position[0].toFixed(6)}, {position[1].toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    );
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axiosInstance.get(`/attendances/${id}`);
        setClockOutData(response.data);
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
    <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div
        className={`p-3 rounded-xl ${
          isWarning ? "bg-gray-200" : "bg-primary/10"
        } transition-colors duration-300 group-hover:${
          isWarning ? "bg-gray-300" : "bg-primary/20"
        }`}
      >
        {React.cloneElement(icon, {
          className: `w-6 h-6 ${
            isWarning ? "text-green-600" : "text-primary"
          } stroke-2`,
        })}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p
          className={`text-xl font-semibold ${
            isWarning ? "text-green-600" : "text-gray-900"
          }`}
        >
          {value || "-"}
        </p>
      </div>
    </div>
  );

  const processCoordinates = (locationString) => {
    if (!locationString) return null;
    const coordinates = locationString.split(",").map(Number);
    if (
      coordinates.length === 2 &&
      !isNaN(coordinates[0]) &&
      !isNaN(coordinates[1])
    ) {
      return coordinates;
    }
    return null;
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-gray-50"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Kembali ke Dashboard</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-100 rounded-2xl"></div>
          </div>
        ) : message ? (
          <div className="p-6 bg-red-50/80 backdrop-blur-sm text-red-700 rounded-2xl flex items-center gap-4 border border-red-100">
            <XCircleIcon className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Gagal Memuat Data</h3>
              <p>{message}</p>
            </div>
          </div>
        ) : (
          clockOutData && (
            <div className="space-y-4">
              {/* Main Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-2 rounded-full">
                  <CheckCircleIcon className="w-6 h-6 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    Clock Out Berhasil
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {renderDetailItem(
                  <CalendarIcon />,
                  "Tanggal Presensi",
                  new Date(clockOutData.Date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                )}

                {renderDetailItem(
                  <ClockIcon />,
                  "Waktu Clock Out",
                  new Date(clockOutData.ClockOut).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )}

                {renderDetailItem(
                  <MapPinIcon />,
                  "Lokasi Presensi",
                  "Dalam Radius",
                  !clockOutData.isWithinRadius
                )}
              </div>

              {/* Layout Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Photos Section */}
                <div className="space-y-4">
                  {clockOutData.facePhotoClockOut && (
                    <div className="group bg-white p-3 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <PhotoIcon className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Clock-Out
                          </h3>
                        </div>
                      </div>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          src={clockOutData.facePhotoClockOut}
                          alt="Clock-out"
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Map Section */}
                <div className="group bg-white p-3 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPinIcon className="w-4 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Lokasi Presensi
                      </h3>
                    </div>
                  </div>
                  <div className="relative h-[320px] rounded-xl overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
                    {clockOutData.LocationClockOut &&
                      (() => {
                        const coordinates = processCoordinates(
                          clockOutData.LocationClockOut
                        );
                        return coordinates ? (
                          <>
                            <MapComponent position={coordinates} />
                          </>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center bg-red-50 text-red-600 p-6 text-center">
                            <XCircleIcon className="w-12 h-12 mb-4" />
                            <p className="font-medium">
                              Format lokasi tidak valid
                            </p>
                            <p className="text-sm">Silakan cek data GPS Anda</p>
                          </div>
                        );
                      })()}
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

export default ClockOutResults;
