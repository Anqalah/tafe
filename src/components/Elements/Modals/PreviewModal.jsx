import {
  CameraIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import LocationMap from "../LocationMap/LocationMap";

const PreviewModal = ({
  show,
  type = "clockIn",
  imageSrc,
  latitude,
  longitude,
  isLoading,
  handleSubmit,
  handleClose,
  message,
}) => {
  if (!show) return null;

  const title = type === "clockOut" ? "Clock Out" : "Clock In";
  const gradient =
    type === "clockOut"
      ? "from-primary to-secondary"
      : "from-primary to-secondary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto overflow-hidden flex flex-col transform transition-all duration-300 scale-[0.98] hover:scale-100">
        {/* Header */}
        <div className={`bg-gradient-to-r ${gradient} p-3 sticky top-0 z-10`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-6 h-6 text-white/90" />
              <h3 className="text-xl font-bold text-white tracking-tight">
                Preview {title}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <XMarkIcon className="w-7 h-7 text-white/90 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 flex-1 flex flex-col overflow-auto">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-2">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ClockIcon className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
              <p className="text-gray-600 font-medium animate-pulse">
                Memproses presensi...
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Layout */}
              <div className="hidden md:grid grid-cols-2 gap-8">
                {/* Foto */}
                <div className="flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg mr-3">
                      <CameraIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      Foto Presensi
                    </h4>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center max-h-[60vh]">
                    <img
                      src={imageSrc}
                      alt="Foto presensi"
                      className="object-contain max-h-full w-auto"
                    />
                  </div>
                </div>

                {/* Map */}
                <div className="flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg mr-3">
                      <MapPinIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      Lokasi Presensi
                    </h4>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 relative max-h-[60vh]">
                    <LocationMap latitude={latitude} longitude={longitude} />
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden flex flex-col">
                {/* Foto */}
                <div className="flex flex-col h-[36vh]">
                  <div className="flex items-center ">
                    <div className="bg-primary/10 p-2 rounded-lg mr-2">
                      <CameraIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      Foto Presensi
                    </h4>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={imageSrc}
                      alt="Foto presensi"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* Map */}
                <div className="flex flex-col h-[35vh]">
                  <div className="flex items-center mt-2">
                    <div className="bg-primary/10 p-2 rounded-lg mr-3">
                      <MapPinIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-800">
                      Lokasi Presensi
                    </h4>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 relative">
                    <LocationMap latitude={latitude} longitude={longitude} />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <form onSubmit={handleSubmit} className="mt-4">
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 font-medium shadow-md hover:shadow-lg transition-transform duration-150`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <ClockIcon className="w-5 h-5" />
                      Konfirmasi {title}
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
