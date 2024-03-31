import { useDispatch, useSelector } from "react-redux";
import { authLogout, authStart } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Toast } from "../assets/sweetToast";
import Swal from "sweetalert2";
import ProfileCardSkeleton from "./loaders/ProfileCardSkeleton";
import AdminProfile from "../pages/admin/AdminProfile";
import TeacherProfile from "../pages/teacher/TeacherProfile";

export default function Profile() {
    const { auth, isLoading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        Swal.fire({
            title: "Ishonchingiz komilmi?",
            text: "Ushbu harakat hisobning o'chirilishiga olib kelmaydi!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Yo'q",
            confirmButtonText: "Ha, albatta!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(authStart());
                dispatch(authLogout());
                navigate("/");
                Toast.fire({
                    icon: "success",
                    title: "Successfully loged out!"
                });
            }
        });
    };

    switch (localStorage.getItem("x-auth")) {
        case "admin": return <AdminProfile auth={auth} isLoading={isLoading} logoutHandler={logoutHandler} />
        case "teacher": return <TeacherProfile teacher={auth} isLoading={isLoading} logoutHandler={logoutHandler} />
        case "student": return <StudentProfile student={auth} isLoading={isLoading} logoutHandler={logoutHandler} />
        default: return <ProfileCardSkeleton />
    }
};