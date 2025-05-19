import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../../Features/authSlice";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-neutral_bg font-sans">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-screen bg-primary text-neutral_teks shadow-xl">
        {/* Logo/Brand */}
        <div className="p-5 flex justify-between items-center border-b border-secondary/20">
          <span className="text-xl text-secondary font-semibold">
            MALEO GOGAKUIN
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1 px-2">
          {[
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
          ].map(({ path, label, icon }) => (
            <NavItem key={path} path={path} label={label} icon={icon} />
          ))}
        </nav>

        {/* User Profile - positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-primary/90">
          <UserProfile
            user={user}
            isOpen={isProfileOpen}
            toggle={() => setIsProfileOpen(!isProfileOpen)}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:ml-64 overflow-y-auto">
        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">{children}</div>
      </main>
    </div>
  );
};

const NavItem = ({ path, label, icon }) => {
  const navigate = useNavigate();
  const isActive = location.pathname === path;
  return (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all
      ${
        isActive
          ? "bg-secondary/10 text-secondary"
          : "hover:bg-primary/70 text-neutral_teks/90 hover:text-white"
      }`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      {label}
      {isActive && (
        <span className="ml-auto w-1 h-6 bg-secondary rounded-full"></span>
      )}
    </button>
  );
};

const UserProfile = ({ user, isOpen, toggle, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Profile Toggle Button */}
      <div
        className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-primary/70 transition-colors"
        onClick={toggle}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/20 flex items-center justify-center">
          {user?.foto_profile ? (
            <img
              src={user.foto_profile}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default_profile.png"; // fallback jika gagal load
              }}
            />
          ) : (
            <UserCircleIcon className="h-10 w-10 text-secondary" />
          )}
        </div>

        <div className="ml-3 overflow-hidden">
          <p className="font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs text-neutral_teks/70 truncate">{user?.email}</p>
        </div>

        <ChevronDownIcon
          className={`ml-2 w-4 h-4 text-neutral_teks/70 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl overflow-hidden z-10 border border-gray-100">
          <button
            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-neutral_bg transition-colors"
            onClick={() => navigate(`/admin/edit/${user?.uuid}`)}
          >
            <PencilSquareIcon className="h-5 w-5 mr-3 text-primary" />
            <span>Ubah Profil</span>
          </button>
          <button
            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors"
            onClick={onLogout}
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-accent" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
