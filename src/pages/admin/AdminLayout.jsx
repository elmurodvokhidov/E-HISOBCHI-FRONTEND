import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import AdminSidebar from "./AdminSidebar"
import { useEffect, useState } from "react";
import { getCookie } from "../../config/cookiesService";

function AdminLayout() {
    const [sideModal, setSideModal] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCookie("x-token") || getCookie("x-auth") !== "admin") {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div className="w-full h-screen overflow-hidden">
            <Navbar sideModal={sideModal} setSideModal={setSideModal} setOpen={setOpen} />
            <div className="w-full flex">
                <AdminSidebar sideModal={sideModal} setSideModal={setSideModal} open={open} setOpen={setOpen} />
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout