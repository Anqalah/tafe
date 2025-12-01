import { CameraIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";

const PreviewModal = ({
  show,
  type = "clockIn",
  imageSrc,
  verification,
  onConfirm,
  onRetake,
}) => {
  if (!show || !verification) return null;

  const title = type === "clockOut" ? "Clock Out" : "Clock In";
  const match = verification.match ?? false;
  const similarity = verification.similarity_percent ?? 0;
  const threshold = verification.threshold_similarity ?? 70.0;

  const statusLabel = match ? "Verified" : "Not Verified";
  const statusColor = match ? "text-emerald-600" : "text-red-600";
  const statusBg = match
    ? "bg-emerald-100 border-emerald-200"
    : "bg-red-100 border-red-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto overflow-hidden transform transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-primary p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{title} Preview</h3>
            </div>
            <button
              onClick={onRetake}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Photos Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registered Face */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CameraIcon className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold text-gray-800">Registered Face</h4>
              </div>
              {verification.face_crop_url ? (
                <img
                  src={`http://localhost:5000${verification.face_crop_url}`}
                  alt="Registered"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No face data
                </div>
              )}
            </div>

            {/* Current Photo */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CameraIcon className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Current Photo</h4>
              </div>
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Current"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No photo
                </div>
              )}
            </div>
          </div>

          {/* Similarity & Threshold */}
          <div className={`rounded-xl border-2 ${statusBg} p-4`}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-gray-700">
                Verification Status
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  match ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {statusLabel}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Similarity Score</span>
                  <span className="font-mono font-bold text-gray-800">
                    {similarity.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      match
                        ? "bg-emerald-500"
                        : similarity > 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, similarity)}%` }}
                  />
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Threshold: </span>
                <span className="font-mono font-bold text-primary">
                  {threshold}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onRetake}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Retake Photo
            </button>
            {match && (
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-primary text-white rounded-lg hover:opacity-90 font-medium flex items-center justify-center gap-2"
              >
                <ClockIcon className="w-5 h-5" />
                Confirm {title}
              </button>
            )}
          </div>

          {!match && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              Face verification failed. Ensure good lighting and center your
              face.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
