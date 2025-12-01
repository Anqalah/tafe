import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { store } from "./App/store";
import "./index.css";
import AddAdmin from "./Pages/Admin/AddAdmin.jsx";
import DashboardAdmin from "./Pages/Admin/DashboardAdmin";
import DataAbsen from "./Pages/Admin/DataAbsen.jsx";
import DataAdmin from "./Pages/Admin/DataAdmin.jsx";
import DataStudent from "./Pages/Admin/DataStudent.jsx";
import EditAdmin from "./Pages/Admin/EditAdmin.jsx";
import EditDataAdmin from "./Pages/Admin/EditDataAdmin.jsx";
import EditDataStudent from "./Pages/Admin/EditDataStudent.jsx";
import FaceRegister from "./Pages/Auth/FaceRegister.jsx";
import LoginPage from "./Pages/Auth/login.jsx";
import RegisterPage from "./Pages/Auth/register.jsx";
import ClockIn from "./Pages/Student/ClockIn.jsx";
import ClockInResults from "./Pages/Student/ClockInResult.jsx";
import ClockOut from "./Pages/Student/ClockOut.jsx";
import ClockOutResults from "./Pages/Student/ClockOutResult.jsx";
import DashboardStudent from "./Pages/Student/DashboardStudent.jsx";
import HistoryAttendance from "./Pages/Student/HistoryAttendance.jsx";
import ProfileStudent from "./Pages/Student/ProfileStudent";
import UpdateFace from "./Pages/Student/UpdateFace.jsx";

axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
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
    path: "/student/history/:id",
    element: <HistoryAttendance />,
  },
  {
    path: "/student/profile/:id",
    element: <ProfileStudent />,
  },
  {
    path: "/student/updateface/:id",
    element: <UpdateFace />,
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
    path: "/data/student",
    element: <DataStudent />,
  },
  {
    path: "/data/student/edit/:id",
    element: <EditDataStudent />,
  },
  {
    path: "/data/absen",
    element: <DataAbsen />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
