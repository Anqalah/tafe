import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { store } from "./App/store";
import FaceVerificationRegister from "./components/Fragments/FaceVerificationRegister.jsx";
import "./index.css";
import AbsenAdmin from "./Pages/Admin/AbsenAdmin";
import DashboardAdmin from "./Pages/Admin/DashboardAdmin";
import EditAdmin from "./Pages/Admin/EditAdmin.jsx";
import StudentAdmin from "./Pages/Admin/StudentAdmin";
import TeacherAdmin from "./Pages/Admin/TeacherAdmin";
import LoginPage from "./Pages/login";
import RegisterPage from "./Pages/register";
import AbsenStudent from "./Pages/Student/AbsenStudent";
import AddStudent from "./Pages/Student/AddStudent.jsx";
import ClockIn from "./Pages/Student/ClockIn.jsx";
import ClockInResults from "./Pages/Student/ClockInResult.jsx";
import ClockOut from "./Pages/Student/ClockOut.jsx";
import HomeStudent from "./Pages/Student/HomeStudent";
import ProfileStudent from "./Pages/Student/ProfileStudent";
import AbsenTeacher from "./Pages/Teacher/AbsenTeacher";
import AddTeacher from "./Pages/Teacher/AddTeacher.jsx";
import ClassTeacher from "./Pages/Teacher/ClassTeacher";
import EditTeacher from "./Pages/Teacher/EditTeacher.jsx";
import HomeTeacher from "./Pages/Teacher/HomeTeacher";
import ProfileTeacher from "./Pages/Teacher/ProfileTeacher";

axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <p className="flex font-bold text-[#8d99ae] bg-[#2b2d42] justify-center text-[86px] min-h-screen items-center">
        <Link to="/login">SKRIPSI LEE</Link>
      </p>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/register/face",
    element: <FaceVerificationRegister />,
  },
  {
    path: "/student/dashboard",
    element: <HomeStudent />,
  },
  {
    path: "/student/absen",
    element: <AbsenStudent />,
  },
  {
    path: "/student/profile",
    element: <ProfileStudent />,
  },
  {
    path: "/attendances/clockin/:id",
    element: <ClockIn />,
  },
  {
    path: "/attendances/clockin-results",
    element: <ClockInResults />,
  },
  {
    path: "/attendances/clockout/:id",
    element: <ClockOut />,
  },
  {
    path: "/dashboard/teacher",
    element: <HomeTeacher />,
  },
  {
    path: "/teacher/class",
    element: <ClassTeacher />,
  },
  {
    path: "/teacher/absen",
    element: <AbsenTeacher />,
  },
  {
    path: "/teacher/profile",
    element: <ProfileTeacher />,
  },
  {
    path: "/admin/dashboard",
    element: <DashboardAdmin />,
  },
  {
    path: "/admin/edit/:id",
    element: <EditAdmin />,
  },
  {
    path: "/admin/teacher",
    element: <TeacherAdmin />,
  },
  {
    path: "admin/teacher/add",
    element: <AddTeacher />,
  },
  {
    path: "/admin/teacher/edit/:id",
    element: <EditTeacher />,
  },
  {
    path: "/admin/student",
    element: <StudentAdmin />,
  },
  {
    path: "admin/student/add",
    element: <AddStudent />,
  },
  {
    path: "admin/student/edit/:id",
    // element: <EditStudent />,
  },
  {
    path: "/admin/absen",
    element: <AbsenAdmin />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
