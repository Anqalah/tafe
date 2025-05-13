import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ClockIcon as ClockSolidIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import StudentLayout from "../../components/Layouts/StudentLayout";
import { getMe } from "../../Features/authSlice";
import axiosInstance from "../../config/axios";

const DashboardStudent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user: authUser } = useSelector((state) => state.auth);
  const [clockInData, setClockInData] = useState([null]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [attendanceId, setAttendanceId] = useState(null);

  const getAttendanceByUserId = async () => {
    try {
      const response = await axiosInstance.get(`/attendances/${authUser?.id}`);
      setAttendanceId(response.data.id);
      console.log("hasillll", response);
      setClockInData(response.data);
    } catch (error) {
      console.log("erorrrrrr", error.response.data);
    }
  };

  useEffect(() => {
    getAttendanceByUserId();
  }, []);

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
        {/* Clock In/Out Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ClockCard
            type="in"
            faceResult={clockInData?.facePhotoClockIn ? "success" : "failed"}
            location={clockInData?.LocationClockIn || "-"}
            time={
              clockInData?.ClockIn
                ? new Date(clockInData.ClockIn).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"
            }
            date={
              clockInData?.Date
                ? new Date(clockInData.Date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "-"
            }
            onDetail={() =>
              navigate(`/attendances/clockin-results/${authUser?.id}`)
            }
          />

          {/* Clock Out Card (optional: based on your backend data) */}
          <ClockCard
            type="out"
            faceResult={clockInData?.facePhotoClockOut ? "success" : "failed"}
            location={clockInData?.LocationClockOut || "-"}
            time={
              clockInData?.ClockOut
                ? new Date(clockInData.ClockOut).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"
            }
            date={
              clockInData?.Date
                ? new Date(clockInData.Date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "-"
            }
            onDetail={() =>
              navigate(`/attendances/clockout-results/${authUser?.id}`)
            }
          />
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

const ClockCard = ({ type, faceResult, location, time, date, onDetail }) => (
  <div
    className={`bg-white p-5 rounded-2xl shadow-sm border border-[#2A4365]/10 hover:shadow-md transition-all`}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-[#4A5568] flex items-center gap-2">
          {type === "in" ? "Clock In" : "Clock Out"}
        </h3>
        <p className="text-sm text-[#4A5568]/60">{date}</p>
      </div>
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-full ${
          faceResult === "success"
            ? "bg-green-50 text-green-600"
            : "bg-red-50 text-red-600"
        }`}
      >
        <span className="text-xs font-medium">
          {faceResult === "success" ? "Verified" : "Failed"}
        </span>
      </div>
    </div>

    <div className="space-y-3 mb-5">
      <div className="flex items-center gap-3">
        <MapPinIcon className="w-5 h-5 text-[#4A5568]/70" />
        <p className="text-sm text-[#4A5568]">{location}</p>
      </div>
      <div className="flex items-center gap-3">
        <ClockSolidIcon className="w-5 h-5 text-[#4A5568]/70" />
        <p className="text-sm text-[#4A5568]">{time}</p>
      </div>
    </div>

    <button
      onClick={onDetail}
      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
        type === "in"
          ? "bg-[#2A4365]/10 text-[#2A4365] hover:bg-[#2A4365]/20"
          : "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20"
      } transition-colors`}
    >
      <span className="text-sm font-medium">Lihat Detail</span>
      <ArrowRightIcon className="w-4 h-4" />
    </button>
  </div>
);

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

export default DashboardStudent;
