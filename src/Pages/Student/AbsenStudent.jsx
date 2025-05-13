import React from "react";
import StudentLayout from "../../components/Layouts/StudentLayout";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const AbsenStudent = () => {
  return (
    <StudentLayout>
      <div className="space-y-4 p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <CalendarIcon className="w-8 h-8" />
            Rekap Kehadiran
          </h1>
          <p className="text-gray-600 mt-2">Riwayat presensi harian siswa</p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-primary text-neutral_teks">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Hari
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="hover:bg-neutral_bg transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-800">Kamis</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    10-10-2024
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
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
              <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            </li>

            {[1, 2, 3, 4, 5].map((page) => (
              <li key={page}>
                <button
                  className={`px-3 py-1 rounded-lg ${
                    page === 3
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-primary/10"
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}

            <li>
              <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
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
