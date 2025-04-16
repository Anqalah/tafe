import React from "react";
import TeacherLayout from "../../components/Layouts/TeacherLayout";

const HomeTeacher = () => {
  return (
    <TeacherLayout>
      <div className="flex flex-col items-center justify-center gap-5">
        <img
          src="/images/logo.jpg"
          alt="profile"
          className="w-24 h-24 bg-black rounded-lg"
        />
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold">Muhammad Bilal</p>
          <p className="italic text-xl">Pertanian</p>
          <p className="font-semibold text-lg">Kelas A</p>
        </div>
        <div className="w-full flex justify-center mt-10">
          <div class="relative max-w-sm">
            <input
              datepicker
              id="default-datepicker"
              type="date"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1"
              placeholder="Select date"
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-around">
          <div className="flex flex-col justify-center items-center px-5 py-3 rounded-lg border">
            <p className="text-3xl">10</p>
            <p className="text-base">Hadir</p>
          </div>
          <div className="flex flex-col justify-center items-center px-5 py-3 rounded-lg border">
            <p className="text-3xl">10</p>
            <p className="text-base">Izin</p>
          </div>
          <div className="flex flex-col justify-center items-center px-5 py-3 rounded-lg border">
            <p className="text-3xl">10</p>
            <p className="text-base">Alpa</p>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default HomeTeacher;
