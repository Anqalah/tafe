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
import InputForm from "../Elements/Input/index";
import Label from "../Elements/Input/Label";
import SuccessModal from "../Elements/Modals/SuccessModal";
import ErrorModal from "../Elements/Modals/ErrorModal";
import ConfirmDialog from "../Elements/Modals/ConfirmDialog";
import LoadingModal from "../Elements/Modals/LoadingModal";
import CropperModal from "../Elements/Modals/CropperModal";

export const FormAddAdmin = () => {
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState("");

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Untuk Cropper
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);

  // Modal
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);

  const navigate = useNavigate();

  // =========================
  // Handle Foto → buka cropper
  // =========================
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      setIsErrorOpen(true);
      return;
    }

    const imgURL = URL.createObjectURL(file);
    setRawImage(imgURL);
    setIsCropOpen(true);
  };

  // Setelah crop selesai
  const handleCropDone = (file) => {
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setIsCropOpen(false);
  };

  // =========================
  // Handle Submit
  // =========================
  const handleSubmitAdmin = () => {
    setIsConfirmOpen(true);
  };

  const confirmSave = async () => {
    setIsConfirmOpen(false);
    setIsLoadingOpen(true);

    if (password !== confPassword) {
      setError("Password dan konfirmasi password tidak sama");
      setIsLoadingOpen(false);
      setIsErrorOpen(true);
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

      if (photo) formData.append("foto", photo);

      await axiosInstance.post("/admins", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsLoadingOpen(false);
      setIsSuccessOpen(true);
    } catch (err) {
      setIsLoadingOpen(false);
      setError(err.response?.data?.message || "Terjadi kesalahan server");
      setIsErrorOpen(true);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    navigate("/data/admin");
  };

  return (
    <>
      {/* ================= */}
      {/*  FORM  */}
      {/* ================= */}
      <div className="min-h-screen bg-gradient-to-br from-[#2A4365]/5 to-[#D4AF37]/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
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
          </div>

          {/* Error Inline */}
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

          {/* Main Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="p-8">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                {/* Photo Upload */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-[#2A4365] flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#D4AF37]" />
                    Foto Profil Admin
                  </Label>

                  <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-gradient-to-br from-[#2A4365]/5 to-[#D4AF37]/5 rounded-2xl border-2 border-dashed border-[#2A4365]/20 hover:border-[#D4AF37] transition-all duration-300 group">
                    {/* Preview */}
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

                <div className="border-t border-[#2A4365]/10"></div>

                {/* Inputs */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#2A4365] flex items-center gap-2">
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#2A4365] flex items-center gap-2">
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#2A4365] flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#D4AF37]" />
                        Nomor HP
                      </Label>
                      <InputForm
                        id="hp"
                        type="tel"
                        placeholder="62xxx"
                        value={hp}
                        onChange={(e) => setHp(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#2A4365] flex items-center gap-2">
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
                      />
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <Label className="text-sm font-medium text-[#2A4365] flex items-center gap-2">
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
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="button"
                    onClick={handleSubmitAdmin}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E8C44F] hover:from-[#C19C30] hover:to-[#D4AF37] text-[#2A4365] py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <User className="w-5 h-5" />
                    <span>Daftarkan Admin</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* =========================== */}
      {/*     MODALS (Semua)          */}
      {/* =========================== */}

      {/* Cropper */}
      <CropperModal
        isOpen={isCropOpen}
        image={rawImage}
        onClose={() => setIsCropOpen(false)}
        onCropDone={handleCropDone}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSave}
        title="Konfirmasi Tambah Admin"
        message="Apakah semua data sudah benar? Admin akan ditambahkan ke sistem."
        confirmText="Ya, Daftarkan"
        cancelText="Batal"
        variant="pending"
      />

      {/* Loading */}
      <LoadingModal isOpen={isLoadingOpen} message="Mendaftarkan admin..." />

      {/* Success */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={handleSuccessClose}
        title="Admin Berhasil Ditambahkan!"
        message="Admin baru telah berhasil dibuat dan disimpan ke sistem."
      />

      {/* Error */}
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title="Gagal Menambahkan Admin"
        message={error}
      />
    </>
  );
};
