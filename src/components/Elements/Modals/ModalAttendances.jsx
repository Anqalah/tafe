import {
  XMarkIcon,
  ClockIcon,
  MapPinIcon,
  CameraIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import LocationMap from "../LocationMap/LocationMap";

export const ModalAttendances = ({ type, data, onClose, show }) => {
  if (!show) return null;

  const modalConfig = {
    in: {
      title: "Detail Clock In",
      time: data?.ClockIn,
      location: data?.LocationClockIn,
      photo: data?.facePhotoClockIn,
      verification: data?.facePhotoClockIn ? "success" : "failed",
      coordinates: data?.LocationClockIn?.split(",").map(Number),
    },
    out: {
      title: "Detail Clock Out",
      time: data?.ClockOut,
      location: data?.LocationClockOut,
      photo: data?.facePhotoClockOut,
      verification: data?.facePhotoClockOut ? "success" : "failed",
      coordinates: data?.LocationClockOut?.split(",").map(Number),
    },
  };

  const currentConfig = modalConfig[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto z-10 max-h-[90vh] flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {currentConfig.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Verification Status */}
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-gray-500 flex items-center">
              <CheckCircleIcon
                className={`h-5 w-5 mr-2 ${
                  currentConfig.verification === "success"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              />
              Verifikasi
            </span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                currentConfig.verification === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {currentConfig.verification === "success" ? "Berhasil" : "Gagal"}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-gray-500 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
              Waktu
            </span>
            <span className="text-sm text-gray-900">
              {currentConfig.time
                ? new Date(currentConfig.time).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-gray-500 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
              Tanggal
            </span>
            <span className="text-sm text-gray-900">
              {data?.Date
                ? new Date(data.Date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>

          {/* Layout Grid untuk Foto dan Peta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Foto Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 flex items-center">
                <CameraIcon className="h-5 w-5 mr-2 text-gray-400" />
                Foto {type === "in" ? "Clock In" : "Clock Out"}
              </h4>
              <div className="border rounded-lg overflow-hidden bg-gray-100 aspect-square flex items-center justify-center">
                {currentConfig.photo ? (
                  <img
                    src={currentConfig.photo}
                    alt={`Foto ${currentConfig.title}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Tidak ada foto
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                Lokasi Presensi
              </h4>
              <div className="border rounded-lg overflow-hidden bg-gray-100 aspect-square">
                {currentConfig.coordinates ? (
                  <LocationMap
                    latitude={currentConfig.coordinates[0]}
                    longitude={currentConfig.coordinates[1]}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Lokasi tidak tersedia
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
