// src/Pages/Student/HistoryAttendance.jsx
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
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
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const HistoryAttendanceModal = () => {
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
  const years = [2024, 2025, 2026];
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

  // Attendance status logic
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
      photoIn: attendance?.photoIn || null,
      photoOut: attendance?.photoOut || null,
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
    izin: {
      label: "Izin",
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-300",
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

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
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
                <ChevronLeftIcon className="w-5 h-5 text-secondary-foreground" />
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
                <ChevronRightIcon className="w-5 h-5 text-secondary-foreground" />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {dayNames.map((d) => (
                <div key={d} className="text-center py-2">
                  <span className="text-sm font-semibold text-secondary-foreground">
                    {d}
                  </span>
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
    </div>
  );
};

export default HistoryAttendanceModal;
