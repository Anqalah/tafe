import React from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";

const AbsenAdmin = () => {
  return (
    <AdminLayout>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="w-full flex justify-end mb-10">
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

        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Nama
              </th>
              <th scope="col" class="px-6 py-3">
                Jurusan
              </th>
              <th scope="col" class="px-6 py-3">
                Kelas
              </th>
              <th scope="col" class="px-6 py-3">
                Keterangan
              </th>
              <th scope="col" class="px-6 py-3">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Muhammad BIlal
              </td>
              <td class="px-6 py-4">Pertanian</td>
              <td class="px-6 py-4">A</td>
              <td class="px-6 py-4">Hadir</td>
              <td className="flex items-center justify-center gap-2 py-2">
                <button className="px-6 py-1 rounded-lg bg-blue-700 text-white">
                  Edit
                </button>
                <button className="px-6 py-1 rounded-lg bg-red-700 text-white">
                  Hapus
                </button>
              </td>
            </tr>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Muhammad BIlal
              </td>
              <td class="px-6 py-4">Pertanian</td>
              <td class="px-6 py-4">A</td>
              <td class="px-6 py-4">Hadir</td>
              <td className="flex items-center justify-center gap-2 py-2">
                <button className="px-6 py-1 rounded-lg bg-blue-700 text-white">
                  Edit
                </button>
                <button className="px-6 py-1 rounded-lg bg-red-700 text-white">
                  Hapus
                </button>
              </td>
            </tr>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Muhammad BIlal
              </td>
              <td class="px-6 py-4">Pertanian</td>
              <td class="px-6 py-4">A</td>
              <td class="px-6 py-4">Hadir</td>
              <td className="flex items-center justify-center gap-2 py-2">
                <button className="px-6 py-1 rounded-lg bg-blue-700 text-white">
                  Edit
                </button>
                <button className="px-6 py-1 rounded-lg bg-red-700 text-white">
                  Hapus
                </button>
              </td>
            </tr>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Muhammad BIlal
              </td>
              <td class="px-6 py-4">Pertanian</td>
              <td class="px-6 py-4">A</td>
              <td class="px-6 py-4">Hadir</td>
              <td className="flex items-center justify-center gap-2 py-2">
                <button className="px-6 py-1 rounded-lg bg-blue-700 text-white">
                  Edit
                </button>
                <button className="px-6 py-1 rounded-lg bg-red-700 text-white">
                  Hapus
                </button>
              </td>
            </tr>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Muhammad BIlal
              </td>
              <td class="px-6 py-4">Pertanian</td>
              <td class="px-6 py-4">A</td>
              <td class="px-6 py-4">Hadir</td>
              <td className="flex items-center justify-center gap-2 py-2">
                <button className="px-6 py-1 rounded-lg bg-blue-700 text-white">
                  Edit
                </button>
                <button className="px-6 py-1 rounded-lg bg-red-700 text-white">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AbsenAdmin;
