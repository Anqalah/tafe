import {
  ArrowLeft,
  User,
  Upload,
  Camera,
  Shield,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import Button from "../Elements/Button/index";
import { InputForm } from "../Elements/Input/index";
import Label from "../Elements/Input/Label";

export const FormAddAdmin = () => {
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // HANDLE PHOTO CHANGE
  // =========================
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      return;
    }

    setPhoto(file);
    const previewURL = URL.createObjectURL(file);
    setPhotoPreview(previewURL);
    setError(""); // Clear error jika ada
  };

  // =========================
  // SAVE ADMIN
  // =========================
  const saveAdmin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confPassword) {
      setError("Password dan konfirmasi password tidak sama");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("hp", hp);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confPassword", confPassword);
      formData.append("role", "Admin");

      if (photo) {
        formData.append("photo", photo);
      }

      await axiosInstance.post("/admins", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/data/admin");
    } catch (error) {
      setError(error.response?.data?.message || "Terjadi kesalahan server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A4365]/5 to-[#D4AF37]/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="group p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#D4AF37] transition-colors" />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#E8C44F] flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2A4365] rounded-full border-2 border-white flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-[#2A4365] tracking-tight">
                  Tambah Admin
                </h1>
                <p className="text-gray-500 mt-1">
                  Buat akun administrator baru untuk sistem
                </p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
            <span className="text-[#2A4365] font-medium">Data Admin</span>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span className="text-gray-400">Konfirmasi</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in fade-in duration-300">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-red-700 text-sm flex-1">{error}</p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="p-8">
            <form onSubmit={saveAdmin} className="space-y-8">
              {/* Photo Upload Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold text-[#2A4365] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#D4AF37]" />
                  Foto Profil Admin
                </Label>

                <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-gradient-to-br from-[#2A4365]/5 to-[#D4AF37]/5 rounded-2xl border-2 border-dashed border-[#2A4365]/20 hover:border-[#D4AF37] transition-all duration-300 group">
                  {/* Photo Preview */}
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-2xl bg-white border-2 border-[#2A4365]/10 shadow-sm group-hover:border-[#D4AF37]/30 transition-all duration-300 overflow-hidden">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#2A4365]/40 group-hover:text-[#D4AF37] transition-colors">
                            <Camera className="w-8 h-8 mb-2" />
                            <span className="text-xs">No Photo</span>
                          </div>
                        )}
                      </div>

                      {/* Edit Badge */}
                      {photoPreview && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <Camera className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <input
                        type="file"
                        id="photo"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />

                      <label
                        htmlFor="photo"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#2A4365] rounded-xl border border-[#2A4365]/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        {photoPreview ? "Ganti Foto" : "Pilih Foto"}
                      </label>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-[#2A4365]/80">
                        Upload foto profil administrator
                      </p>
                      <p className="text-xs text-[#2A4365]/60">
                        Format: JPG, PNG, WEBP • Maksimal 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#2A4365]/10"></div>

              {/* Form Inputs Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#2A4365]">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                  <Label className="text-base font-semibold">
                    Informasi Admin
                  </Label>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Nama Lengkap */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-[#D4AF37]" />
                      Nama Lengkap *
                    </Label>
                    <InputForm
                      id="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                      Email *
                    </Label>
                    <InputForm
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40"
                    />
                  </div>

                  {/* Nomor HP */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="hp"
                      className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-[#D4AF37]" />
                      Nomor HP
                    </Label>
                    <InputForm
                      id="hp"
                      type="tel"
                      placeholder="62xxx"
                      value={hp}
                      onChange={(e) => setHp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-[#D4AF37]" />
                      Password *
                    </Label>
                    <InputForm
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40"
                    />
                  </div>

                  {/* Konfirmasi Password */}
                  <div className="space-y-2 lg:col-span-2">
                    <Label
                      htmlFor="confPassword"
                      className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-[#D4AF37]" />
                      Konfirmasi Password *
                    </Label>
                    <InputForm
                      id="confPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E8C44F] hover:from-[#C19C30] hover:to-[#D4AF37] text-[#2A4365] py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#2A4365] border-t-transparent rounded-full animate-spin"></div>
                      <span>Mendaftarkan...</span>
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Daftarkan Admin</span>
                    </>
                  )}
                </Button>

                <p className="text-center text-[#2A4365]/60 text-sm mt-3">
                  Admin akan mendapatkan akses penuh ke sistem setelah
                  pendaftaran
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A4365]/5 rounded-full">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
            <span className="text-sm text-[#2A4365]/60 font-medium">
              Sistem Administrasi Premium
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
