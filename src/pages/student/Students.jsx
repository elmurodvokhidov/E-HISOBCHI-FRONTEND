import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastLeft } from "../../config/sweetToast";
import { allStudentSuccess, getStudentSuccess, studentFailure, studentStart } from "../../redux/slices/studentSlice";
import service from "../../config/service";
import { NavLink } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import StudentModal from "./StudentModal";
import Swal from "sweetalert2";
import { allGroupSuccess, groupFailure } from "../../redux/slices/groupSlice";
import Pagination from "../../components/Pagination";
import { GoHorizontalRule } from "react-icons/go";
import { allCourseSuccess, courseFailure } from "../../redux/slices/courseSlice";
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";
import * as XLSX from 'xlsx';
import { FormattedDate } from "../../components/FormattedDate";
import { RxEnvelopeClosed } from "react-icons/rx";
import { IoRemoveOutline } from "react-icons/io5";
import { Bin, Pencil } from "../../assets/icons/Icons";

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
            const { data } = await service.getAllStudents();
            dispatch(allStudentSuccess(data));
        } catch (error) {
            dispatch(studentFailure(error.message));
        }
    };

    // Barcha guruhlarni olish
    const getAllGroupsFunc = async () => {
        try {
            const { data } = await service.getAllGroups();
            dispatch(allGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.message));
        }
    };

    // Barcha kurslarni olish
    const getAllCoursesFunc = async () => {
        try {
            const { data } = await service.getAllCourses();
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

            if (key === "searchBy") return student?.first_name.toLowerCase().includes(value.toLowerCase().trim()) || student.last_name.toLowerCase().includes(value.toLowerCase().trim()) || student.phoneNumber.toString().includes(value.toString().trim());
            if (key === "course") return student?.group?.course?.title === value;

            if (key === 'start_date' || key === 'end_date') {
                const studentStartDate = new Date(student?.group?.start_date);
                const studentEndDate = new Date(student?.group?.end_date);
                const filterStartDate = new Date(filters['start_date']);
                const filterEndDate = new Date(filters['end_date']);

                if (filters['start_date'] && filters['end_date']) return studentStartDate >= filterStartDate && studentEndDate <= filterEndDate;
                else if (filters['start_date']) return studentStartDate >= filterStartDate;
                else if (filters['end_date']) return studentEndDate <= filterEndDate;
                else return true;

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
        const header = ["Ism", "Familya", "Otasining ismi", "Onasining ismi", "Tug'ilgan sana", "Telefon", "Otasining raqami", "Onasining raqami", "Guruh nomi"];

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
        setNewStudent({ ...student, group: student?.group?._id });
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
                    const { data } = await service.updateStudentPass({ ...newPass, id: newStudent._id });
                    dispatch(getStudentSuccess(data));
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                }
            }
            else {
                dispatch(studentFailure());
                ToastLeft.fire({ icon: "error", title: "Parol 8 ta belgidan kam bo'lmasligi kerak!" });
            }
        }
        else {
            if (
                newStudent.first_name !== "" &&
                newStudent.last_name !== "" &&
                newStudent.phoneNumber !== ""
            ) {
                dispatch(studentStart());
                try {
                    // yangi o'quvchi qo'shish
                    if (!newStudent._id) {
                        if (newPass.newPassword.length >= 8) {
                            const { data } = await service.addNewStudent({ ...newStudent, ...newPass });
                            await service.caclStudentBalance();
                            getAllStudentsFunction();
                            clearModal();
                            Toast.fire({ icon: "success", title: data.message });
                        } else {
                            dispatch(studentFailure());
                            ToastLeft.fire({ icon: "error", title: "Parol 8 ta belgidan kam bo'lmasligi kerak!" });
                        }
                    } else {
                        // o'quvchi ma'lumotlarini o'zgartirish
                        const { _id, __v, createdAt, updatedAt, ...newStudentCred } = newStudent;
                        const { data } = await service.updateStudent(newStudent._id, newStudentCred);
                        await service.caclStudentBalance();
                        dispatch(getStudentSuccess(data));
                        getAllStudentsFunction();
                        clearModal();
                        Toast.fire({ icon: "success", title: data.message });
                    }
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "error", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
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
                service.deleteStudent(id).then((res) => {
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
                        service.deleteManyStudent(checkedStudentsList).then((res) => {
                            getAllStudentsFunction();
                            Toast.fire({ icon: "success", title: res?.data.message });
                        }).catch((error) => {
                            dispatch(studentFailure(error.response?.data.message));
                            ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                        });
                    }
                });
            }
            else {
                Toast.fire({ icon: "error", title: "O'chirish uchun o'quvchi tanlanmadi!" });
            }
        }
        else {
            Toast.fire({ icon: "error", title: "O'quvchi mavjud emas!" });
        }
    };

    return (
        <div
            className="students container"
            onClick={() => handleModal("more", null)}
            style={{ paddingLeft: 0, paddingRight: 0 }}
        >
            <div className="sm:flex justify-between relative px-[40px]">
                <div className="flex items-end gap-4 text-sm pc:text-base">
                    <h1 className="capitalize text-2xl pc:text-3xl">O'quvchilar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{students?.length}</span></p>
                </div>
                <button onClick={() => {
                    handleModal("modal", true);
                    handleModal("passModal", true);
                    handleModal("createModal", true);
                }} className="global_add_btn small:w-full small:mt-4 small:py-2 sm:w-fit sm:mt-0 sm:py-0">
                    Yangisini qo'shish
                </button>
            </div>

            {/* filters */}
            <div className="flex items-center flex-wrap gap-4 py-5 px-[40px]">
                {/* Search by */}
                <input
                    value={filters.searchBy}
                    onChange={handleFilterChange}
                    className="w-56 pc:w-64 px-4 py-2 text-xs pc:text-lg outline-main-1 border rounded bg-main-2"
                    type="text"
                    name="searchBy"
                    id="searchBy"
                    placeholder="Ism yoki telefon orqali qidirish" />

                {/* Courses */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="course"
                        className="absolute text-xs pc:text-base bg-main-2 -top-1.5 pc:-top-3 left-3">
                        <span>Kurslar</span>
                    </label>
                    <select
                        value={filters.course}
                        onChange={handleFilterChange}
                        name="course"
                        id="course"
                        className="w-full p-2 text-sm pc:text-lg rounded border outline-main-1 bg-main-2">
                        <option
                            value=""
                            className="text-sm pc:text-lg italic">
                            None
                        </option>
                        {
                            courses.map(course => (
                                <option
                                    key={course._id}
                                    value={course?.title}
                                    className="text-sm pc:text-lg">
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
                        className="absolute text-xs pc:text-base bg-main-2 -top-1.5 pc:-top-3 left-3">
                        <span>Boshlanish</span>
                    </label>
                    <input
                        value={filters.start_date}
                        onChange={handleFilterChange}
                        type="date"
                        name="start_date"
                        id="start_date"
                        className="w-full p-1.5 text-sm pc:text-lg rounded border outline-main-1 bg-main-2" />
                </div>

                {/* End Date */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="end_date"
                        className="absolute text-xs pc:text-base bg-main-2 -top-1.5 pc:-top-3 left-3">
                        <span>Tugash</span>
                    </label>
                    <input
                        value={filters.end_date}
                        onChange={handleFilterChange}
                        type="date"
                        name="end_date"
                        id="end_date"
                        className="w-full p-1.5 text-sm pc:text-lg rounded border outline-main-1 bg-main-2" />
                </div>

                <button
                    onClick={() => setFilters({ searchBy: "", course: "", start_date: "", end_date: "" })}
                    className="border rounded p-2 text-sm pc:text-lg text-gray-700 bg-main-2 hover:bg-gray-100 hover:text-gray-500 transition-all outline-main-1"
                >
                    Filterni tiklash
                </button>
            </div>

            <div className="max-h-[600px] min-h-[200px] overflow-auto pb-16 px-[40px]">
                <table className="w-full mt-4">
                    <thead className="sticky top-0 bg-main-2 z-[1]">
                        <tr className="font-semibold text-xs pc:text-base flex text-left px-4 py-2">
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
                            <th className="w-[300px] pc:w-[350px] text-left">Ism</th>
                            <th className="w-[180px] pc:w-[230px] text-left">Telefon</th>
                            <th className="w-[200px] pc:w-[250px] text-left">Guruhlar</th>
                            <th className="w-[180px] pc:w-[230px] text-left">O'qituvchilar</th>
                            <th className="w-[200px] pc:w-[250px] text-left">Mashg'ulotlar sanalari</th>
                            <th className="w-[120px] pc:w-[170px] text-left">Balans</th>
                            <th className="w-[80px] pc:w-[130px] text-center">
                                <div className="flex items-center gap-4">
                                    <button className="size-6 pc:size-8 flex items-center justify-center text-sm pc:text-base border rounded-full text-main-1 border-main-1 hover:bg-main-1 hover:text-white transition-all duration-300">
                                        <RxEnvelopeClosed />
                                    </button>
                                    <button onClick={deleteManyStudents} className="size-6 pc:size-8 flex items-center justify-center text-sm pc:text-base border rounded-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-all duration-300">
                                        <Bin />
                                    </button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="grid grid-cols-1 small:gap-4 py-4">
                        {isLoading ? <>
                            <tr className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse">
                                <td className="w-[85%] h-4 rounded bg-gray-300"></td>
                                <td className="w-[50%] h-4 rounded bg-gray-300"></td>
                                <td className="w-[65%] h-4 rounded bg-gray-300"></td>
                            </tr>
                        </> : pageStudents.length > 0 ?
                            pageStudents.map((student, index) => (
                                <tr key={index} className={`${student.balance < 0 && 'bg-red-100'} small:w-full flex items-center capitalize text-sm pc:text-base border rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all`}>
                                    <td className="w-fit mr-4">
                                        <input
                                            checked={checkedStudentsList.includes(student._id)}
                                            onChange={() => settingDeletionStudents(student._id)}
                                            type="checkbox"
                                            className="align-middle"
                                        />
                                    </td>
                                    <td className="w-[300px] pc:w-[350px] text-left text-base pc:text-lg hover:text-main-1">
                                        <NavLink to={`/student-info/${student._id}`}>{student.first_name} {student.last_name}</NavLink>
                                    </td>
                                    <td
                                        onClick={() => handleCopy(student.phoneNumber)}
                                        className="w-[180px] pc:w-[230px] flex items-center gap-1 text-left text-sm pc:text-base cursor-pointer text-blue-400">
                                        {student.phoneNumber}
                                        <img
                                            src={copied === student.phoneNumber ? tick : copy}
                                            alt="copy svg"
                                            className="cursor-pointer" />
                                    </td>
                                    <td className="w-[200px] pc:w-[250px] text-left text-xs pc:text-base hover:text-main-1">
                                        {
                                            student?.group ? <>
                                                <NavLink
                                                    to={`/group-info/${student.group?._id}`}
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
                                    <td className="w-[180px] pc:w-[230px] text-left text-sm pc:text-base">
                                        {
                                            student?.group ? <>
                                                {student.group?.teacher.first_name} {student.group?.teacher.last_name}
                                            </> : <>
                                                <GoHorizontalRule className="text-xs pc:text-base" />
                                            </>
                                        }
                                    </td>
                                    <td className="w-[200px] pc:w-[250px] text-left text-xs pc:text-base">
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
                                    <td className="w-[120px] pc:w-[170px] text-left text-xs pc:text-base">
                                        {Math.round(student.balance).toLocaleString()} UZS
                                    </td>
                                    <td className="w-[80px] pc:w-[130px] flex justify-center">
                                        {/* more button */}
                                        <div onClick={(e) => {
                                            e.stopPropagation()
                                            handleModal("more", student._id)
                                        }} className="relative cursor-pointer text-main-1 text-xl">
                                            <IoMdMore />
                                            {/* more btn modal */}
                                            <div className={`${modals.more === student._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute small:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] pc:text-base bg-white`}>
                                                <button
                                                    onClick={() => openModal(student)}
                                                    className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"
                                                >
                                                    <Pencil />
                                                    Tahrirlash
                                                </button>
                                                <button
                                                    onClick={() => deleteStudent(student._id)}
                                                    className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"
                                                >
                                                    <Bin />
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