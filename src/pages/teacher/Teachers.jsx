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
import Skeleton from "../../components/loaders/Skeleton";
import tick from "../../img/tick.svg";
import copy from "../../img/copy.svg";

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
    const [copied, setCopied] = useState("");

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

    const handleCopy = (text) => {
        setCopied(text);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            setCopied("");
        }, 3000);
    };

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
                        const { _id, __v, groups, password, createdAt, updatedAt, ...newTeacherCred } = newTeacher;
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
                    <h1 className="capitalize text-2xl">O'qituvchilar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{teachers?.length}</span></p>
                </div>
                <button onClick={() => {
                    handleModal("modal", true);
                    handleModal("passModal", true);
                    handleModal("createModal", true);
                }} className="global_add_btn">
                    Yangisini qo'shish
                </button>
            </div>

            <div className="grid lg:grid-cols-2 2xsm:grid-cols-1 2xsm:gap-4 py-6">
                {isLoading ? <>
                    <Skeleton parentWidth={90} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                </> : teachers.length > 0 ?
                    teachers.map((teacher, index) => (
                        <div key={index} className="lg:w-4/5 md:w-full flex justify-between capitalize text-sm border rounded-lg p-4 hover:shadow-md transition-all">
                            <NavLink to={`/admin/teacher-info/${teacher._id}`} className="hover:text-cyan-600">{teacher.first_name} {teacher.last_name}</NavLink>
                            <div className="flex items-center gap-8 text-xs">
                                <h3
                                    onClick={() => handleCopy(teacher.contactNumber)}
                                    className="flex items-center gap-1 text-blue-400">
                                    {teacher.contactNumber}
                                    <img
                                        src={copied === teacher.contactNumber ? tick : copy}
                                        alt="copy svg"
                                        className="cursor-pointer" />
                                </h3>
                                <h3 className="text-xs lowercase">{teacher.groups.length} guruh</h3>
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