import { authFailure, authStart, authSuccess } from "../../redux/slices/authSlice";
import logo from "../../img/uitc_logo.png";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import { useState } from "react";
import AuthService from "../../config/authService";
import AdminModal from "./AdminModal";
import { useDispatch } from "react-redux";

function AdminProfile({ auth, isLoading, logoutHandler }) {
    const dispatch = useDispatch();
    const [updatedAuth, setUpdatedAuth] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
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
                    const { _id, __v, password, passwordUpdated, createdAt, updatedAt, ...newAuthCred } = updatedAuth;
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
                <h1 className="capitalize text-3xl">Hisob qaydnomalari</h1>
                {logoutHandler && <button
                    onClick={logoutHandler}
                    className="border-2 rounded border-cyan-600 px-5 hover:bg-red-500 hover:border-red-500 transition-all hover:text-white duration-300">
                    Chiqish
                </button>}
                <p className="absolute bottom-[-1px] border-b-2 uppercase text-[14px] pb-2 border-cyan-600 text-cyan-600">
                    admin
                </p>
            </div>

            <div className="w-fit border-2 py-8 px-6 my-20 rounded shadow-dim">
                <div className="flex justify-start gap-10">
                    <figure className={`w-[100px] h-[100px] rounded-[50%] overflow-hidden bg-slate-100 mt-2 ${!auth ? "bg-gray-300 animate-pulse" : null}`}>
                        {auth ? <img className="w-full h-full object-cover" src={logo} alt="logo" /> : null}
                    </figure>

                    {!auth ?
                        <div className="flex flex-col gap-1 animate-pulse">
                            <h1 className="w-40 h-10 rounded bg-gray-300">&nbsp;</h1>
                            <h1 className="w-32 h-4 rounded bg-gray-300">&nbsp;</h1>
                            <div className="flex gap-6 mt-4">
                                <h4 className="w-32 h-8 rounded bg-gray-300">&nbsp;</h4>
                                <h4 className="w-32 h-8 rounded bg-gray-300">&nbsp;</h4>
                            </div>
                        </div> :
                        <div className="flex flex-col">
                            <h1 className="capitalize text-4xl">{auth.first_name}</h1>
                            <h2 className="capitalize text-2xl">{auth.last_name}</h2>
                            <h3 className="text-[14px] mt-1">{auth.email}</h3>
                            <div className="flex gap-6 text-[14px]">
                                <h4>Date of Bithday: <span className="underline">{auth.dob}</span></h4>
                                <h4>Phone: <span className="underline">+{auth.contactNumber}</span></h4>
                            </div>
                        </div>
                    }

                    <div>
                        <button
                            disabled={auth ? false : true}
                            onClick={() => openModal()}
                            className="border-2 rounded ml-16 px-6 py-1 border-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300">
                            {auth ? "Tahrirlash" : "Loading..."}
                        </button>
                    </div>
                </div>
            </div>

            {/* profile edit modal */}
            <AdminModal
                clearModal={clearModal}
                modals={modals}
                updatedAuth={updatedAuth}
                setUpdatedAuth={setUpdatedAuth}
                newPass={newPass}
                setNewPass={setNewPass}
                isLoading={isLoading}
                updateHandler={updateHandler}
                handleModal={handleModal}
            />
        </div>
    )
}

export default AdminProfile