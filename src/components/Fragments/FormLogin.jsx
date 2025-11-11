// FormLogin.jsx (Fixed Version)
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../../Features/authSlice";
import AuthLayout from "../Layouts/AuthLayouts";
import { useModal } from "../Elements/Modals/UseAuthModal";

const FormLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  // Gunakan useModal hook
  const { Modal, showModal, hideModal } = useModal();

  useEffect(() => {
    console.log("Auth state changed:", { user, isSuccess, isError, message }); // Debug log

    if (user && isSuccess) {
      console.log("Showing success modal"); // Debug log
      showModal({
        type: "success",
        title: "Login Berhasil!",
        message: "Login berhasil! Mengarahkan ke dashboard...",
        confirmText: "Lanjutkan",
        onConfirm: () => {
          hideModal();
          const dashboardRoutes = {
            Admin: "/admin/dashboard",
            Student: "/student/dashboard",
          };
          navigate(dashboardRoutes[user.role] || "/");
          dispatch(reset());
        },
      });
    }

    if (isError) {
      console.log("Showing error modal:", message); // Debug log
      setIsSubmitting(false);
      showModal({
        type: "error",
        title: "Login Gagal",
        message: message || "Terjadi kesalahan saat login",
        confirmText: "Coba Lagi",
        onConfirm: hideModal,
      });
    }
  }, [
    user,
    isSuccess,
    isError,
    message,
    navigate,
    dispatch,
    showModal,
    hideModal,
  ]);

  const handleInputChange = useCallback((e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!credentials.email || !credentials.password) {
      showModal({
        type: "warning",
        title: "Data Tidak Lengkap",
        message: "Harap isi email dan password dengan benar.",
        confirmText: "Mengerti",
        onConfirm: hideModal,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Tampilkan loading modal
      showModal({
        type: "loading",
        title: "Memproses Login",
        message: "Sedang memverifikasi data...",
      });

      const result = await dispatch(login(credentials)).unwrap();
      console.log("Login result:", result); // Debug log

      // Loading modal akan otomatis tertutup oleh useEffect ketika isSuccess true
    } catch (error) {
      console.error("Login error:", error); // Debug log
      // Error modal akan ditampilkan oleh useEffect ketika isError true
    } finally {
      // Jangan set isSubmitting false di sini karena useEffect sudah menanganinya
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

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#D4AF37] hover:bg-[#B8941F] transform hover:-translate-y-0.5"
          } flex items-center justify-center gap-2`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memproses...
            </>
          ) : (
            "Masuk Sekarang"
          )}
        </button>
      </form>

      {/* Modal Component - PASTIKAN INI DIMASUKKAN */}
      <Modal />
    </AuthLayout>
  );
};

// Komponen InputField
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
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-20 transition-all"
      placeholder={label}
      required={required}
    />
  </div>
);

// Komponen PasswordField
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
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-20 transition-all pr-12"
        placeholder="••••••••"
        required={required}
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#D4AF37] transition-colors"
      >
        {showPassword ? (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          </svg>
        )}
      </button>
    </div>
  </div>
);

export default FormLogin;
