import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Elements/Button";
import DeleteConfirmationModal from "../../components/Elements/Modals/DeleteConfirmation";
import SuccessModal from "../../components/Elements/Modals/SuccessModal";
import ErrorModal from "../../components/Elements/Modals/ErrorModal";
import LoadingModal from "../../components/Elements/Modals/LoadingModal";
import AdminLayout from "../../components/Layouts/AdminLayout";
import axiosInstance from "../../config/axios";

const DataStudent = () => {
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get("/students");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setModalMessage("Gagal memuat data siswa. Silakan coba lagi.");
      setShowError(true);
    }
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudent) return;

    setIsDeleteModalOpen(false);
    setIsDeleting(true);

    try {
      await axiosInstance.delete(`/students/${selectedStudent.uuid}`);
      setModalMessage(`Siswa "${selectedStudent.name}" berhasil dihapus.`);
      setShowSuccess(true);
      getUsers(); // Refresh data
    } catch (error) {
      console.error("Error deleting student:", error);
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.message ||
        "Gagal menghapus siswa. Silakan coba lagi.";
      setModalMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsDeleting(false);
      setSelectedStudent(null);
    }
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setShowSuccess(false);
    setShowError(false);
    setSelectedStudent(null);
  };

  return (
    <AdminLayout>
      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        studentName={selectedStudent?.name || "siswa ini"}
      />

      <LoadingModal
        isOpen={isDeleting}
        message={`Menghapus siswa ${
          selectedStudent?.name ? `"${selectedStudent.name}"` : "..."
        }...`}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={closeModal}
        title="Berhasil!"
        message={modalMessage}
      />

      <ErrorModal
        isOpen={showError}
        onClose={closeModal}
        title="Gagal Menghapus"
        message={modalMessage}
      />

      {/* Header & Action Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Data Siswa</h1>
        <Link to="/data/student/add">
          <Button className="text-white bg-secondary/80 hover:bg-secondary">
            + Tambah Siswa
          </Button>
        </Link>
      </div>

      {/* Table */}
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
                  HP
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
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada data siswa.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.uuid} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4">{user.kelas}</td>
                    <td className="px-6 py-4">{user.jk}</td>
                    <td className="px-6 py-4">{user.hp || "—"}</td>
                    <td className="px-6 py-4">{user.bidang}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/data/student/edit/${user.uuid}`}>
                          <Button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            <PencilSquareIcon className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleDeleteClick(user)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DataStudent;
