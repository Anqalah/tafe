import { CalendarIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/Elements/Modals/Modal";
import { ModalAttendances } from "../../components/Elements/Modals/ModalAttendances";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";
import { getMe } from "../../Features/authSlice";
import AttendanceCardModal from "../../components/Elements/Modals/AttendanceCardModal";
import AcademicCalendar from "../../components/Elements/Modals/AcademicCalender";

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
    if (!dateString) return "--:-- --";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "--:-- --"
      : date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AttendanceCardModal
            title="Clock In"
            subtitle="Absen Masuk"
            location={displayData.LocationClockIn}
            time={formatTime(displayData.ClockIn)}
            status={displayData.facePhotoClockIn ? "Berhasil" : "Pending"}
            onDetail={() => handleDetailClick("in")}
          />
          <AttendanceCardModal
            title="Clock Out"
            subtitle="Absen Pulang"
            location={displayData.LocationClockOut}
            time={formatTime(displayData.ClockOut)}
            status={displayData.facePhotoClockOut ? "Berhasil" : "Pending"}
            onDetail={() => handleDetailClick("out")}
          />
        </div>

        <AcademicCalendar />
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

export default DashboardStudent;
