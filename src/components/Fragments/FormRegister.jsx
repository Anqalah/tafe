// FormRegister.jsx (Updated Button Colors)
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import Button from "../Elements/Button";
import AuthLayout from "../Layouts/AuthLayouts";
import { useModal } from "../Elements/Modals/UseAuthModal";

const FormRegister = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { Modal, showModal, hideModal } = useModal();

  const toggleVisibility = useCallback((setter) => {
    setter((prev) => !prev);
  }, []);

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        confPassword: data.confirmPassword,
        hp: data.hp,
      };

      // Tampilkan modal loading dengan warna secondary
      showModal({
        type: "loading",
        title: "Memproses Pendaftaran",
        message: "Harap tunggu sebentar...",
      });

      const response = await axiosInstance.post("/register", payload);

      // Tampilkan modal sukses dengan warna primary (emas)
      showModal({
        type: "success",
        title: "Pendaftaran Berhasil!",
        message: "Pendaftaran awal berhasil! Lanjutkan verifikasi wajah.",
        confirmText: "Lanjutkan Verifikasi",
        onConfirm: () => {
          hideModal();
          if (response.data.verification_token) {
            navigate(
              `/register/complete?token=${response.data.verification_token}`
            );
          } else {
            throw new Error("No verification token received");
          }
        },
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Gagal melakukan pendaftaran";

      // Tampilkan modal error
      showModal({
        type: "error",
        title: "Pendaftaran Gagal",
        message: errorMsg,
        confirmText: "Coba Lagi",
        onConfirm: hideModal,
      });
    }
  };

  return (
    <AuthLayout type="register" title="Daftar Akun Siswa">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMessage && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-2">
          <InputField
            label="Nama Lengkap"
            name="name"
            register={register}
            errors={errors}
            required
          />
          <InputField
            label="Email"
            name="email"
            register={register}
            errors={errors}
            type="email"
            required
          />

          <InputField
            label="Nomor HP/Whatsapp"
            name="hp"
            register={register}
            errors={errors}
            type="tel"
          />

          <PasswordField
            label="Password"
            name="password"
            register={register}
            errors={errors}
            show={showPassword}
            toggle={() => toggleVisibility(setShowPassword)}
            required
            minLength={6}
          />
          <PasswordField
            label="Konfirmasi Password"
            name="confirmPassword"
            register={register}
            errors={errors}
            show={showConfirmPassword}
            toggle={() => toggleVisibility(setShowConfirmPassword)}
            validate={(val) => {
              return val === watch("password") || "Password tidak cocok";
            }}
            required
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#D4AF37] hover:bg-[#B8941F] shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              </div>
            ) : (
              "Daftar Sekarang"
            )}
          </Button>
        </div>
      </form>

      {/* Modal Component dengan warna baru */}
      <Modal />
    </AuthLayout>
  );
};

// InputField Component dengan focus color primary
const InputField = ({
  label,
  name,
  register,
  errors,
  type = "text",
  required = false,
  ...rest
}) => (
  <div>
    <label
      htmlFor={name}
      className="block mb-2 text-sm font-medium text-gray-700"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      type={type}
      {...register(name, {
        required: required && `${label} wajib diisi`,
        ...rest,
      })}
      className={`w-full px-4 py-3 border rounded-lg transition-colors ${
        errors[name]
          ? "border-red-500 focus:ring-red-200 focus:border-red-500"
          : "border-gray-300 focus:ring-[#D4AF37] focus:ring-2 focus:border-[#D4AF37]"
      }`}
    />
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
);

// PasswordField Component dengan focus color primary
const PasswordField = ({
  label,
  name,
  register,
  errors,
  show,
  toggle,
  required = false,
  validate,
  minLength,
  ...rest
}) => (
  <div>
    <label
      htmlFor={name}
      className="block mb-2 text-sm font-medium text-gray-700"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        id={name}
        type={show ? "text" : "password"}
        {...register(name, {
          required: required && `${label} wajib diisi`,
          minLength: minLength && {
            value: minLength,
            message: `Minimal ${minLength} karakter`,
          },
          validate: validate,
          ...rest,
        })}
        className={`w-full px-4 py-3 border rounded-lg transition-colors pr-12 ${
          errors[name]
            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
            : "border-gray-300 focus:ring-[#D4AF37] focus:ring-2 focus:border-[#D4AF37]"
        }`}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-[#D4AF37] transition-colors"
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
      >
        {show ? (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
              clipRule="evenodd"
            />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
          </svg>
        )}
      </button>
    </div>
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
    )}
  </div>
);

export default FormRegister;
