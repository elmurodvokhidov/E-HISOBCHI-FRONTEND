import { FaChalkboardTeacher } from "react-icons/fa";
import { MdLibraryBooks, MdOutlineAdminPanelSettings } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiStudent } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
import { Link, NavLink } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { useState } from "react";
import { ImBooks } from "react-icons/im";
import { AiOutlineAppstore } from "react-icons/ai";


function AdminSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="sidebar h-screen pt-20 overflow-y-auto shadow-smooth bg-white">
            <div onClick={() => setOpen(false)}>
                <NavLink
                    to="/admin/dashboard"
                    className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center">
                    <LuLayoutDashboard className="text-3xl" />
                    <h1 className="text-[14px]">Dashboard</h1>
                </NavLink>

                <NavLink
                    to="notice"
                    className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center">
                    <CgNotes className="text-3xl" />
                    <h1 className="text-[14px]">Eslatmalar</h1>
                </NavLink>

                <NavLink
                    to="admins"
                    className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center">
                    <MdOutlineAdminPanelSettings className="text-3xl" />
                    <h1 className="text-[14px]">Adminlar</h1>
                </NavLink>

                <NavLink
                    to="groups"
                    className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center">
                    <MdLibraryBooks className="text-3xl" />
                    <h1 className="text-[14px]">Guruhlar</h1>
                </NavLink>

                <NavLink
                    to="teachers"
                    className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center">
                    <FaChalkboardTeacher className="text-3xl" />
                    <h1 className="text-[14px]">O'qituvchilar</h1>
                </NavLink>

                <NavLink
                    to="students"
                    className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center">
                    <PiStudent className="text-3xl" />
                    <h1 className="text-[14px]">O'quvchilar</h1>
                </NavLink>

                <Link
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(!open);
                    }}
                    className="cell relative text-gray-500 border-b-2 py-4 px-6 flex flex-col items-center">
                    <IoMdSettings className="text-3xl" />
                    <h1 className="text-[14px]">Sozlamalar</h1>
                </Link>
            </div>


            {/* settings modal */}
            <div
                onClick={() => setOpen(false)}
                className={`${open ? `left-[126px] right-0` : `-left-[100%]`} h-screen absolute top-0 z-10 transition-all`}>
                <div className='w-72 h-full pt-24 overflow-y-auto shadow-dim-right bg-white'>
                    <Link
                        to="courses"
                        className="relative text-gray-500 py-4 px-6 flex justify-start gap-4">
                        <ImBooks className="text-xl" />
                        <h1 className="text-[14px]">Kurslar</h1>
                    </Link>

                    <Link
                        to="rooms"
                        className="relative text-gray-500 py-4 px-6 flex justify-start gap-4">
                        <AiOutlineAppstore className="text-xl" />
                        <h1 className="text-[14px]">Xonalar</h1>
                    </Link>

                    <Link
                        to="settings"
                        className="relative text-gray-500 py-4 px-6 flex justify-start gap-4">
                        <IoMdSettings className="text-xl" />
                        <h1 className="text-[14px]">Umumiy sozlamalar</h1>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AdminSidebar