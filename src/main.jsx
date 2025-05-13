import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import { store } from "./App/store";
import "./index.css";
import AbsenAdmin from "./Pages/Admin/AbsenAdmin";
import AddAdmin from "./Pages/Admin/AddAdmin.jsx";
import DashboardAdmin from "./Pages/Admin/DashboardAdmin";
import DataAdmin from "./Pages/Admin/DataAdmin.jsx";
import EditAdmin from "./Pages/Admin/EditAdmin.jsx";
import EditDataAdmin from "./Pages/Admin/EditDataAdmin.jsx";
import StudentAdmin from "./Pages/Admin/StudentAdmin";
import FaceRegister from "./Pages/Auth/FaceRegister.jsx";
import LoginPage from "./Pages/Auth/login.jsx";
import RegisterPage from "./Pages/Auth/register.jsx";
import AbsenStudent from "./Pages/Student/AbsenStudent";
import AddStudent from "./Pages/Student/AddStudent.jsx";
import ClockIn from "./Pages/Student/ClockIn.jsx";
import ClockInResults from "./Pages/Student/ClockInResult.jsx";
import ClockOut from "./Pages/Student/ClockOut.jsx";
import DashboardStudent from "./Pages/Student/DashboardStudent.jsx";
import ProfileStudent from "./Pages/Student/ProfileStudent";
import ClockOutResults from "./Pages/Student/ClockOutResult.jsx";

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
    path: "/register/complete",
    element: <FaceRegister />,
  },
  {
    path: "/student/dashboard",
    element: <DashboardStudent />,
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
    path: "/attendances/clockin-results/:id",
    element: <ClockInResults />,
  },
  {
    path: "/attendances/clockout/:id",
    element: <ClockOut />,
  },
  {
    path: "/attendances/clockout-results/:id",
    element: <ClockOutResults />,
  },
  {
    path: "/admin/dashboard",
    element: <DashboardAdmin />,
  },
  {
    path: "/data/admin",
    element: <DataAdmin />,
  },
  {
    path: "/admin/edit/:id",
    element: <EditAdmin />,
  },
  {
    path: "/data/admin/edit/:id",
    element: <EditDataAdmin />,
  },
  {
    path: "data/admin/add",
    element: <AddAdmin />,
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
