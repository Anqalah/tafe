import {
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  MapPinIcon,
  XCircleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../../public/logo/logo.png";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";
import { Dialog } from "@headlessui/react";

const ClockInResults = () => {
  const { id } = useParams();
  const [clockInData, setClockInData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [mapComponents, setMapComponents] = useState(null);
  const navigate = useNavigate();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState("");

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
    setIsPhotoModalOpen(true);
  };

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
              <h4 className="font-semibold text-primary">Lokasi Clock-In</h4>
              <p className="text-sm text-secondary">
                {" "}
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
    <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div
        className={`p-3 rounded-xl ${
          isWarning ? "bg-accent/10" : "bg-primary/10"
        } transition-colors duration-300 group-hover:${
          isWarning ? "bg-accent/20" : "bg-primary/20"
        }`}
      >
        {React.cloneElement(icon, {
          className: `w-6 h-6 ${
            isWarning ? "text-accent" : "text-primary"
          } stroke-2`,
        })}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p
          className={`text-xl font-semibold ${
            isWarning ? "text-accent" : "text-gray-900"
          }`}
        >
          {value || "-"}
        </p>
      </div>
    </div>
  );

  // Fungsi untuk memproses koordinat
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
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors  px-4 py-2 rounded-lg hover:bg-gray-50"
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
          clockInData && (
            <div className="space-y-8">
              {/* Main Header */}
              <div className="text-center space-y-2 mb-12">
                <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-2 rounded-full">
                  <CheckCircleIcon className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-primary">
                    Presensi Berhasil
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">
                  Detail Presensi Harian
                </h1>
              </div>
              {/* Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {renderDetailItem(
                  <CalendarIcon />,
                  "Tanggal Presensi",
                  new Date(clockInData.Date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                )}

                {renderDetailItem(
                  <ClockIcon />,
                  "Waktu Clock In",
                  new Date(clockInData.ClockIn).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )}

                {renderDetailItem(
                  <MapPinIcon />,
                  "Lokasi Presensi",
                  "Dalam Radius",
                  !clockInData.isWithinRadius
                )}
              </div>
              {/* Map Section */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-900 mb-6">
                  <MapPinIcon className="w-7 h-7 text-primary stroke-2" />
                  Lokasi Presensi
                </h3>
                <div className="h-96 rounded-xl overflow-hidden border border-gray-200 relative">
                  {clockInData.LocationClockIn &&
                    (() => {
                      const coordinates = processCoordinates(
                        clockInData.LocationClockIn
                      );
                      return coordinates ? (
                        <>
                          {" "}
                          <MapComponent position={coordinates} />
                          <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm z-[1000]">
                            <span className="text-primary font-medium">
                              Koordinat:
                            </span>{" "}
                            {coordinates[0].toFixed(6)},{" "}
                            {coordinates[1].toFixed(6)}
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
                          <XCircleIcon className="w-8 h-8 mr-2" />
                          Format lokasi tidak valid
                        </div>
                      );
                    })()}
                </div>
              </div>
              {/* Photos Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clockInData.facePhotoClockIn && (
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                        <PhotoIcon className="w-7 h-7 text-primary stroke-2" />
                        Foto Clock In
                      </h3>
                      <button
                        onClick={() =>
                          handlePhotoClick(clockInData.facePhotoClockIn)
                        }
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        Perbesar →
                      </button>
                    </div>
                    <div className="relative aspect-square rounded-xl overflow-hidden cursor-zoom-in">
                      <img
                        src={clockInData.facePhotoClockIn}
                        alt="Clock-in"
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        onClick={() =>
                          handlePhotoClick(clockInData.facePhotoClockIn)
                        }
                      />
                    </div>
                  </div>
                )}

                {clockInData.facePhotoClockOut && (
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="flex items-center gap-3 text-xl font-semibold text-primary">
                        <PhotoIcon className="w-7 h-7 text-primary stroke-2" />
                        Foto Clock Out
                      </h3>
                      <button
                        onClick={() =>
                          handlePhotoClick(clockInData.facePhotoClockOut)
                        }
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        Perbesar →
                      </button>
                    </div>
                    <div className="relative aspect-square rounded-xl overflow-hidden cursor-zoom-in">
                      <img
                        src={clockInData.facePhotoClockOut}
                        alt="Clock-out"
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        onClick={() =>
                          handlePhotoClick(clockInData.facePhotoClockOut)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Photo Modal */}
        <Dialog
          open={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden">
              <img
                src={selectedPhoto}
                alt="Full size"
                className="w-full h-full object-contain max-h-[80vh]"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <XCircleIcon className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </StudentLayout>
  );
};

export default ClockInResults;
