import {
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function FaceUpdateActions({
  onConfirm,
  onReset,
  loading,
  similarity,
}) {
  const isValid = similarity > 0.5;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 justify-center">
        <button
          onClick={onConfirm}
          disabled={loading || !isValid}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 font-semibold"
        >
          <CheckCircleIcon className="w-5 h-5" />
          {loading ? "Memproses..." : "Konfirmasi Update"}
        </button>

        <button
          onClick={onReset}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Ambil Ulang
        </button>
      </div>

      {!isValid && similarity !== null && (
        <div className="text-center text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
          Kemiripan wajah rendah. Disarankan mengambil foto ulang dengan
          pencahayaan yang lebih baik.
        </div>
      )}
    </div>
  );
}
