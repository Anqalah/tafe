import React from "react";
import { Link } from "react-router-dom";

const TeacherLayout = ({ children }) => {
  return (
    <div className="relative w-[400px] h-screen overflow-y-scroll mx-auto border-lg border-2 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 flex justify-between items-center py-2 px-5 border-b-2 bg-white">
        <p>Teacher</p>
        <img
          src="/images/logo.jpg"
          alt="profile"
          className="w-7 h-7 bg-black rounded-full"
        />
      </div>

      {/* Content */}
      <div className="p-5">{children}</div>

      {/* Navigation */}
      <div className="fixed bottom-0 z-10 flex justify-between items-center w-[400px] bg-white border-t-2">
        <Link
          to={"/teacher"}
          className="py-2 text-center cursor-pointer bg-slate-100 w-full hover:bg-slate-200"
        >
          <p>Home</p>
        </Link>
        <Link
          to={"/teacher/class"}
          className="py-2 text-center cursor-pointer bg-slate-100 w-full hover:bg-slate-200"
        >
          <p>Kelas</p>
        </Link>
        <Link
          to={"/teacher/absen"}
          className="py-2 text-center cursor-pointer bg-slate-100 w-full hover:bg-slate-200"
        >
          <p>Absen</p>
        </Link>
        <Link
          to={"/teacher/profile"}
          className="py-2 text-center cursor-pointer bg-slate-100 w-full hover:bg-slate-200"
        >
          <p>Profile</p>
        </Link>
      </div>
    </div>
  );
};

export default TeacherLayout;
