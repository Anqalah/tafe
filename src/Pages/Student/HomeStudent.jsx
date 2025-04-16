import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/Layouts/StudentLayout";
import { getMe } from "../../Features/authSlice";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const HomeStudent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user: authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      const action = await dispatch(getMe());
      if (getMe.rejected.match(action)) {
        navigate("/");
      }
    };
    fetchUser();
  }, [dispatch, navigate]);

  if (!authUser) return null;

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-r from-[#2A4365] to-[#D4AF37]/80 p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-10" />
          <div className="flex items-center gap-5 relative z-10">
            <img
              src="/images/shoes1.jpg"
              alt="profile"
              className="w-24 h-24 rounded-2xl border-4 border-white/30 shadow-md"
            />
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-1">{authUser.name}</h1>
              <p className="text-sm opacity-90 font-medium">
                {authUser.bidang}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <UserCircleIcon className="w-5 h-5 opacity-80" />
                <span className="text-sm">{authUser.kelas}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<CheckCircleIcon className="w-8 h-8 text-[#2A4365]" />}
            value="12"
            label="Hadir"
            bgColor="bg-[#2A4365]/10"
          />
          <StatCard
            icon={<ClockIcon className="w-8 h-8 text-[#D4AF37]" />}
            value="2"
            label="Izin"
            bgColor="bg-[#D4AF37]/10"
          />
          <StatCard
            icon={<ClockIcon className="w-8 h-8 text-[#C53030]" />}
            value="1"
            label="Alpa"
            bgColor="bg-[#C53030]/10"
          />
        </div>

        {/* Calendar Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#2A4365]/10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-[#4A5568]">
              Kalender Akademik
            </h2>
            <CalendarIcon className="w-7 h-7 text-[#2A4365]" />
          </div>

          <div className="space-y-4">
            <CalendarEvent
              title="Ujian Mid Semester"
              date="15 Oktober 2024"
              color="bg-[#2A4365]"
            />
            <CalendarEvent
              title="Batas Pengumpulan Tugas"
              date="20 Oktober 2024"
              color="bg-[#D4AF37]"
            />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

const StatCard = ({ icon, value, label, bgColor }) => (
  <div
    className={`${bgColor} p-4 rounded-2xl shadow-sm transition-transform hover:scale-[1.02]`}
  >
    <div className="flex flex-col items-center">
      <div className="mb-3">{icon}</div>
      <p className="text-3xl font-bold text-[#4A5568] mb-1">{value}</p>
      <p className="text-sm text-[#4A5568]/80 font-medium">{label}</p>
    </div>
  </div>
);

const CalendarEvent = ({ title, date, color }) => (
  <div className="flex items-center gap-4 p-3 hover:bg-[#F5F7FA] rounded-xl transition-colors">
    <div className={`${color} w-3 h-3 rounded-full flex-shrink-0`} />
    <div>
      <p className="text-sm font-medium text-[#4A5568]">{title}</p>
      <p className="text-xs text-[#4A5568]/60 mt-1">{date}</p>
    </div>
  </div>
);

export default HomeStudent;
