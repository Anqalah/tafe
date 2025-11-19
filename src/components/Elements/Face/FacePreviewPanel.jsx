export default function FacePreviewPanel({ title, image, type = "old" }) {
  const gradient =
    type === "old"
      ? "from-blue-50 to-indigo-100"
      : "from-green-50 to-emerald-100";

  const borderColor = type === "old" ? "border-blue-200" : "border-green-200";

  return (
    <div className="space-y-2">
      <p className="font-semibold text-gray-700 flex items-center gap-2">
        {type === "old" ? (
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        ) : (
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        )}
        {title}
      </p>

      <div
        className={`bg-gradient-to-br ${gradient} border-2 ${borderColor} p-4 rounded-2xl flex flex-col items-center shadow-inner`}
      >
        {image ? (
          <img
            src={image}
            className="w-32 h-32 rounded-xl object-cover shadow-lg border-2 border-white"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-gray-400 text-sm">Tidak ada gambar</span>
          </div>
        )}
      </div>
    </div>
  );
}
