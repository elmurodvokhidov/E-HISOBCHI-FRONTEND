import { useDispatch, useSelector } from "react-redux"
import {
    adminFailure,
    adminStart,
    allAdminSuccess,
    getAdminSuccess,
} from "../../redux/slices/adminSlice";
import service from "../../config/service";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Toast, ToastLeft } from "../../config/sweetToast";
import AdminModal from "./AdminModal";
import Skeleton from "../../components/loaders/Skeleton";
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";
import { IoMdMore } from "react-icons/io";
import Swal from "sweetalert2";

export default function Employees() {
    const { admins, isLoading } = useSelector(state => state.admin);
    const { auth } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [newAdmin, setNewAdmin] = useState({ first_name: "", last_name: "", dob: "", phoneNumber: "", role: "", avatar: "", });
    const [newPass, setNewPass] = useState({ newPassword: "", confirmPassword: "", });
    const [modals, setModals] = useState({ modal: false, createModal: false, passModal: false, imageModal: false, more: null, });
    const [copied, setCopied] = useState("");

    const handleCopy = (text) => {
        setCopied(text);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            setCopied("");
        }, 3000);
    };

    const getAllAdminsFunc = async () => {
        dispatch(adminStart());
        try {
            const { data } = await service.getAllAdmin();
            dispatch(allAdminSuccess(data));
        } catch (error) {
            dispatch(adminFailure(error.message));
        }
    };

    useEffect(() => {
        getAllAdminsFunc();

        if (auth?.role !== "ceo") navigate("/admin/dashboard");
    }, []);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewAdmin({ first_name: "", last_name: "", dob: "", phoneNumber: "", role: "", avatar: "", });
        setNewPass({ newPassword: "", confirmPassword: "" });
        setModals({ modal: false, createModal: false, passModal: false, imageModal: false, });
    };

    const handleCreateAndUpdate = async (e) => {
        e.preventDefault();
        if (modals.passModal && newAdmin._id) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(adminStart());
                    const { data } = await service.updateAdminPass({ ...newPass, phoneNumber: newAdmin.phoneNumber });
                    dispatch(getAdminSuccess(data));
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                } catch (error) {
                    dispatch(adminFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "warning", title: error.response?.data.message || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "warning", title: "Parol 8 ta belgidan kam bo'lmasligi kerak!" });
            }
        }
        else {
            if (newAdmin.first_name !== "" && newAdmin.last_name !== "" && newAdmin.dob !== "" && newAdmin.phoneNumber !== "" && newAdmin.role !== "") {
                dispatch(adminStart());
                try {
                    // yangi xodim qo'shish
                    if (!newAdmin._id) {
                        if (newPass.newPassword.length >= 8) {
                            const { data } = await service.addNewAdmin({ ...newAdmin, ...newPass });
                            getAllAdminsFunc();
                            clearModal();
                            Toast.fire({ icon: "success", title: data.message });
                        } else {
                            ToastLeft.fire({ icon: "warning", title: "Parol 8 ta belgidan kam bo'lmasligi kerak!" });
                        }
                    } else {
                        // xodim ma'lumotlarini o'zgartirish
                        const { _id, __v, groups, password, createdAt, updatedAt, ...newAdminCred } = newAdmin;
                        const { data } = await service.updateAdminProfile(newAdmin._id, newAdminCred);
                        dispatch(getAdminSuccess(data));
                        getAllAdminsFunc();
                        clearModal();
                        Toast.fire({ icon: "success", title: data.message });
                    }

                } catch (error) {
                    dispatch(adminFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "warning", title: error.response?.data.message || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "warning", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
            }
        }
    };

    const openModal = (emp) => {
        setNewAdmin(emp);
        handleModal("modal", true);
        handleModal("createModal", false);
    };

    const deleteEmployee = async (id) => {
        Swal.fire({
            title: "Ishonchingiz komilmi?",
            text: "Buni ortga qaytarib bo'lmaydi!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ha, albatta!",
            cancelButtonText: "Bekor qilish"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(adminStart());
                service.deleteAdmin(id).then((res) => {
                    getAllAdminsFunc();
                    Toast.fire({ icon: "success", title: res?.data.message });
                }).catch((error) => {
                    dispatch(adminFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "warning", title: error.response?.data.message || error.message });
                });
            }
        });
    };

    return (
        <div onClick={() => handleModal("more", null)} className="admins container">
            <div className="sm:flex justify-between relative">
                <div className="flex items-end gap-4 text-sm pc:text-base">
                    <h1 className="capitalize text-2xl pc:text-3xl">Xodimlar</h1>
                    <p>
                        Miqdor
                        <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span>
                        <span>{admins?.filter(emp => emp._id !== auth?._id).length}</span>
                    </p>
                </div>
                <button
                    onClick={() => {
                        handleModal("modal", true);
                        handleModal("passModal", true);
                        handleModal("createModal", true);
                    }} className="global_add_btn small:w-full small:mt-4 small:py-2 sm:w-fit sm:mt-0 sm:py-0">
                    Yangisini qo'shish
                </button>
            </div>

            <div className="grid xl:grid-cols-2 small:grid-cols-1 small:gap-4 py-6">
                {isLoading ? <>
                    <Skeleton parentWidth={90} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                </> : admins?.filter(emp => emp._id !== auth?._id).length > 0 ?
                    admins
                        .filter(emp => emp._id !== auth?._id)
                        .map((admin, index) => (
                            <div key={index} className="xl:w-4/5 flex justify-between capitalize text-sm pc:text-base border rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                                <NavLink to={`/admin/admin-info/${admin._id}`} className="hover:text-main-1 pc:text-base">
                                    {admin.first_name} {admin.last_name}
                                </NavLink>
                                <div className="flex items-center gap-8 text-xs pc:text-base">
                                    <h3 className="text-xs pc:text-base lowercase">{admin?.role}</h3>
                                    <h3
                                        onClick={() => handleCopy(admin.phoneNumber)}
                                        className="flex items-center gap-1 text-blue-400 cursor-pointer">
                                        {admin.phoneNumber}
                                        <img
                                            src={copied === admin.phoneNumber ? tick : copy}
                                            alt="copy svg"
                                            className="cursor-pointer" />
                                    </h3>
                                    {/* more button */}
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                        handleModal("more", admin._id)
                                    }} className="relative cursor-pointer text-main-1 text-xl">
                                        <IoMdMore />
                                        {/* more btn modal */}
                                        <div className={`${modals.more === admin._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute z-10 lg:left-8 small:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] pc:text-base bg-white`}>
                                            <button
                                                onClick={() => openModal(admin)}
                                                className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"
                                            >
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                                </svg>
                                                Tahrirlash
                                            </button>
                                            <button
                                                onClick={() => deleteEmployee(admin._id)}
                                                className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"
                                            >
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                                </svg>
                                                O'chirish
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : <h1>Ma'lumot topilmadi</h1>
                }
            </div>

            {/* add new modal */}
            <AdminModal
                clearModal={clearModal}
                modals={modals}
                newAdmin={newAdmin}
                setNewAdmin={setNewAdmin}
                newPass={newPass}
                setNewPass={setNewPass}
                isLoading={isLoading}
                handleCreateAndUpdate={handleCreateAndUpdate}
                handleModal={handleModal}
            />
        </div>
    )
}