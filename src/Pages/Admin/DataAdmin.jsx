import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import axiosInstance from "../../config/axios";
import { Link } from "react-router-dom";
import Button from "../../components/Elements/Button";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Logo from "../../assets/logo/logo.png";

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
    await axiosInstance.delete(`/admins/${userId}`);
    getUsers();
  };

  return (
    <AdminLayout>
      <Link to="add">
        <Button className="mb-2 text-white bg-secondary/80">Tambah</Button>
      </Link>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-primary">
                No
              </th>
              <th scope="col" className="px-6 py-3 text-primary">
                Nama
              </th>
              <th scope="col" className="px-6 py-3 text-primary">
                Hp
              </th>
              <th scope="col" className="px-6 py-3 text-primary">
                Foto
              </th>
              <th
                scope="col"
                className="flex items-center justify-center px-6 py-3 text-primary  "
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
                <td className="px-6 py-4 text-gray-900">
                  <img
                    src={user.foto_profile ? user.foto_profile : Logo}
                    alt="Foto Profil"
                    className="w-10 h-10 object-cover rounded"
                  />
                </td>
                <td className="flex items-center justify-center gap-2 py-2">
                  <Link to={`/data/admin/edit/${user.uuid}`}>
                    <Button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <PencilSquareIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <Button
                    onClick={() => deleteUser(user.uuid)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Hapus</span>
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
