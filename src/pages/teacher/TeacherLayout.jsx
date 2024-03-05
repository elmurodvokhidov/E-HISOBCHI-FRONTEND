import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import Navbar from "../../components/Navbar";

function TeacherLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("x-token") === null) {
            navigate("/teacher/login");
        }
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