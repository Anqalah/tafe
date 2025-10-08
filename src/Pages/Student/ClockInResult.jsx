import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhotoIcon,
  XCircleIcon,
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

  useEffect(() => {
    const loadMapComponents = async () => {
      const { MapContainer, TileLayer, Marker, Popup } = await import(
        "react-leaflet"
      );
      setMapComponents({ MapContainer, TileLayer, Marker, Popup });
    };
    loadMapComponents();
  }, []);

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
          icon={L.icon({
            iconUrl: Logo,
            iconSize: [45, 45],
            iconAnchor: [22, 44],
            popupAnchor: [0, -40],
          })}
        >
          <Popup className="custom-popup">
            <div className="text-center space-y-2">
              <img src={Logo} alt="Marker" className="w-12 h-12 mx-auto mb-2" />
              <h4 className="font-semibold text-primary">Lokasi Clock-In</h4>
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
        setClockInData(response.data);
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
    <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
      <div
        className={`p-2 rounded-lg ${
          isWarning ? "bg-gray-200" : "bg-primary/10"
        }`}
      >
        {React.cloneElement(icon, {
          className: `w-5 h-5 ${isWarning ? "text-green-600" : "text-primary"}`,
        })}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <p
          className={`text-base font-semibold ${
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
      <div className="p-4 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium text-sm">Kembali</span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded-xl w-1/2"></div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-100 rounded-xl"></div>
          </div>
        ) : message ? (
          <div className="p-4 bg-red-50 rounded-xl flex items-start gap-3">
            <XCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Gagal Memuat Data</h3>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        ) : (
          clockInData && (
            <div className="space-y-4">
              {/* Main Header */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1 rounded-full">
                  <CheckCircleIcon className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-primary">
                    Clock In Berhasil
                  </span>
                </div>
              </div>

              {/* Info Grid - Mobile friendly */}
              <div className="grid grid-cols-2 gap-2">
                {renderDetailItem(
                  <CalendarIcon />,
                  "Tanggal",
                  new Date(clockInData.Date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
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
                  <MapPinIcon />,
                  "Status",
                  clockInData.isWithinRadius ? "Valid" : "Diluar Radius",
                  !clockInData.isWithinRadius
                )}
              </div>

              {/* Content Section - Stacked on mobile */}
              <div className="space-y-4">
                {/* Photo Section */}
                {clockInData.facePhotoClockIn && (
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <PhotoIcon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Foto Clock-In</h3>
                    </div>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={clockInData.facePhotoClockIn}
                        alt="Clock-in"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Map Section */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinIcon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Lokasi</h3>
                  </div>
                  <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
                    {clockInData.LocationClockIn &&
                      (() => {
                        const coordinates = processCoordinates(
                          clockInData.LocationClockIn
                        );
                        return coordinates ? (
                          <MapComponent position={coordinates} />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center bg-red-50 text-red-600 p-4 text-center">
                            <XCircleIcon className="w-8 h-8 mb-2" />
                            <p className="text-sm font-medium">
                              Format lokasi tidak valid
                            </p>
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

export default ClockInResults;
