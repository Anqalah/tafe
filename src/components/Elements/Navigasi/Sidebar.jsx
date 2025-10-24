import React from "react";
import bg from "../../../assets/logo/bg.jpg";
import {
  HomeIcon,
  ClockIcon,
  CameraIcon,
  UserCircleIcon,
  PowerIcon,
  Bars3Icon,
  XMarkIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({
  avatar = "/images/shoes1.jpg",
  activeKey = "home",
  onNavigate = () => {},
  user = { name: "User", email: "student@email.com" },
  isCollapsed = false,
  setIsCollapsed = () => {},
}) => {
  const menuItems = [
    { key: "home", icon: <HomeIcon className="h-6 w-6" />, label: "Dashboard" },
    {
      key: "history",
      icon: <ClockIcon className="h-6 w-6" />,
      label: "History",
    },
    { key: "scan", icon: <CameraIcon className="h-6 w-6" />, label: "Absen" },
  ];

  const profileItems = [
    {
      key: "profile",
      icon: <UserCircleIcon className="h-6 w-6" />,
      label: "Profile",
    },
    { key: "logout", icon: <PowerIcon className="h-6 w-6" />, label: "Logout" },
  ];

  const [showMenu, setShowMenu] = React.useState(false);
  // Tutup menu jika klik di luar area
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-menu-area")) setShowMenu(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const backgroundImage = bg;

  return (
    <div
      className={`hidden lg:flex flex-col h-screen bg-cover bg-center 
      transition-all duration-500 ease-in-out transform
      ${isCollapsed ? "w-20" : "w-64"} 
      ${isCollapsed ? "-translate-x-0" : "translate-x-0"}
      `}
      style={{
        backgroundImage: `linear-gradient(rgba(42, 67, 101, 0.85), rgba(42, 67, 101, 0.9)), url(${backgroundImage})`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-3 transition-all duration-500 ease-in-out">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F7EF8A] shadow-lg">
              <AcademicCapIcon className="h-6 w-6 text-[#2A4365]" />
            </div>
            <span className="text-xl font-bold text-[#F5F7FA]">
              Student Portal
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-3 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isCollapsed ? (
            <Bars3Icon className="h-5 w-5 text-[#F5F7FA]" />
          ) : (
            <XMarkIcon className="h-5 w-5 text-[#F5F7FA]" />
          )}
        </button>
      </div>

      {/* Menu Utama */}
      <div
        className={`flex-1 py-6 px-4 overflow-y-auto transition-all duration-500 ease-in-out ${
          isCollapsed ? "px-2" : "px-4"
        }`}
      >
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 w-full ${
                activeKey === item.key
                  ? "bg-[#D4AF37] text-[#2A4365] shadow-lg"
                  : "text-[#F5F7FA] hover:bg-white/10"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <div
                className={`${
                  activeKey === item.key ? "text-[#2A4365]" : "text-[#F5F7FA]"
                }`}
              >
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="font-medium transition-opacity duration-500 ease-in-out">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Profil */}
      <div
        className={`p-4 border-t border-white/10 flex flex-col items-center ${
          isCollapsed ? "justify-center" : ""
        } relative profile-menu-area`}
      >
        {/* Avatar */}
        <div
          className={`relative flex items-center ${
            isCollapsed ? "justify-center" : "gap-3"
          } w-full transition-all duration-300`}
        >
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="relative focus:outline-none group"
          >
            <img
              src={avatar}
              alt="User Avatar"
              className={`rounded-full border-2 border-[#D4AF37] object-cover shadow-lg transition-all duration-300 ${
                isCollapsed ? "h-12 w-12" : "h-10 w-10"
              } group-hover:scale-105`}
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-[#2A4365]" />
          </button>

          {/* Info user saat sidebar terbuka */}
          {!isCollapsed && (
            <div className="flex-1 min-w-0 transition-opacity duration-500 ease-in-out">
              <p className="text-sm font-semibold text-[#F5F7FA] truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-[#F5F7FA]/70 truncate">
                {user?.email || "student@email.com"}
              </p>
            </div>
          )}
        </div>

        {/* Popup menu */}
        {showMenu && (
          <div
            className={`absolute z-50 ${
              isCollapsed
                ? "bottom-16 left-1/2 -translate-x-1/2"
                : "bottom-20 left-1/2 -translate-x-1/2"
            } w-48 bg-[#2A4365]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl 
      animate-fadeInScale overflow-hidden`}
          >
            <div className="p-3 border-b border-white/10">
              <p className="text-sm font-semibold text-white text-center">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-300 text-center truncate">
                {user?.email || "student@email.com"}
              </p>
            </div>

            <button
              onClick={() => {
                onNavigate("profile");
                setShowMenu(false);
              }}
              className="flex items-center gap-3 w-full p-3 text-[#F5F7FA]/90 hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Profile</span>
            </button>

            <button
              onClick={() => {
                onNavigate("logout");
                setShowMenu(false);
              }}
              className="flex items-center gap-3 w-full p-3 text-[#F5F7FA]/90 hover:bg-white/10 hover:text-[#D4AF37] transition-colors border-t border-white/10"
            >
              <PowerIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
