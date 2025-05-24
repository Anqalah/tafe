import { CameraIcon, ClockIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMe, logout, reset } from "../../Features/authSlice";
import { Modal } from "../Elements/Modals/Modal.jsx";
import axiosInstance from "../../config/axios.js";

const StudentLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({
    loading: false,
    error: null,
    hasClockedIn: false,
    hasClockedOut: false,
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const pathMap = {
      "/student/dashboard": "home",
      "/student/absen": "history",
      "/attendances/clockin": "scan",
      "/attendances/clockout": "scan",
    };
    setActiveTab(pathMap[location.pathname] || "home");
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

      if (!hasClockedIn) {
        navigate(`/attendances/clockin/${user.uuid}`);
      } else if (!hasClockedOut) {
        navigate(`/attendances/clockout/${user.uuid}`);
      } else {
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error("Scan error:", error);
      alert("Gagal memeriksa status absensi. Coba lagi nanti.");
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch(getMe())
        .unwrap()
        .catch(() => navigate("/login"));
    }
  }, [dispatch, navigate, user]);

  useEffect(() => {
    if (user?.uuid && location.pathname.includes("attendances")) {
      checkAttendance(user.uuid);
    }
  }, [user, location.pathname]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(reset());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col w-full h-screen mx-auto bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden font-inter">
      {/* Header */}
      <header className="sticky z-50 bg-gradient-to-r rounded-b-sm from-primary to-blue-600 shadow-lg lg:static lg:bg-white lg:shadow-md">
        <div className="flex justify-between items-center p-5 lg:max-w-6xl lg:mx-auto lg:px-4">
          <h1 className="text-secondary font-bold text-xl lg:text-2xl lg:text-primary">
            Student Portal
          </h1>
          <div className="relative">
            <img
              src={user.foto_profile || "/images/default-avatar.png"}
              alt="profile"
              className="w-12 h-12 rounded-full cursor-pointer border-2 border-white/30 shadow-lg hover:scale-105 transition-transform lg:w-14 lg:h-14 lg:border-gray-200"
              onClick={() => setShowUserModal(!showUserModal)}
            />
            {showUserModal && (
              <div className="absolute right-0 top-14 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 animate-slideDown lg:top-16">
                <div className="p-3 space-y-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.kelas}</p>
                  </div>
                  <button
                    onClick={() => navigate("/student/profile")}
                    className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 h-full overflow-y-auto scroll-smooth">
        <div className="lg:max-w-5xl lg:mx-auto lg:px-4">
          {attendanceStatus.error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {attendanceStatus.error}
            </div>
          )}
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="w-full bg-white rounded-t-2xl shadow-2xl border-t border-gray-300 lg:rounded-none lg:border-t-0">
        <div className="flex justify-around items-center p-2 lg:max-w-6xl lg:mx-auto lg:py-4">
          <div className="hidden lg:flex lg:gap-6 lg:items-center">
            <NavLink
              to="/student/dashboard"
              icon={<HomeIcon className="w-5 h-5" />}
              label="Home"
              active={activeTab === "home"}
              desktop
            />
            <NavLink
              to="/student/absen"
              icon={<ClockIcon className="w-5 h-5" />}
              label="History"
              active={activeTab === "history"}
              desktop
            />
          </div>

          {/* Scan Button */}
          <div className="relative -top-1 lg:-top-4">
            <button
              onClick={handleScan}
              disabled={attendanceStatus.loading}
              className={`p-5 lg:p-6 rounded-full shadow-lg transition-all ${
                attendanceStatus.loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-primary to-blue-600 hover:shadow-xl hover:scale-105"
              } ${activeTab === "scan" ? "ring-4 ring-blue-200" : ""}`}
            >
              <CameraIcon
                className={`w-4 h-4 lg:w-6 lg:h-6 ${
                  attendanceStatus.loading ? "text-gray-200" : "text-white"
                }`}
              />
            </button>
          </div>

          <div className="lg:hidden flex gap-8">
            <NavLink
              to="/student/dashboard"
              icon={<HomeIcon className="w-5 h-5" />}
              label="Home"
              active={activeTab === "home"}
            />
            <NavLink
              to="/student/absen"
              icon={<ClockIcon className="w-5 h-5" />}
              label="History"
              active={activeTab === "history"}
            />
          </div>
        </div>
      </nav>

      {/* Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
      >
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-4">Absensi Selesai!</h3>
          <p className="text-gray-600 mb-4">
            Anda telah melakukan Clock-In dan Clock-Out hari ini.
          </p>
          <button
            onClick={() => setShowCompletionModal(false)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Tutup
          </button>
        </div>
      </Modal>
    </div>
  );
};

// NavLink Component
const NavLink = ({ to, icon, label, active, desktop = false }) => (
  <Link
    to={to}
    className={`${
      desktop
        ? `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
            active
              ? "bg-blue-100 text-primary"
              : "text-gray-600 hover:bg-gray-50"
          }`
        : `flex flex-col items-center p-2 rounded-xl ${
            active
              ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
              : "text-gray-500 hover:bg-gray-50"
          }`
    }`}
  >
    <span className={`${desktop ? "w-5 h-5" : "w-6 h-6"}`}>{icon}</span>
    <span className={`text-xs ${desktop ? "text-sm font-medium" : "mt-1"}`}>
      {label}
    </span>
  </Link>
);

export default StudentLayout;
