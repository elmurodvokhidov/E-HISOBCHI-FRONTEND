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
import Profile from "./components/Profile";
import TeacherInfo from "./pages/admin/TeacherInfo";
import StudentInfo from "./pages/admin/StudentInfo";
import NotFound from "./components/NotFound";
import AdminInfo from "./pages/admin/AdminInfo";
import TeacherLayout from "./pages/teacher/TeacherLayout";
import StudentLayout from "./pages/student/StudentLayout";
import Courses from "./pages/courses/Courses";
import Groups from "./pages/groups/Groups";
import GeneralSettings from "./pages/admin/GeneralSettings";
import Rooms from "./pages/admin/Rooms";
import CourseInfo from "./pages/courses/CourseInfo";

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
          <Route path="notice" element={<Notice />} />
          <Route path="admins" element={<Admins />} />
          <Route path="admin-info/:id" element={<AdminInfo />} />
          <Route path="teachers" element={<Teachers />}></Route>
          <Route path="teacher-info/:id" element={<TeacherInfo />} />
          <Route path="students" element={<Students />}></Route>
          <Route path="student-info/:id" element={<StudentInfo />} />
          <Route path="profile" element={<Profile />} />
          <Route path="groups" element={<Groups />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course-info/:id" element={<CourseInfo />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="settings" element={<GeneralSettings />} />
        </Route>

        {/* teacher routes */}
        <Route path="teacher/login" element={<TeacherLogin />} />
        <Route path="teacher" element={<TeacherLayout />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notice" element={<Notice />} />
        </Route>

        {/* student routes */}
        <Route path="student/login" element={<StudentLogin />} />
        <Route path="student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notice" element={<Notice />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
