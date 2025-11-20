// components/Layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChartBarIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout, reset } from "../../Features/authSlice";
import LoadingModal from "../Elements/Modals/LoadingModal";
import ErrorModal from "../Elements/Modals/ErrorModal";

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile) {
        setIsCollapsed(true);
        setIsSidebarOpen(false);
      } else {
        setIsCollapsed(false);
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(logout());
      dispatch(reset());
      navigate("/login");
    }, 1000);
  };

  const navigation = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <ChartBarIcon className="h-5 w-5" />,
    },
    {
      path: "/data/admin",
      label: "Data Admin",
      icon: <UserGroupIcon className="h-5 w-5" />,
    },
    {
      path: "/data/student",
      label: "Data Siswa",
      icon: <AcademicCapIcon className="h-5 w-5" />,
    },
    {
      path: "/data/absen",
      label: "Data Absen",
      icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
    },
  ];

  const getPageTitle = () => {
    const currentNav = navigation.find((nav) => nav.path === location.pathname);
    return currentNav ? currentNav.label : "Dashboard";
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50/30 font-sans overflow-hidden">
      {/* Loading & Error Modals */}
      <LoadingModal isOpen={isLoading} />
      <ErrorModal
        isOpen={!!error}
        onClose={() => setError(null)}
        title="Terjadi Kesalahan"
        message={error}
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-gradient-to-b from-[#1E2E4A] to-[#0F1A2F]
        text-white shadow-2xl lg:shadow-xl
        transition-all duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
        ${isCollapsed && !isMobile ? "w-20" : "w-64 lg:w-64"}
        ${isMobile ? "w-64" : ""}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/10">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                MALEO
              </span>
            </div>
          )}

          {isCollapsed && !isMobile && (
            <div className="w-8 h-8 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-lg flex items-center justify-center mx-auto">
              <AcademicCapIcon className="h-5 w-5 text-white" />
            </div>
          )}

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 lg:mt-8 space-y-1 lg:space-y-2 px-3 lg:px-4">
          {navigation.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isCollapsed={isCollapsed && !isMobile}
              isMobile={isMobile}
              isActive={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setIsSidebarOpen(false);
              }}
            />
          ))}
        </nav>

        {/* User Profile - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t border-white/10">
          <UserProfile
            user={user}
            isCollapsed={isCollapsed && !isMobile}
            isMobile={isMobile}
            isOpen={isProfileOpen}
            toggle={() => setIsProfileOpen(!isProfileOpen)}
            onLogout={handleLogout}
            onEditProfile={() => navigate(`/admin/edit/${user?.uuid}`)}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Topbar */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm z-30 sticky top-0">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 lg:hover:scale-105"
              >
                <Bars3Icon className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600" />
              </button>

              {/* Page Title */}
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#1E2E4A] to-[#D4AF37] bg-clip-text text-transparent">
                  {getPageTitle()}
                </h1>
                {/* Mobile Date */}
                <div className="lg:hidden flex items-center space-x-1 text-sm text-gray-500 mt-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Profile */}
            <div className="hidden lg:block">
              <UserProfile
                user={user}
                isCollapsed={false}
                isMobile={false}
                isOpen={isProfileOpen}
                toggle={() => setIsProfileOpen(!isProfileOpen)}
                onLogout={handleLogout}
                onEditProfile={() => navigate(`/admin/edit/${user?.uuid}`)}
              />
            </div>

            {/* Mobile Profile Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
              >
                <UserCircleIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile Profile Dropdown */}
          {isProfileOpen && isMobile && (
            <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50 px-4 py-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
                  {user?.foto_profile ? (
                    <img
                      src={user.foto_profile}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/admin/edit/${user?.uuid}`)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <PencilSquareIcon className="h-4 w-4 mr-2" />
                  Edit Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ item, isCollapsed, isMobile, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center rounded-xl p-3 text-sm font-medium
        transition-all duration-200 group relative
        ${
          isActive
            ? "bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 text-[#D4AF37] shadow-lg shadow-[#D4AF37]/10"
            : "text-gray-300 hover:bg-white/5 hover:text-white"
        }
        ${isMobile ? "text-base" : ""}
      `}
    >
      <div
        className={`transition-transform duration-200 ${
          isActive ? "scale-110" : "scale-100"
        }`}
      >
        {item.icon}
      </div>

      {(!isCollapsed || isMobile) && (
        <span className="ml-3 transition-opacity duration-200">
          {item.label}
        </span>
      )}

      {/* Active indicator */}
      {isActive && !isMobile && (
        <div className="absolute right-3 w-1.5 h-6 bg-[#D4AF37] rounded-full" />
      )}

      {/* Tooltip for collapsed state on desktop */}
      {isCollapsed && !isMobile && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          {item.label}
        </div>
      )}
    </button>
  );
};

const UserProfile = ({
  user,
  isCollapsed,
  isMobile,
  isOpen,
  toggle,
  onLogout,
  onEditProfile,
}) => {
  if (isMobile) return null; // Mobile profile handled in topbar

  return (
    <div className="relative">
      <div
        className="flex items-center cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all duration-200 group"
        onClick={toggle}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] flex items-center justify-center shadow-lg">
            {user?.foto_profile ? (
              <img
                src={user.foto_profile}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default_profile.png";
                }}
              />
            ) : (
              <UserCircleIcon className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1E2E4A]"></div>
        </div>

        {!isCollapsed && (
          <div className="ml-3 overflow-hidden flex-1 text-left">
            <p className="font-semibold text-white truncate text-sm">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        )}

        {!isCollapsed && (
          <ChevronDownIcon
            className={`ml-2 w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden z-10 border border-gray-200/50">
          <button
            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 group"
            onClick={onEditProfile}
          >
            <PencilSquareIcon className="h-4 w-4 mr-3 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span>Ubah Profil</span>
          </button>
          <button
            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50/80 transition-all duration-200 group"
            onClick={onLogout}
          >
            <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Helper component for Calendar Icon
const CalendarIcon = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default AdminLayout;
