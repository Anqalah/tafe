import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function EmbeddingCard({ title, embedding, type = "old" }) {
  const bgColor = type === "old" ? "bg-blue-50" : "bg-green-50";
  const borderColor = type === "old" ? "border-blue-200" : "border-green-200";
  const textColor = type === "old" ? "text-blue-700" : "text-green-700";

  if (!embedding) {
    return (
      <div
        className={`p-4 ${bgColor} border ${borderColor} rounded-xl text-sm ${textColor}`}
      >
        <p className="font-medium">{title}</p>
        <p className="mt-2 text-gray-500">Embedding belum tersedia.</p>
      </div>
    );
  }

  const copy = () => {
    navigator.clipboard.writeText(JSON.stringify(embedding, null, 2));
    toast.success("Embedding disalin!");
  };

  return (
    <div
      className={`p-4 ${bgColor} border ${borderColor} rounded-xl transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <button
          onClick={copy}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-white/50"
        >
          <DocumentDuplicateIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs bg-white/50 p-3 rounded-lg border">
        {embedding.slice(0, 12).map((v, i) => (
          <span key={i} className="text-center font-mono text-gray-600">
            {parseFloat(v).toFixed(3)}
          </span>
        ))}
      </div>

      <p className="text-xs mt-2 text-gray-500 text-center">
        ... {embedding.length - 12} nilai lainnya
      </p>
    </div>
  );
}
