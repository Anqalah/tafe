import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import axiosInstance from "../../config/axios";
import { Link } from "react-router-dom";
import Button from "../../components/Elements/Button";

const TeacherAdmin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await axiosInstance.get("/teachers");
    setUsers(response.data);
  };

  const deleteUser = async (userId) => {
    await axiosInstance.delete("/teachers/${userId}");
    getUsers();
  };

  return (
    <AdminLayout>
      <Link to="add">
        <Button classname="flex my-1 py-2 px-3 text-white bg-green-600">
          Tambah
        </Button>
      </Link>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                No
              </th>
              <th scope="col" class="px-6 py-3">
                Nama
              </th>
              <th scope="col" class="px-6 py-3">
                Jenis Kelamin
              </th>
              <th scope="col" class="px-6 py-3">
                Alamat
              </th>
              <th scope="col" class="px-6 py-3">
                Hp
              </th>
              <th
                scope="col"
                className="flex items-center justify-center px-6 py-3"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.uuid}>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {index + 1}
                </td>
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.name}
                </td>
                <td class="px-6 py-4">{user.jk}</td>
                <td class="px-6 py-4">{user.alamat}</td>
                <td class="px-6 py-4">{user.hp}</td>
                <td className="flex items-center justify-center gap-2 py-2">
                  <Link to={`/admin/teacher/edit/${user.uuid}`}>
                    <Button classname="px-6 py-1 rounded-lg bg-blue-700 text-white">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    onClick={() => deleteUser(user.uuid)}
                    classname="px-6 py-1 rounded-lg bg-red-700 text-white"
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default TeacherAdmin;
