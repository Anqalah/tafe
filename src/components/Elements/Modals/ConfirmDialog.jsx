import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah kamu yakin ingin melanjutkan tindakan ini?",
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "pending", // "pending" | "destructive"
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const colorSet =
    variant === "destructive"
      ? {
          bg: "bg-red-100",
          text: "text-red-600",
          btn: "bg-red-600 hover:bg-red-700 text-white",
        }
      : {
          bg: "bg-amber-100",
          text: "text-amber-600",
          btn: "bg-amber-500 hover:bg-amber-600 text-white",
        };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 max-w-md w-[90%] border border-neutral-200 dark:border-neutral-700 animate-scaleIn">
        <div className="flex items-center gap-3 mb-3">
          <div className={`rounded-full p-2 ${colorSet.bg}`}>
            <ExclamationTriangleIcon className={`h-6 w-6 ${colorSet.text}`} />
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
            {title}
          </h2>
        </div>

        <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium ${colorSet.btn} transition-colors duration-200`}
          >
            {confirmText}
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
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
