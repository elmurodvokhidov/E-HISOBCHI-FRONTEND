import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import AdminSidebar from "./AdminSidebar"
import { useEffect, useState } from "react";
import { getCookie } from "../../config/cookiesService";
import AuthService from "../../config/authService";
import { useDispatch } from "react-redux";
import { allStudentSuccess } from "../../redux/slices/studentSlice";

function AdminLayout({ modals, handleModal, closeAllModals }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCookie("x-token") || getCookie("x-auth") !== "admin") {
            navigate("/");
        };

        // O'quvchi balansini hisoblash funksiyasi
        async function caclStudentBalanceFunction() {
            try {
                const res = await AuthService.getCurrentDate();
                const today = res.data.today;
                await AuthService.caclStudentBalance({ today });
                const { data } = await AuthService.getAllStudents();
                dispatch(allStudentSuccess(data));
            } catch (error) {
                console.error("Error calculate student's balance:", error);
            }
        };

        caclStudentBalanceFunction();
    }, [navigate]);

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