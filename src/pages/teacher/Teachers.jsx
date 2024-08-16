import { useEffect, useState } from "react"
import service from "../../config/service";
import { useDispatch, useSelector } from "react-redux";
import { IoMdMore } from "react-icons/io";
import { allTeacherSuccess, getTeacherSuccess, teacherFailure, teacherStart } from "../../redux/slices/teacherSlice";
import { NavLink } from "react-router-dom";
import { Toast, ToastLeft } from "../../config/sweetToast";
import TeacherModal from "./TeacherModal";
import Swal from "sweetalert2";
import Skeleton from "../../components/loaders/Skeleton";
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";
import * as XLSX from 'xlsx';
import { MdFileDownload } from "react-icons/md";
import { Bin, Pencil } from "../../assets/icons/Icons";

function Teachers() {
    const { teachers, isLoading } = useSelector(state => state.teacher);
    const dispatch = useDispatch();
    const [newTeacher, setNewTeacher] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        phoneNumber: "",
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
            const { data } = await service.getAllTeachers();
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
            dob: "",
            phoneNumber: "",
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
                    const { data } = await service.updateTeacherPass({ ...newPass, id: newTeacher._id });
                    dispatch(getTeacherSuccess(data));
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                } catch (error) {
                    dispatch(teacherFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "error", title: "Parol 8 ta belgidan kam bo'lmasligi kerak!" });
            }
        }
        else {
            if (
                newTeacher.first_name !== "" &&
                newTeacher.last_name !== "" &&
                newTeacher.phoneNumber !== ""
            ) {
                dispatch(teacherStart());
                try {
                    // yangi o'qituvchi qo'shish
                    if (!newTeacher._id) {
                        if (newPass.newPassword.length >= 8) {
                            const { data } = await service.addNewTeacher({ ...newTeacher, ...newPass });
                            getAllTeachersFunc();
                            clearModal();
                            Toast.fire({ icon: "success", title: data.message });
                        } else {
                            ToastLeft.fire({ icon: "error", title: "Parol 8 ta belgidan kam bo'lmasligi kerak!" });
                        }
                    } else {
                        // o'qituvchi ma'lumotlarini o'zgartirish
                        const { _id, __v, createdAt, updatedAt, ...newTeacherCred } = newTeacher;
                        const { data } = await service.updateTeacher(newTeacher._id, newTeacherCred);
                        dispatch(getTeacherSuccess(data));
                        getAllTeachersFunc();
                        clearModal();
                        Toast.fire({ icon: "success", title: data.message });
                    }

                } catch (error) {
                    dispatch(teacherFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "error", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
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
                service.deleteTeacher(id).then((res) => {
                    getAllTeachersFunc();
                    Toast.fire({ icon: "success", title: res?.data.message });
                }).catch((error) => {
                    dispatch(teacherFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                });
            }
        });
    };

    // Barcha o'qituvchilar ma'lumotlarini exel fayli sifatida yuklab olish funksiyasi
    const exportToExcel = () => {
        const fileName = 'teachers.xlsx';
        const header = ["Ism", "Familya", "Tug'ilgan sana", "Telefon"];

        const wb = XLSX.utils.book_new();
        const data = teachers.map(teacher => [
            teacher.first_name || '',
            teacher.last_name || '',
            teacher.dob || '',
            (teacher.phoneNumber || '').toString(),
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
            className="w-full h-screen overflow-auto pt-24 pc:pt-28 px-10 bg-main-2"
        >
            <div className="sm:flex justify-between relative">
                <div className="flex items-end gap-4 text-sm pc:text-base">
                    <h1 className="capitalize text-2xl pc:text-3xl">O'qituvchilar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{teachers?.length}</span></p>
                </div>
                <button onClick={() => {
                    handleModal("modal", true);
                    handleModal("passModal", true);
                    handleModal("createModal", true);
                }} className="global_add_btn small:w-full small:mt-4 small:py-2 sm:w-fit sm:mt-0 sm:py-0">
                    Yangisini qo'shish
                </button>
            </div>

            <div className="grid xl:grid-cols-2 small:grid-cols-1 small:gap-4 py-6">
                {isLoading ? <>
                    <Skeleton parentWidth={90} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                </> : teachers.length > 0 ?
                    teachers.map((teacher, index) => (
                        <div key={index} className="xl:w-4/5 flex justify-between capitalize text-sm pc:text-base border rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
                            <NavLink to={`/admin/teacher-info/${teacher._id}`} className="hover:text-main-1 pc:text-base">{teacher.first_name} {teacher.last_name}</NavLink>
                            <div className="flex items-center gap-8 text-xs pc:text-base">
                                <h3
                                    onClick={() => handleCopy(teacher.phoneNumber)}
                                    className="flex items-center gap-1 text-blue-400 cursor-pointer">
                                    {teacher.phoneNumber}
                                    <img
                                        src={copied === teacher.phoneNumber ? tick : copy}
                                        alt="copy svg"
                                        className="cursor-pointer" />
                                </h3>
                                <h3 className="text-xs pc:text-base lowercase">{teacher.groups.length} guruh</h3>
                                {/* more button */}
                                <div onClick={(e) => {
                                    e.stopPropagation()
                                    handleModal("more", teacher._id)
                                }} className="relative cursor-pointer text-main-1 text-xl">
                                    <IoMdMore />
                                    {/* more btn modal */}
                                    <div className={`${modals.more === teacher._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute z-10 lg:left-8 small:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] pc:text-base bg-white`}>
                                        <button
                                            onClick={() => openModal(teacher)}
                                            className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"
                                        >
                                            <Pencil />
                                            Tahrirlash
                                        </button>
                                        <button
                                            onClick={() => deleteTeacher(teacher._id)}
                                            className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"
                                        >
                                            <Bin />
                                            O'chirish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : <h1>Ma'lumot topilmadi</h1>
                }
            </div>

            {
                !isLoading &&
                <button
                    onClick={exportToExcel}
                    id="downloadExelBtn"
                    className="size-8 pc:size-10 relative float-end flex items-center justify-center ml-8 text-gray-400 border border-gray-300 outline-main-1 text-xl pc:text-2xl rounded-full hover:text-main-1 hover:bg-blue-100 transition-all">
                    <MdFileDownload />
                </button>
            }

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