import { useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export const Modal = ({ type, message, onClose, show }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      });
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const modalConfig = {
    success: {
      icon: <CheckCircleIcon className="h-12 w-12 text-green-500" />,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    error: {
      icon: <XCircleIcon className="h-12 w-12 text-red-500" />,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
    },
    loading: {
      icon: (
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      ),
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>
      <div
        className={`relative ${modalConfig[type].bgColor} rounded-lg p-6 shadow-xl max-w-md w-full mx-auto z-10`}
      >
        <div className="flex flex-col items-center space-y-4">
          {modalConfig[type].icon}
          <h3 className={`text-lg font-medium ${modalConfig[type].textColor}`}>
            {message}
          </h3>
          {type !== "loading" && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
