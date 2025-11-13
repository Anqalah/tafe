import {
  CameraIcon,
  ClockIcon,
  HomeIcon,
  XMarkIcon,
  UserCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import userProfile from "../../../public/images/shoes1.jpg";
import bg_home from "../../assets/logo/bg_home.jpg";
import axiosInstance from "../../config/axios.js";
import { getMe, logout, reset } from "../../Features/authSlice";
import ProfileCard from "../Elements/Modals/ProfileCard.jsx";
import Sidebar from "../Elements/Navigasi/SidebarStudent.jsx";

const StudentLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", isSidebarOpen);
  }, [isSidebarOpen]);

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({
    loading: false,
    error: null,
    hasClockedIn: false,
    hasClockedOut: false,
  });

  useEffect(() => {
    const pathMap = {
      "/student/dashboard": "home",
      "/student/history": "history",
      "/student/absen": "history",
      "/attendances/clockin": "scan",
      "/attendances/clockout": "scan",
      "/student/profile": "profile",
      "/student/updateface": "updateface", // ✅ sudah include route baru
    };
    const matchedPath = Object.keys(pathMap).find((path) =>
      location.pathname.startsWith(path)
    );
    setActiveTab(matchedPath ? pathMap[matchedPath] : "home");
  }, [location.pathname]);

  const checkAttendance = async (uuid) => {
    try {
      setAttendanceStatus((prev) => ({ ...prev, loading: true, error: null }));
      const response = await axiosInstance.get(`/attendances/status/${uuid}`);
      const { hasClockedIn, hasClockedOut } = response.data.data;
      setAttendanceStatus({
        loading: false,
        hasClockedIn,
        hasClockedOut,
        error: null,
      });
      return { hasClockedIn, hasClockedOut };
    } catch (error) {
      setAttendanceStatus({
        loading: false,
        error: error.response?.data?.message || error.message,
        hasClockedIn: false,
        hasClockedOut: false,
      });
      throw error;
    }
  };

  const handleScan = async () => {
    if (!user?.uuid) return;
    try {
      const { hasClockedIn, hasClockedOut } = await checkAttendance(user.uuid);

      if (hasClockedIn && hasClockedOut) {
        setShowCompletionModal(true);
        return;
      }

      if (!hasClockedIn) {
        navigate(`/attendances/clockin/${user.uuid}`);
      } else if (!hasClockedOut) {
        navigate(`/attendances/clockout/${user.uuid}`);
      }
    } catch (error) {
      alert("Gagal memeriksa status absensi. Coba lagi nanti.");
    }
  };

  const handleNavigation = (key) => {
    switch (key) {
      case "home":
        navigate("/student/dashboard");
        break;
      case "history":
        navigate(`/student/history/${user.uuid}`);
        break;
      case "scan":
        handleScan();
        break;
      case "profile":
        navigate(`/student/profile/${user.uuid}`);
        break;
      case "updateface":
        navigate(`/student/updateface/${user.uuid}`); // ✅ route update face
        break;
      case "logout":
        dispatch(logout());
        dispatch(reset());
        navigate("/login");
        break;
      default:
        break;
    }
  };

  // Escape modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowUserModal(false);
    };
    if (showUserModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showUserModal]);

  useEffect(() => {
    if (!user) {
      dispatch(getMe())
        .unwrap()
        .catch(() => navigate("/login"));
    }
  }, [dispatch, navigate, user]);

  if (!user) return null;

  return (
    <div className="relative flex w-full h-screen mx-auto overflow-hidden font-inter">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${bg_home})`,
          zIndex: 0,
          opacity: 0.25,
        }}
      />

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex relative z-20">
        <Sidebar
          activeKey={activeTab}
          avatar={user.foto_profile || userProfile}
          logo="S"
          onNavigate={handleNavigation}
          user={user}
          isCollapsed={isSidebarOpen}
          setIsCollapsed={setIsSidebarOpen}
        />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        {/* Header Mobile */}
        <header className="sticky top-0 z-40 bg-gradient-to-r from-primary/90 to-blue-600/90 shadow-lg backdrop-blur-sm lg:hidden">
          <div className="flex justify-between items-center p-5">
            <h1 className="text-white font-bold text-xl">Student Portal</h1>
            <div className="relative">
              <img
                src={user.foto_profile ? user.foto_profile : userProfile}
                alt="profile"
                className="w-12 h-12 rounded-full cursor-pointer border-2 border-white/30 shadow-lg hover:scale-105 transition-transform"
                onClick={() => setShowUserModal(true)}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 h-full overflow-y-auto scroll-smooth z-40">
          {attendanceStatus.error && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-4 shadow-sm">
              {attendanceStatus.error}
            </div>
          )}
          {children}
        </main>

        {/* ✅ Bottom Navigation (Mobile) */}
        <nav className="w-full bg-white rounded-t-2xl shadow-2xl border-t border-gray-300 lg:hidden relative z-30">
          <div className="flex justify-around items-center p-2">
            <NavLink
              to="/student/dashboard"
              icon={<HomeIcon className="w-5 h-5" />}
              label="Home"
              active={activeTab === "home"}
            />
            <button
              onClick={handleScan}
              disabled={attendanceStatus.loading}
              className={`p-5 rounded-full shadow-lg transition-all relative ${
                attendanceStatus.loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-primary to-blue-600 hover:shadow-xl hover:scale-105 active:scale-95"
              } ${
                activeTab === "scan"
                  ? "ring-4 ring-blue-200 ring-opacity-50"
                  : ""
              }`}
            >
              <CameraIcon className="w-4 h-4 text-white" />
              {attendanceStatus.loading && (
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin"></div>
              )}
            </button>
            <NavLink
              to={`/student/history/${user.uuid}`}
              icon={<ClockIcon className="w-5 h-5" />}
              label="History"
              active={activeTab === "history"}
            />
          </div>
        </nav>
      </div>

      {showUserModal && (
        <ProfileCard
          user={user}
          onViewProfile={() => navigate(`/student/profile/${user.uuid}`)}
          onUpdateFace={() => navigate(`/student/updateface/${user.uuid}`)}
          onLogout={() => {
            dispatch(logout());
            dispatch(reset());
            navigate("/login");
          }}
          onClose={() => setShowUserModal(false)}
        />
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Attendance Complete
              </h3>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-gray-700">
                Anda telah melakukan Clock-In dan Clock-Out hari ini.
              </p>
            </div>
            <button
              onClick={() => setShowCompletionModal(false)}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
      active
        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg transform scale-105"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`}
  >
    <span className="w-6 h-6">{icon}</span>
    <span className="text-xs mt-1 font-medium">{label}</span>
  </Link>
);

export default StudentLayout;
