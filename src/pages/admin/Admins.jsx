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
import ProfileModal from "../../components/ProfileModal";

function Admins() {
    const { admins, isLoading } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const [newAdmin, setNewAdmin] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        contactNumber: "",
        avatar: "test.png",
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
            avatar: "test.png",
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
        <div className="admins w-full h-screen overflow-auto pt-24 px-10">
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">Adminlar</h1>
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
                    }}
                    className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">
                    Yangisini qo'shish
                </button>
            </div>

            <ul role="list" className="mt-4 divide-y divide-gray-100">
                {
                    admins ?
                        admins.map((admin, index) => (
                            <li className="flex justify-between gap-x-6 py-5" key={index}>
                                <div className="flex min-w-0 gap-x-4">
                                    <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg" alt="" />
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
                            <div className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                                <div className="w-[85%] h-4 rounded bg-gray-300">&nbsp;</div>
                                <div className="w-[50%] h-4 rounded bg-gray-300">&nbsp;</div>
                                <div className="w-[65%] h-4 rounded bg-gray-300">&nbsp;</div>
                            </div>
                        </>
                }
            </ul>

            {/* add new modal */}
            <ProfileModal
                clearModal={clearModal}
                modals={modals}
                updatedAuth={newAdmin}
                setUpdatedAuth={setNewAdmin}
                newPass={newPass}
                setNewPass={setNewPass}
                isLoading={isLoading}
                updateHandler={createHandler}
                handleModal={handleModal}
            />

        </div>
    )
}

export default Admins