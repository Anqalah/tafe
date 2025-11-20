// pages/DashboardAdmin.jsx
import React, { useEffect, useState } from "react";
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
  ArrowTrendingUpIcon,
  DocumentChartBarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
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
  const { user, isError } = useSelector((state) => state.auth);

  // Mock data untuk chart dan activities
  const weeklyStats = [65, 78, 82, 79, 85, 73, 88];
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
    {
      user: "Sarah Amanda",
      action: "melakukan presensi pulang",
      type: "presensi",
      timestamp: "2024-03-15T16:20:00",
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

  // Stat Cards Component - Responsive
  const StatCard = ({ title, value, icon, color, link, trend }) => (
    <div className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm hover:shadow-xl border border-gray-200/50 p-4 lg:p-6 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div
          className={`p-2 lg:p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
        >
          <div className="h-4 w-4 lg:h-6 lg:w-6 text-white">{icon}</div>
        </div>
        {trend && (
          <div className="flex items-center text-xs lg:text-sm text-green-500 bg-green-50 px-2 py-1 rounded-full">
            <ArrowTrendingUpIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
            {trend}
          </div>
        )}
      </div>

      <div className="space-y-1 lg:space-y-2">
        <p className="text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl lg:text-3xl font-bold text-gray-800">{value}</p>
      </div>

      {link && (
        <Link
          to={link}
          className="mt-3 lg:mt-4 inline-flex items-center text-xs lg:text-sm text-[#D4AF37] hover:text-[#1E2E4A] transition-colors group-hover:translate-x-1 duration-200"
        >
          Lihat Detail
          <ChevronDoubleRightIcon className="w-3 h-3 lg:w-4 lg:h-4 ml-1" />
        </Link>
      )}
    </div>
  );

  // Activity Item Component - Responsive
  const ActivityItem = ({ activity, index }) => (
    <div
      className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 group hover:shadow-md"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className={`p-1.5 lg:p-2 rounded-lg ${
          activity.type === "presensi"
            ? "bg-green-100 text-green-600"
            : activity.type === "update"
            ? "bg-blue-100 text-blue-600"
            : "bg-purple-100 text-purple-600"
        } group-hover:scale-110 transition-transform duration-200`}
      >
        {activity.type === "presensi" ? (
          <CheckCircleIcon className="h-3 w-3 lg:h-4 lg:w-4" />
        ) : activity.type === "update" ? (
          <PencilSquareIcon className="h-3 w-3 lg:h-4 lg:w-4" />
        ) : (
          <DocumentChartBarIcon className="h-3 w-3 lg:h-4 lg:w-4" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {activity.user}
        </p>
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
          {activity.action}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(activity.timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 lg:space-y-8 animate-fadeIn">
        {/* Header Section */}
        <div className="text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-[#1E2E4A] to-[#D4AF37] bg-clip-text text-transparent mb-3 lg:mb-4">
                Selamat Datang {user?.name || "Admin"}
              </h1>
              <div className="hidden lg:flex items-center space-x-3 text-gray-500">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-lg">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          <StatCard
            title="Absensi Hari Ini"
            value="142"
            icon={<ChartBarIcon />}
            color="from-blue-500 to-blue-600"
            link="/data/absen"
            trend="+12%"
          />

          <StatCard
            title="Total Siswa"
            value={students.length.toString()}
            icon={<UserGroupIcon />}
            color="from-green-500 to-green-600"
            link="/data/student"
          />

          <StatCard
            title="Kehadiran"
            value="94.2%"
            icon={<CheckCircleIcon />}
            color="from-emerald-500 to-emerald-600"
            trend="+2.1%"
          />

          <StatCard
            title="Keterlambatan"
            value="8"
            icon={<ClockIcon />}
            color="from-amber-500 to-amber-600"
          />
        </div>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Chart Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Weekly Attendance Chart */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-200/50 p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                  Statistik Mingguan
                </h2>
                <DocumentChartBarIcon className="h-5 w-5 lg:h-6 lg:w-6 text-[#D4AF37]" />
              </div>

              {/* Chart Container */}
              <div className="h-48 lg:h-64 flex items-end justify-between space-x-1 lg:space-x-2 pb-4">
                {weeklyStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center space-y-1 lg:space-y-2"
                  >
                    <div className="relative flex-1 w-full flex items-end min-h-[80px] lg:min-h-[120px]">
                      <div
                        className="w-full bg-gradient-to-t from-[#D4AF37] to-[#F4D03F] rounded-t-lg transition-all duration-500 hover:opacity-80"
                        style={{ height: `${stat}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {["S", "S", "R", "K", "J", "S", "M"][index]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-200/50">
                <span className="text-xs lg:text-sm text-gray-500">
                  Rata-rata minggu ini
                </span>
                <span className="text-base lg:text-lg font-bold text-[#1E2E4A]">
                  78.5%
                </span>
              </div>
            </div>

            {/* Fastest Attendance & Additional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Fastest Attendance */}
              <div className="bg-gradient-to-br from-[#1E2E4A] to-[#0F1A2F] rounded-2xl shadow-xl p-4 lg:p-6 text-white">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold">
                    Presensi Tercepat
                  </h2>
                  <SparklesIcon className="h-5 w-5 lg:h-6 lg:w-6 text-[#D4AF37]" />
                </div>

                {fastestAttendance ? (
                  <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-sm lg:text-lg font-bold text-white">
                        {fastestAttendance.Student?.name?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm lg:text-lg truncate">
                        {fastestAttendance.Student?.name}
                      </p>
                      <p className="text-gray-300 text-xs lg:text-sm">
                        {new Date(fastestAttendance.clockIn).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      <p className="text-[#D4AF37] text-xs lg:text-sm font-medium truncate">
                        Kelas: {fastestAttendance.Student?.kelas}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="bg-[#D4AF37] text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-bold">
                        #1
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 lg:py-8 text-gray-400">
                    <ClockIcon className="h-8 w-8 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-3 opacity-50" />
                    <p className="text-sm lg:text-base">
                      Belum ada presensi hari ini
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Info Card */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-200/50 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                    Info Singkat
                  </h2>
                  <UsersIcon className="h-5 w-5 lg:h-6 lg:w-6 text-[#D4AF37]" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                    <span className="text-sm text-gray-600">Siswa Hadir</span>
                    <span className="font-semibold text-[#1E2E4A]">135</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                    <span className="text-sm text-gray-600">Siswa Izin</span>
                    <span className="font-semibold text-amber-600">5</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Siswa Alpha</span>
                    <span className="font-semibold text-red-600">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-200/50 p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                  Aktivitas Terkini
                </h2>
                <Link
                  to="/aktivitas"
                  className="text-xs lg:text-sm text-[#D4AF37] hover:text-[#1E2E4A] transition-colors"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="space-y-2 lg:space-y-3 max-h-80 lg:max-h-96 overflow-y-auto">
                {recentActivities.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Custom scrollbar untuk activities */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #b8941f;
        }
      `}</style>
    </AdminLayout>
  );
};

export default DashboardAdmin;
