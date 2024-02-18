import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiStudent } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
import { NavLink } from "react-router-dom";

function AdminSidebar() {
    return (
        <div className="sidebar pt-20 h-screen overflow-auto bg-white shadow-smooth font-montserrat">
            <NavLink to="/admin/dashboard" className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center hover:text-cyan-600 transition-all duration-300">
                <LuLayoutDashboard className="text-3xl" />
                <h1 className="text-[16px]">Dashboard</h1>
            </NavLink>

            <NavLink to="notice" className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center hover:text-cyan-600 transition-all duration-300">
                <CgNotes className="text-3xl" />
                <h1 className="text-[16px]">Notice</h1>
            </NavLink>

            <NavLink to="admins" className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center hover:text-cyan-600 transition-all duration-300">
                <MdOutlineAdminPanelSettings className="text-3xl" />
                <h1 className="text-[16px]">Admins</h1>
            </NavLink>

            <NavLink to="teachers" className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center hover:text-cyan-600 transition-all duration-300">
                <FaChalkboardTeacher className="text-3xl" />
                <h1 className="text-[16px]">Teachers</h1>
            </NavLink>

            <NavLink to="students" className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center hover:text-cyan-600 transition-all duration-300">
                <PiStudent className="text-3xl" />
                <h1 className="text-[16px]">Students</h1>
            </NavLink>
        </div>
    )
}

export default AdminSidebar