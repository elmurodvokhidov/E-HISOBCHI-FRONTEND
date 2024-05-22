import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastLeft } from "../../config/sweetToast";
import {
    allStudentSuccess,
    getStudentSuccess,
    studentFailure,
    studentStart
} from "../../redux/slices/studentSlice";
import AuthService from "../../config/authService";
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
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";
import * as XLSX from 'xlsx';
import { FormattedDate } from "../../components/FormattedDate";
import { RxEnvelopeClosed } from "react-icons/rx";
import { IoRemoveOutline } from "react-icons/io5";

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
        dob: "",
        phoneNumber: "",
        fatherPhoneNumber: "",
        motherPhoneNumber: "",
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
    const [checkedStudentsList, setCheckedStudentsList] = useState([]);

    // Barcha o'quvchilarni olish
    const getAllStudentsFunction = async () => {
        try {
            dispatch(studentStart());
            const { data } = await AuthService.getAllStudents();
            dispatch(allStudentSuccess(data));
        } catch (error) {
            dispatch(studentFailure(error.message));
        }
    };

    // Barcha guruhlarni olish
    const getAllGroupsFunc = async () => {
        try {
            dispatch(groupStart());
            const { data } = await AuthService.getAllGroups();
            dispatch(allGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.message));
        }
    };

    // Barcha kurslarni olish
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

    // Matnni nusxalash funksiyasi
    const handleCopy = (text) => {
        setCopied(text);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            setCopied("");
        }, 3000);
    };

    // Filterlash uchun qiymat olish
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
                return student.first_name.toLowerCase().includes(value.toLowerCase().trim()) || student.last_name.toLowerCase().includes(value.toLowerCase().trim()) || student.phoneNumber.toString().includes(value.toString().trim());
            };

            if (key === "course") {
                return student?.group?.course?.title === value;
            };

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
            };


            return student[key] === value;
        });
    });

    // Pagination
    const indexOfLastStudent = page * limit;
    const indexOfFirstStudent = indexOfLastStudent - limit;
    const pageStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    // Barcha o'quvchilar ma'lumotlarini exel fayli sifatida yuklab olish funksiyasi
    const exportToExcel = () => {
        const fileName = 'students.xlsx';
        const header = ['Ism', 'Familya', 'Otasining ismi', 'Onasining ismi', 'Tug\'ilgan sana', 'Telefon', 'Otasining raqami', 'Onasining raqami', 'Jins', 'Guruh'];

        const wb = XLSX.utils.book_new();
        const data = filteredStudents.map(student => [
            student.first_name || '',
            student.last_name || '',
            student.father_name || '',
            student.mother_name || '',
            student.dob || '',
            (student.phoneNumber || '').toString(),
            (student.fatherPhoneNumber || '').toString(),
            (student.motherPhoneNumber || '').toString(),
            student.gender || '',
            student.group.name || ''
        ]);
        data.unshift(header);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex]).length), 0)
        }));
        ws['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        XLSX.writeFile(wb, fileName);
    };

    // Modal state-ni optimal tarzda o'zgartirish
    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    // Input, modal, newStudent qiymatlarini tozalash
    const clearModal = () => {
        setNewStudent({
            first_name: "",
            last_name: "",
            father_name: "",
            mother_name: "",
            dob: "",
            phoneNumber: "",
            fatherPhoneNumber: "",
            motherPhoneNumber: "",
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
        });
    };

    // O'quvchini tahrirlash uchun, modal oynani ochish funksiyasi
    const openModal = (student) => {
        setNewStudent(student);
        handleModal("modal", true);
        handleModal("createModal", false);
    };

    // Yangi o'quvchi qo'shish hamda o'quvchini tahrirlash funksiyasi
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
                    Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                }
            }
            else {
                dispatch(studentFailure());
                ToastLeft.fire({
                    icon: "error",
                    title: "Parol 8 ta belgidan kam bo'lmasligi kerak!"
                });
            }
        }
        else {
            if (
                newStudent.first_name !== "" &&
                newStudent.last_name !== "" &&
                newStudent.gender !== "" &&
                newStudent.phoneNumber !== ""
            ) {
                dispatch(studentStart());
                try {
                    // yangi o'quvchi qo'shish
                    if (!newStudent._id) {
                        if (newPass.newPassword.length >= 8) {
                            const { data } = await AuthService.addNewStudent({ ...newStudent, ...newPass });
                            await AuthService.caclStudentBalance();
                            getAllStudentsFunction();
                            clearModal();
                            Toast.fire({
                                icon: "success",
                                title: data.message
                            });
                        } else {
                            dispatch(studentFailure());
                            ToastLeft.fire({
                                icon: "error",
                                title: "Parol 8 ta belgidan kam bo'lmasligi kerak!"
                            });
                        }
                    } else {
                        // o'quvchi ma'lumotlarini o'zgartirish
                        const { _id, __v, password, createdAt, updatedAt, ...newStudentCred } = newStudent;
                        const { data } = await AuthService.updateStudent(newStudent._id, newStudentCred);
                        await AuthService.caclStudentBalance();
                        dispatch(getStudentSuccess(data));
                        getAllStudentsFunction();
                        clearModal();
                        Toast.fire({
                            icon: "success",
                            title: data.message
                        });
                    }
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                }
            }
            else {
                ToastLeft.fire({
                    icon: "error",
                    title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
                });
            }
        }
    };

    // O'quvchini o'chirish funksiyasi
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

    // O'chirilishi kerak bo'lgan o'quvchilarni belgilash funksiyasi
    const settingDeletionStudents = (id) => {
        // Agar berilgan id allaqachon ro'yhatda bo'lsa, u holda uni ro'yhatda o'chirish
        if (checkedStudentsList.includes(id)) {
            setCheckedStudentsList(prevList => prevList.filter(studentId => studentId !== id));
        } else {
            // Agar berilgan id ro'yhatda bo'lmasa, u holda uni ro'yhatga qo'shish
            setCheckedStudentsList(prevList => [...prevList, id]);
        }
    };

    // Bir nechta o'quvchilarni bir vaqtni o'zida o'chirish funksiyasi
    const deleteManyStudents = async (e) => {
        e.preventDefault();
        if (filteredStudents.length > 0) {
            if (checkedStudentsList.length > 0) {
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
                        AuthService.deleteManyStudent(checkedStudentsList).then((res) => {
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
            }
            else {
                Toast.fire({
                    icon: "error",
                    title: "O'chirish uchun o'quvchi tanlanmadi!"
                });
            }
        }
        else {
            Toast.fire({
                icon: "error",
                title: "O'quvchi mavjud emas!"
            });
        }
    };

    return (
        <div
            className="students container"
            onClick={() => handleModal("more", null)}
            style={{ paddingLeft: 0, paddingRight: 0 }}
        >
            <div className="sm:flex justify-between relative px-[40px]">
                <div className="flex items-end gap-4 text-sm">
                    <h1 className="capitalize text-2xl">O'quvchilar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{students?.length}</span></p>
                </div>
                <button onClick={() => {
                    handleModal("modal", true);
                    handleModal("passModal", true);
                    handleModal("createModal", true);
                }} className="global_add_btn 2xsm:w-full 2xsm:mt-4 2xsm:py-2 sm:w-fit sm:mt-0 sm:py-0">
                    Yangisini qo'shish
                </button>
            </div>

            {/* filters */}
            <div className="flex items-center flex-wrap gap-4 py-5 px-[40px]">
                {/* Search by */}
                <input
                    value={filters.searchBy}
                    onChange={handleFilterChange}
                    className="w-56 px-4 py-2 text-xs outline-cyan-600 border rounded bg-[#f8f8f8]"
                    type="text"
                    name="searchBy"
                    id="searchBy"
                    placeholder="Ism yoki telefon orqali qidirish" />

                {/* Courses */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="course"
                        className="absolute text-xs bg-[#f8f8f8] -top-1.5 left-3">
                        <span>Kurslar</span>
                    </label>
                    <select
                        value={filters.course}
                        onChange={handleFilterChange}
                        name="course"
                        id="course"
                        className="w-full p-2 text-sm rounded border outline-cyan-600 bg-[#f8f8f8]">
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
                        className="absolute text-xs bg-[#f8f8f8] -top-1.5 left-3">
                        <span>Boshlanish</span>
                    </label>
                    <input
                        value={filters.start_date}
                        onChange={handleFilterChange}
                        type="date"
                        name="start_date"
                        id="start_date"
                        className="w-full p-1.5 text-sm rounded border outline-cyan-600 bg-[#f8f8f8]" />
                </div>

                {/* End Date */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="end_date"
                        className="absolute text-xs bg-[#f8f8f8] -top-1.5 left-3">
                        <span>Tugash</span>
                    </label>
                    <input
                        value={filters.end_date}
                        onChange={handleFilterChange}
                        type="date"
                        name="end_date"
                        id="end_date"
                        className="w-full p-1.5 text-sm rounded border outline-cyan-600 bg-[#f8f8f8]" />
                </div>

                <button
                    onClick={() => setFilters({ searchBy: "", course: "", start_date: "", end_date: "" })}
                    className="border rounded p-2 text-sm text-gray-700 bg-[#f8f8f8] hover:bg-gray-100 hover:text-gray-500 transition-all outline-cyan-600"
                >
                    Filterni tiklash
                </button>
            </div>

            <div className="max-h-[600px] min-h-[200px] overflow-auto pb-16 px-[40px]">
                <table className="w-full mt-4">
                    <thead className="sticky top-0 bg-[#f8f8f8] z-[1]">
                        <tr className="font-semibold text-xs flex text-left px-4 py-2">
                            <th className="w-fit mr-4">
                                <input
                                    disabled={filteredStudents.length === 0}
                                    checked={filteredStudents.length > 0 && filteredStudents.every(student => checkedStudentsList.includes(student._id))}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            // Agar input belgilansa, barcha idlarni ro'yxatga saqlash
                                            setCheckedStudentsList(filteredStudents.map(student => student._id));
                                        } else {
                                            // Agar input belgilanmagan bo'lsa, ro'yxatni tozalash
                                            setCheckedStudentsList([]);
                                        }
                                    }}
                                    type="checkbox"
                                    className="align-middle"
                                />
                            </th>
                            <th className="w-[300px] text-left">Ism</th>
                            <th className="w-[180px] text-left">Telefon</th>
                            <th className="w-[200px] text-left">Guruhlar</th>
                            <th className="w-[180px] text-left">O'qituvchilar</th>
                            <th className="w-[200px] text-left">Mashg'ulotlar sanalari</th>
                            <th className="w-[120px] text-left">Balans</th>
                            <th className="w-[80px] text-center">
                                <div className="flex items-center gap-4">
                                    <button className="size-6 flex items-center justify-center text-sm border rounded-full text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300">
                                        <RxEnvelopeClosed />
                                    </button>
                                    <button onClick={deleteManyStudents} className="size-6 flex items-center justify-center text-sm border rounded-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="grid grid-cols-1 2xsm:gap-4 py-4">
                        {isLoading ? <>
                            <tr className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse]">
                                <td className="w-[85%] h-4 rounded bg-gray-300"></td>
                                <td className="w-[50%] h-4 rounded bg-gray-300"></td>
                                <td className="w-[65%] h-4 rounded bg-gray-300"></td>
                            </tr>
                        </> : pageStudents.length > 0 ?
                            pageStudents.map((student, index) => (
                                <tr key={index} className="2xsm:w-full flex items-center capitalize text-sm border rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all">
                                    <td className="w-fit mr-4">
                                        <input
                                            checked={checkedStudentsList.includes(student._id)}
                                            onChange={() => settingDeletionStudents(student._id)}
                                            type="checkbox"
                                            className="align-middle"
                                        />
                                    </td>
                                    <td className="w-[300px] text-left text-base hover:text-cyan-600">
                                        <NavLink to={`/admin/student-info/${student._id}`}>{student.first_name} {student.last_name}</NavLink>
                                    </td>
                                    <td
                                        onClick={() => handleCopy(student.phoneNumber)}
                                        className="w-[180px] flex items-center gap-1 text-left text-sm cursor-pointer text-blue-400">
                                        {student.phoneNumber}
                                        <img
                                            src={copied === student.phoneNumber ? tick : copy}
                                            alt="copy svg"
                                            className="cursor-pointer" />
                                    </td>
                                    <td className="w-[200px] text-left text-xs hover:text-cyan-600">
                                        {
                                            student?.group ? <>
                                                <NavLink
                                                    to={`/admin/group-info/${student.group?._id}`}
                                                    className="flex items-center gap-1">
                                                    <span className="bg-gray-200 p-1 rounded">{student.group?.name}</span>
                                                    <span>{student.group?.course.title}</span>
                                                    <span>({student.group?.start_time})</span>
                                                </NavLink>
                                            </> : <>
                                                <GoHorizontalRule />
                                            </>
                                        }
                                    </td>
                                    <td className="w-[180px] text-left text-sm">
                                        {
                                            student?.group ? <>
                                                {student.group?.teacher.first_name} {student.group?.teacher.last_name}
                                            </> : <>
                                                <GoHorizontalRule className="text-xs" />
                                            </>
                                        }
                                    </td>
                                    <td className="w-[200px] text-left text-xs">
                                        {
                                            student?.group ?
                                                <div>
                                                    <h1 className="flex items-center gap-1">
                                                        <FormattedDate date={student.group?.start_date} />
                                                        <GoHorizontalRule />
                                                    </h1>
                                                    <FormattedDate date={student.group?.end_date} />
                                                </div> :
                                                <IoRemoveOutline />
                                        }
                                    </td>
                                    <td className="w-[120px] text-left text-xs">
                                        {Math.round(student.balance).toLocaleString()} UZS
                                    </td>
                                    <td className="w-[80px] flex justify-center">
                                        {/* more button */}
                                        <div onClick={(e) => {
                                            e.stopPropagation()
                                            handleModal("more", student._id)
                                        }} className="relative cursor-pointer text-cyan-600 text-xl">
                                            <IoMdMore />
                                            {/* more btn modal */}
                                            <div className={`${modals.more === student._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
                                                <button
                                                    onClick={() => openModal(student)}
                                                    className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"
                                                >
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                                    </svg>
                                                    Tahrirlash
                                                </button>
                                                <button
                                                    onClick={() => deleteStudent(student._id)}
                                                    className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"
                                                >
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                                    </svg>
                                                    O'chirish
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )) : <tr className="mx-auto my-6"><td>O'quvchi mavjud emas!</td></tr>
                        }
                    </tbody>
                </table>
            </div>

            {
                !isLoading &&
                <Pagination
                    students={filteredStudents}
                    page={page}
                    setPage={setPage}
                    limit={limit}
                    exportToExcel={exportToExcel}
                />
            }

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