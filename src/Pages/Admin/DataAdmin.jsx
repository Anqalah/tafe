import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import axiosInstance from "../../config/axios";
import { Link } from "react-router-dom";
import Button from "../../components/Elements/Button";

const DataAdmin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await axiosInstance.get("/admins");
    console.log(response.data);
    setUsers(response.data);
  };

  const deleteUser = async (userId) => {
    await axiosInstance.delete(`/admin/${userId}`);
    getUsers();
  };

  return (
    <AdminLayout>
      <Link to="add">
        <Button className="flex my-1 py-2 px-3 text-white bg-green-600">
          Tambah
        </Button>
      </Link>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-secondary">
                No
              </th>
              <th scope="col" className="px-6 py-3 text-secondary">
                Nama
              </th>
              <th scope="col" className="px-6 py-3 text-secondary">
                Hp
              </th>
              <th scope="col" className="px-6 py-3 text-secondary">
                Foto
              </th>
              <th
                scope="col"
                className="flex items-center justify-center px-6 py-3 text-secondary"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.uuid}>
                <td className="px-6 py-4 text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-gray-900">{user.hp}</td>
                <td className=" text-gray-900">
                  <img src={user.foto_profile} alt="Foto Profil" />
                </td>
                <td className="flex items-center justify-center gap-2 py-2">
                  <Link to={`/data/admin/edit/${user.uuid}`}>
                    <Button className="px-4 rounded-lg bg-blue-700 text-white">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    onClick={() => deleteUser(user.uuid)}
                    className="px-2 rounded-lg bg-red-700 text-white"
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

export default DataAdmin;
