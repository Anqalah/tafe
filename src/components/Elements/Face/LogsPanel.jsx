import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function LogsPanel({ logs }) {
  return (
    <div className="space-y-3">
      <h4 className="text-white font-semibold flex items-center gap-2">
        <InformationCircleIcon className="w-5 h-5" />
        Log Proses
      </h4>

      <div className="bg-gray-800/50 rounded-xl p-4 max-h-64 overflow-y-auto space-y-2 border border-gray-700">
        {logs.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            Menunggu proses dimulai...
          </p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 text-sm">
              <span className="text-gray-400 text-xs mt-0.5 flex-shrink-0">
                {log.timestamp}
              </span>
              <span className="text-gray-200 flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
