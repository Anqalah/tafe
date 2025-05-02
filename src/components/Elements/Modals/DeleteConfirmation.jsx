import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  studentName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30"></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto z-10 p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Warning Icon */}
          <div className="p-3 bg-yellow-50 rounded-full">
            <ExclamationTriangleIcon className="h-10 w-10 text-yellow-500" />
          </div>

          {/* Message */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Konfirmasi Penghapusan
            </h3>
            <p className="text-gray-600">
              Apakah Anda yakin ingin menghapus siswa{" "}
              <span className="font-semibold">{studentName}</span>?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 w-full pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-2 px-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
