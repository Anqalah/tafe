import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { InputForm } from "../Elements/Input";
import Button from "../Elements/Button";
import { CameraIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import AdminLayout from "../Layouts/AdminLayout";

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
    <AdminLayout>
      <div className="p-6 bg-white ">
        <div className="flex items-center mb-2 ">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center rounded-full hover:bg-neutral_bg transition-colors"
          >
            <div className="p-2 ">
              <ArrowLeftIcon className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-primary">
              Edit Profil Admin
            </h2>
          </button>
        </div>

        {msg && (
          <div className="mb-4 bg-accent/10 text-accent rounded-md text-sm">
            {msg}
          </div>
        )}

        <form onSubmit={updateAdmin} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3 flex flex-col items-center">
              <label htmlFor="profileImage" className="cursor-pointer relative">
                <div className="w-20 h-20 rounded-full bg-neutral_bg border-2 border-primary/20 flex items-center justify-center overflow-hidden mb-2">
                  {formData.previewImage ? (
                    <img
                      src={formData.previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-secondary">
                      {formData.name.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 right-1 bg-secondary p-1.5 rounded-full border-2 border-white">
                  <CameraIcon className="h-4 w-4 text-white" />
                </div>
              </label>

              <p className="text-sm text-gray-500 mt-2">Unggah foto profil</p>

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <InputForm
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama anda"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <InputForm
              label="Email"
              type="email"
              placeholder="contoh@gmail.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <InputForm
              label="Nomor HP"
              type="text"
              placeholder="08...."
              name="hp"
              value={formData.hp}
              onChange={handleChange}
            />

            <InputForm
              label="Password Baru"
              type="password"
              placeholder="******"
              name="password"
              value={formData.password}
              onChange={handleChange}
              helperText="Kosongkan jika tidak ingin mengubah password"
            />

            <InputForm
              label="Konfirmasi Password"
              type="password"
              placeholder="******"
              name="confPassword"
              value={formData.confPassword}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4">
            <Button
              className={`w-full bg-primary hover:bg-primary/90 text-white ${
                isLoading ? "opacity-70" : ""
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default FormEditDataAdmin;
