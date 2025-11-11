import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  CameraIcon,
  ClockIcon,
  HomeIcon,
  UserIcon,
  FaceSmileIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import bg from "../../../assets/logo/bg.jpg";
import logo from "../../../assets/logo/logo.png";

const Sidebar = ({
  avatar,
  activeKey = "home",
  onNavigate = () => {},
  user = { name: "User", email: "student@email.com" },
  isCollapsed = false,
  setIsCollapsed = () => {},
}) => {
  const menuItems = [
    { key: "home", icon: <HomeIcon className="h-6 w-6" />, label: "Dashboard" },
    { key: "history", icon: <ClockIcon className="h-6 w-6" />, label: "History" },
    { key: "scan", icon: <CameraIcon className="h-6 w-6" />, label: "Absen" },
    { key: "profile", icon: <UserIcon className="h-6 w-6" />, label: "Profile" },
    // ✅ Tambahan baru
    {
      key: "updateface",
      icon: <FaceSmileIcon className="h-6 w-6" />,
      label: "Update Face",
    },
  ];

  const backgroundImage = bg;
  const profileImage = avatar || logo;

  return (
    <div
      className={`hidden lg:flex flex-col h-screen bg-cover bg-center transition-all duration-500 ease-in-out transform
      ${isCollapsed ? "w-20" : "w-64"}`}
      style={{
        backgroundImage: `linear-gradient(rgba(42, 67, 101, 0.85), rgba(42, 67, 101, 0.9)), url(${backgroundImage})`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white overflow-hidden shadow-lg">
              <img
                src={profileImage}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[#F5F7FA]">
                {user.name}
              </span>
              <span className="text-sm text-[#DDE6ED] opacity-80">
                {user.email}
              </span>
            </div>
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
        className={`flex-1 py-6 overflow-y-auto transition-all duration-500 ease-in-out ${
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

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => onNavigate("logout")}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/10 text-white hover:text-red-500 transition-all"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
