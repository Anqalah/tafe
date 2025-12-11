import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect } from "react";
export const Modal = ({ type, message, onClose, show }) => {
  useEffect(() => {
    if (show && type !== "warning") {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, type]);

  if (!show) return null;

  const modalConfig = {
    success: {
      icon: <CheckCircleIcon className="h-12 w-12 text-green-500" />,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    error: {
      icon: <XCircleIcon className="h-12 w-12 text-red-500" />,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700", // Tetap biru untuk konsistensi
    },
    loading: {
      icon: (
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      ),
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={type === "warning" ? null : onClose}
      ></div>
      <div className="relative mx-auto z-10 w-full max-w-md">
        <div
          className={`${modalConfig[type].bgColor} rounded-xl shadow-2xl overflow-hidden transition-all transform`}
        >
          <div className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-2">{modalConfig[type].icon}</div>

              {typeof message === "string" ? (
                <h3
                  className={`text-lg font-medium ${modalConfig[type].textColor} text-center`}
                >
                  {message}
                </h3>
              ) : (
                message
              )}

              {type === "warning" && typeof message === "string" && (
                <div className="mt-4">
                  <button
                    onClick={onClose}
                    className={`px-6 py-2 ${modalConfig[type].buttonColor} text-white rounded-lg transition-colors shadow-md`}
                  >
                    Mengerti
                  </button>
                </div>
              )}
            </div>
          </div>

          {type !== "warning" && (
            <div className="px-4 py-3 bg-gray-50 text-right">
              <button
                onClick={onClose}
                className={`px-4 py-2 ${modalConfig[type].buttonColor} text-white rounded-md transition-colors`}
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
