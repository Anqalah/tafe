import {
  CameraIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

import LocationMap from "../LocationMap/LocationMap";

const PreviewModal = ({
  show,
  type = "clockIn",
  imageSrc,
  embeddingImage,
  latitude,
  longitude,
  isLoading,
  verification,
  onConfirm,
  onRetake,
}) => {
  if (!show) return null;

  const title = type === "clockOut" ? "Clock Out" : "Clock In";
  const gradient = "from-primary to-blue-600";

  const distance = verification?.distance ?? null;
  const threshold = verification?.threshold ?? null;
  const confidence = verification?.confidence ?? null;
  const match = verification?.match ?? false;

  let similarity = null;
  if (distance != null && threshold != null && threshold > 0) {
    const norm = distance / (2 * threshold);
    similarity = Math.max(0, Math.min(1, 1 - norm));
  }

  const statusLabel = match ? "Verified" : "Not Verified";
  const statusColor = match ? "text-emerald-600" : "text-red-600";
  const statusBg = match
    ? "bg-emerald-50 border-emerald-200"
    : "bg-red-50 border-red-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto overflow-hidden flex flex-col transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh]">
        {/* Header - Lebih Compact */}
        <div
          className={`bg-gradient-to-r ${gradient} p-4 sm:p-5 sticky top-0 z-10`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {title} Preview
                </h3>
                <p className="text-white/80 text-xs sm:text-sm">
                  Verify your attendance details
                </p>
              </div>
            </div>
            <button
              onClick={onRetake}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-primary animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-medium text-base">
                  Processing Attendance
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Verifying your identity and location...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Desktop Layout - Grid yang Lebih Seimbang */}
              <div className="hidden lg:grid grid-cols-12 gap-4 sm:gap-6">
                {/* Photos Section - 5 kolom */}
                <div className="col-span-5 space-y-4 sm:space-y-5">
                  {/* Registered Face Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100/80 p-3 sm:p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                          <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                            Registered Face
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Your stored face data
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 h-48 sm:h-52 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                      {embeddingImage ? (
                        <img
                          src={embeddingImage}
                          alt="Registered face"
                          className="object-cover rounded-lg max-h-full w-auto shadow-sm border border-gray-200"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <CameraIcon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-xs sm:text-sm font-medium">
                            No registered face data
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Current Photo Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100/80 p-3 sm:p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                          <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                            Current Photo
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Taken just now
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 h-48 sm:h-52 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt="Current attendance"
                          className="object-cover rounded-lg max-h-full w-auto shadow-sm border border-gray-200"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <CameraIcon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-xs sm:text-sm font-medium">
                            No photo available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Map & Verification Section - 7 kolom */}
                <div className="col-span-7 space-y-4 sm:space-y-5">
                  {/* Location Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100/80 p-3 sm:p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg">
                          <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                            Location
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Your attendance location
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="h-48 sm:h-52 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <LocationMap
                          latitude={latitude}
                          longitude={longitude}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Verification Card */}
                  <div
                    className={`bg-white rounded-xl shadow-sm border-2 ${statusBg} overflow-hidden transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                            Face Verification
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Siamese CNN analysis results
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            match
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {statusLabel}
                        </div>
                      </div>

                      {/* Metrics Grid - Lebih Compact */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-500 text-xs font-medium mb-1">
                            Distance
                          </p>
                          <p className="font-mono text-lg font-bold text-gray-800">
                            {distance != null ? distance.toFixed(4) : "—"}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Euclidean distance
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-500 text-xs font-medium mb-1">
                            Threshold
                          </p>
                          <p className="font-mono text-lg font-bold text-gray-800">
                            {threshold != null ? threshold.toFixed(4) : "—"}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Verification limit
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-500 text-xs font-medium mb-1">
                            Confidence
                          </p>
                          <p className="font-mono text-lg font-bold text-gray-800">
                            {confidence != null
                              ? `${(confidence * 100).toFixed(1)}%`
                              : "—"}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Model confidence
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-500 text-xs font-medium mb-1">
                            Similarity
                          </p>
                          <p className="font-mono text-lg font-bold text-gray-800">
                            {similarity != null
                              ? `${(similarity * 100).toFixed(1)}%`
                              : "—"}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Face match score
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Layout - Diperbaiki */}
              <div className="lg:hidden space-y-4">
                {/* Photos Row */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      <span className="text-xs font-semibold text-gray-700">
                        Registered
                      </span>
                    </div>
                    <div className="h-28 sm:h-32 bg-gray-50 rounded-md flex items-center justify-center">
                      {embeddingImage ? (
                        <img
                          src={embeddingImage}
                          alt="Registered"
                          className="object-cover h-full w-full rounded-md"
                        />
                      ) : (
                        <CameraIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-gray-700">
                        Current
                      </span>
                    </div>
                    <div className="h-28 sm:h-32 bg-gray-50 rounded-md flex items-center justify-center">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt="Current"
                          className="object-cover h-full w-full rounded-md"
                        />
                      ) : (
                        <CameraIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Map Mobile */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100/80 p-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-gray-700">
                        Location
                      </span>
                    </div>
                  </div>
                  <div className="h-40">
                    <LocationMap latitude={latitude} longitude={longitude} />
                  </div>
                </div>

                {/* Verification Status Mobile */}
                <div
                  className={`bg-white rounded-lg shadow-sm border-2 ${statusBg} p-3 sm:p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      Face Verification
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        match
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <p className="text-gray-500">Distance</p>
                      <p className="font-mono text-gray-800 text-sm">
                        {distance?.toFixed(4) || "—"}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <p className="text-gray-500">Threshold</p>
                      <p className="font-mono text-gray-800 text-sm">
                        {threshold?.toFixed(4) || "—"}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <p className="text-gray-500">Confidence</p>
                      <p className="font-mono text-gray-800 text-sm">
                        {confidence != null
                          ? `${(confidence * 100).toFixed(1)}%`
                          : "—"}
                      </p>
                    </div>
                    <div className="bg-white rounded p-2 border border-gray-200">
                      <p className="text-gray-500">Similarity</p>
                      <p className="font-mono text-gray-800 text-sm">
                        {similarity != null
                          ? `${(similarity * 100).toFixed(1)}%`
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Lebih Proporsional */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-5 border-t border-gray-200">
                <button
                  onClick={onRetake}
                  className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm sm:text-base"
                >
                  <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Retake Photo</span>
                </button>

                {match && (
                  <button
                    onClick={onConfirm}
                    className={`flex-1 sm:flex-none sm:w-48 px-4 sm:px-6 py-3 bg-gradient-to-r ${gradient} text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm sm:text-base shadow-md hover:scale-105 disabled:opacity-50`}
                    disabled={isLoading}
                  >
                    <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Confirm {title}</span>
                  </button>
                )}
              </div>

              {/* Error Message */}
              {!match && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <XMarkIcon className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-red-700 font-semibold text-sm">
                        Face verification failed
                      </p>
                      <p className="text-red-600 text-xs mt-1">
                        Please retake photo with better lighting and
                        positioning. Ensure your face is clearly visible and
                        centered.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
