import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const LoadingModal = ({ isOpen, message = "Memproses..." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm px-6 py-8 flex flex-col items-center text-center animate-scaleIn">
        {/* Ikon Loading */}
        <div className="relative mb-4">
          <ArrowPathIcon className="w-14 h-14 text-[#D4AF37] animate-spin" />
        </div>

        {/* Judul */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Mohon Tunggu
        </h3>

        {/* Pesan */}
        <p className="text-gray-500 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
