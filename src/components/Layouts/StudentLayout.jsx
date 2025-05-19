import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getMe, logout, reset } from "../../Features/authSlice";
import { HomeIcon, ClockIcon, CameraIcon } from "@heroicons/react/24/outline";
import axiosInstance from "../../config/axios.js";

const StudentLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isError, user: authUser } = useSelector((state) => state.auth);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [hasClockedIn, setHasClockedIn] = useState(false);
  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
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

  useEffect(() => {
    if (!authUser) {
      dispatch(getMe()).then((action) => {
        if (getMe.rejected.match(action)) navigate("/");
      });
    }
  }, [dispatch, navigate, authUser]);

  useEffect(() => {
    if (
      authUser &&
      location.pathname.includes("attendances") &&
      !attendanceChecked
    ) {
      checkAttendance(authUser.uuid);
    }
  }, [authUser, location.pathname, attendanceChecked]);

  const checkAttendance = async (userId) => {
    if (attendanceChecked) return;

    try {
      const response = await axiosInstance.get(`/attendances/${userId}`);
      setHasClockedIn(response.data.hasClockedIn);
    } catch (error) {
      console.error(
        "Attendance check error:",
        error.response?.data?.message || error.message
      );
    } finally {
      setAttendanceChecked(true);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(reset());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!authUser) return null;

  return (
    <div className="flex flex-col w-full h-screen mx-auto bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden font-inter">
      <Header
        authUser={authUser}
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        handleLogout={handleLogout}
        isScrolled={isScrolled}
      />

      <main className="flex-1 p-4 lg:p-6 h-full overflow-y-auto scroll-smooth">
        <div className="lg:max-w-5xl lg:mx-auto lg:px-4">{children}</div>
      </main>

      <Navigation
        authUser={authUser}
        activeTab={activeTab}
        hasClockedIn={hasClockedIn}
      />
    </div>
  );
};

const Header = ({
  authUser,
  showUserModal,
  setShowUserModal,
  handleLogout,
}) => (
  <header className="sticky z-50 bg-gradient-to-r rounded-b-sm from-primary to-blue-600 shadow-lg lg:static lg:bg-white lg:shadow-md">
    <div className="flex justify-between items-center p-5 lg:max-w-6xl lg:mx-auto lg:px-4">
      <h1 className="text-secondary font-bold text-xl lg:text-2xl lg:text-secondary">
        Student Portal
      </h1>
      <div className="relative">
        <img
          src={
            authUser.foto_profile ? authUser.foto_profile : "/images/shoes1.jpg"
          }
          alt="profile"
          className="w-12 h-12 rounded-full cursor-pointer border-2 border-white/30 shadow-lg hover:scale-105 transition-transform lg:w-14 lg:h-14 lg:border-gray-200"
          onClick={() => setShowUserModal(!showUserModal)}
        />
        {showUserModal && (
          <UserModal authUser={authUser} handleLogout={handleLogout} />
        )}
      </div>
    </div>
  </header>
);

const UserModal = ({ authUser, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute right-0 top-14 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 animate-slideDown lg:top-16">
      <div className="p-3 space-y-2">
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="font-medium text-gray-800">{authUser.name}</p>
          <p className="text-sm text-gray-500">{authUser.kelas}</p>
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
  );
};

const NavLink = ({ to, icon, label, active, desktop }) => (
  <Link
    to={to}
    className={`${
      desktop
        ? `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
            active
              ? "bg-blue-100 text-primary"
              : "text-gray-600 hover:bg-gray-50"
          }`
        : `flex flex-col items-center p-3 rounded-xl ${
            active
              ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg"
              : "text-gray-500 hover:bg-gray-50"
          }`
    }`}
  >
    {icon}
    <span className={`${desktop ? "text-sm font-medium" : "text-xs mt-1"}`}>
      {label}
    </span>
  </Link>
);

const Navigation = ({ authUser, activeTab, hasClockedIn }) => (
  <nav className="w-full bg-white rounded-t-2xl shadow-2xl border border-t-gray-300 lg:rounded-none lg:border-t-0 lg:shadow-none">
    <div className="flex justify-around items-center p-2 lg:max-w-6xl lg:mx-auto lg:py-4">
      {/* Desktop Navigation Items */}
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

      {/* Mobile Scan Button */}
      <Link
        to={
          hasClockedIn
            ? `/attendances/clockout/${authUser.uuid}`
            : `/attendances/clockin/${authUser.uuid}`
        }
        className="relative -top-1 lg:hidden"
      >
        <button
          className={`p-5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all ${
            activeTab === "scan"
              ? "ring-4 ring-blue-200 bg-gradient-to-br from-primary to-blue-600"
              : "bg-gradient-to-br from-primary to-blue-600"
          }`}
        >
          <CameraIcon className="w-4 h-4 text-white" />
        </button>
      </Link>

      {/* Desktop Scan Button */}
      <div className="hidden lg:block lg:relative lg:-top-4">
        <Link
          to={
            hasClockedIn
              ? `/attendances/clockout/${authUser.uuid}`
              : `/attendances/clockin/${authUser.uuid}`
          }
        >
          <button className="p-6 rounded-full shadow-lg bg-gradient-to-br from-primary to-blue-600 hover:scale-105 transition-transform">
            <CameraIcon className="w-6 h-6 text-white" />
          </button>
        </Link>
      </div>

      {/* Mobile Navigation Items */}
      <div className="lg:hidden">
        <NavLink
          to="/student/dashboard"
          icon={<HomeIcon className="w-4 h-4" />}
          label="Home"
          active={activeTab === "home"}
        />
        <NavLink
          to="/student/absen"
          icon={<ClockIcon className="w-4 h-4" />}
          label="History"
          active={activeTab === "history"}
        />
      </div>
    </div>
  </nav>
);

export default StudentLayout;
