import React from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

const AcademicCalendar = () => {
  const events = [
    {
      id: 1,
      title: "Ujian Mid Semester",
      date: "25 Oktober 2025",
      color: "bg-red-500",
      iconBg: "bg-red-100",
      icon: <BookOpenIcon className="h-5 w-5 text-red-500" />,
    },
    {
      id: 2,
      title: "Batas Pengumpulan Tugas Algoritma",
      date: "28 Oktober 2025",
      color: "bg-yellow-500",
      iconBg: "bg-yellow-100",
      icon: <ClockIcon className="h-5 w-5 text-yellow-500" />,
    },
    {
      id: 3,
      title: "Libur Nasional - Hari Sumpah Pemuda",
      date: "28 Oktober 2025",
      color: "bg-green-500",
      iconBg: "bg-green-100",
      icon: <CalendarDaysIcon className="h-5 w-5 text-green-500" />,
    },
  ];

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-100">
          <CalendarDaysIcon className="h-6 w-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-[#2A4365]">
            Academic Calendar
          </h2>
          <p className="text-sm text-gray-500">Upcoming events & deadlines</p>
        </div>
      </div>

      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={event.id} className="relative pl-10">
            {index !== events.length - 1 && (
              <span className="absolute left-[18px] top-8 h-full w-[2px] bg-gray-200"></span>
            )}

            <div
              className={`absolute left-0 w-9 h-9 rounded-lg flex items-center justify-center ${event.iconBg}`}
            >
              {event.icon}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-[#2A4365]">{event.title}</p>
                <p className="text-sm text-gray-500">{event.date}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicCalendar;
