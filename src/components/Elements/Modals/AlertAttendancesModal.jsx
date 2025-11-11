import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

const alertTypes = {
  error: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />,
    title: "Error",
    btn: "bg-red-100 hover:bg-red-200 text-red-700",
  },
  success: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: <CheckCircleIcon className="w-12 h-12 text-green-500" />,
    title: "Success",
    btn: "bg-green-100 hover:bg-green-200 text-green-700",
  },
};

const AlertAttendancesModal = ({ message, onClose, type = "success" }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
    } else {
      // kasih delay sebelum hide agar transisi keluar bisa jalan
      setTimeout(() => setShow(false), 150);
    }
  }, [message]);

  if (!message) return null;

  const style = alertTypes[type] || alertTypes.success;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className={`relative transform transition-all duration-300 p-6 rounded-xl shadow-xl max-w-sm w-full ${
          style.bg
        } ${style.text} ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close alert"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{style.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{style.title}</h3>
          <p className="mb-6 text-sm leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${style.btn}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertAttendancesModal;
