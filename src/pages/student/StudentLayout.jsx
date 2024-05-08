import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import Navbar from "../../components/Navbar";
import { getCookie } from "../../config/cookiesService";

function StudentLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCookie("x-token") || getCookie("x-auth") !== "student") navigate("/");
    }, [navigate]);

    return (
        <div className="w-full h-screen overflow-hidden">
            <Navbar />
            <div className="flex">
                <StudentSidebar />
                <Outlet />
            </div>
        </div>
    )
}

export default StudentLayout