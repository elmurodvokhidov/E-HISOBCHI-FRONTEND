import { useDispatch, useSelector } from "react-redux"
import { adminFailure, adminStart, allAdminSuccess, newAdminSuccess } from "../../redux/slices/adminSlice";
import AuthService from "../../config/authService";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { Toast, ToastLeft } from "../../config/sweetToast";

function Admins() {
    const { admins, isLoading } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        contactNumber: "",
        avatar: "test.png",
        newPassword: "",
        confirmPassword: "",
    });

    const getNewAdminCred = (e) => {
        setNewAdmin({
            ...newAdmin,
            [e.target.name]: e.target.value
        });
    };

    const clearModal = () => {
        setNewAdmin({
            first_name: "",
            last_name: "",
            email: "",
            dob: "",
            contactNumber: "",
            avatar: "test.png",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const addNewAdmin = async (e) => {
        e.preventDefault();
        if (
            newAdmin.first_name !== "" &&
            newAdmin.last_name !== "" &&
            newAdmin.email !== "" &&
            newAdmin.dob !== "" &&
            newAdmin.contactNumber !== ""
        ) {
            if (newAdmin.newPassword.length >= 8) {
                try {
                    dispatch(adminStart());
                    const { data } = await AuthService.addNewAdmin(newAdmin);
                    dispatch(newAdminSuccess(data));
                    clearModal();
                    setModal(false);
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
    };

    const getAllAdmins = async () => {
        dispatch(adminStart());
        try {
            const { data } = await AuthService.getAllAdmin();
            dispatch(allAdminSuccess(data));
        } catch (error) {
            dispatch(adminFailure(error.message));
        }
    };

    useEffect(() => {
        getAllAdmins();
    }, []);

    return (
        <div className="admins w-full h-screen overflow-auto pt-24 px-10">
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">Adminlar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{admins?.length}</span></p>
                </div>
                <button onClick={() => setModal(true)} className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">Yangisini qo'shish</button>
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
            <div onClick={() => setModal(false)} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
                <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                    <div className="flex justify-between text-xl p-5 border-b-2"><h1>Yangi admin ma'lumotlari</h1> <button type="button" onClick={() => setModal(false)} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                    <div className="flex flex-col gap-2 px-5 py-7">
                        <div className="flex flex-col">
                            <label htmlFor="first_name" className="text-[14px]">First Name</label>
                            <input onChange={getNewAdminCred} value={newAdmin.first_name} type="text" name="first_name" id="first_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="last_name" className="text-[14px]">Last Name</label>
                            <input onChange={getNewAdminCred} value={newAdmin.last_name} type="text" name="last_name" id="last_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-[14px]">Email</label>
                            <input onChange={getNewAdminCred} value={newAdmin.email} type="email" name="email" id="email" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="dob" className="text-[14px]">Date of birthday</label>
                                <input onChange={getNewAdminCred} value={newAdmin.dob} type="text" name="dob" id="dob" className="border-2 border-gray-500 rounded px-2 py-1" placeholder="dd/mm/yyyy" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="contactNumber" className="text-[14px]">Contact Number</label>
                                <input onChange={getNewAdminCred} value={newAdmin.contactNumber} type="number" name="contactNumber" id="contactNumber" className="border-2 border-gray-500 rounded px-2 py-1" placeholder='without "+"' />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="avatar" className="text-[14px]">Photo</label>
                            <input type="file" name="avatar" id="avatar" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>

                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="newPassword" className="text-[14px]">New Password</label>
                                <input onChange={getNewAdminCred} value={newAdmin.newPassword} type="text" name="newPassword" id="newPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="confirmPassword" className="text-[14px]">Confirm Password</label>
                                <input onChange={getNewAdminCred} value={newAdmin.confirmPassword} type="text" name="confirmPassword" id="confirmPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                        </div>
                        <button disabled={isLoading ? true : false} onClick={addNewAdmin} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : "Qo'shish"}</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Admins