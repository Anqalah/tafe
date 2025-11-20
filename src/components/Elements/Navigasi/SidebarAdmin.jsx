import { UserCircle, ChevronDown, Pencil, LogOut } from "lucide-react";

export const SidebarAdmin = ({
  user,
  isCollapsed,
  isOpen,
  toggle,
  onLogout,
  onEditProfile,
}) => {
  return (
    <div className="relative">
      <button
        onClick={toggle}
        className={`w-full flex items-center p-3 rounded-xl transition-all 
        hover:bg-white/5 ${isCollapsed ? "justify-center" : "justify-between"}`}
      >
        <div className="flex items-center gap-3">
          {/* Foto Profil */}
          {user?.profile_image ? (
            <img
              src={user.profile_image}
              className="h-10 w-10 rounded-full object-cover border border-white/10"
              alt="Profile"
            />
          ) : (
            <UserCircle className="h-10 w-10 text-gray-300" />
          )}

          {/* Nama & email */}
          {!isCollapsed && (
            <div className="text-left">
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-gray-400 text-xs">{user?.email}</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <ChevronDown
            className={`h-4 w-4 text-gray-300 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {isOpen && (
        <div className="mt-2 bg-[#1A2438] border border-white/10 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
          <button
            onClick={onEditProfile}
            className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/5"
          >
            <Pencil className="h-5 w-5" />
            Edit Profil
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-white/5"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
