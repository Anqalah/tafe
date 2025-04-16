import React from "react";
import TeacherLayout from "../../components/Layouts/TeacherLayout";

const AbsenTeacher = () => {
  return (
    <TeacherLayout>
      <div className="space-y-5">
        <p className="font-semibold text-center">KEHADIRAN</p>

        <div className="w-full flex justify-end">
          <div class="relative max-w-sm">
            <input
              datepicker
              id="default-datepicker"
              type="date"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1"
              placeholder="Select date"
            />
          </div>
        </div>

        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-[10px] text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-2 py-2">
                  Nama
                </th>
                <th scope="col" class="px-2 py-2">
                  Keterangan
                </th>
                <th scope="col" class="px-2 py-2">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-2 py-2">Muhammad Bilal</td>
                <td class="px-2 py-2">Hadir</td>
                <div className="flex items-center justify-center gap-2 py-2">
                  <button className="px-2 py-1 rounded-lg bg-blue-700 text-white">
                    Edit
                  </button>
                  <button className="px-2 py-1 rounded-lg bg-red-700 text-white">
                    Hapus
                  </button>
                </div>
              </tr>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-2 py-2">Muhammad Bilal</td>
                <td class="px-2 py-2">Hadir</td>
                <div className="flex items-center justify-center gap-2 py-2">
                  <button className="px-2 py-1 rounded-lg bg-blue-700 text-white">
                    Edit
                  </button>
                  <button className="px-2 py-1 rounded-lg bg-red-700 text-white">
                    Hapus
                  </button>
                </div>
              </tr>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-2 py-2">Muhammad Bilal</td>
                <td class="px-2 py-2">Hadir</td>
                <div className="flex items-center justify-center gap-2 py-2">
                  <button className="px-2 py-1 rounded-lg bg-blue-700 text-white">
                    Edit
                  </button>
                  <button className="px-2 py-1 rounded-lg bg-red-700 text-white">
                    Hapus
                  </button>
                </div>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default AbsenTeacher;
