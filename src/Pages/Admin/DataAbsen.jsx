import React from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import {
  ChevronUpDownIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const DataAbsen = () => {
  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2A4365]">
              Rekap Absensi Siswa
            </h1>
            <p className="text-gray-500 mt-1">Catatan kehadiran harian siswa</p>
          </div>
          <div className="relative">
            <input
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#D4AF37] focus:border-[#2A4365] block w-full px-4 py-2.5"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-[#2A4365] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">
                  <div className="flex items-center gap-1">
                    Nama
                    <ChevronUpDownIcon className="w-4 h-4 cursor-pointer hover:text-[#D4AF37]" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold">Jurusan</th>
                <th className="px-6 py-4 text-left font-semibold">Kelas</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    Muhammad Bilal
                  </td>
                  <td className="px-6 py-4 text-gray-600">Pertanian</td>
                  <td className="px-6 py-4 text-gray-600">A</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                      Hadir
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-[#2A4365] hover:bg-[#2A4365]/10 rounded-lg transition-all">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <span className="text-gray-600">Menampilkan 1-5 dari 20 entri</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-[#2A4365] hover:bg-[#2A4365]/10 rounded-lg">
              Sebelumnya
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? "bg-[#2A4365] text-white"
                    : "text-[#2A4365] hover:bg-[#2A4365]/10"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-4 py-2 text-[#2A4365] hover:bg-[#2A4365]/10 rounded-lg">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DataAbsen;
