import {
  CalendarDaysIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  getYear,
  isSameDay,
  isSameMonth,
  isWeekend,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { id } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";

const HistoryAttendance = () => {
  const { id: studentId } = useParams();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const currentYear = getYear(new Date());
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  // helper join class
  const cn = (...classes) => classes.filter(Boolean).join(" ");

  // Fetch attendance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/attendances/history/${studentId}`
        );
        setAttendanceData(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId, currentMonth]);

  // Calendar generator
  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = [];
    let date = startDate;
    while (date <= endDate) {
      days.push(date);
      date = addDays(date, 1);
    }
    return days;
  };

  // Attendance status logic - DIPERBAIKI untuk mengambil data lengkap
  const getAttendanceStatus = (date) => {
    if (isWeekend(date)) return { status: "weekend" };
    const attendance = attendanceData.find((a) =>
      isSameDay(new Date(a.Date), date)
    );

    let status = "alpa";
    if (attendance) {
      if (attendance.ClockIn && attendance.ClockOut)
        status = attendance.status || "hadir";
      else if (attendance.ClockIn) status = "tidak_lengkap";
    }

    return {
      status,
      clockIn: attendance?.ClockIn,
      clockOut: attendance?.ClockOut,
      note: attendance?.Note || "-",
      confidenceIn: attendance?.confidenceIn || 0,
      confidenceOut: attendance?.confidenceOut || 0,
      photoIn: attendance?.photoIn || null,
      photoOut: attendance?.photoOut || null,
      // Data asli dari API
      rawData: attendance || null,
    };
  };

  const statusConfig = {
    hadir: {
      label: "Hadir",
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-300",
    },
    terlambat: {
      label: "Terlambat",
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-300",
    },

    tidak_lengkap: {
      label: "Tidak Lengkap",
      bg: "bg-primary/20",
      text: "text-primary",
      border: "border-primary/30",
    },
    alpa: {
      label: "Alpa",
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-300",
    },
    weekend: {
      label: "Libur",
      bg: "bg-muted/50",
      text: "text-muted-foreground",
      border: "border-border",
    },
  };

  // Helper untuk format confidence score
  const formatConfidence = (score) => {
    if (!score) return "0%";
    const percentage = Math.round(score * 100);
    return `${percentage}%`;
  };

  // Helper untuk warna confidence score
  const getConfidenceColor = (score) => {
    if (!score) return "text-gray-500";
    const percentage = Math.round(score * 100);
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Helper untuk background confidence score
  const getConfidenceBg = (score) => {
    if (!score) return "bg-gray-100";
    const percentage = Math.round(score * 100);
    if (percentage >= 80) return "bg-green-100";
    if (percentage >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const calendarDays = getCalendarDays();
  const today = new Date();

  const handleDayClick = (day) => {
    const data = getAttendanceStatus(day);
    setSelectedDay(day);
    setSelectedData(data);
  };

  const closeModal = () => {
    setSelectedDay(null);
    setSelectedData(null);
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center justify-center">
          Riwayat Kehadiran
        </h1>

        <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="bg-secondary p-4 md:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 rounded-lg hover:bg-secondary-foreground/10"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>

              <div className="flex gap-3">
                <select
                  value={getMonth(currentMonth)}
                  onChange={(e) =>
                    setCurrentMonth(
                      new Date(
                        getYear(currentMonth),
                        parseInt(e.target.value),
                        1
                      )
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-card text-foreground border-0 font-medium focus:ring-2 focus:ring-primary"
                >
                  {months.map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={getYear(currentMonth)}
                  onChange={(e) =>
                    setCurrentMonth(
                      new Date(
                        parseInt(e.target.value),
                        getMonth(currentMonth),
                        1
                      )
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-card text-foreground border-0 font-medium focus:ring-2 focus:ring-primary"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => navigateMonth("next")}
                className="p-2 rounded-lg hover:bg-secondary-foreground/10"
              >
                <ChevronRightIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {dayNames.map((d) => (
                <div key={d} className="text-center py-2">
                  <span className="text-sm font-semibold text-white ">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-2 md:p-4">
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((day, i) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, today);
                const { status } = getAttendanceStatus(day);
                const config = statusConfig[status];

                return (
                  <div
                    key={i}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "aspect-square p-1 md:p-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center gap-1",
                      !isCurrentMonth && "opacity-40",
                      isCurrentMonth && "hover:shadow-md cursor-pointer"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium",
                        isToday &&
                          "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                        !isToday && "text-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </div>

                    {config && (
                      <div className="w-full text-center">
                        <div
                          className={cn(
                            "text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-medium border",
                            config.bg,
                            config.text,
                            config.border
                          )}
                        >
                          {config.label}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="border-t border-border p-4 md:p-6 bg-muted/30">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {Object.entries(statusConfig).map(([key, config]) =>
                key !== "weekend" ? (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        config.bg,
                        "border-2",
                        config.border
                      )}
                    />
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {config.label}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail Kehadiran - DIPERBAIKI dengan Confidence Score dan Foto */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white to-slate-50 w-full max-w-2xl rounded-2xl shadow-2xl border border-[#D4AF37]/20 overflow-hidden relative animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Header dengan gradient secondary */}
            <div className="bg-gradient-to-r from-[#2A4365] to-[#1E2F4D] p-6 text-white relative overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#D4AF37] rounded-full translate-y-12 -translate-x-12"></div>
              </div>

              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <div className="w-2 h-6 bg-[#D4AF37] rounded-full"></div>
                    Detail Kehadiran
                  </h2>
                  <p className="text-blue-100 text-sm mt-2 flex items-center gap-1">
                    <CalendarDaysIcon className="w-4 h-4" />
                    {format(selectedDay, "d MMMM yyyy", { locale: id })}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-white/20 transition-all duration-200 hover:scale-110"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Badge Status dengan aksen emas */}
            <div className="px-6 pt-6">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-l-4 ${
                  selectedData?.status === "hadir"
                    ? "bg-green-50 text-green-800 border-green-400"
                    : selectedData?.status === "izin"
                    ? "bg-blue-50 text-blue-800 border-blue-400"
                    : selectedData?.status === "sakit"
                    ? "bg-orange-50 text-orange-800 border-orange-400"
                    : "bg-red-50 text-red-800 border-red-400"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${
                    selectedData?.status === "hadir"
                      ? "bg-green-500"
                      : selectedData?.status === "izin"
                      ? "bg-blue-500"
                      : selectedData?.status === "sakit"
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                ></span>
                {statusConfig[selectedData?.status]?.label || "-"}
              </div>
            </div>

            {/* Konten utama */}
            <div className="p-6 space-y-5">
              {/* Section Waktu Kehadiran dengan Confidence Score */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]"></div>
                <h3 className="text-sm font-semibold text-[#2A4365] mb-4 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-[#D4AF37]" />
                  Waktu Kehadiran & Verifikasi
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Clock In Section */}
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-xs text-[#2A4365] font-medium mb-2">
                        Clock In
                      </div>
                      <div className="text-xl font-bold text-[#2A4365] mb-2">
                        {selectedData?.clockIn ? (
                          format(new Date(selectedData.clockIn), "HH:mm")
                        ) : (
                          <span className="text-gray-400 text-lg">--:--</span>
                        )}
                      </div>

                      {/* Confidence Score Clock In */}
                      {selectedData?.confidenceIn > 0 && (
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getConfidenceBg(
                            selectedData.confidenceIn
                          )}`}
                        >
                          <FaceSmileIcon
                            className={`w-3 h-3 ${getConfidenceColor(
                              selectedData.confidenceIn
                            )}`}
                          />
                          <span
                            className={`text-xs font-medium ${getConfidenceColor(
                              selectedData.confidenceIn
                            )}`}
                          >
                            Confidence:{" "}
                            {formatConfidence(selectedData.confidenceIn)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Foto Clock In */}
                    {selectedData?.photoIn ? (
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-2 flex items-center justify-center gap-1">
                          <PhotoIcon className="w-3 h-3" />
                          Foto Clock In
                        </div>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={selectedData.photoIn}
                            alt="Foto Clock In"
                            className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                            onClick={() =>
                              window.open(selectedData.photoIn, "_blank")
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-lg">
                        <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">
                          Tidak ada foto clock in
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Clock Out Section */}
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="text-xs text-[#2A4365] font-medium mb-2">
                        Clock Out
                      </div>
                      <div className="text-xl font-bold text-[#2A4365] mb-2">
                        {selectedData?.clockOut ? (
                          format(new Date(selectedData.clockOut), "HH:mm")
                        ) : (
                          <span className="text-gray-400 text-lg">--:--</span>
                        )}
                      </div>

                      {/* Confidence Score Clock Out */}
                      {selectedData?.confidenceOut > 0 && (
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getConfidenceBg(
                            selectedData.confidenceOut
                          )}`}
                        >
                          <FaceSmileIcon
                            className={`w-3 h-3 ${getConfidenceColor(
                              selectedData.confidenceOut
                            )}`}
                          />
                          <span
                            className={`text-xs font-medium ${getConfidenceColor(
                              selectedData.confidenceOut
                            )}`}
                          >
                            Confidence:{" "}
                            {formatConfidence(selectedData.confidenceOut)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Foto Clock Out */}
                    {selectedData?.photoOut ? (
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-2 flex items-center justify-center gap-1">
                          <PhotoIcon className="w-3 h-3" />
                          Foto Clock Out
                        </div>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={selectedData.photoOut}
                            alt="Foto Clock Out"
                            className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                            onClick={() =>
                              window.open(selectedData.photoOut, "_blank")
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-lg">
                        <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">
                          Tidak ada foto clock out
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary Confidence Score */}
                {(selectedData?.confidenceIn > 0 ||
                  selectedData?.confidenceOut > 0) && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-[#2A4365]/5 to-[#D4AF37]/5 rounded-lg border border-[#2A4365]/10">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#2A4365] mb-2">
                      <ChartBarIcon className="w-4 h-4" />
                      Ringkasan Verifikasi Wajah
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-gray-600">
                          Clock In
                        </div>
                        <div
                          className={`font-bold ${getConfidenceColor(
                            selectedData.confidenceIn
                          )}`}
                        >
                          {formatConfidence(selectedData.confidenceIn)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-600">
                          Clock Out
                        </div>
                        <div
                          className={`font-bold ${getConfidenceColor(
                            selectedData.confidenceOut
                          )}`}
                        >
                          {formatConfidence(selectedData.confidenceOut)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer dengan tombol emas */}
            <div className="px-6 pb-6">
              <button
                onClick={closeModal}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#2A4365] font-semibold rounded-xl hover:from-[#E5C158] hover:to-[#F0D675] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] "
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default HistoryAttendance;
