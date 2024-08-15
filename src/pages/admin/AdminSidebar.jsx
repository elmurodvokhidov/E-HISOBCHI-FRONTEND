import { PiCurrencyDollar, PiHandCoinsLight } from "react-icons/pi";
import { BsExclamationTriangle, BsPeople, BsPerson } from "react-icons/bs";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AiOutlineAppstore } from "react-icons/ai";
import { CiCoins1 } from "react-icons/ci";
import { LiaChartPieSolid, LiaSwatchbookSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { SlLayers } from "react-icons/sl";
import { useSelector } from "react-redux";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { RxDashboard } from "react-icons/rx";


function AdminSidebar({ modals, handleModal, closeAllModals }) {
    const { auth } = useSelector(state => state.auth);
    const location = useLocation();

    return (
        <>
            <div className={`sidebar md:static absolute z-10 ${modals.sideModal ? "left-0" : "-left-full"} h-screen pt-20 overflow-y-auto shadow-smooth transition-all bg-white`}>
                <div onClick={() => handleModal("settingsModal", false)}>
                    <NavLink
                        to="/admin/dashboard"
                        onClick={closeAllModals}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-4 pc:px-6 flex flex-col items-center">
                        <RxDashboard className="pc:text-4xl 2xl:text-3xl text-2xl" />
                        <h1 className="pc:text-lg text-base">Dashboard</h1>
                    </NavLink>

                    <NavLink
                        to="leads"
                        onClick={closeAllModals}
                        className="cell relative text-gray-500 border-b-2 py-4 md:px-4 pc:px-6 flex flex-col items-center">
                        <BsPerson className="pc:text-4xl 2xl:text-3xl text-2xl" />
                        <h1 className="pc:text-lg text-base">Lidlar</h1>
                    </NavLink>

                    {
                        auth?.role === "ceo" &&
                        <NavLink
                            to="employees"
                            onClick={closeAllModals}
                            className={`${location.pathname.includes('admin-info') && 'active'} cell relative text-gray-500 border-b-2 py-4 md:px-4 pc:px-6 flex flex-col items-center`}>
                            <BsPeople className="pc:text-4xl 2xl:text-3xl text-2xl" />
                            <h1 className="pc:text-lg text-base">Xodimlar</h1>
                        </NavLink>
                    }

                    <NavLink
                        to="groups"
                        onClick={closeAllModals}
                        className={`${location.pathname.includes('group-info') && 'active'} cell relative text-gray-500 border-b-2 py-4 md:px-4 pc:px-6 flex flex-col items-center`}>
                        <SlLayers className="pc:text-4xl 2xl:text-3xl text-2xl" />
                        <h1 className="pc:text-lg text-base">Guruhlar</h1>
                    </NavLink>

                    <NavLink
                        to="teachers"
                        onClick={closeAllModals}
                        className={`${location.pathname.includes('teacher-info') && 'active'} cell relative text-gray-500 border-b-2 py-4 md:px-4 pc:px-6 flex flex-col items-center`}>
                        <BsPeople className="pc:text-4xl 2xl:text-3xl text-2xl" />
                        <h1 className="pc:text-lg text-base">O'qituvchilar</h1>
                    </NavLink>

                    <NavLink
                        to="students"
                        onClick={closeAllModals}
                        className={`${location.pathname.includes('student-info') && 'active'} cell relative text-gray-500 border-b-2 py-4 md:px-4 pc:px-6 flex flex-col items-center`}>
                        <BsPerson className="pc:text-4xl 2xl:text-3xl text-2xl" />
                        <h1 className="pc:text-lg text-base">O'quvchilar</h1>
                    </NavLink>

                    {
                        auth?.role === "ceo" &&
                        <NavLink
                            to="reports"
                            onClick={closeAllModals}
                            className="cell relative text-gray-500 border-b-2 py-4 md:px-4 pc:px-6 flex flex-col items-center">
                            <HiOutlineDocumentChartBar className="pc:text-4xl 2xl:text-3xl text-2xl" />
                            <h1 className="pc:text-lg text-base">Hisobotlar</h1>
                        </NavLink>
                    }

                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleModal("financeModal", !modals.financeModal);
                            handleModal("settingsModal", false);
                        }}
                        className={`${(location.pathname === '/admin/payments' || location.pathname === '/admin/cost' || location.pathname === '/admin/salary' || location.pathname === '/admin/debtors') && 'activeDiv'} cell relative text-gray-500 border-b-2 py-4 md:px-4 pc:px-6 flex flex-col items-center cursor-pointer`}>
                        <PiCurrencyDollar className="pc:text-4xl 2xl:text-3xl text-2xl" />
                        <h1 className="pc:text-lg text-base">Moliya</h1>
                    </div>

                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleModal("settingsModal", !modals.settingsModal);
                            handleModal("financeModal", false);
                        }}
                        className={`${(location.pathname === '/admin/courses' || location.pathname === '/admin/rooms' || location.pathname === '/admin/settings' || location.pathname.includes('course-info')) && 'activeDiv'} cell relative text-gray-500 border-b-2 py-4 md:px-4 pc:px-6 flex flex-col items-center cursor-pointer`}>
                        <IoSettingsOutline className="pc:text-4xl 2xl:text-3xl text-2xl" />
                        <h1 className="pc:text-lg text-base">Sozlamalar</h1>
                    </div>
                </div>
            </div>

            {/* finance modal */}
            <div
                onClick={() => handleModal("financeModal", false)}
                className={`${modals.financeModal ? `pc:left-[145px] lg:left-[120px] md:left-[110px] small:left-[101px] right-0` : `-left-[100%]`} h-screen absolute top-0 z-10 transition-all`}>
                <div className='extraModal pc:w-[350px] md:w-72 small:w-60 h-full pt-24 overflow-y-auto shadow-dim-right bg-white'>
                    <Link
                        onClick={closeAllModals}
                        to="payments"
                        className="relative text-gray-500 py-4 md:px-4 pc:px-6 flex justify-start gap-4">
                        <CiCoins1 className="pc:text-2xl text-xl" />
                        <h1 className="pc:text-lg text-base">Barcha to'lovlar</h1>
                    </Link>

                    <Link
                        onClick={closeAllModals}
                        to="cost"
                        className="relative text-gray-500 py-4 md:px-4 pc:px-6 flex justify-start gap-4">
                        <LiaChartPieSolid className="pc:text-2xl text-xl" />
                        <h1 className="pc:text-lg text-base">Xarajatlar</h1>
                    </Link>

                    <Link
                        onClick={closeAllModals}
                        to="salary"
                        className="relative text-gray-500 py-4 md:px-4 pc:px-6 flex justify-start gap-4">
                        <PiHandCoinsLight className="pc:text-2xl text-xl" />
                        <h1 className="pc:text-lg text-base">Ish haqi</h1>
                    </Link>

                    <Link
                        onClick={closeAllModals}
                        to="debtors"
                        className="relative text-gray-500 py-4 md:px-4 pc:px-6 flex justify-start gap-4">
                        <BsExclamationTriangle className="pc:text-2xl text-xl" />
                        <h1 className="pc:text-lg text-base">Qarzdorlar</h1>
                    </Link>
                </div>
            </div>

            {/* settings modal */}
            <div
                onClick={() => handleModal("settingsModal", false)}
                className={`${modals.settingsModal ? `pc:left-[145px] lg:left-[120px] md:left-[110px] small:left-[101px] right-0` : `-left-[100%]`} h-screen absolute top-0 z-10 transition-all`}>
                <div className='extraModal pc:w-[350px] md:w-72 small:w-60 h-full pt-24 overflow-y-auto shadow-dim-right bg-white'>
                    <Link
                        onClick={closeAllModals}
                        to="courses"
                        className="relative text-gray-500 py-4 md:px-4 pc:px-6 flex justify-start gap-4">
                        <LiaSwatchbookSolid className="pc:text-2xl text-xl" />
                        <h1 className="pc:text-lg text-base">Kurslar</h1>
                    </Link>

                    <Link
                        onClick={closeAllModals}
                        to="rooms"
                        className="relative text-gray-500 py-4 md:px-4 pc:px-6 flex justify-start gap-4">
                        <AiOutlineAppstore className="pc:text-2xl text-xl" />
                        <h1 className="pc:text-lg text-base">Xonalar</h1>
                    </Link>

                    {
                        auth?.role === "ceo" &&
                        <Link
                            onClick={closeAllModals}
                            to="settings"
                            className="relative text-gray-500 py-4 md:px-4 pc:px-6 flex justify-start gap-4">
                            <IoSettingsOutline className="pc:text-2xl text-xl" />
                            <h1 className="pc:text-lg text-base">Umumiy sozlamalar</h1>
                        </Link>
                    }
                </div>
            </div>
        </>
    )
}

export default AdminSidebar