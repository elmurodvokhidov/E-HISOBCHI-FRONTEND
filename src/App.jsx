import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import { useDispatch } from "react-redux";
import { authSuccess } from "./redux/slices/authSlice";
import AuthService from "./config/authService";
import Login from "./components/Login";
import TeacherLogin from "./pages/teacher/TeacherLogin";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentLogin from "./pages/student/StudentLogin";
import StudentDashboard from "./pages/student/StudentDashboard";
import Notice from "./pages/admin/Notice";
import Admins from "./pages/admin/Admins";
import Teachers from "./pages/admin/Teachers";
import Students from "./pages/admin/Students";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import TeacherInfo from "./pages/admin/TeacherInfo";
import StudentInfo from "./pages/admin/StudentInfo";
import NotFound from "./components/NotFound";

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
        else if (localStorage.getItem("x-auth") === "student") {
          const { data } = await AuthService.getStudent(id);
          dispatch(authSuccess(data));
        }
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
        <Route path="*" element={<NotFound />} />

        {/* admin routes */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notice" element={<Notice />}></Route>
          <Route path="admins" element={<Admins />}></Route>
          <Route path="teachers" element={<Teachers />}></Route>
          <Route path="teacher-info/:id" element={<TeacherInfo />} />
          <Route path="students" element={<Students />}></Route>
          <Route path="student-info/:id" element={<StudentInfo />} />
          <Route path="profile" element={<AdminProfile />}></Route>
        </Route>

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
