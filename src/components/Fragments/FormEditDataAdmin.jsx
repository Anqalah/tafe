import {
  ArrowLeft,
  User,
  Upload,
  Camera,
  Shield,
  Mail,
  Phone,
  Lock,
  Save,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../config/axios";
import Button from "../Elements/Button";
import InputForm from "../Elements/Input";
import Label from "../Elements/Input/Label";
import SuccessModal from "../Elements/Modals/SuccessModal";
import ErrorModal from "../Elements/Modals/ErrorModal";
import ConfirmDialog from "../Elements/Modals/ConfirmDialog";
import LoadingModal from "../Elements/Modals/LoadingModal";
import CropperModal from "../Elements/Modals/CropperModal";

const FormEditDataAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    hp: "",
    email: "",
    password: "",
    confPassword: "",
    profileImage: null,
    previewImage: "",
    removePhoto: false,
  });
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageURL, setTempImageURL] = useState("");
  const [originalPhoto, setOriginalPhoto] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const getAdminById = async () => {
      try {
        setIsFetching(true);
        const response = await axiosInstance.get(`/admins/${id}`);
        const adminData = response.data.data || response.data;

        setFormData({
          name: adminData.name || "",
          email: adminData.email || "",
          hp: adminData.hp || "",
          password: "",
          confPassword: "",
          profileImage: null,
          previewImage: adminData.foto_profile || "",
        });
        setOriginalPhoto(adminData.foto_profile || null);
      } catch (error) {
        setShowError(true);
      } finally {
        setIsFetching(false);
      }
    };
    getAdminById();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setShowError(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImageURL(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropDone = (croppedFile) => {
    const preview = URL.createObjectURL(croppedFile);
    setFormData({
      ...formData,
      profileImage: croppedFile,
      previewImage: preview,
      removePhoto: false,
    });
    setShowCropper(false);
    setTempImageURL("");
  };

  const onCropCancel = () => {
    setShowCropper(false);
    setTempImageURL("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateAdmin = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confPassword) {
      setShowError(true);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setShowLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("hp", formData.hp);
      formDataToSend.append("email", formData.email);

      // Password
      if (formData.password && formData.password !== "") {
        formDataToSend.append("password", formData.password);
        formDataToSend.append("confPassword", formData.confPassword);
      }

      // ✅ Hanya kirim removePhoto jika benar-benar diinginkan
      if (formData.removePhoto) {
        formDataToSend.append("removePhoto", "true");
      }

      // ✅ Hanya kirim foto jika ada file baru
      if (formData.profileImage) {
        formDataToSend.append("foto", formData.profileImage);
      }

      await axiosInstance.patch(`/admins/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowLoading(false);
      setShowSuccess(true);
    } catch (error) {
      setShowLoading(false);
      console.error("Update error:", error);
      setShowError(true);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      previewImage: "",
      profileImage: null,
      removePhoto: true,
    });
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A4365]/5 to-[#D4AF37]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2A4365] font-medium">Memuat data admin...</p>
        </div>
      </div>
    );
  }

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
                  Edit Data Admin
                </h1>
                <p className="text-gray-500 mt-1">
                  Perbarui informasi akun administrator
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="p-8">
            <form onSubmit={updateAdmin} className="space-y-8">
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
                        {formData.previewImage ? (
                          <img
                            src={formData.previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#2A4365]/40 group-hover:text-[#D4AF37] transition-colors">
                            <span className="text-2xl font-bold">
                              {formData.name.charAt(0)?.toUpperCase() || "A"}
                            </span>
                          </div>
                        )}
                      </div>

                      {formData.previewImage && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <Camera className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={fileInputRef}
                      />

                      <label
                        htmlFor="profileImage"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#2A4365] rounded-xl border border-[#2A4365]/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        {formData.previewImage ? "Ganti Foto" : "Pilih Foto"}
                      </label>

                      {formData.previewImage && !formData.removePhoto && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-200 hover:bg-red-100 transition-all duration-200 font-medium"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-[#2A4365]/80">
                        {formData.previewImage
                          ? "Foto profil saat ini"
                          : "Upload foto profil administrator"}
                      </p>
                      <p className="text-xs text-[#2A4365]/60">
                        Format: JPG, PNG, WEBP • Maksimal 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
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
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
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
                      name="hp"
                      value={formData.hp}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40"
                    />
                  </div>

                  {/* Admin ID (Readonly) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2A4365]">
                      Admin ID
                    </Label>
                    <div className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 bg-[#2A4365]/5 text-[#2A4365] font-mono text-sm">
                      {id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Update Section */}
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-[#2A4365]/80">
                    <strong>Catatan:</strong> Biarkan kolom password kosong jika
                    tidak ingin mengubah password.
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-[#D4AF37]" />
                      Password Baru
                    </Label>
                    <InputForm
                      id="password"
                      type="password"
                      placeholder="Kosongkan jika tidak diubah"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40"
                    />
                  </div>

                  {/* Konfirmasi Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confPassword"
                      className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-[#D4AF37]" />
                      Konfirmasi Password
                    </Label>
                    <InputForm
                      id="confPassword"
                      type="password"
                      placeholder="Kosongkan jika tidak diubah"
                      name="confPassword"
                      value={formData.confPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#E8C44F] hover:from-[#C19C30] hover:to-[#D4AF37] text-[#2A4365] py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
                >
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Simpan Perubahan</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate("/data/admin");
        }}
        title="Berhasil!"
        message="Data admin berhasil diperbarui."
      />

      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        title="Gagal Memperbarui"
        message="Gagal memperbarui data admin. Silakan cek koneksi atau data input."
      />

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title="Konfirmasi Simpan"
        message={`Apakah Anda yakin ingin menyimpan perubahan untuk admin "${formData.name}"?`}
        confirmText="Ya, Simpan"
        cancelText="Batal"
        variant="pending"
      />

      <LoadingModal isOpen={showLoading} message="Menyimpan data admin..." />

      <CropperModal
        isOpen={showCropper}
        image={tempImageURL}
        onClose={onCropCancel}
        onCropDone={onCropDone}
      />
    </div>
  );
};

export default FormEditDataAdmin;
