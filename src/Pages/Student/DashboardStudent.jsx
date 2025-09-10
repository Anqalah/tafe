import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon as ClockSolidIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";
import { getMe } from "../../Features/authSlice";
import { ModalAttendances } from "../../components/Elements/Modals/ModalAttendances";
import { Modal } from "../../components/Elements/Modals/Modal";

const DashboardStudent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((state) => state.auth);
  const [clockInData, setClockInData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("in");
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: "warning",
    message: "",
  });

  const getAttendanceByUserId = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/attendances/${authUser.id}`);
      setClockInData(response.data || null);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAlertModal({
        show: true,
        type: "error",
        message: "Gagal memuat data presensi. Silakan coba lagi.",
      });
      setClockInData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const action = await dispatch(getMe());
      if (getMe.rejected.match(action)) {
        navigate("/login");
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (authUser?.id) {
      getAttendanceByUserId();
      const intervalId = setInterval(getAttendanceByUserId, 30000);
      return () => clearInterval(intervalId);
    }
  }, [authUser?.id]);

  const handleDetailClick = (type) => {
    if (!clockInData) {
      setAlertModal({
        show: true,
        type: "warning",
        message: (
          <div className="text-center">
            <p className="mb-4">Data presensi belum tersedia</p>
            <button
              onClick={() =>
                setAlertModal((prev) => ({ ...prev, show: false }))
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Mengerti
            </button>
          </div>
        ),
      });
      return;
    }

    const hasData =
      clockInData[`facePhotoClock${type === "in" ? "In" : "Out"}`];
    if (!hasData) {
      setAlertModal({
        show: true,
        type: "warning",
        message: (
          <div className="text-center">
            <p className="mb-4">
              Data {type === "in" ? "Clock In" : "Clock Out"} belum tersedia
            </p>
            <button
              onClick={() =>
                setAlertModal((prev) => ({ ...prev, show: false }))
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Mengerti
            </button>
          </div>
        ),
      });
      return;
    }

    setModalType(type);
    setModalOpen(true);
  };

  if (!authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const fallbackData = {
    facePhotoClockIn: null,
    LocationClockIn: "-",
    ClockIn: null,
    facePhotoClockOut: null,
    LocationClockOut: "-",
    ClockOut: null,
    Date: null,
  };

  const displayData = loading ? fallbackData : clockInData || fallbackData;

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "-"
      : date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "-"
      : date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ClockCard
            type="in"
            faceResult={displayData.facePhotoClockIn ? "success" : "failed"}
            location={displayData.LocationClockIn}
            time={formatTime(displayData.ClockIn)}
            date={formatDate(displayData.Date)}
            onDetail={() => handleDetailClick("in")}
            loading={loading}
          />

          <ClockCard
            type="out"
            faceResult={displayData.facePhotoClockOut ? "success" : "failed"}
            location={displayData.LocationClockOut}
            time={formatTime(displayData.ClockOut)}
            date={formatDate(displayData.Date)}
            onDetail={() => handleDetailClick("out")}
            loading={loading}
          />
        </div>

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

      {clockInData && (
        <ModalAttendances
          type={modalType}
          data={clockInData}
          onClose={() => setModalOpen(false)}
          show={modalOpen}
        />
      )}

      <Modal
        type={alertModal.type}
        message={alertModal.message}
        onClose={() => setAlertModal((prev) => ({ ...prev, show: false }))}
        show={alertModal.show}
      />
    </StudentLayout>
  );
};

const ClockCard = ({
  type,
  faceResult,
  location,
  time,
  date,
  onDetail,
  loading,
}) => (
  <div
    className={`bg-white p-5 rounded-2xl shadow-sm border border-[#2A4365]/10 hover:shadow-md transition-all ${
      loading ? "animate-pulse" : ""
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-[#4A5568] flex items-center gap-2">
          {type === "in" ? "Clock In" : "Clock Out"}
        </h3>
        <p className="text-sm text-[#4A5568]/60">{date}</p>
      </div>
      {!loading && (
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
      )}
    </div>

    <div className="space-y-3 mb-5">
      <div className="flex items-center gap-3">
        <MapPinIcon className="w-5 h-5 text-[#4A5568]/70" />
        <p className="text-sm text-[#4A5568]">
          {loading ? "Memuat..." : location}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ClockSolidIcon className="w-5 h-5 text-[#4A5568]/70" />
        <p className="text-sm text-[#4A5568]">{loading ? "Memuat..." : time}</p>
      </div>
    </div>

    <button
      onClick={onDetail}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
        type === "in"
          ? "bg-[#2A4365]/10 text-[#2A4365] hover:bg-[#2A4365]/20"
          : "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20"
      } transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className="text-sm font-medium">Lihat Detail</span>
      <ArrowRightIcon className="w-4 h-4" />
    </button>
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
