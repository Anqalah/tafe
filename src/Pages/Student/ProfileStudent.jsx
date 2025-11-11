import {
  CameraIcon,
  EnvelopeIcon,
  LockClosedIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";
import getCroppedImg from "../../utils/CropImage";
import ConfirmDialog from "../../components/Elements/Modals/ConfirmDialog";
import SuccessModal from "../../components/Elements/Modals/SuccessModal";
import ErrorModal from "../../components/Elements/Modals/ErrorModal";

const ProfileStudent = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    jk: "",
    umur: "",
    alamat: "",
    hp: "",
    email: "",
    password: "",
    confPassword: "",
    profileImage: null,
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const getUser = async () => {
      try {
        const { data } = await axiosInstance.get("/me");
        if (isMounted) {
          setUser(data);
          setFormData({
            name: data.name || "",
            jk: data.jk || "",
            umur: data.umur || "",
            alamat: data.alamat || "",
            hp: data.hp || "",
            email: data.email || "",
            password: "",
            confPassword: "",
            profileImage: "",
          });
          setPreviewImage(data.foto_profile || "");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        if (isMounted) setMsg("Gagal mengambil data pengguna.");
      }
    };

    getUser();
    return () => (isMounted = false);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMsg("File harus berupa gambar!");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setMsg("Ukuran gambar maksimal 2MB!");
        return;
      }
      setFormData({ ...formData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  const handleCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleSaveCropped = async () => {
    const croppedUrl = await getCroppedImg(previewImage, croppedAreaPixels);
    const response = await fetch(croppedUrl);
    const blob = await response.blob();
    const file = new File([blob], `profile-${Date.now()}.jpg`, {
      type: blob.type,
    });

    setFormData((prev) => ({ ...prev, profileImage: file }));
    setPreviewImage(croppedUrl);
    setShowCropper(false);
  };

  const handleConfirmSubmit = () => {
    setConfirmOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    if (formData.password && formData.password !== formData.confPassword) {
      setMsg("Konfirmasi password tidak cocok!");
      setIsLoading(false);
      setErrorOpen(true);
      return;
    }

    try {
      const dataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          key !== "profileImage"
        ) {
          dataToSend.append(key, value);
        }
      });

      if (formData.profileImage) {
        dataToSend.append("foto", formData.profileImage);
      }

      const res = await axiosInstance.patch(
        `/students/${user.uuid}`,
        dataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMsg(res.data?.msg || "Profil berhasil diperbarui!");
      setSuccessOpen(true);

      if (res.status === 200) {
        const { data } = await axiosInstance.get("/me");
        setUser(data);
        setPreviewImage(data.foto_profile);
      }
    } catch (error) {
      console.error("Update gagal:", error);
      const serverMsg = error.response?.data?.msg;
      setMsg(serverMsg || "Terjadi kesalahan saat memperbarui profil.");
      setErrorOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  return (
    <StudentLayout>
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Profil */}
          <div className="bg-secondary rounded-2xl p-6 md:p-8 border border-border shadow-lg">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                {previewImage || user?.foto_profile ? (
                  <img
                    src={previewImage || user?.foto_profile}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-primary object-contain bg-white p-1 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-primary bg-yellow-500 flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
                    {formData.name
                      ? formData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "?"}
                  </div>
                )}
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:scale-105 transition-transform"
                >
                  <CameraIcon className="w-4 h-4" />
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                {formData.name}
              </h1>
              <p className="text-sm md:text-base text-white">
                {formData.email}
              </p>
            </div>
          </div>

          {/* Form Profil */}
          <div className="bg-secondary rounded-2xl p-6 md:p-8 border border-border shadow-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmSubmit();
              }}
              className="space-y-6"
            >
              {/* Nama */}
              <div>
                <label className="block text-primary text-sm font-medium mb-2">
                  Nama
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <EnvelopeIcon className="w-5 h-5 text-secondary" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="your.name"
                  />
                </div>
              </div>

              {/* Gender + Umur */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jk"
                    value={formData.jk}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Umur
                  </label>
                  <input
                    type="number"
                    name="umur"
                    value={formData.umur}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Masukkan umur"
                  />
                </div>
              </div>

              {/* No HP */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Nomor Handphone
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <PhoneIcon className="w-5 h-5 text-muted-primary" />
                  </div>
                  <input
                    type="tel"
                    name="hp"
                    value={formData.hp}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="+62 812-3456-7890"
                  />
                </div>
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Alamat
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3">
                    <MapPinIcon className="w-5 h-5 text-muted-primary" />
                  </div>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows={4}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  Ubah Password
                </h3>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Password Baru{" "}
                      <span className="text-muted-secondary">(Opsional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <LockClosedIcon className="w-5 h-5 text-muted-primary" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <LockClosedIcon className="w-5 h-5 text-muted-primary" />
                      </div>
                      <input
                        type="password"
                        name="confPassword"
                        value={formData.confPassword}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 hover:shadow-lg"
                }`}
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70">
          <div className="relative w-80 h-80 bg-black rounded-lg overflow-hidden">
            <Cropper
              image={previewImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              cropShape="round"
              showGrid={false}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setShowCropper(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleSaveCropped}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          handleSubmit(new Event("submit"));
        }}
        title="Simpan Perubahan"
        message="Apakah Anda yakin ingin menyimpan perubahan profil?"
      />

      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Berhasil!"
        message={msg || "Data profil berhasil diperbarui."}
      />

      <ErrorModal
        isOpen={errorOpen}
        onClose={() => setErrorOpen(false)}
        title="Gagal!"
        message={msg || "Terjadi kesalahan saat memperbarui profil."}
      />
    </StudentLayout>
  );
};

export default ProfileStudent;
