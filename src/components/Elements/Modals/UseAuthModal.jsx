// hooks/useModal.js
import { useState, useCallback } from "react";
import AuthModal from "./AuthModal"

export const useModal = () => {
  const [modalState, setModalState] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "Tutup",
    onConfirm: null,
    showCancelButton: false,
    cancelText: "Batal",
    onCancel: null,
  });

  const showModal = useCallback((config) => {
    setModalState((prev) => ({
      ...prev,
      show: true,
      ...config,
    }));
  }, []);

  const hideModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, show: false }));
  }, []);

  const ModalComponent = useCallback(
    (props) => (
      <AuthModal
        show={modalState.show}
        onClose={modalState.type === "loading" ? null : hideModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        onConfirm={modalState.onConfirm}
        showCancelButton={modalState.showCancelButton}
        cancelText={modalState.cancelText}
        onCancel={modalState.onCancel}
        {...props}
      />
    ),
    [modalState, hideModal]
  );

  return {
    Modal: ModalComponent,
    showModal,
    hideModal,
    modalState,
  };
};
