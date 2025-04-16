import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../../Features/authSlice";
import Button from "../Elements/Button";

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <>
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r dark:bg-gray-800 dark:border-gray-700">
        <div className="p-5 flex justify-between items-center border-b dark:border-gray-700">
          <span className="text-lg font-semibold">SKRIPSI ABSEN</span>
        </div>
        <nav className="mt-5 space-y-4">
          {[
            { path: "/admin/dashboard/", label: "Dashboard" },
            { path: "/admin/teacher", label: "Data Guru" },
            { path: "/admin/student", label: "Data Siswa" },
            { path: "/admin/absen", label: "Data Absen" },
          ].map(({ path, label }) => (
            <NavItem key={path} path={path} label={label} />
          ))}
        </nav>
        <UserProfile
          user={user}
          isOpen={isProfileOpen}
          toggle={() => setIsProfileOpen(!isProfileOpen)}
          onLogout={handleLogout}
        />
      </aside>

      <main className="p-4 sm:ml-64">
        <div className="mt-14">{children}</div>
      </main>
    </>
  );
};

const NavItem = ({ path, label }) => (
  <a
    href={path}
    className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    {label}
  </a>
);

const UserProfile = ({ user, isOpen, toggle, onLogout }) => (
  <div className="p-3 border-t dark:border-gray-700">
    <div className="flex items-center cursor-pointer" onClick={toggle}>
      <img
        className="w-12 h-12 rounded-full"
        src={"/public/images/shoes1.jpg"}
        alt="User Profile"
      />
      <div className="ml-3">
        <p className="font-bold text-gray-800">{user?.name}</p>
        <p className="text-sm text-gray-600">{user?.email}</p>
      </div>
    </div>
    {isOpen && (
      <div className="mt-3 border-t dark:border-gray-700">
        <Button
          classname="w-full text-left p-2 hover:bg-blue-500"
          onClick={() => navigate(`/admin/edit/${user?.uuid}`)}
        >
          Ubah Profil
        </Button>
        <Button
          classname="w-full text-left p-2 hover:bg-red-700"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    )}
  </div>
);

export default AdminLayout;
