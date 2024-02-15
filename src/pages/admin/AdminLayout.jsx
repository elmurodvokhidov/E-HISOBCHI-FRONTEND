import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import AdminSidebar from "./AdminSidebar"
import { useEffect } from "react";

function AdminLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("x-token") === null) {
            navigate("/admin/login");
        }
    }, [navigate]);

    return (
        <div className="w-full h-screen overflow-hidden">
            <Navbar />
            <div className="flex">
                <AdminSidebar />
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout