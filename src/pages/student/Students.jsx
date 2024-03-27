import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import {
    allStudentSuccess,
    getStudentSuccess,
    studentFailure,
    studentStart
} from "../../redux/slices/studentSlice";
import AuthService from "../../config/authService";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import StudentModal from "./StudentModal";
import Swal from "sweetalert2";
import { allGroupSuccess, groupFailure, groupStart } from "../../redux/slices/groupSlice";

function Students() {
    const { students, isLoading } = useSelector(state => state.student);
    const { groups } = useSelector(state => state.group);
    const dispatch = useDispatch();
    const [newStudent, setNewStudent] = useState({
        first_name: "",
        last_name: "",
        father_name: "",
        mother_name: "",
        email: "",
        dob: "",
        contactNumber: "",
        fatherContactNumber: "",
        motherContactNumber: "",
        gender: "",
        group: "",
    });
    const [newPass, setNewPass] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [modals, setModals] = useState({
        modal: false,
        createModal: false,
        passModal: false,
        parentsModal: false,
        imageModal: false,
        more: null,
    });


    const getAllStudents = async () => {
        try {
            dispatch(studentStart());
            const { data } = await AuthService.getAllStudents();
            dispatch(allStudentSuccess(data));
        } catch (error) {
            dispatch(studentFailure(error.message));
        }
    };

    const getAllGroupsFunc = async () => {
        try {
            dispatch(groupStart());
            const { data } = await AuthService.getAllGroups();
            dispatch(allGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.message));
        }
    };

    useEffect(() => {
        getAllStudents();
        getAllGroupsFunc();
    }, []);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewStudent({
            first_name: "",
            last_name: "",
            father_name: "",
            mother_name: "",
            email: "",
            dob: "",
            contactNumber: "",
            fatherContactNumber: "",
            motherContactNumber: "",
            gender: "",
            group: "",
        });
        setNewPass({ newPassword: "", confirmPassword: "" });
        setModals({
            modal: false,
            createModal: false,
            passModal: false,
            parentsModal: false,
            imageModal: false,
            more: null,
        })
    };

    const handleCreateAndUpdate = async (e) => {
        e.preventDefault();
        // o'quvchi parolini o'zgartirish
        if (modals.passModal && newStudent._id) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(studentStart());
                    const { data } = await AuthService.updateStudentPass({ ...newPass, _id: newStudent._id });
                    dispatch(getStudentSuccess(data));
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(studentFailure(error.response.data.message));
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
                newStudent.first_name !== "" &&
                newStudent.last_name !== "" &&
                newStudent.email !== "" &&
                newStudent.group !== ""
            ) {
                dispatch(studentStart());
                try {
                    // yangi o'quvchi qo'shish
                    if (!newStudent._id) {
                        if (newPass.newPassword.length >= 8) {
                            const { data } = await AuthService.addNewStudent({ ...newStudent, ...newPass });
                            getAllStudents();
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
                        // o'quvchi ma'lumotlarini o'zgartirish
                        const { _id, __v, password, passwordUpdated, createdAt, updatedAt, ...newStudentCred } = newStudent;
                        const { data } = await AuthService.updateStudent(newStudent._id, newStudentCred);
                        dispatch(getStudentSuccess(data));
                        getAllStudents();
                        clearModal();
                        await Toast.fire({
                            icon: "success",
                            title: data.message
                        });
                    }

                } catch (error) {
                    dispatch(studentFailure(error.response?.data.message));
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
        setNewStudent(students.filter(student => student._id === id)[0]);
        handleModal("modal", true);
        handleModal("createModal", false);
    };

    const deleteStudent = async (id) => {
        Swal.fire({
            title: "Ishonchingiz komilmi?",
            text: "Buni qaytara olmaysiz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Yo'q",
            confirmButtonText: "Ha, albatta!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(studentStart());
                AuthService.deleteStudent(id).then((res) => {
                    getAllStudents();
                    Toast.fire({
                        icon: "success",
                        title: res?.data.message
                    });
                }).catch((error) => {
                    dispatch(studentFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                });
            }
        });
    };


    return (
        <div className="students w-full h-screen overflow-auto pt-24 px-10" onClick={() => handleModal("more", null)}>
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">O'quvchilar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{students?.length}</span></p>
                </div>
                <button onClick={() => {
                    handleModal("modal", true);
                    handleModal("passModal", true);
                    handleModal("createModal", true);
                }} className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">Yangisini qo'shish</button>
            </div>

            <div className="flex gap-4 py-5">
                <input className="px-4 py-1 text-[12px] outline-cyan-600 border-2 rounded" type="text" name="search" id="search" placeholder="Search by name or phone" />

                <select name="" id="" className="text-[12px] outline-cyan-600 border-2 rounded">
                    <option value="" className="text-gray-700 block px-4 py-2 text-sm italic">None</option>
                    {
                        groups.map(course => (
                            <option key={course._id} value={course?.name} className="text-gray-700 block px-4 py-2 text-sm">{course?.name}</option>
                        ))
                    }
                </select>
            </div>

            <table className="w-full mt-4">
                <thead>
                    <tr className="font-semibold text-[14px] flex text-left px-4">
                        <th className="w-2/5">First and Last name</th>
                        <th className="w-2/5">Contact number</th>
                        <th className="w-2/5">Group</th>
                    </tr>
                </thead>
                <tbody className="grid grid-cols-1 2xsm:gap-4 py-4">
                    {isLoading ? <>
                        <tr className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                            <td className="w-[85%] h-4 rounded bg-gray-300">&nbsp;</td>
                            <td className="w-[50%] h-4 rounded bg-gray-300">&nbsp;</td>
                            <td className="w-[65%] h-4 rounded bg-gray-300">&nbsp;</td>
                        </tr>
                    </> : students.length > 0 ?
                        students.map((student, index) => (
                            <tr key={index} className="2xsm:w-full flex justify-between capitalize text-[15px] border-2 rounded-lg p-4 shadow-smooth">
                                <td className="w-2/5 text-left hover:text-cyan-600">
                                    <NavLink to={`/admin/student-info/${student._id}`}>{student.first_name} {student.last_name}</NavLink>
                                </td>
                                <td className="w-2/5 text-left text-blue-400">{student.contactNumber}</td>
                                <td className="w-2/5 text-left">{student.group?.name}</td>
                                <td className="w-fit flex gap-8">
                                    {/* more button */}
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                        handleModal("more", student._id)
                                    }} className="relative cursor-pointer text-cyan-600 text-xl">
                                        <IoMdMore />
                                        {/* more btn modal */}
                                        <div className={`${modals.more === student._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
                                            <button onClick={() => openModal(student._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"><LiaEditSolid />Tahrirlash</button>
                                            <button onClick={() => deleteStudent(student._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"><RiDeleteBin7Line />O'chirish</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td>Ma'lumot topilmadi</td></tr>
                    }
                </tbody>
            </table>

            {/* create new student and update student modal */}
            <StudentModal
                modals={modals}
                handleModal={handleModal}
                newStudent={newStudent}
                setNewStudent={setNewStudent}
                newPass={newPass}
                setNewPass={setNewPass}
                handleCreateAndUpdate={handleCreateAndUpdate}
                isLoading={isLoading}
                clearModal={clearModal}
                groups={groups}
            />
        </div>
    )
}

export default Students