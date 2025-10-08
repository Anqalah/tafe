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
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
          <div className="relative">
            <img
              src={avatar}
              alt="User Avatar"
              className="h-10 w-10 rounded-full border-2 border-[#D4AF37] object-cover shadow-md"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-[#2A4365]"></div>
          </div>

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

        {!isCollapsed && (
          <div className="mt-3 space-y-1 transition-all duration-500 ease-in-out">
            {profileItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors ${
                  activeKey === item.key
                    ? "text-[#D4AF37] bg-white/10"
                    : "text-[#F5F7FA]/80 hover:text-[#F5F7FA] hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
