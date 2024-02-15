import { useEffect, useState } from "react"
import AuthService from "../../config/authService";
import { useDispatch, useSelector } from "react-redux";
import { IoMdMore } from "react-icons/io";
import {
    newTeacherSuccess,
    teacherFailure,
    teacherStart,
    teacherSuccess
} from "../../redux/slices/authSlice";
import { Link, NavLink } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import { Toast, ToastLeft } from "../../config/sweetToast";

function Teachers() {
    const { isLoading, teachers } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [more, setMore] = useState(null);
    const [newTeacher, setNewTeacher] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        contactNumber: "",
        gender: "",
        specialist_in: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const getAllTeachers = async () => {
            try {
                dispatch(teacherStart());
                const { data } = await AuthService.getAllTeachers();
                dispatch(teacherSuccess(data));
            } catch (error) {
                dispatch(teacherFailure(error.message));
            }
        };

        getAllTeachers();
    }, []);

    const getTeacherCred = (e) => {
        setNewTeacher({
            ...newTeacher,
            [e.target.name]: e.target.value
        });
    };

    const clearModal = () => {
        setNewTeacher({
            first_name: "",
            last_name: "",
            email: "",
            dob: "",
            contactNumber: "",
            gender: "",
            specialist_in: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const addNewTeacher = async (e) => {
        e.preventDefault();
        if (

            newTeacher.first_name !== "" &&
            newTeacher.last_name !== "" &&
            newTeacher.email !== "" &&
            newTeacher.dob !== "" &&
            newTeacher.contactNumber !== "" &&
            newTeacher.specialist_in !== "" &&
            newTeacher.gender !== ""
        ) {
            if (newTeacher.newPassword.length >= 8) {
                try {
                    dispatch(teacherStart());
                    const { data } = await AuthService.addNewTeacher(newTeacher);
                    dispatch(newTeacherSuccess(data));
                    clearModal();
                    setModal(false);
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(teacherFailure(error.response.data.message));
                    await ToastLeft.fire({
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
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 px-10" onClick={() => setMore(null)}>
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">Teachers</h1>
                    <p>Total <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{teachers?.length}</span></p>
                </div>
                <button onClick={() => setModal(true)} className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">Add new teacher</button>
            </div>

            <div className="grid lg:grid-cols-2 2xsm:grid-cols-1 2xsm:gap-4 py-6">
                {teachers ?
                    teachers.map((teacher, index) => (
                        <div key={index} className="lg:w-3/4 md:w-[100%] flex justify-between capitalize text-[15px] border-2 rounded-lg p-4 shadow-smooth">
                            <NavLink to={`/admin/teacher-info/${teacher._id}`} className="hover:text-cyan-600">{teacher.first_name} {teacher.last_name}</NavLink>
                            <div className="flex gap-8">
                                <h3 className="underline">{teacher.contactNumber}</h3>
                                {/* more button */}
                                <div onClick={(e) => {
                                    e.stopPropagation()
                                    setMore(teacher._id)
                                }} className="relative cursor-pointer text-cyan-600 text-xl">
                                    <IoMdMore />
                                    {/* more btn modal */}
                                    <div className={`${more === teacher._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute lg:left-8 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
                                        <Link className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500" to={`/admin/teacher-update/${teacher._id}`}><LiaEditSolid /> Edit</Link>
                                        <button className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500" onClick={() => deleteTeacher(teacher._id)}><RiDeleteBin7Line /> Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <>
                        <div className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                            <div className="w-[85%] h-4 rounded bg-gray-300">&nbsp;</div>
                            <div className="w-[50%] h-4 rounded bg-gray-300">&nbsp;</div>
                            <div className="w-[65%] h-4 rounded bg-gray-300">&nbsp;</div>
                        </div>
                    </>}
            </div>

            {/* add new modal */}
            <div onClick={() => setModal(false)} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
                <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                    <div className="flex justify-between text-xl p-5 border-b-2"><h1>New teacher credentials</h1> <button type="button" onClick={() => setModal(false)} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                    <div className="flex flex-col gap-2 px-5 py-7">
                        <div className="flex flex-col">
                            <label htmlFor="first_name" className="text-[14px]">First Name</label>
                            <input onChange={(e) => getTeacherCred(e)} value={newTeacher.first_name} type="text" name="first_name" id="first_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="last_name" className="text-[14px]">Last Name</label>
                            <input onChange={(e) => getTeacherCred(e)} value={newTeacher.last_name} type="text" name="last_name" id="last_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-[14px]">Email</label>
                            <input onChange={(e) => getTeacherCred(e)} value={newTeacher.email} type="email" name="email" id="email" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="dob" className="text-[14px]">Date of birthday</label>
                                <input onChange={(e) => getTeacherCred(e)} value={newTeacher.dob} type="text" name="dob" id="dob" className="border-2 border-gray-500 rounded px-2 py-1" placeholder="dd/mm/yyyy" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="contactNumber" className="text-[14px]">Contact Number</label>
                                <input onChange={(e) => getTeacherCred(e)} value={newTeacher.contactNumber} type="number" name="contactNumber" id="contactNumber" className="border-2 border-gray-500 rounded px-2 py-1" placeholder='without "+"' />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="avatar" className="text-[14px]">Photo</label>
                            <input type="file" name="avatar" id="avatar" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="specialist_in" className="text-[14px]">Specialist in</label>
                                <input onChange={(e) => getTeacherCred(e)} value={newTeacher.specialist_in} type="text" name="specialist_in" id="specialist_in" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="gender" className="text-[14px]">Gender</label>
                                <input onChange={(e) => getTeacherCred(e)} value={newTeacher.gender} type="text" name="gender" id="gender" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="newPassword" className="text-[14px]">New Password</label>
                                <input onChange={(e) => getTeacherCred(e)} value={newTeacher.newPassword} type="text" name="newPassword" id="newPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="confirmPassword" className="text-[14px]">Confirm Password</label>
                                <input onChange={(e) => getTeacherCred(e)} value={newTeacher.confirmPassword} type="text" name="confirmPassword" id="confirmPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                        </div>
                        <button disabled={isLoading ? true : false} onClick={(e) => addNewTeacher(e)} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : "Add"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Teachers