import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../config/axios";
import Button from "../Elements/Button";
import { InputForm, SelectForm, TextareaForm } from "../Elements/Input/index";

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
    { value: "A", label: "A" },
    { value: "B", label: "B" },
  ];

  useEffect(() => {
    const getStudentById = async () => {
      try {
        const response = await axiosInstance.get(`/students/${id}`);
        setFormData({
          ...formData,
          ...response.data,
          previewImage: response.data.foto_profile || "",
        });
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
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
    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const updateStudent = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] && key !== "previewImage") {
          formDataToSend.append(key, formData[key]);
        }
      }

      await axiosInstance.patch(`/students/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 group"
        >
          <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Edit Data Siswa</h2>
        </button>
      </div>

      {msg && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{msg}</div>
      )}

      <form onSubmit={updateStudent} className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-primary mb-6">
            Foto Profil
          </h3>
          <div className="flex flex-col items-center gap-4">
            <label
              htmlFor="profileImage"
              className="relative cursor-pointer group"
            >
              <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-secondary/20 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-secondary/40">
                {formData.previewImage ? (
                  <img
                    src={formData.previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-primary/50">
                    {formData.name.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-secondary p-2 rounded-full border-4 border-white shadow-sm">
                <CameraIcon className="h-5 w-5 text-white" />
              </div>
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-500">Format: JPG/PNG (maks. 2MB)</p>
          </div>
        </div>

        {/* Data Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-primary mb-6">
            Data Pribadi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputForm
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <SelectForm
              label="Jenis Kelamin"
              name="jk"
              value={formData.jk}
              onChange={handleChange}
              options={[
                { value: "L", label: "Laki-laki" },
                { value: "P", label: "Perempuan" },
              ]}
            />

            <InputForm
              label="Umur"
              type="number"
              name="umur"
              value={formData.umur}
              onChange={handleChange}
              min="10"
              max="50"
            />

            <TextareaForm
              label="Alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        {/* Contact & Academic Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Kontak</h3>
              <InputForm
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <InputForm
                label="Nomor HP"
                name="hp"
                value={formData.hp}
                onChange={handleChange}
                pattern="[0-9]*"
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Akademik</h3>
              <SelectForm
                label="Bidang"
                name="bidang"
                value={formData.bidang}
                onChange={handleChange}
                options={bidangOptions}
              />

              <SelectForm
                label="Kelas"
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                options={kelasOptions}
              />
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-primary mb-6">
            Ubah Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputForm
              label="Password Baru"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              helperText="Kosongkan jika tidak ingin mengubah"
            />

            <InputForm
              label="Konfirmasi Password"
              type="password"
              name="confPassword"
              value={formData.confPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button
          className={`w-full bg-primary hover:bg-[#1E2E4A] text-white py-3.5 text-lg ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
};

export default FormEditDataStudent;
