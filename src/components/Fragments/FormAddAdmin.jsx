import React, { Fragment, useState } from "react";
import { InputForm } from "../Elements/Input";
import { useNavigate } from "react-router-dom";
import Button from "../Elements/Button";
import axiosInstance from "../../config/axios";
import { ArrowLeftIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import AdminLayout from "../Layouts/AdminLayout";

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
    try {
      await axiosInstance.post("/admins", {
        name: name,
        hp: hp,
        email: email,
        password: password,
        confPassword: confPassword,
        role: "Admin",
      });
      navigate("/admin/add");
    } catch (error) {
      setError(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-neutral_bg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-primary" />
          </button>
          <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
            <UserPlusIcon className="h-5 w-5" />
            Tambah Admin Baru
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-accent/10 text-accent rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={saveAdmin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputForm
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <InputForm
              label="Email"
              type="email"
              placeholder="contoh@gmail.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputForm
              label="Nomor HP"
              type="tel"
              placeholder="08...."
              name="hp"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />

            <InputForm
              label="Password"
              type="password"
              placeholder="******"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <InputForm
              label="Konfirmasi Password"
              type="password"
              placeholder="******"
              name="confirmPassword"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-4">
            <Button
              className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 flex items-center justify-center gap-2"
              type="submit"
            >
              <UserPlusIcon className="h-5 w-5" />
              <span>Daftarkan Admin</span>
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
