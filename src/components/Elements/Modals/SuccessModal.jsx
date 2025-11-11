import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const SuccessModal = ({
  isOpen,
  onClose,
  title = "Berhasil!",
  message = "Operasi berhasil dilakukan.",
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-6 max-w-md w-[90%] animate-scaleIn">
        <div className="flex flex-col items-center text-center py-4">
          <div className="mb-4 rounded-full bg-green-100 p-3">
            <CheckCircleIcon className="h-16 w-16 text-green-600 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
            {title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            {message}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-11 px-8 rounded-md font-medium transition-all duration-200"
          >
            OK
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;
