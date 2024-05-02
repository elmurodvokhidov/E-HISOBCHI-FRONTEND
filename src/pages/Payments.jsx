import { CiCoins1 } from "react-icons/ci";
import { GoHorizontalRule } from "react-icons/go";
import SplineChart from "../components/charts/SplineChart";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
    allStudentPayHistorySuccess,
    studentPayHistoryFailure,
    studentPayHistoryStart
} from "../redux/slices/studentPayHistory";
import AuthService from "../config/authService";
import {
    allGroupSuccess,
    groupFailure,
    groupStart
} from "../redux/slices/groupSlice";
import {
    allCourseSuccess,
    courseFailure,
    courseStart
} from "../redux/slices/courseSlice";
import { allTeacherSuccess, teacherFailure, teacherStart } from "../redux/slices/teacherSlice";
import { NavLink } from "react-router-dom";

export default function Payments() {
    const { studentPayHistory, isLoading } = useSelector(state => state.studentPayHistory);
    const { groups } = useSelector(state => state.group);
    const { courses } = useSelector(state => state.course);
    const { teachers } = useSelector(state => state.teacher);
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({
        searchBy: "",
        amount: "",
        course: "",
        group: "",
        teacher: "",
        method: "",
        start_date: "",
        end_date: ""
    });

    // Barcha o'quvchilar to'lov tarixini olish funksiyasi
    const getAllStudentPayHistoryFunction = async () => {
        try {
            dispatch(studentPayHistoryStart());
            const { data } = await AuthService.getStudentPayHistory();
            dispatch(allStudentPayHistorySuccess(data));
        } catch (error) {
            dispatch(studentPayHistoryFailure(error.message));
        }
    };

    useEffect(() => {
        // Barcha guruhlarni olish
        const getAllGroupsFunction = async () => {
            try {
                dispatch(groupStart());
                const { data } = await AuthService.getAllGroups();
                dispatch(allGroupSuccess(data));
            } catch (error) {
                dispatch(groupFailure(error.message));
            }
        };

        // Barcha kurslarni olish
        const getAllCoursesFunction = async () => {
            try {
                dispatch(courseStart());
                const { data } = await AuthService.getAllCourses();
                dispatch(allCourseSuccess(data));
            } catch (error) {
                dispatch(courseFailure(error.message));
            }
        };

        // Barcha o'qituvchilarni olish
        const getAllTeachersFunction = async () => {
            try {
                dispatch(teacherStart());
                const { data } = await AuthService.getAllTeachers();
                dispatch(allTeacherSuccess(data));
            } catch (error) {
                dispatch(teacherFailure(error.message));
            }
        };

        getAllGroupsFunction();
        getAllCoursesFunction();
        getAllTeachersFunction();
        getAllStudentPayHistoryFunction();
    }, []);

    // Filterlash uchun qiymat olish
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // O'quvchilarni to'lov tarixini filterlash funksiyasi
    const filteredStudentPayHistory = studentPayHistory.filter(pay => {
        return Object.entries(filters).every(([key, value]) => {
            if (value === "") return true;

            if (key === "searchBy") {
                return pay.studentId?.first_name.toLowerCase().includes(value.toLowerCase().trim()) || pay.studentId?.last_name.toLowerCase().includes(value.toLowerCase().trim()) || pay.studentId?.contactNumber.toString().includes(value.toString().trim());
            }

            if (key === "amount") {
                return pay.amount.toString().includes(value.toString().trim());
            }

            if (key === "course") {
                return pay.studentId?.group?.course?._id === value;
            }

            if (key === "group") {
                return pay.studentId?.group?._id === value;
            }

            if (key === "teacher") {
                return pay.studentId?.group?.teacher?._id === value;
            }

            if (key === "method") {
                return pay.method === value;
            }

            if (key === 'start_date' || key === 'end_date') {
                const studentPayDate = new Date(pay.date);
                const filterStartDate = new Date(filters['start_date']);
                const filterEndDate = new Date(filters['end_date']);

                if (filters['start_date'] && filters['end_date']) {
                    return studentPayDate >= filterStartDate && studentPayDate <= filterEndDate;
                }
                else if (filters['start_date']) {
                    return studentPayDate >= filterStartDate;
                }
                else if (filters['end_date']) {
                    return studentPayDate <= filterEndDate;
                }
                else {
                    return true;
                }
            }


            return student[key] === value;
        });
    });

    return (
        <div className="container flex flex-col gap-6">
            <h1 className="text-2xl">Barcha to'lovlar</h1>
            <div className="lg:flex gap-10">
                <div className="w-fit flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-6 relative rounded before:w-1 before:h-full before:absolute before:rounded-lg before:bg-cyan-600 bg-white shadow-md text-base">
                        <div className="my-3 ml-5">
                            <div className="flex items-center gap-2">
                                <h1 className="flex gap-2">
                                    <span>To'lovlar miqdori:</span>
                                    <span>
                                        {studentPayHistory.reduce((total, pay) => total + pay.amount, 0).toLocaleString()}
                                    </span>
                                    <span>UZS</span>
                                </h1>
                                <span>(2024-04-04</span>
                            </div>
                            <h1 className="flex items-center"><GoHorizontalRule />2024-05-04)</h1>
                        </div>

                        <CiCoins1 className="text-3xl text-cyan-600 mr-4" />
                    </div>

                    <div className="flex items-center justify-between gap-6 relative rounded before:w-1 before:h-full before:absolute before:rounded-lg before:bg-cyan-600 bg-white shadow-md text-base">
                        <div className="my-3 ml-5">
                            <div className="flex items-center gap-2">
                                <h1 className="flex gap-2">
                                    <span>Sof foyda miqdori:</span>
                                    <span>
                                        {studentPayHistory.reduce((total, pay) => total + pay.amount, 0).toLocaleString()}
                                    </span>
                                    <span>UZS</span>
                                </h1>
                                <span>(2024-04-04</span>
                            </div>
                            <h1 className="flex items-center"><GoHorizontalRule />2024-05-04)</h1>
                        </div>

                        <CiCoins1 className="text-3xl text-cyan-600 mr-4" />
                    </div>

                    <ul className="list-disc rounded shadow-md py-6 px-12 text-sm bg-white">
                        <li>Naqd pul: <span>
                            {
                                studentPayHistory.filter(item => item.method === "cash")
                                    .reduce((total, pay) => total + pay.amount, 0)
                                    .toLocaleString()
                            }
                        </span> UZS</li>
                        <li>Plastik kartasi: <span>
                            {
                                studentPayHistory.filter(item => item.method === "card")
                                    .reduce((total, pay) => total + pay.amount, 0)
                                    .toLocaleString()
                            }
                        </span> UZS</li>
                        <li>Jami tushumlar: <span>{studentPayHistory.reduce((total, pay) => total + pay.amount, 0).toLocaleString()}</span> UZS</li>
                    </ul>
                </div>

                <div className="lg:w-3/5 w-full shadow-md">
                    <SplineChart />
                </div>
            </div>

            <div className="mt-6">
                {/* filter */}
                <div className="flex items-center flex-wrap gap-4 py-5">
                    {/* Search by */}
                    <input
                        value={filters.searchBy}
                        onChange={handleFilterChange}
                        className="w-48 p-2 text-xs outline-cyan-600 border rounded bg-[#f8f8f8]"
                        type="text"
                        name="searchBy"
                        id="searchBy"
                        placeholder="Ism yoki telefon orqali qidirish" />

                    {/* Amount */}
                    <input
                        value={filters.amount}
                        onChange={handleFilterChange}
                        className="w-36 p-2 text-xs outline-cyan-600 border rounded bg-[#f8f8f8]"
                        type="text"
                        name="amount"
                        id="amount"
                        placeholder="Sum"
                    />

                    {/* Courses */}
                    <div className="w-28 relative text-gray-500">
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
                                        key={course?._id}
                                        value={course?._id}
                                        className="text-sm">
                                        {course?.title}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Groups */}
                    <div className="w-28 relative text-gray-500">
                        <label
                            htmlFor="group"
                            className="absolute text-xs bg-[#f8f8f8] -top-1.5 left-3">
                            <span>Guruhlar</span>
                        </label>
                        <select
                            value={filters.group}
                            onChange={handleFilterChange}
                            name="group"
                            id="group"
                            className="w-full p-2 text-sm rounded border outline-cyan-600 bg-[#f8f8f8]">
                            <option
                                value=""
                                className="text-sm italic">
                                None
                            </option>
                            {
                                groups.map(group => (
                                    <option
                                        key={group?._id}
                                        value={group?._id}
                                        className="text-sm">
                                        {group?.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Teacher */}
                    <div className="w-28 relative text-gray-500">
                        <label
                            htmlFor="teacher"
                            className="absolute text-xs bg-[#f8f8f8] -top-1.5 left-3">
                            <span>O'qituvchi</span>
                        </label>
                        <select
                            value={filters.teacher}
                            onChange={handleFilterChange}
                            name="teacher"
                            id="teacher"
                            className="w-full p-2 text-sm rounded border outline-cyan-600 bg-[#f8f8f8]">
                            <option
                                value=""
                                className="text-sm italic">
                                None
                            </option>
                            {
                                teachers.map(teacher => (
                                    <option
                                        key={teacher?._id}
                                        value={teacher?._id}
                                        className="text-sm">
                                        {teacher?.first_name + " "}
                                        {teacher?.last_name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Mehtod */}
                    <div className="w-28 relative text-gray-500">
                        <label
                            htmlFor="method"
                            className="absolute text-xs bg-[#f8f8f8] -top-1.5 left-3">
                            <span>To'lov turi</span>
                        </label>
                        <select
                            value={filters.method}
                            onChange={handleFilterChange}
                            name="method"
                            id="method"
                            className="w-full p-2 text-sm rounded border outline-cyan-600 bg-[#f8f8f8]">
                            <option
                                value=""
                                className="text-sm italic">
                                None
                            </option>
                            <option
                                value="cash"
                                className="text-sm">
                                Cash
                            </option>
                            <option
                                value="card"
                                className="text-sm">
                                Card
                            </option>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="relative text-gray-500">
                        <label
                            htmlFor="start_date"
                            className="absolute text-xs bg-[#f8f8f8] -top-1.5 left-3">
                            <span>Sanadan</span>
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
                            <span>Sanagacha</span>
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
                        onClick={() => setFilters({
                            searchBy: "",
                            amount: "",
                            course: "",
                            group: "",
                            teacher: "",
                            method: "",
                            start_date: "",
                            end_date: ""
                        })}
                        className="border rounded p-2 text-sm text-gray-700 bg-[#f8f8f8] hover:bg-gray-100 hover:text-gray-500 transition-all"
                    >
                        Filterni tiklash
                    </button>
                </div>

                {/* Barcha to'lovlar */}
                <div className="px-6 py-8 overflow-x-auto rounded shadow-md bg-white">
                    <div className="flex justify-between pb-2 border-b border-b-gray-200 font-semibold text-sm">
                        <h4 className="min-w-[100px] text-sm">Sana</h4>
                        <h4 className="min-w-[200px] text-base">O'quvchi ismi</h4>
                        <h4 className="min-w-[150px] text-base">Sum</h4>
                        <h4 className="min-w-[100px] text-sm capitalize">To'lov turi</h4>
                        <h4 className="min-w-[200px] text-base">O'qituvchi</h4>
                        <h4 className="min-w-[100px] text-sm">Guruh</h4>
                        <h4 className="min-w-[400px] text-sm">Izoh</h4>
                    </div>

                    <div>
                        {
                            filteredStudentPayHistory.map(pay => (
                                <div
                                    key={pay._id}
                                    className="flex justify-between py-2 border-b border-b-gray-200 last:border-b-0"
                                >
                                    <h4 className="min-w-[100px] text-sm">{pay.date}</h4>
                                    <h4 className="min-w-[200px] text-base">
                                        <NavLink
                                            to={`/admin/student-info/${pay.studentId?._id}`}
                                            className="hover:text-cyan-500"
                                        >
                                            {pay.studentId?.first_name + " "}
                                            {pay.studentId?.last_name}
                                        </NavLink>
                                    </h4>
                                    <h4 className="min-w-[150px] text-base">
                                        {pay.amount.toLocaleString()}
                                        <span className="text-xs"> UZS</span>
                                    </h4>
                                    <h4 className="min-w-[100px] text-sm capitalize">{pay.method}</h4>
                                    <h4 className="min-w-[200px] text-base">
                                        {pay.studentId?.group?.teacher?.first_name + " "}
                                        {pay.studentId?.group?.teacher?.last_name}
                                    </h4>
                                    <h4 className="min-w-[100px] text-sm">
                                        <span className="bg-gray-200 p-1 rounded">{pay.studentId?.group?.name}</span>
                                    </h4>
                                    <h4 className="min-w-[400px] text-sm">{pay.description}</h4>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};