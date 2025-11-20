// components/Modals/LoadingModal.jsx (Updated)
import React from "react";

const LoadingModal = ({ isOpen, message = "Memproses..." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn px-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 p-6 lg:p-8 max-w-sm w-full animate-scaleIn">
        <div className="flex flex-col items-center text-center">
          {/* Animated Spinner */}
          <div className="relative mb-4 lg:mb-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-[#D4AF37]/20 rounded-full"></div>
            <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-transparent border-t-[#D4AF37] rounded-full absolute top-0 left-0 animate-spin"></div>
            <div className="w-12 h-12 lg:w-16 lg:h-16 border-4 border-transparent border-b-[#1E2E4A] rounded-full absolute top-0 left-0 animate-spin animation-delay-[-0.3s]"></div>
          </div>

          <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
            Harap Tunggu
          </h3>
          <p className="text-gray-600 text-sm lg:text-base">{message}</p>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-\[-0\.3s\] {
          animation-delay: -0.3s;
        }
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
            transform: scale(0.9) translateY(10px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingModal;
