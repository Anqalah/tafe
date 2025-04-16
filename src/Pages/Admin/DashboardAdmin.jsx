import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../Features/authSlice";
import axiosInstance from "../../config/axios";
import AdminLayout from "../../components/Layouts/AdminLayout";

const DashboardAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const { isError } = useSelector((state) => state.auth);

  const getTeachers = async () => {
    try {
      const response = await axiosInstance.get("/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  const getStudents = async () => {
    try {
      const response = await axiosInstance.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch Students:", error);
    }
  };

  useEffect(() => {
    getTeachers();
    getStudents();
  }, []);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  return (
    <AdminLayout>
      <div className="w-full px-6 py-8">
        <div className="mx-auto">
          <div className="bg-white rounded-3xl p-8 mb-5">
            <h1 className="text-3xl font-bold mb-10">
              Website Integrasi Sistem Absensi LPK MALEO GOGAKUIN PALU
            </h1>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-stretch">
                <div className="text-gray-400 text-xs">
                  Senin, 20 April 2034
                </div>
                <div className="h-100 border-l mx-4"></div>
                <div className="flex flex-nowrap -space-x-3">
                  <div className="h-9 w-9">
                    <img
                      className="object-cover w-full h-full rounded-full"
                      src="https://ui-avatars.com/api/?background=random"
                    />
                  </div>
                  <div className="h-9 w-9">
                    <img
                      className="object-cover w-full h-full rounded-full"
                      src="https://ui-avatars.com/api/?background=random"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-20">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <div className="p-4 bg-green-100 rounded-xl">
                      <div className="font-bold text-xl text-gray-800 leading-none">
                        Absen Siswa
                      </div>
                      <div className="mt-5">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-white text-gray-800 hover:text-green-500 text-sm font-semibold transition"
                        >
                          Lihat Semua
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                    <div className="font-bold text-2xl leading-none">
                      {teachers.length}
                    </div>
                    <div className="mt-2">Guru</div>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                    <div className="font-bold text-2xl leading-none">
                      {students.length}
                    </div>
                    <div className="mt-2">Siswa</div>
                  </div>
                  <div className="col-span-2">
                    <div className="p-4 bg-purple-100 rounded-xl text-gray-800">
                      <div className="font-bold text-xl leading-none">
                        Kelas Absen Terbaik
                      </div>
                      <div className="mt-2">Pertanian A</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-xs">Keterangan</div>
                      <div className="text-gray-400 text-2xl">20</div>
                    </div>
                    <p className="font-bold hover:text-yellow-800">
                      Hadir Terbanyak
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <img
                        src="/images/logo.jpg"
                        className="w-6 h-6 rounded-full"
                      />
                      <p>Muhammad Fadhil</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-xs">Keterangan</div>
                      <div className="text-gray-400 text-2xl">20</div>
                    </div>
                    <p className="font-bold hover:text-yellow-800">
                      Izin Terbanyak
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <img
                        src="/images/logo.jpg"
                        className="w-6 h-6 rounded-full"
                      />
                      <p>Muhammad Fadhil</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-xs">Keterangan</div>
                      <div className="text-gray-400 text-2xl">20</div>
                    </div>
                    <p className="font-bold hover:text-yellow-800">
                      Alpa Terbanyak
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <img
                        src="/images/logo.jpg"
                        className="w-6 h-6 rounded-full"
                      />
                      <p>Muhammad Fadhil</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardAdmin;
