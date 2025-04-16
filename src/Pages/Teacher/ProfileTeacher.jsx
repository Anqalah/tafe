import React from "react";
import TeacherLayout from "../../components/Layouts/TeacherLayout";

const ProfileTeacher = () => {
  return (
    <TeacherLayout>
      <div className="flex flex-col items-center gap-5">
        <img
          src="/images/logo.jpg"
          alt="profile"
          className="w-24 h-24 bg-black rounded-lg"
        />

        <form class="w-full mx-auto mt-5">
          <div class="mb-5">
            <label
              for="fullname"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="fullname"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-2 py-2"
              placeholder="Nama Lengkap ...."
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="jeniskelamin"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Jenis Kelamin
            </label>
            <input
              type="text"
              id="jeniskelamin"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-2 py-2"
              placeholder="Nama Lengkap ...."
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="umur"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Umur
            </label>
            <input
              type="text"
              id="umur"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-2 py-2"
              placeholder="Nama Lengkap ...."
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="address"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Alamat
            </label>
            <input
              type="text"
              id="address"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-2 py-2"
              placeholder="Nama Lengkap ...."
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="nohp"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nomor Handphone
            </label>
            <input
              type="text"
              id="nohp"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-2 py-2"
              placeholder="Nomor Handphone ...."
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="jurusan"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Wali Kelas Jurusan
            </label>
            <input
              type="text"
              id="jurusan"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-2 py-2"
              placeholder="Jurusan ...."
              disabled
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="class"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Wali Kelas
            </label>
            <input
              type="text"
              id="class"
              class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-2 py-2"
              placeholder="Nama Lengkap ...."
              disabled
              required
            />
          </div>

          <button
            type="submit"
            class="w-full text-white bg-blue-700 py-1.5 rounded-lg"
          >
            Simpan
          </button>
        </form>
      </div>
    </TeacherLayout>
  );
};

export default ProfileTeacher;
