import React from "react";
import { CameraIcon, ClockIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMe, logout, reset } from "../../Features/authSlice";
import { Modal } from "../Elements/Modals/Modal.jsx";
import axiosInstance from "../../config/axios.js";
import userProfile from "../../../public/images/shoes1.jpg";
import Sidebar from "../Elements/Navigasi/sidebar.jsx";

const StudentLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Ambil dari localStorage (default: false)
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });
  useEffect(() => {
    // Simpan setiap kali berubah
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
      case "logout":
        // Handle logout logic
        dispatch(logout());
        dispatch(reset());
        navigate("/login");
        break;
      default:
        break;
    }
  };

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
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex">
        <Sidebar
          activeKey={activeTab}
          avatar={user.foto_profile || userProfile}
          logo="S"
          onNavigate={handleNavigation}
          user={user} // Pastikan prop user dikirim
          isCollapsed={isSidebarOpen}
          setIsCollapsed={setIsSidebarOpen}
        />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-primary/90 to-blue-600/90 shadow-lg backdrop-blur-sm lg:hidden">
          <div className="flex justify-between items-center p-5">
            <h1 className="text-white font-bold text-xl">Student Portal</h1>
            <div className="relative">
              <img
                src={user.foto_profile ? user.foto_profile : userProfile}
                alt="profile"
                className="w-12 h-12 rounded-full cursor-pointer border-2 border-white/30 shadow-lg hover:scale-105 transition-transform"
                onClick={() => setShowUserModal(!showUserModal)}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 h-full overflow-y-auto scroll-smooth">
          {attendanceStatus.error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {attendanceStatus.error}
            </div>
          )}
          {children}
        </main>

        {/* Bottom Navigation (Mobile) */}
        <nav className="w-full bg-white rounded-t-2xl shadow-2xl border-t border-gray-300 lg:hidden">
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
              className={`p-5 rounded-full shadow-lg transition-all ${
                attendanceStatus.loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-primary to-blue-600 hover:shadow-xl hover:scale-105"
              } ${activeTab === "scan" ? "ring-4 ring-blue-200" : ""}`}
            >
              <CameraIcon className="w-4 h-4 text-white" />
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

      <Modal
        show={showCompletionModal}
        type="success"
        message="Anda telah melakukan Clock-In dan Clock-Out hari ini."
        onClose={() => setShowCompletionModal(false)}
      />
    </div>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex flex-col items-center p-2 rounded-xl ${
      active
        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
        : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    <span className="w-6 h-6">{icon}</span>
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default StudentLayout;
