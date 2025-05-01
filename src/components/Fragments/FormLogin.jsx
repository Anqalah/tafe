import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../../Features/authSlice";
import AuthLayout from "../Layouts/AuthLayouts";

const FormLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    type: "", // 'success' atau 'error'
    message: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (user && isSuccess) {
      setModal({
        show: true,
        type: "success",
        message: "Login berhasil! Mengarahkan ke dashboard...",
      });

      const timer = setTimeout(() => {
        const dashboardRoutes = {
          Admin: "/admin/dashboard",
          Teacher: "/teacher/dashboard",
          Student: "/student/dashboard",
        };
        navigate(dashboardRoutes[user.role] || "/");
        dispatch(reset()); // <-- reset setelah navigasi
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (isError) {
      setIsSubmitting(false);
      setModal({
        show: true,
        type: "error",
        message: message || "Terjadi kesalahan saat login",
      });
    }
  }, [user, isSuccess, isError, message, navigate, dispatch]);

  const handleInputChange = useCallback((e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await dispatch(login(credentials));
      // Hapus dispatch(reset()) dari sini
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: "Terjadi kesalahan saat mencoba login",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
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
          className={`w-full bg-primary hover:bg-secondary text-white py-3.5 px-6 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
          }`}
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

      {/* Modal Component */}
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`bg-neutral_bg rounded-lg shadow-xl overflow-hidden w-full max-w-md ${
              modal.type === "success"
                ? "border-t-4 border-primary"
                : "border-t-4 border-accent"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                {modal.type === "success" ? (
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary bg-opacity-20">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-accent bg-opacity-20">
                    <svg
                      className="h-6 w-6 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {modal.type === "success" ? "Berhasil!" : "Gagal!"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">{modal.message}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  modal.type === "success"
                    ? "text-primary hover:bg-primary hover:bg-opacity-10"
                    : "text-accent hover:bg-accent hover:bg-opacity-10"
                }`}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
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
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
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
