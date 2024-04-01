import { useSelector } from "react-redux";
import ProfileCardSkeleton from "./loaders/ProfileCardSkeleton";
import AdminProfile from "../pages/admin/AdminProfile";
import TeacherProfile from "../pages/teacher/TeacherProfile";
import StudentProfile from "../pages/student/StudentProfile";

export default function Profile() {
    const { auth, isLoading } = useSelector(state => state.auth);

    switch (localStorage.getItem("x-auth")) {
        case "admin": return <AdminProfile auth={auth} isLoading={isLoading} />
        case "teacher": return <TeacherProfile teacher={auth} isLoading={isLoading} />
        case "student": return <StudentProfile student={auth} isLoading={isLoading} />
        default: return <ProfileCardSkeleton />
    }
};