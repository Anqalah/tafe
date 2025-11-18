import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function SimilarityInfo({ similarity, distance }) {
  if (similarity == null || distance == null) {
    return (
      <div className="p-6 border-2 border-dashed border-gray-300 rounded-2xl text-center text-gray-500 bg-gray-50">
        <p className="text-lg font-medium">Menunggu analisis...</p>
      </div>
    );
  }

  const similarityPercent = (similarity * 100).toFixed(1);
  const isValid = similarity > 0.5;

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        {isValid ? (
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
        ) : (
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
        )}
        Hasil Verifikasi
      </h4>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl text-center border border-blue-200">
          <p className="text-xs text-blue-600 font-medium">Similarity</p>
          <p className="text-2xl font-bold text-blue-700">
            {similarityPercent}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-4 rounded-xl text-center border border-purple-200">
          <p className="text-xs text-purple-600 font-medium">Distance</p>
          <p className="text-2xl font-bold text-purple-700">
            {distance.toFixed(4)}
          </p>
        </div>
      </div>

      <div
        className={`p-3 rounded-lg text-center ${
          isValid
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
        }`}
      >
        <p className="font-medium">
          {isValid
            ? "✅ Wajah terverifikasi cocok"
            : "⚠️ Wajah perlu diperiksa ulang"}
        </p>
        <p className="text-sm mt-1">
          {isValid
            ? "Kemiripan wajah mencukupi untuk update"
            : "Kemiripan wajah di bawah 50%, pastikan foto jelas"}
        </p>
      </div>
    </div>
  );
}
