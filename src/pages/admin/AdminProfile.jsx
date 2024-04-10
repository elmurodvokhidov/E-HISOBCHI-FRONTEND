import { authFailure, authStart, authSuccess } from "../../redux/slices/authSlice";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import { useState } from "react";
import AuthService from "../../config/authService";
import AdminModal from "./AdminModal";
import { useDispatch } from "react-redux";
import { LiaEditSolid } from "react-icons/lia";
import Skeleton from "../../components/loaders/Skeleton";
import { IoPersonCircleOutline } from "react-icons/io5";

function AdminProfile({ auth, isLoading }) {
    const dispatch = useDispatch();
    const [updatedAuth, setUpdatedAuth] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        avatar: "",
        contactNumber: "",
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

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setUpdatedAuth({
            first_name: "",
            last_name: "",
            email: "",
            dob: "",
            avatar: "",
            contactNumber: "",
        });
        setNewPass({ newPassword: "", confirmPassword: "" });
        setModals({
            modal: false,
            createModal: false,
            passModal: false,
            imageModal: false,
        })
    };

    const openModal = () => {
        setUpdatedAuth(auth);
        handleModal("modal", true);
        handleModal("createModal", false);
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        if (modals.passModal) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(authStart());
                    const { data } = await AuthService.updateAdminPass({ ...newPass, email: auth?.email });
                    dispatch(authSuccess(data));
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(authFailure(error.response.data.message));
                    await Toast.fire({
                        icon: "error",
                        title: error.response.data.message || error.message
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
            if (
                updatedAuth.first_name !== "" &&
                updatedAuth.last_name !== "" &&
                updatedAuth.email !== "" &&
                updatedAuth.dob !== "" &&
                updatedAuth.contactNumber !== ""
            ) {
                try {
                    dispatch(authStart());
                    const { _id, __v, password, createdAt, updatedAt, ...newAuthCred } = updatedAuth;
                    const { data } = await AuthService.updateAdminProfile(updatedAuth._id, newAuthCred);
                    dispatch(authSuccess(data));
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(authFailure(error.response.data.error));
                    await Toast.fire({
                        icon: "error",
                        title: error.response.data.error || error.message
                    });
                }
            }
            else {
                await ToastLeft.fire({
                    icon: "error",
                    title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
                });
            }
        }
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 px-10">
            <div className="flex justify-between border-b-2 pb-16 relative">
                <h1 className="capitalize text-2xl">Hisob qaydnomalari</h1>
                <p className="absolute bottom-[-1px] border-b-2 uppercase text-xs pb-2 border-cyan-600 text-cyan-600">
                    admin
                </p>
            </div>

            <div className="w-fit border-2 py-8 px-6 my-20 rounded shadow-dim">
                <div className="flex relative justify-start">
                    {!auth ?
                        <div className="w-[410px]">
                            <Skeleton parentWidth={100} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                        </div> : <>
                            <div className="flex flex-col gap-4 text-sm">
                                <div className="flex items-center gap-4">
                                    <figure className={`w-20 h-20 border-4 border-white rounded-[50%] overflow-hidden bg-slate-100 ${!auth ? "bg-gray-300 animate-pulse" : null}`}>
                                        {
                                            auth && auth.avatar !== "" ?
                                                <img className="w-full h-full object-cover" src={auth.avatar} alt="auth avatar" /> :
                                                <IoPersonCircleOutline className="w-full h-full text-gray-400" />
                                        }
                                    </figure>
                                    <h1 className="capitalize text-xl">{auth.first_name} {auth.last_name}</h1>
                                </div>

                                <div className="flex justify-between gap-20">
                                    <span className="text-gray-500">Telefon:</span>
                                    <span className="text-blue-300">+{auth.contactNumber}</span>
                                </div>

                                <div className="flex justify-between gap-20">
                                    <span className="text-gray-500">Tug'ilgan kun:</span>
                                    <span>{auth.dob}</span>
                                </div>

                                <div className="flex justify-between gap-20">
                                    <span className="text-gray-500">Email manzil:</span>
                                    <span>{auth.email}</span>
                                </div>
                            </div>

                            <div className="w-fit h-fit absolute top-0 right-0">
                                <button
                                    disabled={auth ? false : true}
                                    onClick={() => openModal()}
                                    className="w-8 h-8 flex items-center justify-center text-xl border rounded-full ml-16 text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300">
                                    <LiaEditSolid />
                                </button>
                            </div>
                        </>
                    }

                </div>
            </div>

            {/* profile edit modal */}
            <AdminModal
                clearModal={clearModal}
                modals={modals}
                newAdmin={updatedAuth}
                setNewAdmin={setUpdatedAuth}
                newPass={newPass}
                setNewPass={setNewPass}
                isLoading={isLoading}
                handleCreateAndUpdate={updateHandler}
                handleModal={handleModal}
            />
        </div>
    )
}

export default AdminProfile