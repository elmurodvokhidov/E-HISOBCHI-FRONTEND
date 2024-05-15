import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import AdminSidebar from "./AdminSidebar"
import { useEffect } from "react";
import { getCookie } from "../../config/cookiesService";
import AuthService from "../../config/authService";
import { useDispatch, useSelector } from "react-redux";
import { allStudentSuccess } from "../../redux/slices/studentSlice";
import {
    companyFailure,
    companyStart,
    companySuccess
} from "../../redux/slices/companySlice";

function AdminLayout({ modals, handleModal, closeAllModals }) {
    const { students } = useSelector(state => state.student);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCookie("x-token") || getCookie("x-auth") !== "admin") {
            navigate("/");
        };

        // O'quvchi balansini hisoblash funksiyasi
        async function caclStudentBalanceFunction() {
            try {
                await AuthService.caclStudentBalance();
                const { data } = await AuthService.getAllStudents();
                dispatch(allStudentSuccess(data));
            } catch (error) {
                console.error("Error calculate student's balance:", error);
            }
        };

        // Mavjud kompaniyani olish funksiyasi
        const getCompanyFunction = async () => {
            try {
                dispatch(companyStart());
                const { data } = await AuthService.getCompany();
                dispatch(companySuccess(data));
            } catch (error) {
                dispatch(companyFailure(error.response?.data.message));
                if (!error.success) navigate('/company');
            }
        };

        if (students.length > 0) caclStudentBalanceFunction();
        getCompanyFunction();
    }, [navigate, students.length]);

    return (
        <div className="w-full h-screen overflow-hidden">
            <Navbar modals={modals} handleModal={handleModal} />
            <div className="w-full flex">
                <AdminSidebar modals={modals} handleModal={handleModal} closeAllModals={closeAllModals} />
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout