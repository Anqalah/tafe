import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/Layouts/AdminLayout";
import axiosInstance from "../../config/axios";
import { Link } from "react-router-dom";
import Button from "../../components/Elements/Button";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Logo from "../../assets/logo/logo.png";
import DeleteConfirmationModal from "../../components/Elements/Modals/DeleteConfirmation";
import ErrorModal from "../../components/Elements/Modals/ErrorModal";
import LoadingModal from "../../components/Elements/Modals/LoadingModal";
import SuccessModal from "../../components/Elements/Modals/SuccessModal";

const DataAdmin = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get("/admins");
      setUsers(response.data);
    } catch (err) {
      console.error("Gagal memuat daftar admin:", err);
      setModalMessage("Gagal memuat data admin. Silakan coba lagi.");
      setShowError(true);
    }
  };

  const getUserId = (user) => {
    return user?.uuid || user?.id;
  };

  const handleDeleteClick = (userId, name) => {
    if (getUserId(currentUser) === userId) {
      setModalMessage("Anda tidak dapat menghapus akun Anda sendiri.");
      setShowError(true);
      return;
    }
    setDeletingId({ id: userId, name });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    setLoading(true);
    try {
      await axiosInstance.delete(`/admins/${deletingId.id}`);
      setModalMessage("Admin berhasil dihapus.");
      setShowSuccess(true);
      getUsers();
    } catch (err) {
      console.error("Error saat menghapus admin:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Terjadi kesalahan saat menghapus admin.";
      setModalMessage(errorMsg);
      setShowError(true);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  const closeModal = () => {
    setShowDeleteConfirm(false);
    setShowError(false);
    setShowSuccess(false);
    setDeletingId(null);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Data Admin
        </h1>
        <Link to="add">
          <Button className="text-white bg-secondary/80 hover:bg-secondary">
            + Tambah Admin
          </Button>
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-primary">
                No
              </th>
              <th scope="col" className="px-6 py-3 text-primary">
                Nama
              </th>
              <th scope="col" className="px-6 py-3 text-primary">
                HP
              </th>
              <th scope="col" className="px-6 py-3 text-primary">
                Foto
              </th>
              <th scope="col" className="px-6 py-3 text-primary text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data admin.
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const userId = getUserId(user);
                const currentId = getUserId(currentUser);
                const isSelf = currentId && userId && currentId === userId;

                return (
                  <tr
                    key={user.uuid || user.id || index}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.hp || "-"}</td>
                    <td className="px-6 py-4">
                      <img
                        src={user.foto_profile ? user.foto_profile : Logo}
                        alt={`${user.name} profile`}
                        className="w-10 h-10 object-cover rounded-full border border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/data/admin/edit/${user.uuid || user.id}`}>
                          <Button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            <PencilSquareIcon className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>

                        {isSelf ? (
                          <span className="text-gray-400 italic text-sm px-3 py-1.5 flex items-center">
                            — Akun Anda
                          </span>
                        ) : (
                          <Button
                            onClick={() => handleDeleteClick(userId, user.name)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Hapus
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* === MODALS === */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={closeModal}
        onConfirm={confirmDelete}
        studentName={deletingId?.name || "Admin ini"}
      />

      <LoadingModal isOpen={loading} message="Menghapus admin..." />
      <SuccessModal
        isOpen={showSuccess}
        onClose={closeModal}
        title="Berhasil!"
        message={modalMessage}
      />
      <ErrorModal
        isOpen={showError}
        onClose={closeModal}
        title="Gagal!"
        message={modalMessage}
      />
    </AdminLayout>
  );
};

export default DataAdmin;
