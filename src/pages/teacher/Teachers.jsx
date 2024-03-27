import { useEffect, useState } from "react"
import AuthService from "../../config/authService";
import { useDispatch, useSelector } from "react-redux";
import { IoMdMore } from "react-icons/io";
import {
    allTeacherSuccess,
    getTeacherSuccess,
    teacherFailure,
    teacherStart
} from "../../redux/slices/teacherSlice";
import { NavLink } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import TeacherModal from "./TeacherModal";
import Swal from "sweetalert2";

function Teachers() {
    const { teachers, isLoading } = useSelector(state => state.teacher);
    const dispatch = useDispatch();
    const [newTeacher, setNewTeacher] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        contactNumber: "",
        gender: "",
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
        more: null,
    });

    const getAllTeachersFunc = async () => {
        try {
            dispatch(teacherStart());
            const { data } = await AuthService.getAllTeachers();
            dispatch(allTeacherSuccess(data));
        } catch (error) {
            dispatch(teacherFailure(error.message));
        }
    };

    useEffect(() => {
        getAllTeachersFunc();
    }, []);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewTeacher({
            first_name: "",
            last_name: "",
            email: "",
            dob: "",
            contactNumber: "",
            gender: "",
        });
        setNewPass({ newPassword: "", confirmPassword: "" });
        setModals({
            modal: false,
            createModal: false,
            passModal: false,
            imageModal: false,
            more: null,
        })
    };

    const handleCreateAndUpdate = async (e) => {
        e.preventDefault();
        // o'qituvchi parolini o'zgartirish
        if (modals.passModal && newTeacher._id) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(teacherStart());
                    const { data } = await AuthService.updateTeacherPass({ ...newPass, email: newTeacher._id });
                    dispatch(getTeacherSuccess(data));
                    clearModal();
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
                    title: "Parol 8 ta belgidan kam bo'lmasligi kerak!"
                });
            }
        }
        else {
            if (
                newTeacher.first_name !== "" &&
                newTeacher.last_name !== "" &&
                newTeacher.email !== "" &&
                newTeacher.contactNumber !== "" &&
                newTeacher.dob !== "" &&
                newTeacher.gender !== ""
            ) {
                dispatch(teacherStart());
                try {
                    // yangi o'qituvchi qo'shish
                    if (!newTeacher._id) {
                        if (newPass.newPassword.length >= 8) {
                            const { data } = await AuthService.addNewTeacher({ ...newTeacher, ...newPass });
                            getAllTeachersFunc();
                            clearModal();
                            await Toast.fire({
                                icon: "success",
                                title: data.message
                            });
                        } else {
                            await ToastLeft.fire({
                                icon: "error",
                                title: "Parol 8 ta belgidan kam bo'lmasligi kerak!"
                            });
                        }
                    } else {
                        // o'qituvchi ma'lumotlarini o'zgartirish
                        const { _id, __v, groups, password, passwordUpdated, createdAt, updatedAt, ...newTeacherCred } = newTeacher;
                        const { data } = await AuthService.updateTeacher(newTeacher._id, newTeacherCred);
                        dispatch(getTeacherSuccess(data));
                        getAllTeachersFunc();
                        clearModal();
                        await Toast.fire({
                            icon: "success",
                            title: data.message
                        });
                    }

                } catch (error) {
                    dispatch(teacherFailure(error.response?.data.message));
                    await ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
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

    const openModal = (id) => {
        setNewTeacher(teachers.filter(teacher => teacher._id === id)[0]);
        handleModal("modal", true);
        handleModal("createModal", false);
    };

    const deleteTeacher = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(teacherStart());
                AuthService.deleteTeacher(id).then(() => {
                    getAllTeachersFunc();
                    Toast.fire({
                        icon: "success",
                        title: "Teacher deleted successfully!"
                    });
                }).catch((error) => {
                    dispatch(teacherFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                });
            }
        });
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 px-10" onClick={() => handleModal("more", null)}>
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">O'qituvchilar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{teachers?.length}</span></p>
                </div>
                <button onClick={() => {
                    handleModal("modal", true);
                    handleModal("passModal", true);
                    handleModal("createModal", true);
                }} className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">Yangisini qo'shish</button>
            </div>

            <div className="grid lg:grid-cols-2 2xsm:grid-cols-1 2xsm:gap-4 py-6">
                {isLoading ? <>
                    <div className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                        <div className="w-[85%] h-4 rounded bg-gray-300">&nbsp;</div>
                        <div className="w-[50%] h-4 rounded bg-gray-300">&nbsp;</div>
                        <div className="w-[65%] h-4 rounded bg-gray-300">&nbsp;</div>
                    </div>
                </> : teachers.length > 0 ?
                    teachers.map((teacher, index) => (
                        <div key={index} className="lg:w-3/4 md:w-[100%] flex justify-between capitalize text-[15px] border-2 rounded-lg p-4 shadow-smooth">
                            <NavLink to={`/admin/teacher-info/${teacher._id}`} className="hover:text-cyan-600">{teacher.first_name} {teacher.last_name}</NavLink>
                            <div className="flex gap-8">
                                <h3 className="text-blue-400">{teacher.contactNumber}</h3>
                                {/* more button */}
                                <div onClick={(e) => {
                                    e.stopPropagation()
                                    handleModal("more", teacher._id)
                                }} className="relative cursor-pointer text-cyan-600 text-xl">
                                    <IoMdMore />
                                    {/* more btn modal */}
                                    <div className={`${modals.more === teacher._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute lg:left-8 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
                                        <button onClick={() => openModal(teacher._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"><LiaEditSolid />Tahrirlash</button>
                                        <button onClick={() => deleteTeacher(teacher._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"><RiDeleteBin7Line />O'chirish</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <h1>Ma'lumot topilmadi</h1>
                }
            </div>

            {/* create new teacher and update teacher modal */}
            <TeacherModal
                modals={modals}
                handleModal={handleModal}
                newTeacher={newTeacher}
                setNewTeacher={setNewTeacher}
                newPass={newPass}
                setNewPass={setNewPass}
                handleCreateAndUpdate={handleCreateAndUpdate}
                isLoading={isLoading}
                clearModal={clearModal}
            />
        </div>
    )
}

export default Teachers