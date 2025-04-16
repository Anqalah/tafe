import React from "react";
import TeacherLayout from "../../components/Layouts/TeacherLayout";

const ClassTeacher = () => {
  return (
    <TeacherLayout>
      <div className="space-y-5">
        <p className="font-semibold text-center">DATA SISWA</p>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-[10px] text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-2 py-2">
                  Nama
                </th>
                <th scope="col" class="px-2 py-2">
                  Jenis Kelamin
                </th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-2 py-2">Muhammad Bilal</td>
                <td class="px-2 py-2">Laki Laki</td>
              </tr>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-2 py-2">Muhammad Bilal</td>
                <td class="px-2 py-2">Laki Laki</td>
              </tr>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-2 py-2">Muhammad Bilal</td>
                <td class="px-2 py-2">Laki Laki</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default ClassTeacher;
