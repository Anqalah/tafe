import { useEffect, useState, useCallback } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../../Features/authSlice";
import AuthLayout from "../Layouts/AuthLayouts";

const FormLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user && isSuccess) {
      const dashboardRoutes = {
        Admin: "/admin/dashboard/",
        Teacher: "/teacher/dashboard",
        Student: "/student/dashboard",
      };
      navigate(dashboardRoutes[user.role] || "/");
    }
    if (isError) setError(message);
  }, [user, isSuccess, isError, message, navigate]);

  const handleInputChange = useCallback((e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await dispatch(login(credentials));
      if (login.fulfilled.match(result)) dispatch(reset());
    } catch (error) {
      setError("Terjadi kesalahan saat mencoba login.");
    }
  };

  return (
    <AuthLayout title="Masuk ke Akun" type="login">
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleInputChange}
            required
          />
          <PasswordField
            label="Password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword((prev) => !prev)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-blue-600 text-white py-3.5 px-6 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          Masuk Sekarang
        </button>
      </form>
    </AuthLayout>
  );
};

const InputField = ({ label, name, type, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all"
      placeholder={label}
      required={required}
    />
  </div>
);

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
  required,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all pr-12"
        placeholder="••••••••"
        required={required}
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-3 top-3.5 text-gray-400 hover:text-primary transition-colors"
      >
        {showPassword ? (
          <EyeSlashIcon className="w-6 h-6" />
        ) : (
          <EyeIcon className="w-6 h-6" />
        )}
      </button>
    </div>
  </div>
);

export default FormLogin;
