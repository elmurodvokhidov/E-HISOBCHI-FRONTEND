import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authSuccess } from "./redux/slices/authSlice";
import AuthService from "./config/authService";
import Login from "./components/Login";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import Notice from "./pages/notices/Notice";
import Admins from "./pages/admin/Admins";
import Teachers from "./pages/teacher/Teachers";
import Students from "./pages/student/Students";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./components/Profile";
import TeacherInfo from "./pages/teacher/TeacherInfo";
import StudentInfo from "./pages/student/StudentInfo";
import NotFound from "./components/NotFound";
import AdminInfo from "./pages/admin/AdminInfo";
import TeacherLayout from "./pages/teacher/TeacherLayout";
import StudentLayout from "./pages/student/StudentLayout";
import Courses from "./pages/courses/Courses";
import Groups from "./pages/groups/Groups";
import GeneralSettings from "./pages/company/GeneralSettings";
import Rooms from "./pages/rooms/Rooms";
import CourseInfo from "./pages/courses/CourseInfo";
import GroupInfo from "./pages/groups/GroupInfo";
import TeacherSalary from "./pages/teacher/TeacherSalary";
import Leads from "./pages/leads/Leads";
import { getCookie } from "./config/cookiesService";
import Payments from "./pages/Payments";
import Cost from "./pages/cost/Cost";
import Salary from "./pages/Salary";
import Debtors from "./pages/Debtors";
import Company from "./pages/company/Company";

function App() {
  const dispatch = useDispatch();
  const [modals, setModals] = useState({
    sideModal: false,
    settingsModal: false,
    financeModal: false,
    searchBarModal: false,
  });

  // Modal state-ni optimal tarzda o'zgartirish
  const handleModal = (modalName, value) => {
    setModals(prevState => ({ ...prevState, [modalName]: value }));
  };

  const closeAllModals = () => {
    setModals({
      sideModal: false,
      settingsModal: false,
      financeModal: false,
      searchBarModal: false,
    });
  };

  useEffect(() => {
    async function getUser() {
      try {
        const id = getCookie("x-id");
        if (getCookie("x-auth") === "admin") {
          const { data } = await AuthService.getAdmin(id);
          dispatch(authSuccess(data));
        }
        else if (getCookie("x-auth") === "teacher") {
          const { data } = await AuthService.getTeacher(id);
          dispatch(authSuccess(data));
        }
        else if (getCookie("x-auth") === "student") {
          const { data } = await AuthService.getStudent(id);
          dispatch(authSuccess(data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (getCookie("x-token")) {
      getUser();
    };
  }, []);

  return (
    <div className="app" onClick={closeAllModals}>
      <Routes>
        <Route index element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="company" element={<Company />} />

        {/* admin routes */}
        <Route path="admin" element={<AdminLayout modals={modals} handleModal={handleModal} closeAllModals={closeAllModals} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="notice" element={<Notice />} />
          <Route path="admins" element={<Admins />} />
          <Route path="admin-info/:id" element={<AdminInfo />} />
          <Route path="teachers" element={<Teachers />}></Route>
          <Route path="teacher-info/:id" element={<TeacherInfo />} />
          <Route path="students" element={<Students />}></Route>
          <Route path="student-info/:id" element={<StudentInfo />} />
          <Route path="profile" element={<Profile />} />
          <Route path="groups" element={<Groups />} />
          <Route path="group-info/:id" element={<GroupInfo />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course-info/:id" element={<CourseInfo />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="settings" element={<GeneralSettings />} />
          <Route path="leads" element={<Leads />} />
          <Route path="payments" element={<Payments />} />
          <Route path="cost" element={<Cost />} />
          <Route path="salary" element={<Salary />} />
          <Route path="debtors" element={<Debtors />} />
        </Route>

        {/* teacher routes */}
        <Route path="teacher" element={<TeacherLayout modals={modals} handleModal={handleModal} closeAllModals={closeAllModals} />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notice" element={<Notice />} />
          <Route path="group-info/:id" element={<GroupInfo />} />
          <Route path="salary" element={<TeacherSalary />} />
          <Route path="student-info/:id" element={<StudentInfo />} />
        </Route>

        {/* student routes */}
        <Route path="student" element={<StudentLayout modals={modals} handleModal={handleModal} closeAllModals={closeAllModals} />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notice" element={<Notice />} />
          <Route path="course-info/:id" element={<CourseInfo />} />
          <Route path="group-info/:id" element={<GroupInfo />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
