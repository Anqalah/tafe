import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteConfirmationModal from "../../components/Elements/Modals/DeleteConfirmation";
import LoadingModal from "../../components/Elements/Modals/LoadingModal";
import SuccessModal from "../../components/Elements/Modals/SuccessModal";
import ErrorModal from "../../components/Elements/Modals/ErrorModal";
import axiosInstance from "../../config/axios";

const DataAbsen = () => {
  const [attendances, setAttendances] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    getAttendances();
  }, []);

  const getAttendances = async () => {
    try {
      const response = await axiosInstance.get("/attendances");
      setAttendances(response.data);
    } catch (error) {
      console.error("Error fetching attendances:", error);
      setModalMessage("Gagal memuat data absensi. Silakan coba lagi.");
      setShowError(true);
    }
  };

  const handleDeleteClick = (attendance) => {
    setSelectedAttendance(attendance);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAttendance) return;

    setIsDeleteModalOpen(false);
    setIsDeleting(true);

    try {
      await axiosInstance.delete(`/attendances/${selectedAttendance.uuid}`);
      setModalMessage(
        `Absensi ID "${selectedAttendance.uuid}" berhasil dihapus.`
      );
      setShowSuccess(true);
      getAttendances(); // Refresh data
    } catch (error) {
      console.error("Error deleting attendance:", error);
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.message ||
        "Gagal menghapus absensi. Silakan coba lagi.";
      setModalMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsDeleting(false);
      setSelectedAttendance(null);
    }
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setShowSuccess(false);
    setShowError(false);
    setSelectedAttendance(null);
  };

  // Format date/time helper
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateOnly = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

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
              // TODO: filter by date later
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-[#2A4365] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">#</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Nama Siswa
                </th>
                <th className="px-6 py-4 text-left font-semibold">Clock In</th>
                <th className="px-6 py-4 text-left font-semibold">Clock Out</th>
                <th className="px-6 py-4 text-left font-semibold">Tanggal</th>
                <th className="px-6 py-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendances.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data absensi.
                  </td>
                </tr>
              ) : (
                attendances.map((attendance, index) => (
                  <tr
                    key={attendance.uuid || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      {attendance.student?.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateTime(attendance.ClockIn)}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateTime(attendance.ClockOut)}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateOnly(attendance.Date)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDeleteClick(attendance)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-gray-600 text-sm">
            Menampilkan {attendances.length} dari {attendances.length} entri
          </span>
          {/* TODO: Add real pagination logic later */}
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Hapus Absensi"
        message={`Anda yakin ingin menghapus absensi ID "${
          selectedAttendance?.uuid || "..."
        })"? Tindakan ini tidak dapat dibatalkan.`}
      />

      <LoadingModal
        isOpen={isDeleting}
        message={`Menghapus absensi ID "${
          selectedAttendance?.uuid || "..."
        }"...`}
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
        title="Gagal"
        message={modalMessage}
      />
    </AdminLayout>
  );
};

export default DataAbsen;
