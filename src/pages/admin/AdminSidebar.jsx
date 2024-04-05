import { FaChalkboardTeacher } from "react-icons/fa";
import { MdLibraryBooks, MdOutlineAdminPanelSettings } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiStudent } from "react-icons/pi";
import { BsPerson } from "react-icons/bs";
import { Link, NavLink } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { ImBooks } from "react-icons/im";
import { AiOutlineAppstore } from "react-icons/ai";


function AdminSidebar({ sideModal, setSideModal, open, setOpen }) {
    return (
        <>
            <div className={`sidebar md:static absolute z-10 ${sideModal ? "left-0" : "-left-full"} h-screen pt-20 overflow-y-auto shadow-smooth transition-all bg-white`}>
                <div onClick={() => setOpen(false)}>
                    <NavLink
                        to="/admin/dashboard"
                        onClick={() => setSideModal(false)}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <LuLayoutDashboard className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Dashboard</h1>
                    </NavLink>

                    <NavLink
                        to="lids"
                        onClick={() => setSideModal(false)}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <BsPerson className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Lidlar</h1>
                    </NavLink>

                    <NavLink
                        to="admins"
                        onClick={() => setSideModal(false)}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <MdOutlineAdminPanelSettings className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Adminlar</h1>
                    </NavLink>

                    <NavLink
                        to="groups"
                        onClick={() => setSideModal(false)}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <MdLibraryBooks className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Guruhlar</h1>
                    </NavLink>

                    <NavLink
                        to="teachers"
                        onClick={() => setSideModal(false)}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <FaChalkboardTeacher className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">O'qituvchilar</h1>
                    </NavLink>

                    <NavLink
                        to="students"
                        onClick={() => setSideModal(false)}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <PiStudent className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">O'quvchilar</h1>
                    </NavLink>

                    <Link
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(!open);
                        }}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <IoMdSettings className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Sozlamalar</h1>
                    </Link>
                </div>
            </div>

            {/* settings modal */}
            <div
                onClick={() => setOpen(false)}
                className={`${open ? `lg:left-[126px] md:left-[120px] 2xsm:left-[110px] right-0` : `-left-[100%]`} h-screen absolute top-0 z-10 transition-all`}>
                <div className='md:w-72 2xsm:w-60 h-full pt-24 overflow-y-auto shadow-dim-right bg-white'>
                    <Link
                        onClick={() => setSideModal(false)}
                        to="courses"
                        className="relative text-gray-500 py-4 md:px-6 2xsm:px-4 flex justify-start gap-4">
                        <ImBooks className="text-xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Kurslar</h1>
                    </Link>

                    <Link
                        onClick={() => setSideModal(false)}
                        to="rooms"
                        className="relative text-gray-500 py-4 md:px-6 2xsm:px-4 flex justify-start gap-4">
                        <AiOutlineAppstore className="text-xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Xonalar</h1>
                    </Link>

                    <Link
                        onClick={() => setSideModal(false)}
                        to="settings"
                        className="relative text-gray-500 py-4 md:px-6 2xsm:px-4 flex justify-start gap-4">
                        <IoMdSettings className="text-xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Umumiy sozlamalar</h1>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default AdminSidebar