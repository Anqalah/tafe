import {
  XMarkIcon,
  ClockIcon,
  MapPinIcon,
  CameraIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import LocationMap from "../LocationMap/LocationMap";
import { useMemo } from "react";

export const ModalAttendances = ({ type, data, onClose, show }) => {
  const currentConfig = useMemo(() => {
    if (!data) return null;

    const config = {
      in: {
        title: "Detail Clock In",
        time: data.ClockIn,
        location: data.LocationClockIn,
        photo: data.facePhotoClockIn,
        verification: data.facePhotoClockIn ? "success" : "failed",
        coordinates: data.LocationClockIn?.split(",").map(Number),
      },
      out: {
        title: "Detail Clock Out",
        time: data.ClockOut,
        location: data.LocationClockOut,
        photo: data.facePhotoClockOut,
        verification: data.facePhotoClockOut ? "success" : "failed",
        coordinates: data.LocationClockOut?.split(",").map(Number),
      },
    };

    return config[type];
  }, [type, data]);

  if (!show || !currentConfig) return null;

  const formatTime = (time) =>
    time
      ? new Date(time).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "-";

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "-";

  const isVerified = currentConfig.verification === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <header className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {currentConfig.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Verification Status */}
          <div className="flex items-center">
            <span className="w-40 text-sm font-medium text-gray-600 flex items-center">
              <CheckCircleIcon
                className={`h-5 w-5 mr-2 ${
                  isVerified ? "text-green-500" : "text-red-500"
                }`}
              />
              Status Verifikasi
            </span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                isVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isVerified ? "Berhasil" : "Gagal"}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center">
            <span className="w-40 text-sm font-medium text-gray-600 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
              Waktu
            </span>
            <span className="text-sm text-gray-900">
              {formatTime(currentConfig.time)}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center">
            <span className="w-40 text-sm font-medium text-gray-600 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
              Tanggal
            </span>
            <span className="text-sm text-gray-900">
              {formatDate(data.Date)}
            </span>
          </div>

          {/* Photo and Map Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {/* Photo Section */}
            <section className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600 flex items-center">
                <CameraIcon className="h-5 w-5 mr-2 text-gray-500" />
                Foto {type === "in" ? "Clock In" : "Clock Out"}
              </h4>
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50  flex items-center justify-center">
                {currentConfig.photo ? (
                  <img
                    src={currentConfig.photo}
                    alt={`Foto ${currentConfig.title}`}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 p-4">
                    <CameraIcon className="h-12 w-12 mb-2" />
                    <span className="text-center">
                      Tidak ada foto yang tersedia
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Map Section */}
            <section className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                Lokasi Presensi
              </h4>
              <div className="border-2 border-gray-200 rounded-lg ">
                {currentConfig.coordinates ? (
                  <LocationMap
                    latitude={currentConfig.coordinates[0]}
                    longitude={currentConfig.coordinates[1]}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                    <MapPinIcon className="h-12 w-12 mb-2" />
                    <span className="text-center">Lokasi tidak tersedia</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
