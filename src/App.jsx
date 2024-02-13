import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import { useDispatch } from "react-redux";
import { authSuccess } from "./redux/slices/authSlice";
import AuthService from "./config/authService";
import Login from "./components/Login";
import TeacherLogin from "./pages/teacher/TeacherLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getUser() {
      try {
        const id = localStorage.getItem("x-id");
        if (localStorage.getItem("x-auth") === "admin") {
          const { data } = await AuthService.getAdmin(id);
          dispatch(authSuccess(data));
        }
        else if (localStorage.getItem("x-auth") === "teacher") {
          const { data } = await AuthService.getTeacher(id);
          dispatch(authSuccess(data));
        }
        // else if (localStorage.getItem("x-auth") === "student") {
        //   const { data } = await AuthService.getStudent(id);
        //   dispatch(authSuccess(data));
        // }
      } catch (error) {
        console.log(error);
      }
    };

    if (localStorage.getItem("x-token")) {
      getUser();
    }
  }, [dispatch]);

  return (
    <div className="app">
      <Routes>
        <Route index element={<Login />} />

        {/* admin routes */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />

        {/* teacher routes */}
        <Route path="teacher/login" element={<TeacherLogin />} />
        <Route path="teacher/dashboard" element={<TeacherDashboard />} />

        {/* student routes */}
        <Route path="student/login" element={<StudentLogin />} />
        <Route path="student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
