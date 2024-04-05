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
import {
    allGroupSuccess,
    groupFailure,
    groupStart
} from "../../redux/slices/groupSlice";
import Pagination from "../../components/Pagination";
import { GoHorizontalRule } from "react-icons/go";
import {
    allCourseSuccess,
    courseFailure,
    courseStart
} from "../../redux/slices/courseSlice";
import tick from "../../img/tick.svg";
import copy from "../../img/copy.svg";

function Students() {
    const { students, isLoading } = useSelector(state => state.student);
    const { groups } = useSelector(state => state.group);
    const { courses } = useSelector(state => state.course);
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
    const [filters, setFilters] = useState({
        searchBy: "",
        course: "",
        start_date: "",
        end_date: ""
    });
    const [copied, setCopied] = useState("");
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const getAllStudentsFunction = async () => {
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

    const getAllCoursesFunc = async () => {
        try {
            dispatch(courseStart());
            const { data } = await AuthService.getAllCourses();
            dispatch(allCourseSuccess(data));
        } catch (error) {
            dispatch(courseFailure(error.message));
        }
    };

    useEffect(() => {
        getAllStudentsFunction();
        getAllGroupsFunc();
        getAllCoursesFunc();
    }, []);

    const handleCopy = (text) => {
        setCopied(text);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            setCopied("");
        }, 3000);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // O'quvchilarni filterlash funksiyasi
    const filteredStudents = students.filter(student => {
        return Object.entries(filters).every(([key, value]) => {
            if (value === "") return true;

            if (key === "searchBy") {
                return student.first_name.toLowerCase().includes(value.toLowerCase().trim()) || student.last_name.toLowerCase().includes(value.toLowerCase().trim()) || student.contactNumber.toString().includes(value.toString().trim());
            }

            if (key === "course") {
                return student.group.course.title === value;
            }

            if (key === 'start_date' || key === 'end_date') {
                const studentStartDate = new Date(student.group.start_date);
                const studentEndDate = new Date(student.group.end_date);
                const filterStartDate = new Date(filters['start_date']);
                const filterEndDate = new Date(filters['end_date']);

                if (filters['start_date'] && filters['end_date']) {
                    return studentStartDate >= filterStartDate && studentEndDate <= filterEndDate;
                }
                else if (filters['start_date']) {
                    return studentStartDate >= filterStartDate;
                }
                else if (filters['end_date']) {
                    return studentEndDate <= filterEndDate;
                }
                else {
                    return true;
                }
            }


            return student[key] === value;
        });
    });

    // Pagination
    const indexOfLastStudent = page * limit;
    const indexOfFirstStudent = indexOfLastStudent - limit;
    const pageStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

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
                newStudent.email !== ""
            ) {
                dispatch(studentStart());
                try {
                    // yangi o'quvchi qo'shish
                    if (!newStudent._id) {
                        if (newPass.newPassword.length >= 8) {
                            const { data } = await AuthService.addNewStudent({ ...newStudent, ...newPass });
                            getAllStudentsFunction();
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
                        const { _id, __v, password, createdAt, updatedAt, ...newStudentCred } = newStudent;
                        const { data } = await AuthService.updateStudent(newStudent._id, newStudentCred);
                        dispatch(getStudentSuccess(data));
                        getAllStudentsFunction();
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
                    getAllStudentsFunction();
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
        <div className="students container" onClick={() => handleModal("more", null)}>
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-2xl">O'quvchilar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{students?.length}</span></p>
                </div>
                <button onClick={() => {
                    handleModal("modal", true);
                    handleModal("passModal", true);
                    handleModal("createModal", true);
                }} className="global_add_btn">Yangisini qo'shish</button>
            </div>

            <div className="flex items-center flex-wrap gap-4 py-5">
                {/* Search by */}
                <input
                    value={filters.searchBy}
                    onChange={handleFilterChange}
                    className="w-56 px-4 py-2 text-xs outline-cyan-600 border rounded"
                    type="text"
                    name="searchBy"
                    id="searchBy"
                    placeholder="Ism yoki telefon orqali qidirish" />

                {/* Courses */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="course"
                        className="absolute text-xs bg-white -top-1.5 left-3">
                        <span>Kurslar</span>
                    </label>
                    <select
                        value={filters.course}
                        onChange={handleFilterChange}
                        name="course"
                        id="course"
                        className="w-full p-2 text-sm rounded border outline-cyan-600">
                        <option
                            value=""
                            className="text-sm italic">
                            None
                        </option>
                        {
                            courses.map(course => (
                                <option
                                    key={course._id}
                                    value={course?.title}
                                    className="text-sm">
                                    {course?.title}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Start Date */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="start_date"
                        className="absolute text-xs bg-white -top-1.5 left-3">
                        <span>Boshlanish</span>
                    </label>
                    <input
                        value={filters.start_date}
                        onChange={handleFilterChange}
                        type="date"
                        name="start_date"
                        id="start_date"
                        className="w-full p-1.5 text-sm rounded border outline-cyan-600" />
                </div>

                {/* End Date */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="end_date"
                        className="absolute text-xs bg-white -top-1.5 left-3">
                        <span>Tugash</span>
                    </label>
                    <input
                        value={filters.end_date}
                        onChange={handleFilterChange}
                        type="date"
                        name="end_date"
                        id="end_date"
                        className="w-full p-1.5 text-sm rounded border outline-cyan-600" />
                </div>

                <button onClick={() => setFilters({ searchBy: "", course: "", start_date: "", end_date: "" })} className="border rounded p-2 text-sm text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-500 transition-all">Filterni tiklash</button>
            </div>

            <div className="max-h-[600px] overflow-auto pb-2 pr-2">
                <table className="w-full mt-4">
                    <thead className="sticky top-0 bg-white z-[1]">
                        <tr className="font-semibold text-xs flex text-left px-4 py-2">
                            <th className="w-[300px] text-left">Ism</th>
                            <th className="w-[180px] text-left">Telefon</th>
                            <th className="w-[200px] text-left">Guruhlar</th>
                            <th className="w-[180px] text-left">O'qituvchilar</th>
                            <th className="w-[200px] text-left">Mashg'ulotlar sanalari</th>
                            <th className="w-[120px] text-left">Balans</th>
                            <th className="w-[80px] text-center">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="grid grid-cols-1 2xsm:gap-4 py-4">
                        {isLoading ? <>
                            <tr className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                                <td className="w-[85%] h-4 rounded bg-gray-300"></td>
                                <td className="w-[50%] h-4 rounded bg-gray-300"></td>
                                <td className="w-[65%] h-4 rounded bg-gray-300"></td>
                            </tr>
                        </> : pageStudents.length > 0 ?
                            pageStudents.map((student, index) => (
                                <tr key={index} className="2xsm:w-full flex items-center capitalize text-sm border rounded-lg px-4 py-3 hover:shadow-md transition-all">
                                    <td className="w-[300px] text-left text-base hover:text-cyan-600">
                                        <NavLink to={`/admin/student-info/${student._id}`}>{student.first_name} {student.last_name}</NavLink>
                                    </td>
                                    <td
                                        onClick={() => handleCopy(student.contactNumber)}
                                        className="w-[180px] flex items-center gap-1 text-left text-sm text-blue-400">
                                        {student.contactNumber}
                                        <img
                                            src={copied === student.contactNumber ? tick : copy}
                                            alt="copy svg"
                                            className="cursor-pointer" />
                                    </td>
                                    <td className="w-[200px] text-left text-xs hover:text-cyan-600">
                                        <NavLink
                                            to={`/admin/group-info/${student.group?._id}`}
                                            className="flex items-center gap-1">
                                            <span className="bg-gray-200 p-1 rounded">{student.group?.name}</span>
                                            <span>{student.group?.course.title}</span>
                                            <span>({student.group?.start_time})</span>
                                        </NavLink>
                                    </td>
                                    <td className="w-[180px] text-left text-sm">
                                        {student.group?.teacher.first_name} {student.group?.teacher.last_name}
                                    </td>
                                    <td className="w-[200px] text-left text-xs">
                                        <div>
                                            <h1 className="flex items-center gap-1">
                                                {student.group?.start_date}
                                                <GoHorizontalRule />
                                            </h1>
                                            <h1>{student.group?.end_date}</h1>
                                        </div>
                                    </td>
                                    <td className="w-[120px] text-left text-xs">0 UZS</td>
                                    <td className="w-[80px] flex justify-center">
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
            </div>

            <Pagination
                students={filteredStudents}
                page={page}
                setPage={setPage}
                limit={limit}
            />

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