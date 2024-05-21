import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import Navbar from "../../components/Navbar";
import { getCookie } from "../../config/cookiesService";

function StudentLayout({ modals, handleModal, closeAllModals }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCookie("x-token") || getCookie("x-auth") !== "student") navigate("/");
    }, [navigate]);

    return (
        <div className="w-full h-screen overflow-hidden">
            <Navbar modals={modals} handleModal={handleModal} />
            <div className="flex">
                <StudentSidebar
                    modals={modals}
                    handleModal={handleModal}
                    closeAllModals={closeAllModals}
                />
                <Outlet />
            </div>
        </div>
    )
}

export default StudentLayout