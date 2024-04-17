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
import { Toast, ToastLeft } from "../../config/sweetToast";
import TeacherModal from "./TeacherModal";
import Swal from "sweetalert2";
import Skeleton from "../../components/loaders/Skeleton";
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";
import * as XLSX from 'xlsx';
import { MdFileDownload } from "react-icons/md";

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

    const openModal = (teacher) => {
        setNewTeacher(teacher);
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

    // Barcha o'qituvchilar ma'lumotlarini exel fayli sifatida yuklab olish funksiyasi
    const exportToExcel = () => {
        const fileName = 'teachers.xlsx';
        const header = ['First Name', 'Last Name', 'Email', 'Date of Birth', 'Contact Number', 'Gender'];

        const wb = XLSX.utils.book_new();
        const data = teachers.map(teacher => [
            teacher.first_name || '',
            teacher.last_name || '',
            teacher.email || '',
            teacher.dob || '',
            (teacher.contactNumber || '').toString(),
            teacher.gender || '',
        ]);
        data.unshift(header);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex]).length), 0)
        }));
        ws['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Teachers');
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div
            onClick={() => handleModal("more", null)}
            className="w-full h-screen overflow-auto pt-24 px-10 bg-[#f8f8f8]"
        >
            <div className="sm:flex justify-between relative">
                <div className="flex items-end gap-4 text-sm">
                    <h1 className="capitalize text-2xl">O'qituvchilar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{teachers?.length}</span></p>
                </div>
                <button onClick={() => {
                    handleModal("modal", true);
                    handleModal("passModal", true);
                    handleModal("createModal", true);
                }} className="global_add_btn 2xsm:w-full 2xsm:mt-4 2xsm:py-2 sm:w-fit sm:mt-0 sm:py-0">
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
                                    className="flex items-center gap-1 text-blue-400 cursor-pointer">
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
                                    <div className={`${modals.more === teacher._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute z-10 lg:left-8 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
                                        <button
                                            onClick={() => openModal(teacher)}
                                            className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"
                                        >
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                            </svg>
                                            Tahrirlash
                                        </button>
                                        <button
                                            onClick={() => deleteTeacher(teacher._id)}
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

            <button
                onClick={exportToExcel}
                id="downloadExelBtn"
                className="size-8 relative float-end flex items-center justify-center ml-8 text-gray-400 border border-gray-300 outline-cyan-600 text-xl rounded-full hover:text-cyan-600 hover:bg-blue-100 transition-all">
                <MdFileDownload />
            </button>

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