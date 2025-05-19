import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Elements/Button";
import DeleteConfirmationModal from "../../components/Elements/Modals/DeleteConfirmation";
import AdminLayout from "../../components/Layouts/AdminLayout";
import axiosInstance from "../../config/axios";

const DataStudent = () => {
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get("/students");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/students/${selectedStudent.uuid}`);
      getUsers();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <AdminLayout>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        studentName={selectedStudent?.name || ""}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-secondary uppercase bg-primary">
              <tr>
                <th scope="col" className="px-6 py-4">
                  No
                </th>
                <th scope="col" className="px-6 py-4">
                  Nama
                </th>
                <th scope="col" className="px-6 py-4">
                  Kelas
                </th>
                <th scope="col" className="px-6 py-4">
                  Jenis Kelamin
                </th>
                <th scope="col" className="px-6 py-4">
                  Hp
                </th>
                <th scope="col" className="px-6 py-4">
                  Jurusan
                </th>
                <th scope="col" className="px-6 py-4 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.uuid} className="border-b ">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4">{user.kelas}</td>
                  <td className="px-6 py-4">{user.jk}</td>
                  <td className="px-6 py-4">{user.hp}</td>
                  <td className="px-6 py-4">{user.bidang}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/data/student/edit/${user.uuid}`}>
                        <Button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                          <PencilSquareIcon className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDeleteClick(user)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Hapus</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DataStudent;
