import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import Navbar from "../../components/Navbar";

function StudentLayout() {
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
                <StudentSidebar />
                <Outlet />
            </div>
        </div>
    )
}

export default StudentLayout