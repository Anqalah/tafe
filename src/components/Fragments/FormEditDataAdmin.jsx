import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../config/axios";
import Button from "../Elements/Button";
import { InputForm } from "../Elements/Input";

const FormEditDataAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    hp: "",
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

  useEffect(() => {
    const getAdminById = async () => {
      try {
        const response = await axiosInstance.get(`/admins/${id}`);
        setFormData({
          ...formData,
          name: response.data.name,
          email: response.data.email,
          hp: response.data.hp || "",
          previewImage: response.data.profileImage || "",
        });
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
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
    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const updateAdmin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("hp", formData.hp);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("role", "Admin");
      // Hanya kirim password jika diisi
      if (formData.password && formData.password !== "") {
        formDataToSend.append("password", formData.password);
        formDataToSend.append("confPassword", formData.confPassword);
      }
      if (formData.profileImage) {
        formDataToSend.append("foto", formData.profileImage);
      }

      await axiosInstance.patch(`/admins/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    <div className=" mb-4">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 group"
        >
          <div className=" rounded-full group-hover:bg-primary/10 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Edit Data Admin</h2>
        </button>

        {msg && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {msg}
          </div>
        )}

        {/* Form Content */}
        <div className="p-4">
          <form onSubmit={updateAdmin} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
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
                      {formData.name.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-secondary p-2 rounded-full border-4 border-white shadow-sm">
                  <CameraIcon className="h-5 w-5 text-white" />
                </div>
              </label>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Format: JPG/PNG (maks. 2MB)
              </p>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputForm
                  label="Nama Lengkap"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-secondary focus:border-primary"
                />

                <InputForm
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-secondary focus:border-primary"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InputForm
                  label="Nomor HP"
                  type="tel"
                  name="hp"
                  value={formData.hp}
                  onChange={handleChange}
                  pattern="[0-9]*"
                  className="focus:ring-2 focus:ring-secondary focus:border-primary"
                />
              </div>

              <div className="space-y-2 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputForm
                    label="Password Baru"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    helperText="Kosongkan jika tidak ingin mengubah password"
                    className="focus:ring-2 focus:ring-secondary focus:border-primary"
                  />

                  <InputForm
                    label="Konfirmasi Password"
                    type="password"
                    name="confPassword"
                    value={formData.confPassword}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-secondary focus:border-primary"
                  />
                </div>
              </div>

              <Button
                className={`w-full bg-primary hover:bg-[#1E2E4A] text-white text-lg transition-all ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormEditDataAdmin;
