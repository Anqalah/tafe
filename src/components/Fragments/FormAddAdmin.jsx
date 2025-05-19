import { ArrowLeftIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import Button from "../Elements/Button";
import { InputForm } from "../Elements/Input";

export const FormAddAdmin = () => {
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const saveAdmin = async (e) => {
    e.preventDefault();

    if (password !== confPassword) {
      return setError("Password dan konfirmasi password tidak sama");
    }
    try {
      await axiosInstance.post("/admins", {
        name: name,
        hp: hp,
        email: email,
        password: password,
        confPassword: confPassword,
        role: "Admin",
      });
      navigate("/data/admin");
    } catch (error) {
      setError(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8 ">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-secondary transition-colors mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-medium">Kembali</span>
        </button>

        <div className="flex items-center pt-6 gap-3 ">
          <div className="p-2 bg-secondary/90 rounded-lg">
            <UserPlusIcon className="w-6 h-6 text-primary " />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Tambah Admin Baru
          </h2>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-accent/10 text-accent rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={saveAdmin} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputForm
            label="Nama Lengkap"
            type="text"
            placeholder="Masukkan nama lengkap"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365]"
            required
          />

          <InputForm
            label="Email"
            type="email"
            placeholder="contoh@gmail.com"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365]"
            required
          />

          <InputForm
            label="Nomor HP"
            type="tel"
            placeholder="08...."
            name="hp"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            className="focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365]"
          />

          <InputForm
            label="Password"
            type="password"
            placeholder="******"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365]"
            required
          />

          <InputForm
            label="Konfirmasi Password"
            type="password"
            placeholder="******"
            name="confirmPassword"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            className="focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365]"
            required
          />
        </div>

        <Button
          className={`w-full bg-[#2A4365]  hover:bg-[#1E2E4A] text-white py-3 text-lg transition-all flex items-center justify-center gap-2`}
          type="submit"
        >
          <UserPlusIcon className="h-5 w-5" />
          <span>Daftarkan Admin</span>
        </Button>
      </form>
    </div>
  );
};
