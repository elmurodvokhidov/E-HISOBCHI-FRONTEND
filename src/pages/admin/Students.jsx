import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastLeft } from "../../config/sweetToast";
import {
    allStudentSuccess,
    getStudentSuccess,
    // newStudentSuccess,
    studentFailure,
    studentStart
} from "../../redux/slices/studentSlice";
import AuthService from "../../config/authService";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import StudentEditModal from "../../components/modals/StudentEditModal";
import Swal from "sweetalert2";
import {
    allCourseSuccess,
    courseFailure,
    courseStart
} from "../../redux/slices/courseSlice";

function Students() {
    const { students, isLoading } = useSelector(state => state.student);
    const { courses } = useSelector(state => state.course);
    const [student, setStudent] = useState(null);
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [more, setMore] = useState(null);
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
        course: "",
        group: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [editModal, setEditModal] = useState(false);
    const [passModal, setPassModal] = useState(false);
    const [updatedStudent, setUpdatedStudent] = useState({
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
        course: "",
        group: "",
    });
    const [newPass, setNewPass] = useState({
        newPassword: "",
        confirmPassword: ""
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

    const getAllCourses = async () => {
        try {
            dispatch(courseStart());
            const { data } = await AuthService.getAllCourses();
            dispatch(allCourseSuccess(data));
        } catch (error) {
            dispatch(courseFailure(error.message));
        }
    };

    useEffect(() => {
        getAllStudents();
        getAllCourses();
    }, []);

    const getStudentCred = (e) => {
        setNewStudent({
            ...newStudent,
            [e.target.name]: e.target.value
        });
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
            course: "",
            group: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const addNewStudent = async (e) => {
        e.preventDefault();
        if (
            newStudent.first_name !== "" &&
            newStudent.last_name !== "" &&
            newStudent.father_name !== "" &&
            newStudent.mother_name !== "" &&
            newStudent.email !== "" &&
            newStudent.dob !== "" &&
            newStudent.contactNumber !== "" &&
            newStudent.fatherContactNumber !== "" &&
            newStudent.motherContactNumber !== "" &&
            newStudent.course !== "" &&
            newStudent.group !== "" &&
            newStudent.gender !== ""
        ) {
            if (newStudent.newPassword.length >= 8) {
                try {
                    dispatch(studentStart());
                    const { data } = await AuthService.addNewStudent(newStudent);
                    // dispatch(newStudentSuccess(data));
                    getAllStudents();
                    clearModal();
                    setModal(false);
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
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
                    title: "Password must be longer than 8 characters!"
                });
            }
        }
        else {
            await ToastLeft.fire({
                icon: "error",
                title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
            });
        }
    };

    const openModal = (id) => {
        setStudent(students.filter(student => student._id === id)[0]);
        setEditModal(true);
        setUpdatedStudent(students.filter(student => student._id === id)[0]);
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        if (passModal) {
            if (newPass.newPassword !== "" && newPass.confirmPassword !== "") {
                if (newPass.newPassword.length >= 8) {
                    try {
                        dispatch(studentStart());
                        const { data } = await AuthService.updateStudentPass({ ...newPass, email: student?.email });
                        dispatch(getStudentSuccess(data));
                        setEditModal(false);
                        setPassModal(false);
                        setNewPass({ newPassword: "", confirmPassword: "" });
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
                        title: "Password must be longer than 8 characters!"
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
        else {
            if (
                updatedStudent.first_name !== "" &&
                updatedStudent.last_name !== "" &&
                updatedStudent.father_name !== "" &&
                updatedStudent.mother_name !== "" &&
                updatedStudent.email !== "" &&
                updatedStudent.dob !== "" &&
                updatedStudent.contactNumber !== "" &&
                updatedStudent.fatherContactNumber !== "" &&
                updatedStudent.motherContactNumber !== "" &&
                updatedStudent.course !== "" &&
                updatedStudent.group !== "" &&
                updatedStudent.gender !== ""
            ) {
                try {
                    dispatch(studentStart());
                    const { _id, __v, password, passwordUpdated, createdAt, updatedAt, ...newStudentCred } = updatedStudent;
                    const { data } = await AuthService.updateStudent(updatedStudent._id, newStudentCred);
                    dispatch(getStudentSuccess(data));
                    setEditModal(false);
                    setPassModal(false);
                    setNewPass({ newPassword: "", confirmPassword: "" });
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.error));
                    await ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.error || error.message
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
        getAllStudents();
    };

    const deleteStudent = async (id) => {
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
                dispatch(studentStart());
                AuthService.deleteStudent(id).then(() => {
                    getAllStudents();
                    Toast.fire({
                        icon: "success",
                        title: "O'quvchi ma'lumotlari o'chirildi!"
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
        <div className="students w-full h-screen overflow-auto pt-24 px-10" onClick={() => setMore(null)}>
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">O'quvchilar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{students?.length}</span></p>
                </div>
                <button onClick={() => setModal(true)} className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">Yangisini qo'shish</button>
            </div>

            <div className="flex gap-4 py-5">
                <input className="px-4 py-1 text-[12px] outline-cyan-600 border-2 rounded" type="text" name="search" id="search" placeholder="Search by name or phone" />

                <select name="" id="" className="text-[12px] outline-cyan-600 border-2 rounded">
                    <option value="" className="text-gray-700 block px-4 py-2 text-sm italic">None</option>
                    {
                        courses.map(course => (
                            <option key={course._id} value={course.title} className="text-gray-700 block px-4 py-2 text-sm">{course.title}</option>
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
                        <th className="w-2/5">Course</th>
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
                                <td className="w-2/5 text-left">{student.group}</td>
                                <td className="w-2/5 text-left">{student.course.title}</td>
                                <td className="w-fit flex gap-8">
                                    {/* more button */}
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                        setMore(student._id)
                                    }} className="relative cursor-pointer text-cyan-600 text-xl">
                                        <IoMdMore />
                                        {/* more btn modal */}
                                        <div className={`${more === student._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
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

            {/* add new modal */}
            <div onClick={() => setModal(false)} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
                <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                    <div className="flex justify-between text-xl p-5 border-b-2"><h1>Yangi o'quvchi ma'lumotlari</h1> <button type="button" onClick={() => setModal(false)} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                    <div className="flex flex-col gap-2 px-5 py-7">
                        <div className="flex flex-col">
                            <label htmlFor="first_name" className="text-[14px]">First Name</label>
                            <input onChange={getStudentCred} value={newStudent.first_name} type="text" name="first_name" id="first_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="last_name" className="text-[14px]">Last Name</label>
                            <input onChange={getStudentCred} value={newStudent.last_name} type="text" name="last_name" id="last_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-[14px]">Email</label>
                            <input onChange={getStudentCred} value={newStudent.email} type="email" name="email" id="email" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="dob" className="text-[14px]">Date of birthday</label>
                                <input onChange={getStudentCred} value={newStudent.dob} type="text" name="dob" id="dob" className="border-2 border-gray-500 rounded px-2 py-1" placeholder="dd/mm/yyyy" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="contactNumber" className="text-[14px]">Contact Number</label>
                                <input onChange={getStudentCred} value={newStudent.contactNumber} type="number" name="contactNumber" id="contactNumber" className="border-2 border-gray-500 rounded px-2 py-1" placeholder='without "+"' />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="avatar" className="text-[14px]">Photo</label>
                            <input type="file" name="avatar" id="avatar" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[30%] flex flex-col">
                                <label htmlFor="course" className="text-[14px]">Course</label>
                                <select onChange={getStudentCred} value={newStudent.course} name="course" id="course" className="border-2 border-gray-500 rounded px-2 py-1">
                                    <option value="" className="italic">None</option>
                                    {
                                        courses.map(course => (
                                            <option value={course._id} key={course._id}>{course.title}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="w-[30%] flex flex-col">
                                <label htmlFor="group" className="text-[14px]">Group</label>
                                <input onChange={getStudentCred} value={newStudent.group} type="text" name="group" id="group" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[30%] flex flex-col">
                                <label htmlFor="gender" className="text-[14px]">Gender</label>
                                <input onChange={getStudentCred} value={newStudent.gender} type="text" name="gender" id="gender" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 justify-between gap-4">
                            <div className="w-[100%] flex flex-col">
                                <label htmlFor="father_name" className="text-[14px]">Father Name</label>
                                <input onChange={getStudentCred} value={newStudent.father_name} type="text" name="father_name" id="father_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[100%] flex flex-col">
                                <label htmlFor="fatherContactNumber" className="text-[14px]">Father Number</label>
                                <input onChange={getStudentCred} value={newStudent.fatherContactNumber} type="text" name="fatherContactNumber" id="fatherContactNumber" className="border-2 border-gray-500 rounded px-2 py-1" placeholder='without "+"' />
                            </div>
                            <div className="w-[100%] flex flex-col">
                                <label htmlFor="mother_name" className="text-[14px]">Mother Name</label>
                                <input onChange={getStudentCred} value={newStudent.mother_name} type="text" name="mother_name" id="mother_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[100%] flex flex-col">
                                <label htmlFor="motherContactNumber" className="text-[14px]">Mother Number</label>
                                <input onChange={getStudentCred} value={newStudent.motherContactNumber} type="text" name="motherContactNumber" id="motherContactNumber" className="border-2 border-gray-500 rounded px-2 py-1" placeholder='without "+"' />
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="newPassword" className="text-[14px]">Yangi parol</label>
                                <input onChange={getStudentCred} value={newStudent.newPassword} type="text" name="newPassword" id="newPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="confirmPassword" className="text-[14px]">Parolni tasdiqlang</label>
                                <input onChange={getStudentCred} value={newStudent.confirmPassword} type="text" name="confirmPassword" id="confirmPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                        </div>
                        <button disabled={isLoading ? true : false} onClick={addNewStudent} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : "Qo'shish"}</button>
                    </div>
                </form>
            </div>

            {/* profile edit modal */}
            <StudentEditModal
                modal={editModal}
                setModal={setEditModal}
                updatedStudent={updatedStudent}
                setUpdatedStudent={setUpdatedStudent}
                updateHandler={updateHandler}
                newPass={newPass}
                setNewPass={setNewPass}
                passModal={passModal}
                setPassModal={setPassModal}
            />
        </div>
    )
}

export default Students