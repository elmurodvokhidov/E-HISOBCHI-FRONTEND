import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import Navbar from "../../components/Navbar";
import { getCookie } from "../../config/cookiesService";

function TeacherLayout({ modals, handleModal, closeAllModals }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCookie("x-token") || getCookie("x-auth") !== "teacher") navigate("/");
    }, [navigate]);

    return (
        <div className="w-full h-screen overflow-hidden">
            <Navbar modals={modals} handleModal={handleModal} />
            <div className="flex">
                <TeacherSidebar
                    modals={modals}
                    handleModal={handleModal}
                    closeAllModals={closeAllModals}
                />
                <Outlet />
            </div>
        </div>
    )
}

export default TeacherLayout