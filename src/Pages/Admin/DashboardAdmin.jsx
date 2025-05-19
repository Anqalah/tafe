import {
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ChevronDoubleRightIcon,
  ClockIcon,
  PencilSquareIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../../Features/authSlice";
import AdminLayout from "../../components/Layouts/AdminLayout";
import axiosInstance from "../../config/axios";

const DashboardAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fastestAttendance, setFastestAttendance] = useState(null);
  const [students, setStudents] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    attendanceStats: {},
    recentActivities: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isError } = useSelector((state) => state.auth);

  // Data contoh
  const recentActivities = [
    {
      user: "Muhammad Bilal",
      action: "melakukan presensi masuk",
      type: "presensi",
      timestamp: "2024-03-15T07:15:00",
    },
    {
      user: "Admin",
      action: "memperbarui data kelas Pertanian A",
      type: "update",
      timestamp: "2024-03-15T08:30:00",
    },
    {
      user: "Sistem",
      action: "menghasilkan laporan bulanan",
      type: "report",
      timestamp: "2024-03-15T09:45:00",
    },
  ];

  const getFastestAttendance = async () => {
    try {
      const response = await axiosInstance.get("/attendances/fastest");
      setFastestAttendance(response.data);
    } catch (error) {
      console.error("Gagal memuat data presensi tercepat:", error);
    }
  };

  const getStudents = async () => {
    try {
      const response = await axiosInstance.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Gagal memuat data siswa:", error);
    }
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/dashboard");
      setDashboardData({
        attendanceStats: response.data.attendanceStats,
        recentActivities: response.data.recentActivities,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getFastestAttendance();
      await getStudents();
      await getDashboardData();
      dispatch(getMe());
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/");
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                <AcademicCapIcon className="w-9 h-9 text-[#D4AF37]" />
                Dashboard Sistem Absensi
              </h1>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <CalendarIcon className="w-5 h-5" />
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Absensi */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">
                    TOTAL ABSENSI HARI INI
                  </h3>
                  <ChartBarIcon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-secondary mb-2">142</p>
              </div>
              <div className="mt-auto">
                <Link
                  to="/data/absen"
                  className="inline-flex items-center text-xs text-primary hover:text-secondary transition-colors"
                >
                  Lihat Detail
                  <ChevronDoubleRightIcon className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Total Siswa */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">
                    TOTAL SISWA
                  </h3>
                  <UserGroupIcon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-secondary mb-2">
                  {students.length}
                </p>
              </div>
              <div className="mt-auto">
                <Link
                  to="/data/student"
                  className="inline-flex items-center text-xs text-primary hover:text-secondary transition-colors"
                >
                  Lihat Detail
                  <ChevronDoubleRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Presensi Tercepat */}
          <div className="bg-white p-4 rounded-xl shadow-sm md:col-span-1">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">
                    PRESENSI TERCEPAT
                  </h3>
                  <ClockIcon className="w-5 h-5 text-primary" />
                </div>
                {fastestAttendance ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {fastestAttendance.Student?.name?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#2A4365]">
                        {fastestAttendance.Student?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(fastestAttendance.clockIn).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        Kelas: {fastestAttendance.Student?.kelas}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 py-2">
                    Belum ada presensi hari ini
                  </div>
                )}
              </div>
              <div className="mt-auto">
                <Link
                  to="/data/absen"
                  className="inline-flex items-center text-xs text-primary hover:text-secondary transition-colors"
                >
                  Lihat Semua
                  <ChevronDoubleRightIcon className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-primary mb-6">
              Statistik Absensi Mingguan
            </h2>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Chart Preview</span>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-primary">
                Aktivitas Terkini
              </h2>
              <Link
                to="/aktivitas"
                className="text-xs text-primary hover:text-[#1E2E4A] transition-colors"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className={`p-1.5 rounded-full ${
                      activity.type === "presensi"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "update"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {activity.type === "presensi" ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : activity.type === "update" ? (
                      <PencilSquareIcon className="w-4 h-4" />
                    ) : (
                      <SparklesIcon className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary truncate">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {activity.action}
                    </p>
                    <p className="text-[0.65rem] text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
