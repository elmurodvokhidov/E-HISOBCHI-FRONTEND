import { useDispatch, useSelector } from "react-redux"
import {
    adminFailure,
    adminStart,
    allAdminSuccess,
} from "../../redux/slices/adminSlice";
import AuthService from "../../config/authService";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import AdminModal from "./AdminModal";
import Skeleton from "../../components/loaders/Skeleton";
import { IoPersonCircleOutline } from "react-icons/io5";

function Admins() {
    const { admins, isLoading } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const [newAdmin, setNewAdmin] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        contactNumber: "",
        avatar: "",
    });
    const [newPass, setNewPass] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [modals, setModals] = useState({
        modal: false,
        createModal: false,
        passModal: false,
        imageModal: false,
    });

    const getAllAdminsFunc = async () => {
        dispatch(adminStart());
        try {
            const { data } = await AuthService.getAllAdmin();
            dispatch(allAdminSuccess(data));
        } catch (error) {
            dispatch(adminFailure(error.message));
        }
    };

    useEffect(() => {
        getAllAdminsFunc();
    }, []);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewAdmin({
            first_name: "",
            last_name: "",
            email: "",
            dob: "",
            contactNumber: "",
            avatar: "",
        });
        setNewPass({ newPassword: "", confirmPassword: "" });
        setModals({
            modal: false,
            createModal: false,
            passModal: false,
            imageModal: false,
        });
    };

    const createHandler = async (e) => {
        e.preventDefault();
        if (
            newAdmin.first_name !== "" &&
            newAdmin.last_name !== "" &&
            newAdmin.email !== "" &&
            newAdmin.dob !== "" &&
            newAdmin.contactNumber !== ""
        ) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(adminStart());
                    const { data } = await AuthService.addNewAdmin({ ...newAdmin, ...newPass });
                    getAllAdminsFunc();
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(adminFailure(error.response?.data.message));
                    await ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                }
            }
            else {
                await ToastLeft.fire({
                    icon: "error",
                    title: "Parol 8 ta belgidan kam bo'lmasligi kerak!"
                });
            }
        }
        else {
            await ToastLeft.fire({
                icon: "error",
                title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
            });
        }
    };

    return (
        <div className="admins container">
            <div className="sm:flex justify-between relative">
                <div className="flex items-end gap-4 text-sm">
                    <h1 className="capitalize text-2xl">Adminlar</h1>
                    <p>
                        Miqdor
                        <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span>
                        <span>{admins?.length}</span>
                    </p>
                </div>
                <button
                    onClick={() => {
                        handleModal("modal", true);
                        handleModal("passModal", true);
                        handleModal("createModal", true);
                    }} className="global_add_btn 2xsm:w-full 2xsm:mt-4 2xsm:py-2 sm:w-fit sm:mt-0 sm:py-0">
                    Yangisini qo'shish
                </button>
            </div>

            <ul role="list" className="mt-4 divide-y divide-gray-100">
                {
                    admins ?
                        admins.map((admin, index) => (
                            <li className="flex justify-between gap-x-6 py-5" key={index}>
                                <div className="flex min-w-0 gap-x-4">
                                    <figure className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
                                        {
                                            admin.avatar !== "" ?
                                                <img className="w-full h-full object-cover" src={admin.avatar} alt="admin avatar" /> :
                                                <IoPersonCircleOutline className="w-full h-full text-gray-500" />
                                        }
                                    </figure>
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold capitalize leading-6 text-gray-900 hover:text-cyan-600 transition-all"><NavLink to={`/admin/admin-info/${admin._id}`}>{admin.first_name} {admin.last_name}</NavLink></p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{admin.email}</p>
                                    </div>
                                </div>
                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                    <p className="text-sm leading-6 text-gray-900">Adminstartor</p>
                                    <p className="mt-1 text-xs leading-5 text-gray-500">Create at <time dateTime={admin.createdAt}>{admin.createdAt.slice(0, 10).split("-").reverse().join(".")}</time></p>
                                </div>
                            </li>
                        )) :
                        <>
                            <Skeleton parentWidth={90} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                        </>
                }
            </ul>

            {/* add new modal */}
            <AdminModal
                clearModal={clearModal}
                modals={modals}
                newAdmin={newAdmin}
                setNewAdmin={setNewAdmin}
                newPass={newPass}
                setNewPass={setNewPass}
                isLoading={isLoading}
                handleCreateAndUpdate={createHandler}
                handleModal={handleModal}
            />

        </div>
    )
}

export default Admins