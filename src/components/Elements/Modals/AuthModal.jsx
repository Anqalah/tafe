// components/Elements/AuthModals/AuthModal.jsx
import { useEffect } from "react";

const AuthModal = ({
  show,
  onClose,
  type = "info",
  title,
  message,
  confirmText = "Tutup",
  onConfirm,
  showCancelButton = false,
  cancelText = "Batal",
  onCancel,
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27 && onClose && type !== "loading") onClose();
    };

    if (show) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [show, onClose, type]);

  if (!show) return null;

  const modalConfig = {
    success: {
      icon: (
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-[#D4AF37] bg-opacity-20">
          <svg
            className="h-6 w-6 text-[#D4AF37]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      ),
      borderColor: "border-[#D4AF37]",
      title: title || "Berhasil!",
      buttonStyle:
        "text-[#D4AF37] hover:text-[#B8941F] hover:bg-[#D4AF37] hover:bg-opacity-10",
    },
    error: {
      icon: (
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      ),
      borderColor: "border-red-500",
      title: title || "Gagal!",
      buttonStyle: "text-red-700 hover:text-red-800 hover:bg-red-50",
    },
    warning: {
      icon: (
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100">
          <svg
            className="h-6 w-6 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      ),
      borderColor: "border-yellow-500",
      title: title || "Peringatan!",
      buttonStyle: "text-yellow-700 hover:text-yellow-800 hover:bg-yellow-50",
    },
    info: {
      icon: (
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-[#2A4365] bg-opacity-20">
          <svg
            className="h-6 w-6 text-[#2A4365]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      ),
      borderColor: "border-[#2A4365]",
      title: title || "Informasi",
      buttonStyle:
        "text-[#2A4365] hover:text-[#1E2F4A] hover:bg-[#2A4365] hover:bg-opacity-10",
    },
    loading: {
      icon: (
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-[#2A4365] bg-opacity-20">
          <svg
            className="h-6 w-6 text-[#2A4365] animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ),
      borderColor: "border-[#2A4365]",
      title: title || "Memproses...",
      buttonStyle: "",
    },
  };

  const config = modalConfig[type] || modalConfig.info;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] animate-fadeIn">
      {/* Backdrop click - disabled for loading */}
      {type !== "loading" && (
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Modal */}
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 animate-scaleIn ${config.borderColor} border-t-4`}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            {config.icon}
            <div className="flex-1 min-w-0">
              <h3
                id="modal-title"
                className="text-lg font-semibold text-gray-900 mb-1"
              >
                {config.title}
              </h3>
              <p
                id="modal-description"
                className="text-gray-600 leading-relaxed"
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions - hide for loading */}
        {type !== "loading" && (
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
            {showCancelButton && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              type="button"
              onClick={onConfirm || onClose}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${config.buttonStyle}`}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
