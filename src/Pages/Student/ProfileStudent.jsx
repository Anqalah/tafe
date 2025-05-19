import React from "react";
import StudentLayout from "../../components/Layouts/StudentLayout";

const ProfileStudent = () => {
  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative group">
              <img
                src="/images/logo.jpg"
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-[#D4AF37] object-cover shadow-lg"
              />
              <div className="absolute inset-0 bg-[#2A4365] opacity-0 group-hover:opacity-50 rounded-full transition-opacity duration-300 cursor-pointer flex items-center justify-center">
                <span className="text-white text-sm font-medium hidden group-hover:block">
                  Ganti Foto
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#2A4365]">Profil Siswa</h2>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-[#2A4365] mb-2"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="fullname"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365] transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label
                  htmlFor="jeniskelamin"
                  className="block text-sm font-medium text-[#2A4365] mb-2"
                >
                  Jenis Kelamin
                </label>
                <select
                  id="jeniskelamin"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365] transition-all"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365] transition-all"
                  placeholder="Masukkan umur"
                />
              </div>

              <div>
                <label
                  htmlFor="nohp"
                  className="block text-sm font-medium text-[#2A4365] mb-2"
                >
                  Nomor Handphone
                </label>
                <input
                  type="tel"
                  id="nohp"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365] transition-all"
                  placeholder="Contoh: 081234567890"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-[#2A4365] mb-2"
              >
                Alamat
              </label>
              <textarea
                id="address"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#2A4365] transition-all"
                placeholder="Masukkan alamat lengkap"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="jurusan"
                  className="block text-sm font-medium text-[#2A4365] mb-2"
                >
                  Jurusan
                </label>
                <input
                  type="text"
                  id="jurusan"
                  value="Pertanian"
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-[#2A4365] font-medium"
                />
              </div>

              <div>
                <label
                  htmlFor="class"
                  className="block text-sm font-medium text-[#2A4365] mb-2"
                >
                  Kelas
                </label>
                <input
                  type="text"
                  id="class"
                  value="A"
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-[#2A4365] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2A4365] hover:bg-[#1E2E4A] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.01] shadow-md"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
};

export default ProfileStudent;
