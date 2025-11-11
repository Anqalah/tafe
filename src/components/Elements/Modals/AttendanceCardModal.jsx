import React from "react";
import {
  ArrowRightIcon,
  ClockIcon as ClockSolidIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const AttendanceCardModal = ({
  title,
  subtitle,
  location,
  time,
  status,
  onDetail,
}) => {
  const isSuccess = status === "Berhasil";
  const StatusIcon = isSuccess ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div
          className={`flex items-center gap-1 px-3 py-1 text-sm font-medium border rounded-full ${
            isSuccess
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-yellow-50 text-yellow-600 border-yellow-200"
          }`}
        >
          <StatusIcon className="w-4 h-4" />
          {status}
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-xl bg-yellow-50">
          <MapPinIcon className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Location</p>
          <p className="text-sm font-medium text-slate-700">{location}</p>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 rounded-xl bg-slate-100">
          <ClockSolidIcon className="w-6 h-6 text-slate-600" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Time</p>
          <p className="text-sm font-semibold text-slate-700">{time}</p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onDetail}
        className="w-full py-3 text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-xl flex items-center justify-center gap-2 transition"
      >
        View Detail
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AttendanceCardModal;
