import { useDispatch, useSelector } from "react-redux";
import { authFailure, authLogout, authStart, authSuccess } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import logo from "../../img/uitc_logo.png";
import { Toast, ToastLeft } from "../../config/sweetToast";
import Swal from "sweetalert2";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import AuthService from "../../config/authService";

function AdminProfile() {
    const { auth, isLoading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [passModal, setPassModal] = useState(false);
    const [updatedAdmin, setUpdatedAdmin] = useState({
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

    const logoutHandler = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action will not cause the account to be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log out!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(authStart());
                dispatch(authLogout());
                navigate("/admin/login");
                Toast.fire({
                    icon: "success",
                    title: "Successfully loged out!"
                });
            }
        });
    };

    const getAdminCred = (e) => {
        setUpdatedAdmin({
            ...updatedAdmin,
            [e.target.name]: e.target.value
        });
    };

    const getNewPass = (e) => {
        setNewPass({
            ...newPass,
            [e.target.name]: e.target.value
        });
    };

    const openModal = () => {
        setModal(true);
        setUpdatedAdmin(auth);
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        if (passModal) {
            if (newPass.newPassword !== "" && newPass.confirmPassword !== "") {
                if (newPass.newPassword.length >= 8) {
                    try {
                        dispatch(authStart());
                        const { data } = await AuthService.updateAdminPass({ ...newPass, email: auth?.email });
                        dispatch(authSuccess(data));
                        setModal(false);
                        setPassModal(false);
                        setNewPass({ newPassword: "", confirmPassword: "" });
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
                        title: "Password must be longer than 8 characters!"
                    });
                }
            }
            else {
                await ToastLeft.fire({
                    icon: "error",
                    title: "Please fill in the all blanks!"
                });
            }
        }
        else {
            if (
                updatedAdmin.first_name !== "" &&
                updatedAdmin.last_name !== "" &&
                updatedAdmin.email !== "" &&
                updatedAdmin.dob !== "" &&
                updatedAdmin.contactNumber !== ""
            ) {
                try {
                    dispatch(authStart());
                    const { _id, password, passwordUpdated, created_at, ...newAdminCred } = updatedAdmin;
                    const { data } = await AuthService.updateAdminProfile(updatedAdmin._id, newAdminCred);
                    dispatch(authSuccess(data));
                    setModal(false);
                    setPassModal(false);
                    setNewPass({ newPassword: "", confirmPassword: "" });
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
                    title: "Please fill in the all blanks!"
                });
            }
        }
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 px-10">
            <div className="flex justify-between border-b-2 pb-16 relative">
                <h1 className="capitalize text-3xl">account credentials</h1>
                <button onClick={logoutHandler} className="border-2 rounded border-cyan-600 px-5 hover:bg-red-500 hover:border-red-500 transition-all hover:text-white duration-300">Exit</button>
                <p className="absolute bottom-[-1px] border-b-2 uppercase text-[14px] pb-2 border-cyan-600 text-cyan-600">{localStorage.getItem("x-auth")}</p>
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
                        <button disabled={auth ? false : true} onClick={() => openModal()} className="border-2 rounded ml-16 px-6 py-1 border-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300">{auth ? "Edit" : "Loading..."}</button>
                    </div>
                </div>
            </div>

            {/* profile edit modal */}
            <div onClick={() => {
                setModal(false)
                setPassModal(false)
            }} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
                <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                    <div className="flex justify-between text-xl p-5 border-b-2"><h1>Update account</h1> <button type="button" onClick={() => {
                        setModal(false)
                        setPassModal(false)
                    }} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                    <div className="flex flex-col gap-2 px-5 py-7">
                        <div className="flex flex-col">
                            <label htmlFor="first_name" className="text-[14px]">First Name</label>
                            <input disabled={passModal ? true : false} onChange={(e) => getAdminCred(e)} value={updatedAdmin.first_name} type="text" name="first_name" id="first_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="last_name" className="text-[14px]">Last Name</label>
                            <input disabled={passModal ? true : false} onChange={(e) => getAdminCred(e)} value={updatedAdmin.last_name} type="text" name="last_name" id="last_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-[14px]">Email</label>
                            <input disabled={passModal ? true : false} onChange={(e) => getAdminCred(e)} value={updatedAdmin.email} type="email" name="email" id="email" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="dob" className="text-[14px]">Date of birthday</label>
                                <input disabled={passModal ? true : false} onChange={(e) => getAdminCred(e)} value={updatedAdmin.dob} type="text" name="dob" id="dob" className="border-2 border-gray-500 rounded px-2 py-1" placeholder="dd/mm/yyyy" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="contactNumber" className="text-[14px]">Contact Number</label>
                                <input disabled={passModal ? true : false} onChange={(e) => getAdminCred(e)} value={updatedAdmin.contactNumber} type="number" name="contactNumber" id="contactNumber" className="border-2 border-gray-500 rounded px-2 py-1" placeholder='without "+"' />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="avatar" className="text-[14px]">Photo</label>
                            <input disabled={passModal ? true : false} type="file" name="avatar" id="avatar" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <button onClick={() => setPassModal(!passModal)} type="button" className="flex items-center justify-end gap-1">{passModal ? <FaAngleUp className="text-[14px]" /> : <FaAngleDown className="text-[14px]" />}Add new password</button>
                        {
                            passModal ?
                                <>
                                    <div className="flex flex-col">
                                        <label htmlFor="newPassword" className="text-[14px]">New Password</label>
                                        <input onChange={(e) => getNewPass(e)} type="text" name="newPassword" id="newPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="confirmPassword" className="text-[14px]">Confirm Password</label>
                                        <input onChange={(e) => getNewPass(e)} type="text" name="confirmPassword" id="confirmPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                                    </div>
                                </>
                                : null
                        }
                        <button disabled={isLoading ? true : false} onClick={(e) => updateHandler(e)} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : passModal ? "Update Password" : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminProfile