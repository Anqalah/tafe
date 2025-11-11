import React from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  FaceSmileIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const ProfileCard = ({
  user,
  onViewProfile,
  onLogout,
  onUpdateFace,
  onClose,
}) => {
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "UN";

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md lg:p-6"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-in fade-in-90 slide-in-from-bottom-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dengan Gradient Premium */}
        <div className="bg-gradient-to-br from-[#2A4365] to-[#D4AF37] p-8 rounded-t-3xl relative overflow-hidden">
          {/* Efek Glassmorphism */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

          {/* Tombol Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>

          {/* Profile Info */}
          <div className="flex items-center gap-5 pr-12 relative z-10">
            {/* Foto Profil dengan Border Emas */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F7EF8A] p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  {user?.foto_profile ? (
                    <img
                      src={user.foto_profile}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#2A4365] to-[#1E293B] flex items-center justify-center">
                      <span className="font-bold text-white text-xl">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-3 border-white shadow-lg"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0 text-white">
              <h3 className="font-bold text-2xl tracking-tight truncate drop-shadow-sm">
                {user?.name || "User"}
              </h3>
              <p className="text-white/90 text-base font-medium mt-1 truncate">
                {user?.role || "Student"}
              </p>
              <p className="text-white/70 text-sm mt-1 font-mono">
                ID: {user?.id || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Informasi Kontak */}
        <div className="p-6 space-y-4 bg-gray-50/30">
          {/* Email Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-[#D4AF37]/20 group">
            <div className="p-3 bg-gradient-to-br from-[#2A4365]/10 to-[#D4AF37]/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <EnvelopeIcon className="w-5 h-5 text-[#2A4365]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Email
              </p>
              <p className="text-sm font-semibold text-gray-800 truncate mt-1">
                {user?.email || "—"}
              </p>
            </div>
          </div>

          {/* Phone Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-[#D4AF37]/20 group">
            <div className="p-3 bg-gradient-to-br from-[#2A4365]/10 to-[#D4AF37]/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <PhoneIcon className="w-5 h-5 text-[#2A4365]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Phone
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {user?.hp || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 space-y-4 border-t border-gray-100 bg-white rounded-b-3xl">
          {/* Update Face Button */}
          <button
            onClick={() => {
              if (onUpdateFace) onUpdateFace();
              if (onClose) onClose();
            }}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E8C44F] text-white font-semibold hover:from-[#C19C30] hover:to-[#D4AF37] transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shadow-md group"
          >
            <FaceSmileIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Update Face</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
            </div>
          </button>

          {/* Profile Button */}
          <button
            onClick={() => {
              onViewProfile?.();
              onClose?.();
            }}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] group"
          >
            <UserCircleIcon className="w-5 h-5 text-[#2A4365] group-hover:scale-110 transition-transform duration-300" />
            <span>Profile</span>
            <Cog6ToothIcon className="w-4 h-4 ml-auto text-gray-400 group-hover:text-[#D4AF37] group-hover:rotate-90 transition-all duration-300" />
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              onLogout?.();
              onClose?.();
            }}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-white to-gray-50 text-red-600 font-semibold hover:from-red-50 hover:to-red-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 border-red-200 hover:border-red-300 group"
          >
            <ArrowRightStartOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Logout</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
