import { useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

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
    },
    error: {
      icon: <XCircleIcon className="h-12 w-12 text-red-500" />,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
    },
    warning: {
      icon: <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
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
        onClick={type === "warning" ? null : onClose}
      ></div>
      <div
        className={`relative ${modalConfig[type].bgColor} rounded-lg p-6 shadow-xl max-w-md w-full mx-auto z-10`}
      >
        <div className="flex flex-col items-center space-y-4">
          {modalConfig[type].icon}
          <h3 className={`text-lg font-medium ${modalConfig[type].textColor}`}>
            {message}
          </h3>
          {type === "warning" ? (
            message // For warning type, we render the custom message component
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
