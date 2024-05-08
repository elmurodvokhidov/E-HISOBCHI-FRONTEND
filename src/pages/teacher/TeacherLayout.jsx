import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import Navbar from "../../components/Navbar";
import { getCookie } from "../../config/cookiesService";

function TeacherLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCookie("x-token") || getCookie("x-auth") !== "teacher") navigate("/");
    }, [navigate]);

    return (
        <div className="w-full h-screen overflow-hidden">
            <Navbar />
            <div className="flex">
                <TeacherSidebar />
                <Outlet />
            </div>
        </div>
    )
}

export default TeacherLayout