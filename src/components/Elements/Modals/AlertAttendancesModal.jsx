import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const AlertAttendancesModal = ({
  message,
  onClose,
  type = "info", // 'error', 'success', or 'info'
}) => {
  if (!message) return null;

  const config = {
    error: {
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      icon: <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />,
      title: "Error",
      buttonColor: "bg-red-100 hover:bg-red-200 text-red-700",
    },
    success: {
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      icon: <CheckCircleIcon className="w-12 h-12 text-green-500" />,
      title: "Success",
      buttonColor: "bg-green-100 hover:bg-green-200 text-green-700",
    },
    info: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      icon: <ClockIcon className="w-12 h-12 text-blue-500" />,
      title: "Notification",
      buttonColor: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    },
  };

  const currentConfig = config[type] || config.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`relative transform transition-all duration-300 p-6 rounded-xl shadow-xl max-w-sm w-full ${currentConfig.bgColor} ${currentConfig.textColor}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Message Content */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{currentConfig.icon}</div>

          <h3 className="text-xl font-semibold mb-2">{currentConfig.title}</h3>

          <p className="mb-6">{message}</p>

          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium ${currentConfig.buttonColor}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertAttendancesModal;
