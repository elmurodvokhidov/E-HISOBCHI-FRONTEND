import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiHandCoinsLight, PiStudent } from "react-icons/pi";
import { BsExclamationTriangle, BsPerson } from "react-icons/bs";
import { Link, NavLink } from "react-router-dom";
import { ImBooks } from "react-icons/im";
import { AiOutlineAppstore } from "react-icons/ai";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { CiCoins1 } from "react-icons/ci";
import { LiaChartPieSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { SlLayers } from "react-icons/sl";


function AdminSidebar({ modals, handleModal, closeAllModals }) {
    return (
        <>
            <div className={`sidebar md:static absolute z-10 ${modals.sideModal ? "left-0" : "-left-full"} h-screen pt-20 overflow-y-auto shadow-smooth transition-all bg-white`}>
                <div onClick={() => handleModal("settingsModal", false)}>
                    <NavLink
                        to="/admin/dashboard"
                        onClick={closeAllModals}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <LuLayoutDashboard className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Dashboard</h1>
                    </NavLink>

                    <NavLink
                        to="leads"
                        onClick={closeAllModals}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <BsPerson className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Lidlar</h1>
                    </NavLink>

                    <NavLink
                        to="admins"
                        onClick={closeAllModals}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <MdOutlineAdminPanelSettings className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Adminlar</h1>
                    </NavLink>

                    <NavLink
                        to="groups"
                        onClick={closeAllModals}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <SlLayers className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Guruhlar</h1>
                    </NavLink>

                    <NavLink
                        to="teachers"
                        onClick={closeAllModals}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <FaChalkboardTeacher className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">O'qituvchilar</h1>
                    </NavLink>

                    <NavLink
                        to="students"
                        onClick={closeAllModals}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center">
                        <PiStudent className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">O'quvchilar</h1>
                    </NavLink>

                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleModal("financeModal", !modals.financeModal);
                            handleModal("settingsModal", false);
                        }}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center cursor-pointer">
                        <HiOutlineCurrencyDollar className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Moliya</h1>
                    </div>

                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleModal("settingsModal", !modals.settingsModal);
                            handleModal("financeModal", false);
                        }}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-6 2xsm:px-4 flex flex-col items-center cursor-pointer">
                        <IoSettingsOutline className="md:text-3xl 2xsm:text-2xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Sozlamalar</h1>
                    </div>
                </div>
            </div>

            {/* finance modal */}
            <div
                onClick={() => handleModal("financeModal", false)}
                className={`${modals.financeModal ? `lg:left-[120px] md:left-[110px] 2xsm:left-[101px] right-0` : `-left-[100%]`} h-screen absolute top-0 z-10 transition-all`}>
                <div className='extraModal md:w-72 2xsm:w-60 h-full pt-24 overflow-y-auto shadow-dim-right bg-white'>
                    <Link
                        onClick={closeAllModals}
                        to="payments"
                        className="relative text-gray-500 py-4 md:px-6 2xsm:px-4 flex justify-start gap-4">
                        <CiCoins1 className="text-xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Barcha to'lovlar</h1>
                    </Link>

                    <Link
                        onClick={closeAllModals}
                        to="cost"
                        className="relative text-gray-500 py-4 md:px-6 2xsm:px-4 flex justify-start gap-4">
                        <LiaChartPieSolid className="text-xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Xarajatlar</h1>
                    </Link>

                    <Link
                        onClick={closeAllModals}
                        to="salary"
                        className="relative text-gray-500 py-4 md:px-6 2xsm:px-4 flex justify-start gap-4">
                        <PiHandCoinsLight className="text-xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Ish haqi</h1>
                    </Link>

                    <Link
                        onClick={closeAllModals}
                        to="debtors"
                        className="relative text-gray-500 py-4 md:px-6 2xsm:px-4 flex justify-start gap-4">
                        <BsExclamationTriangle className="text-xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Qarzdorlar</h1>
                    </Link>
                </div>
            </div>

            {/* settings modal */}
            <div
                onClick={() => handleModal("settingsModal", false)}
                className={`${modals.settingsModal ? `lg:left-[120px] md:left-[110px] 2xsm:left-[101px] right-0` : `-left-[100%]`} h-screen absolute top-0 z-10 transition-all`}>
                <div className='extraModal md:w-72 2xsm:w-60 h-full pt-24 overflow-y-auto shadow-dim-right bg-white'>
                    <Link
                        onClick={closeAllModals}
                        to="courses"
                        className="relative text-gray-500 py-4 md:px-6 2xsm:px-4 flex justify-start gap-4">
                        <ImBooks className="text-xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Kurslar</h1>
                    </Link>

                    <Link
                        onClick={closeAllModals}
                        to="rooms"
                        className="relative text-gray-500 py-4 md:px-6 2xsm:px-4 flex justify-start gap-4">
                        <AiOutlineAppstore className="text-xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Xonalar</h1>
                    </Link>

                    <Link
                        onClick={closeAllModals}
                        to="settings"
                        className="relative text-gray-500 py-4 md:px-6 2xsm:px-4 flex justify-start gap-4">
                        <IoSettingsOutline className="text-xl" />
                        <h1 className="md:text-sm 2xsm:text-xs">Umumiy sozlamalar</h1>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default AdminSidebar