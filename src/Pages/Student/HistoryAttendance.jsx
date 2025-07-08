import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
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
import { ModalAttendances } from "../../components/Elements/Modals/ModalAttendances";
import StudentLayout from "../../components/Layouts/StudentLayout";
import axiosInstance from "../../config/axios";

const HistoryAttendance = () => {
  const { id: studentId } = useParams();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const currentYear = getYear(new Date());
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/attendances/history/${studentId}`
        );
        setAttendanceData(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, currentMonth]);

  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday as first day
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      days.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  const handleMonthChange = (monthIndex) => {
    setCurrentMonth(new Date(getYear(currentMonth), monthIndex, 1));
    setShowMonthPicker(false);
  };

  const handleYearChange = (year) => {
    setCurrentMonth(new Date(year, getMonth(currentMonth), 1));
    setShowYearPicker(false);
  };

  const getAttendanceStatus = (date) => {
    if (isWeekend(date)) {
      return {
        status: "weekend",
        clockIn: null,
        clockOut: null,
      };
    }

    const attendance = attendanceData.find((a) =>
      isSameDay(new Date(a.Date), date)
    );

    let status = "none";
    if (attendance) {
      if (attendance.ClockIn && attendance.ClockOut) {
        status = attendance.status || "hadir";
      } else if (attendance.ClockIn) {
        status = "tidak_lengkap";
      } else {
        status = "alpa";
      }
    } else {
      status = "alpa";
    }

    return {
      clockIn: attendance?.ClockIn,
      clockOut: attendance?.ClockOut,
      status: status,
      locationIn: attendance?.LocationClockIn,
      locationOut: attendance?.LocationClockOut,
      facePhotoClockIn: attendance?.facePhotoClockIn,
      facePhotoClockOut: attendance?.facePhotoClockOut,
      clockInConfidence: attendance?.clockInConfidence,
      clockOutConfidence: attendance?.clockOutConfidence,
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "hadir":
        return "bg-green-100 text-green-800";
      case "terlambat":
        return "bg-yellow-100 text-yellow-800";
      case "izin":
        return "bg-blue-100 text-blue-800";
      case "tidak_lengkap":
        return "bg-primary/20 text-primary";
      case "alpa":
        return "bg-red-100 text-red-800";
      case "weekend":
        return "bg-gray-50 text-gray-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "hadir":
        return "Hadir";
      case "terlambat":
        return "Terlambat";
      case "izin":
        return "Izin";
      case "tidak_lengkap":
        return "Tidak Lengkap";
      case "alpa":
        return "Alpa";
      case "weekend":
        return "Libur";
      default:
        return "Tidak Ada Data";
    }
  };

  const MonthPicker = ({ isMobile = false }) => (
    <div className={`relative ${isMobile ? "w-full" : ""}`}>
      <button
        onClick={() => {
          setShowMonthPicker(!showMonthPicker);
          setShowYearPicker(false);
        }}
        className={`flex items-center justify-between ${
          isMobile
            ? "w-full px-3 py-2 bg-white rounded-lg border border-gray-300"
            : "px-3 py-1 bg-white rounded-lg shadow-sm"
        }`}
      >
        <span>{months[getMonth(currentMonth)]}</span>
        {showMonthPicker ? (
          <ChevronUpIcon
            className={`${isMobile ? "h-4 w-4" : "h-4 w-4 ml-2"}`}
          />
        ) : (
          <ChevronDownIcon
            className={`${isMobile ? "h-4 w-4" : "h-4 w-4 ml-2"}`}
          />
        )}
      </button>
      {showMonthPicker && (
        <div
          className={`absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-y-auto ${
            isMobile
              ? "w-full max-h-48 grid gap-1 p-2"
              : "w-48 grid grid-cols-2 gap-1 p-2"
          }`}
        >
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => handleMonthChange(index)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                getMonth(currentMonth) === index
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {isMobile ? month.substring(0, 3) : month}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const YearPicker = ({ isMobile = false }) => (
    <div className={`relative ${isMobile ? "w-full" : ""}`}>
      <button
        onClick={() => {
          setShowYearPicker(!showYearPicker);
          setShowMonthPicker(false);
        }}
        className={`flex items-center justify-between ${
          isMobile
            ? "w-full px-3 py-2 bg-white rounded-lg border border-gray-300"
            : "px-3 py-1 bg-white rounded-lg shadow-sm"
        }`}
      >
        <span>{getYear(currentMonth)}</span>
        {showYearPicker ? (
          <ChevronUpIcon
            className={`${isMobile ? "h-4 w-4" : "h-4 w-4 ml-2"}`}
          />
        ) : (
          <ChevronDownIcon
            className={`${isMobile ? "h-4 w-4" : "h-4 w-4 ml-2"}`}
          />
        )}
      </button>
      {showYearPicker && (
        <div
          className={`absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-y-auto ${
            isMobile ? "w-full max-h-48 p-2" : "w-24 max-h-60 p-2"
          }`}
        >
          <div className="gap-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  getYear(currentMonth) === year
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const MobileDetailModal = () => {
    if (!selectedDate || !selectedAttendance) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800">
                {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
              </h3>
              <button
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedAttendance(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Status Badge */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  selectedAttendance.status
                )}`}
              >
                {getStatusText(selectedAttendance.status)}
              </span>
            </div>

            {/* Clock In Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <h4 className="font-semibold text-lg text-gray-800">
                  Clock In
                </h4>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                {/* Face Photo */}
                {selectedAttendance.facePhotoClockIn && (
                  <div className="mb-4">
                    <div className="flex justify-center mb-2">
                      <img
                        src={selectedAttendance.facePhotoClockIn}
                        alt="Foto Wajah Clock In"
                        className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                      />
                    </div>
                    <div className="text-center text-sm text-gray-500">
                      Akurasi:{" "}
                      {selectedAttendance.clockInConfidence != null
                        ? `${(
                            selectedAttendance.clockInConfidence * 100
                          ).toFixed(2)}%`
                        : "-"}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 block text-sm">Waktu:</span>
                    <span className="font-medium">
                      {selectedAttendance.clockIn
                        ? format(new Date(selectedAttendance.clockIn), "HH:mm")
                        : "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-600 block text-sm">Lokasi:</span>
                    <div className="flex items-start">
                      <span className="font-medium flex-1">
                        {selectedAttendance.locationIn || "-"}
                      </span>
                      <a
                        href={`https://maps.google.com/?q=${selectedAttendance.locationIn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clock Out Section */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg text-gray-800">
                  Clock Out
                </h4>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                {/* Face Photo */}
                {selectedAttendance.facePhotoClockOut && (
                  <div className="mb-4">
                    <div className="flex justify-center mb-2">
                      <img
                        src={selectedAttendance.facePhotoClockOut}
                        alt="Foto Wajah Clock Out"
                        className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                      />
                    </div>
                    <div className="text-center text-sm text-gray-500">
                      Akurasi:{" "}
                      {selectedAttendance.clockOutConfidence != null
                        ? `${(
                            selectedAttendance.clockOutConfidence * 100
                          ).toFixed(2)}%`
                        : "-"}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 block text-sm">Waktu:</span>
                    <span className="font-medium">
                      {selectedAttendance.clockOut
                        ? format(new Date(selectedAttendance.clockOut), "HH:mm")
                        : "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-600 block text-sm">Lokasi:</span>
                    <div className="flex items-start">
                      <span className="font-medium flex-1">
                        {selectedAttendance.locationOut || "-"}
                      </span>
                      <a
                        href={`https://maps.google.com/?q=${selectedAttendance.locationOut}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedDate(null);
                setSelectedAttendance(null);
              }}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DesktopCalendar = () => {
    const calendarDays = getCalendarDays();

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex justify-between items-center bg-secondary p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MonthPicker />
              <YearPicker />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 bg-secondary">
          {dayNames.map((day) => (
            <div
              key={day}
              className="py-3 text-center font-medium text-sm text-neutral_text"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const attendances = getAttendanceStatus(day);
            const isWeekendDay = isWeekend(day);
            const hasAttendance = attendances.clockIn || attendances.clockOut;

            return (
              <div
                key={i}
                className={`min-h-[100px] border-t border-gray-100 p-2 transition-colors relative ${
                  !isCurrentMonth
                    ? "bg-gray-50 text-gray-400"
                    : isWeekendDay
                    ? "bg-gray-50"
                    : hasAttendance
                    ? "bg-primary/10 hover:bg-primary/20"
                    : "hover:bg-gray-50"
                } ${isToday ? "ring-1 ring-[#D4AF37]" : ""}`}
                onClick={() => {
                  if (!isWeekendDay && hasAttendance) {
                    setSelectedDate(day);
                    setSelectedAttendance(attendances);
                  }
                }}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`self-end text-sm px-2 py-1 rounded-full ${
                      isToday ? "bg-[#D4AF37] text-white" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  <div className="mt-auto flex flex-col space-y-1">
                    {!isWeekendDay && attendances.clockIn && (
                      <div className="text-xs text-green-600 bg-green-50 px-1 rounded">
                        {format(new Date(attendances.clockIn), "HH:mm")}
                      </div>
                    )}
                    {!isWeekendDay && attendances.clockOut && (
                      <div className="text-xs text-secondary bg-blue-50 px-1 rounded">
                        {format(new Date(attendances.clockOut), "HH:mm")}
                      </div>
                    )}
                    <div
                      className={`text-xs px-1 rounded ${getStatusColor(
                        attendances.status
                      )}`}
                    >
                      {getStatusText(attendances.status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const MobileCalendar = () => {
    const calendarDays = getCalendarDays();
    // Filter out weekend days (Sabtu dan Minggu)
    const filteredDayNames = dayNames.slice(0, 5);
    const filteredCalendarDays = calendarDays.filter((day) => !isWeekend(day));

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-3 bg-secondary">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <MonthPicker isMobile />
            <YearPicker isMobile />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-5 min-w-max">
            {filteredDayNames.map((day) => (
              <div
                key={day}
                className="py-2 text-center font-medium text-xs text-neutral_text bg-secondary"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 min-w-max">
            {filteredCalendarDays.map((day, i) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const attendances = getAttendanceStatus(day);
              const hasAttendance = attendances.clockIn || attendances.clockOut;

              return (
                <div
                  key={i}
                  className={`min-h-[80px] border-t border-gray-100 p-1 transition-colors relative ${
                    !isCurrentMonth
                      ? "bg-gray-50 text-gray-400"
                      : hasAttendance
                      ? "bg-primary/10 hover:bg-primary/20"
                      : "hover:bg-gray-50"
                  } ${isToday ? "ring-1 ring-[#D4AF37]" : ""}`}
                  onClick={() => {
                    if (hasAttendance) {
                      setSelectedDate(day);
                      setSelectedAttendance(attendances);
                    }
                  }}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`self-end text-xs px-1 rounded-full ${
                        isToday ? "bg-[#D4AF37] text-white" : ""
                      }`}
                    >
                      {format(day, "d")}
                    </span>

                    <div className="mt-auto space-y-0.5">
                      {attendances.clockIn && (
                        <div className="text-[10px] text-green-600">
                          In: {format(new Date(attendances.clockIn), "HH:mm")}
                        </div>
                      )}
                      {attendances.clockOut && (
                        <div className="text-[10px] text-blue-600">
                          Out: {format(new Date(attendances.clockOut), "HH:mm")}
                        </div>
                      )}
                      <div
                        className={`text-[10px] px-0.5 rounded ${getStatusColor(
                          attendances.status
                        )}`}
                      >
                        {getStatusText(attendances.status).substring(0, 3)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto p-4 bg-neutral_bg">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary">
            Riwayat Kehadiran
          </h1>
        </div>

        {/* Desktop View (hidden on mobile) */}
        <div className="hidden md:block">
          <DesktopCalendar />
        </div>

        {/* Mobile View (hidden on desktop) */}
        <div className="md:hidden">
          <MobileCalendar />
        </div>

        {/* Mobile Detail Modal */}
        {selectedDate && selectedAttendance && <MobileDetailModal />}

        {/* ModalAttendances Integration (for desktop) */}
        {modalType && selectedAttendance && (
          <ModalAttendances
            type={modalType}
            data={{
              ClockIn: selectedAttendance.clockIn,
              ClockOut: selectedAttendance.clockOut,
              LocationClockIn: selectedAttendance.locationIn,
              LocationClockOut: selectedAttendance.locationOut,
              Date: selectedDate,
              facePhotoClockIn: selectedAttendance.facePhotoClockIn,
              facePhotoClockOut: selectedAttendance.facePhotoClockOut,
              clockInConfidence: selectedAttendance.clockInConfidence,
              clockOutConfidence: selectedAttendance.clockOutConfidence,
            }}
            onClose={() => {
              setModalType(null);
              setSelectedAttendance(null);
            }}
            show={true}
          />
        )}
      </div>
    </StudentLayout>
  );
};

export default HistoryAttendance;
