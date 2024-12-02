import { Outlet } from "react-router-dom"
import Navbar from "../../components/Navbar"
import AdminSidebar from "./AdminSidebar"
import { useEffect } from "react";
import service from "../../config/service";
import { useDispatch } from "react-redux";
import { allStudentSuccess } from "../../redux/slices/studentSlice";

function AdminLayout({ modals, handleModal, closeAllModals }) {
    const dispatch = useDispatch();

    useEffect(() => {
        // O'quvchi balansini hisoblash funksiyasi
        async function caclStudentBalanceFunction() {
            try {
                await service.caclStudentBalance();
                const { data } = await service.getAllStudents();
                dispatch(allStudentSuccess(data));
            } catch (error) {
                console.error("Error calculate student's balance:", error);
            }
        };

        caclStudentBalanceFunction();
    }, []);

    return (
        <div className="w-full h-screen overflow-hidden">
            <Navbar modals={modals} handleModal={handleModal} />
            <div className="w-full flex">
                <AdminSidebar
                    modals={modals}
                    handleModal={handleModal}
                    closeAllModals={closeAllModals}
                />
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout