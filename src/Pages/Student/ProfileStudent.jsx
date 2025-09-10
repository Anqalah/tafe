import React, { useEffect, useState } from "react";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";

const ProfileStudent = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    jk: "",
    umur: "",
    alamat: "",
    hp: "",
    email: "",
    password: "",
    confPassword: "",
  });
  const [message, setMessage] = useState("");

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
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        if (isMounted) {
          setMessage("Gagal mengambil data pengguna.");
        }
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("hp", formData.hp);
      formDataToSend.append("email", formData.email);
      // Hanya kirim password jika diisi
      if (formData.password && formData.password !== "") {
        formDataToSend.append("password", formData.password);
        formDataToSend.append("confPassword", formData.confPassword);
      }
      if (formData.profileImage) {
        formDataToSend.append("foto", formData.profileImage);
      }

      await axiosInstance.patch(`/students/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/Student/dashboard");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        {message && <p className="text-red-500 mb-4">{message}</p>}
        {user ? (
          <>
            <div className="flex flex-col items-center gap-4 mb-8">
              <img
                src={user.foto_profile}
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-[#D4AF37] object-cover shadow-lg"
              />
              <h2 className=" text-center text-2xl font-bold text-[#2A4365]">
                {user.name}
              </h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#2A4365] mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="jk"
                    className="block text-sm font-medium text-[#2A4365] mb-2"
                  >
                    Jenis Kelamin
                  </label>
                  <select
                    id="jk"
                    value={formData.jk}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="umur"
                    className="block text-sm font-medium text-[#2A4365] mb-2"
                  >
                    Umur
                  </label>
                  <input
                    type="number"
                    id="umur"
                    value={formData.umur}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="hp"
                    className="block text-sm font-medium text-[#2A4365] mb-2"
                  >
                    Nomor Handphone
                  </label>
                  <input
                    type="tel"
                    id="hp"
                    value={formData.hp}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="alamat"
                  className="block text-sm font-medium text-[#2A4365] mb-2"
                >
                  Alamat
                </label>
                <textarea
                  id="alamat"
                  rows="3"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>

              {/* Password dan Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#2A4365] mb-2"
                  >
                    Password Baru (Opsional)
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365] transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confPassword"
                    className="block text-sm font-medium text-[#2A4365] mb-2"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    id="confPassword"
                    value={formData.confPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2A4365] text-white font-semibold rounded-lg"
              >
                Simpan Perubahan
              </button>
            </form>
          </>
        ) : (
          <p>Memuat data...</p>
        )}
      </div>
    </StudentLayout>
  );
};

export default ProfileStudent;
