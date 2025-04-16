import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import Button from "../Elements/Button";
import AuthLayout from "../Layouts/AuthLayouts";

const FormRegister = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const toggleVisibility = useCallback((setter) => {
    setter((prev) => !prev);
  }, []);

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, alamat, ...formData } = data;
      formData.confPassword = confirmPassword;
      formData.alamat = alamat; // Pastikan alamat ikut dikirim
      const response = await axiosInstance.post("/register", {
        ...formData,
        role: "Student",
      });
      const token = response.data?.token || response.data?.verification_token;
      if (token) {
        navigate(`/register/complete`);
      } else {
        setErrorMessage("Token verifikasi tidak ditemukan dalam respons");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.msg || "Terjadi kesalahan saat registrasi"
      );
    }
  };

  return (
    <AuthLayout type="register" title="Daftar Akun Baru">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}

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
          label="Alamat"
          name="alamat"
          register={register}
          errors={errors}
          required
        />
        <SelectField
          label="Bidang"
          name="bidang"
          options={[
            "Pertanian",
            "Konstruksi",
            "Perikanan",
            "Pengolahan Makanan",
          ]}
          register={register}
          errors={errors}
        />
        <SelectField
          label="Kelas"
          name="kelas"
          options={["A", "B", "C"]}
          register={register}
          errors={errors}
        />
        <SelectField
          label="Jenis Kelamin"
          name="jk"
          options={["Laki-laki", "Perempuan"]}
          register={register}
          errors={errors}
        />

        <PasswordField
          label="Password"
          name="password"
          register={register}
          errors={errors}
          show={showPassword}
          toggle={() => toggleVisibility(setShowPassword)}
          required
        />
        <PasswordField
          label="Konfirmasi Password"
          name="confirmPassword"
          register={register}
          errors={errors}
          show={showConfirmPassword}
          toggle={() => toggleVisibility(setShowConfirmPassword)}
          validate={watch("password")}
        />

        <Button
          type="submit"
          className="w-full py-4 px-6 rounded-lg font-semibold shadow-sm hover:scale-[1.02] transition-transform"
        >
          Lanjut ke Verifikasi Wajah
        </Button>
      </form>
    </AuthLayout>
  );
};

const InputField = ({
  label,
  name,
  register,
  errors,
  type = "text",
  required = false,
}) => (
  <div>
    <label className="block mb-2 font-medium">{label}</label>
    <input
      type={type}
      {...register(name, { required: required && `${label} wajib diisi` })}
      className="w-full p-3 border rounded-lg"
    />
    {errors[name] && (
      <span className="text-red-500 text-sm mt-1">{errors[name].message}</span>
    )}
  </div>
);

const SelectField = ({ label, name, options, register, errors }) => (
  <div>
    <label className="block mb-2 font-medium">{label}</label>
    <select
      {...register(name, { required: `${label} wajib diisi` })}
      className="w-full p-3 border rounded-lg bg-white"
    >
      <option value="">Pilih {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {errors[name] && (
      <span className="text-red-500 text-sm mt-1">{errors[name].message}</span>
    )}
  </div>
);

const PasswordField = ({
  label,
  name,
  register,
  errors,
  show,
  toggle,
  required = false,
  validate,
}) => (
  <div>
    <label className="block mb-2 font-medium">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        {...register(name, {
          required: required && "Password wajib diisi",
          validate: validate
            ? (value) => value === validate || "Password tidak cocok"
            : undefined,
        })}
        className="w-full p-3 border rounded-lg pr-10"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute inset-y-0 right-3 p-2"
      >
        {show ? "🙈" : "👁️"}
      </button>
    </div>
    {errors[name] && (
      <span className="text-red-500 text-sm mt-1">{errors[name].message}</span>
    )}
  </div>
);

export default FormRegister;
