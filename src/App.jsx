import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authSuccess } from "./redux/slices/authSlice";
import service from "./config/service";
import Login from "./components/Login";
import Notice from "./pages/notices/Notice";
import Employees from "./pages/admin/Employees";
import Teachers from "./pages/teacher/Teachers";
import Students from "./pages/student/Students";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./components/NotFound";
import AdminInfo from "./pages/admin/AdminInfo";
import Courses from "./pages/courses/Courses";
import Groups from "./pages/groups/Groups";
import GeneralSettings from "./pages/company/GeneralSettings";
import Rooms from "./pages/rooms/Rooms";
import CourseInfo from "./pages/courses/CourseInfo";
import GroupInfo from "./pages/groups/GroupInfo";
import Leads from "./pages/leads/Leads";
import { getCookie } from "./config/cookiesService";
import Payments from "./pages/Payments";
import Cost from "./pages/cost/Cost";
import Salary from "./pages/Salary";
import Debtors from "./pages/Debtors";
import Reports from "./pages/Reports";
import AdminProfile from "./pages/admin/AdminProfile";
import StudentProfile from "./pages/student/StudentProfile";
import TeacherProfile from "./pages/teacher/TeacherProfile";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    async function getAuthFunction() {
      try {
        const { data } = await service.getMe();
        dispatch(authSuccess(data));
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    };

    if (getCookie("x-token")) {
      getAuthFunction();
    };
  }, []);

  return (
    <div className="app" onClick={closeAllModals}>
      <Routes>
        <Route index element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="admin" element={<AdminLayout
          modals={modals}
          handleModal={handleModal}
          closeAllModals={closeAllModals}
        />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="notice" element={<Notice />} />
          <Route path="employees" element={<Employees />} />
          <Route path="admin-info/:id" element={<AdminInfo />} />
          <Route path="teachers" element={<Teachers />}></Route>
          <Route path="teacher-info/:id" element={<TeacherProfile />} />
          <Route path="students" element={<Students />}></Route>
          <Route path="student-info/:id" element={<StudentProfile />} />
          <Route path="profile" element={<AdminProfile />} />
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
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
