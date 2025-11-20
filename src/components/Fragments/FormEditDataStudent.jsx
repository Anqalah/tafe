import {
  ArrowLeft,
  User,
  Upload,
  Camera,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Lock,
  Save,
  Users,
  Calendar,
  GraduationCap,
  Home,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../config/axios";
import Button from "../Elements/Button";
import { InputForm, SelectForm, TextareaForm } from "../Elements/Input/index";
import Label from "../Elements/Input/Label";

const FormEditDataStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    jk: "",
    umur: "",
    alamat: "",
    hp: "",
    bidang: "",
    kelas: "",
    email: "",
    password: "",
    confPassword: "",
    profileImage: null,
    previewImage: "",
  });

  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  const bidangOptions = [
    { value: "Konstruksi", label: "Konstruksi" },
    { value: "Perikanan", label: "Perikanan" },
    { value: "Pertanian", label: "Pertanian" },
    { value: "Peternakan", label: "Peternakan" },
    { value: "Pengolahan Makananan", label: "Pengolahan Makananan" },
    { value: "Perawat Lansia", label: "Perawat Lansia" },
  ];

  const kelasOptions = [
    { value: "A", label: "Kelas A" },
    { value: "B", label: "Kelas B" },
  ];

  const jkOptions = [
    { value: "L", label: "Laki-laki" },
    { value: "P", label: "Perempuan" },
  ];

  useEffect(() => {
    const getStudentById = async () => {
      try {
        setIsFetching(true);
        const response = await axiosInstance.get(`/students/${id}`);
        const studentData = response.data.data || response.data;

        setFormData({
          name: studentData.name || "",
          jk: studentData.jk || "",
          umur: studentData.umur || "",
          alamat: studentData.alamat || "",
          hp: studentData.hp || "",
          bidang: studentData.bidang || "",
          kelas: studentData.kelas || "",
          email: studentData.email || "",
          password: "",
          confPassword: "",
          profileImage: null,
          previewImage: studentData.foto_profile || "",
        });
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg || "Gagal memuat data siswa");
        }
      } finally {
        setIsFetching(false);
      }
    };
    getStudentById();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMsg("Ukuran file maksimal 2MB");
      return;
    }

    setFormData({
      ...formData,
      profileImage: file,
      previewImage: URL.createObjectURL(file),
    });
    setMsg("");
  };

  const updateStudent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    // Validasi password jika diisi
    if (formData.password && formData.password !== formData.confPassword) {
      setMsg("Password dan konfirmasi password tidak sama");
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] && key !== "previewImage" && key !== "confPassword") {
          // Hanya kirim password jika diisi
          if (key === "password" && !formData.password) continue;
          formDataToSend.append(key, formData[key]);
        }
      }

      await axiosInstance.patch(`/students/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("success:Data siswa berhasil diperbarui!");

      // Redirect setelah 2 detik
      setTimeout(() => {
        navigate("/data/student");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg || "Terjadi kesalahan server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordFields = () => {
    setFormData({
      ...formData,
      password: "",
      confPassword: "",
    });
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A4365]/5 to-[#D4AF37]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2A4365] font-medium">Memuat data siswa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A4365]/5 to-[#D4AF37]/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#2A4365] rounded-full border-2 border-white flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-[#2A4365] tracking-tight">
                  Edit Data Siswa
                </h1>
                <p className="text-gray-500 mt-1">
                  Perbarui informasi data siswa
                </p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
            <span className="text-[#2A4365] font-medium">Edit Data Siswa</span>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span className="text-gray-400">Preview</span>
          </div>
        </div>

        {/* Success/Error Alert */}
        {msg && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in duration-300 ${
              msg.startsWith("success:")
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                msg.startsWith("success:") ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {msg.startsWith("success:") ? (
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
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
              )}
            </div>
            <p
              className={`text-sm flex-1 ${
                msg.startsWith("success:") ? "text-green-700" : "text-red-700"
              }`}
            >
              {msg.startsWith("success:") ? msg.replace("success:", "") : msg}
            </p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="p-8">
            <form onSubmit={updateStudent} className="space-y-8">
              {/* Photo Upload Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold text-[#2A4365] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#D4AF37]" />
                  Foto Profil Siswa
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
                              {formData.name.charAt(0)?.toUpperCase() || "S"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Edit Badge */}
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
                      />

                      <label
                        htmlFor="profileImage"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#2A4365] rounded-xl border border-[#2A4365]/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        {formData.previewImage ? "Ganti Foto" : "Pilih Foto"}
                      </label>

                      {formData.previewImage && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              previewImage: "",
                              profileImage: null,
                            })
                          }
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
                          : "Upload foto profil siswa"}
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

              {/* Data Pribadi Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#2A4365]">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                  <Label className="text-base font-semibold">
                    Data Pribadi
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

                  {/* Jenis Kelamin */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="jk"
                      className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                    >
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      Jenis Kelamin
                    </Label>
                    <SelectForm
                      id="jk"
                      name="jk"
                      value={formData.jk}
                      onChange={handleChange}
                      options={jkOptions}
                      className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365]"
                    />
                  </div>

                  {/* Umur */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="umur"
                      className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      Umur
                    </Label>
                    <InputForm
                      id="umur"
                      type="number"
                      placeholder="Masukkan umur"
                      name="umur"
                      value={formData.umur}
                      onChange={handleChange}
                      min="10"
                      max="50"
                      className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40"
                    />
                  </div>

                  {/* Student ID (Readonly) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2A4365]">
                      Student ID
                    </Label>
                    <div className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 bg-[#2A4365]/5 text-[#2A4365] font-mono text-sm">
                      {id}
                    </div>
                  </div>
                </div>

                {/* Alamat */}
                <div className="space-y-2">
                  <Label
                    htmlFor="alamat"
                    className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    Alamat
                  </Label>
                  <TextareaForm
                    id="alamat"
                    placeholder="Masukkan alamat lengkap"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40 resize-none"
                  />
                </div>
              </div>

              {/* Kontak & Akademik Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Kontak */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[#2A4365]">
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                    <Label className="text-base font-semibold">
                      Informasi Kontak
                    </Label>
                  </div>

                  <div className="space-y-4">
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
                        placeholder="student@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365] placeholder-[#2A4365]/40"
                      />
                    </div>

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
                  </div>
                </div>

                {/* Akademik */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[#2A4365]">
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                    <Label className="text-base font-semibold">
                      Informasi Akademik
                    </Label>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="bidang"
                        className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                        Bidang
                      </Label>
                      <SelectForm
                        id="bidang"
                        name="bidang"
                        value={formData.bidang}
                        onChange={handleChange}
                        options={bidangOptions}
                        className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="kelas"
                        className="text-sm font-medium text-[#2A4365] flex items-center gap-2"
                      >
                        <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                        Kelas
                      </Label>
                      <SelectForm
                        id="kelas"
                        name="kelas"
                        value={formData.kelas}
                        onChange={handleChange}
                        options={kelasOptions}
                        className="w-full px-4 py-3 rounded-xl border border-[#2A4365]/20 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 text-[#2A4365]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Update Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#2A4365]">
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
                    <Label className="text-base font-semibold">
                      Perbarui Password
                    </Label>
                  </div>

                  <button
                    type="button"
                    onClick={resetPasswordFields}
                    className="text-sm text-[#2A4365]/60 hover:text-[#D4AF37] transition-colors font-medium"
                  >
                    Reset
                  </button>
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

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-[#2A4365]/80">
                    <strong>Catatan:</strong> Biarkan kolom password kosong jika
                    tidak ingin mengubah password.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#E8C44F] hover:from-[#C19C30] hover:to-[#D4AF37] text-[#2A4365] py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#2A4365] border-t-transparent rounded-full animate-spin"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 bg-white text-[#2A4365] border border-[#2A4365]/20 rounded-2xl font-semibold hover:bg-[#2A4365]/5 hover:border-[#2A4365]/30 transition-all duration-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A4365]/5 rounded-full">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
            <span className="text-sm text-[#2A4365]/60 font-medium">
              Sistem Manajemen Siswa Premium
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditDataStudent;
