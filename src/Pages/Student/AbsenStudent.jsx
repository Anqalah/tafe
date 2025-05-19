import React from "react";
import StudentLayout from "../../components/Layouts/StudentLayout";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ icon, value, label, bgColor }) => (
  <div
    className={`${bgColor} p-4 rounded-2xl shadow-sm transition-all duration-200 hover:scale-[1.02]`}
  >
    <div className="flex flex-col items-center">
      <div className="mb-3">{icon}</div>
      <p className="text-3xl font-bold text-[#4A5568] mb-1">{value}</p>
      <p className="text-sm text-[#4A5568]/80 font-medium">{label}</p>
    </div>
  </div>
);

const AbsenStudent = () => {
  return (
    <StudentLayout>
      <div className="space-y-6 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2A4365] flex items-center justify-center gap-2">
            <CalendarIcon className="w-8 h-8 text-[#D4AF37]" />
            Rekap Kehadiran
          </h1>
          <p className="text-gray-600 mt-2">Riwayat presensi harian siswa</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2A4365] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Hari
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(6)].map((_, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    Kamis
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    10-10-2024
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#2A4365] text-sm font-medium">
                      <CheckCircleIcon className="w-4 h-4" />
                      Hadir
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav className="flex justify-center">
          <ul className="flex items-center gap-1">
            <li>
              <button className="p-2 text-[#2A4365] hover:bg-[#2A4365]/10 rounded-lg transition-colors duration-200">
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            </li>

            {[1, 2, 3, 4, 5].map((page) => (
              <li key={page}>
                <button
                  className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                    page === 3
                      ? "bg-[#2A4365] text-white"
                      : "text-gray-600 hover:bg-[#2A4365]/10"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}

            <li>
              <button className="p-2 text-[#2A4365] hover:bg-[#2A4365]/10 rounded-lg transition-colors duration-200">
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </StudentLayout>
  );
};

export default AbsenStudent;
