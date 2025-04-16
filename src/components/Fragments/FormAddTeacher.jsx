import React, { Fragment, useState } from "react";
import { InputForm } from "../Elements/Input";
import { useNavigate } from "react-router-dom";
import Button from "../Elements/Button";
import axiosInstance from "../../config/axios";

export const FormAddTeacher = () => {
  const [name, setName] = useState("");
  const [jk, setJk] = useState("");
  const [umur, setUmur] = useState("");
  const [alamat, setAlamat] = useState("");
  const [hp, setHp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const navigate = useNavigate();

  const saveTeacher = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/teachers", {
        name: name,
        jk: jk,
        umur: umur,
        alamat: alamat,
        hp: hp,
        email: email,
        password: password,
        confPassword: confPassword,
        role: "Teacher",
      });
      navigate("/admin/teacher");
    } catch (error) {
      {
        console.log(error);
      }
    }
  };

  return (
    <Fragment>
      <form onSubmit={saveTeacher}>
        <InputForm
          label="Name"
          type="text"
          placeholder="Masukkan nama anda"
          name="name"
          value={name}
          onchange={(e) => setName(e.target.value)}
        />

        <InputForm
          label="email"
          type="email"
          placeholder="contoh@gmail.com"
          name="email"
          value={email}
          onchange={(e) => setEmail(e.target.value)}
        />

        <InputForm
          label="Jenis Kelamin"
          type="text"
          placeholder="Laki-laki/Perempuan"
          name="jenis kelamin"
          value={jk}
          onchange={(e) => setJk(e.target.value)}
        />

        <InputForm
          label="Umur"
          type="text"
          placeholder="...tahun"
          name="umur"
          value={umur}
          onchange={(e) => setUmur(e.target.value)}
        />

        <InputForm
          label="Alamat"
          type="text"
          placeholder="Jl...."
          name="alamat"
          value={alamat}
          onchange={(e) => setAlamat(e.target.value)}
        />

        <InputForm
          label="Hp"
          type="text"
          placeholder="08...."
          name="hp"
          value={hp}
          onchange={(e) => setHp(e.target.value)}
        />

        <InputForm
          label="password"
          type="password"
          placeholder="******"
          name="password"
          value={password}
          onchange={(e) => setPassword(e.target.value)}
        />

        <InputForm
          label="Confirm Password"
          type="password"
          placeholder="******"
          name="confirmPassword"
          value={confPassword}
          onchange={(e) => setConfPassword(e.target.value)}
        />

        <Button
          onClick={saveTeacher}
          classname="bg-[#03A9F4] w-full"
          type="submit"
        >
          Register
        </Button>
      </form>
    </Fragment>
  );
};
