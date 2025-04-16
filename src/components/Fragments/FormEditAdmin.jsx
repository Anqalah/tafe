import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react";
import { InputForm } from "../Elements/Input";
import Button from "../Elements/Button";

const FormEditAdmin = () => {
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getAdminById = async () => {
      try {
        const response = await axiosInstance.get(`/admins/${id}`);
        setName(response.data.name);
        setEmail(response.data.email);
        setRole(response.data.role);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getAdminById();
  }, [id]);

  const updateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/admins/${id}`, {
        name: name,
        hp: hp,
        email: email,
        password: password,
        confPassword: confPassword,
        role: "Admin",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      <form onSubmit={updateAdmin}>
        <InputForm
          label="Name"
          type="text"
          placeholder="Masukkan nama anda"
          name="name"
          value={name}
          onchange={(e) => setName(e.target.value)}
        />

        <InputForm
          label="Email"
          type="email"
          placeholder="contoh@gmail.com"
          name="email"
          value={email}
          onchange={(e) => setEmail(e.target.value)}
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
          onClick={updateAdmin}
          classname="bg-[#03A9F4] w-full"
          type="submit"
        >
          Update
        </Button>
      </form>
    </Fragment>
  );
};

export default FormEditAdmin;
