import { useEffect, useState } from "react";
import AuthService from "../config/authService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdCheck, MdClose, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Skeleton from "./loaders/Skeleton";
import { getCookie } from "../config/cookiesService";

export default function Attendance({ group, isLoading }) {
    const [today, setToday] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loadingCell, setLoadingCell] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 13;

    // Umumiy sahifalar sonini hisoblash
    const totalPages = Math.ceil(group.course_days.length / itemsPerPage);

    // Barcha davomat ro'yhatini olish funksiyasi
    const getAllAttendanceFunction = async () => {
        try {
            const res = await AuthService.getAllAttendance();
            setAttendance(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // Bugungi sanani olish
        const getCurrentDateFunction = async () => {
            try {
                const { data } = await AuthService.getCurrentDate();
                setToday(data.today);
                // Bugungi sana guruh kunlari ichida ekanligini tekshirish
                const todayIndex = group.course_days.findIndex(date => date >= data.today);
                // Agar guruh sanasi topilsa shu sana joylashgan pagination'ga o'tkazish
                if (todayIndex !== -1) {
                    setCurrentPage(Math.ceil((todayIndex + 1) / itemsPerPage));
                };
            } catch (error) {
                console.log(error);
            }
        };

        getCurrentDateFunction();
        getAllAttendanceFunction();
    }, []);

    // Handle check function
    const handleCheckboxChange = async (student, date, present) => {
        try {
            setLoadingCell({ student, date });
            await AuthService.checkAttendance({ student, date, present }, group._id);
            getAllAttendanceFunction();
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingCell(null);
        }
    };

    // Handle delete attendance
    const deleteAtdFunction = async (student, date) => {
        try {
            setLoadingCell({ student, date });
            await AuthService.deleteAttendance(student, date);
            getAllAttendanceFunction();
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingCell(null);
        }
    };

    // Checkbox or loading
    const renderCellContent = (id, date) => {
        const isLoading = loadingCell && loadingCell.student === id && loadingCell.date === date;

        return isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-sm m-auto" />
        ) : (
            <button
                disabled={getCookie("x-auth") === "admin" ? today < date : today !== date}
                onClick={() => deleteAtdFunction(id, date)}
                className={`w-4 h-4 flex items-center justify-center cursor-pointer m-auto text-white text-sm rounded disabled:bg-zinc-100 disabled:border-gray-300 ${attendance.some(attendanceRecord => attendanceRecord?.student?._id === id && attendanceRecord.date.slice(0, 10) === date && attendanceRecord.present === "was") ? 'bg-green-500' : attendance.some(attendanceRecord => attendanceRecord.student?._id === id && attendanceRecord.date.slice(0, 10) === date && attendanceRecord.present === "not") ? 'bg-red-500' : 'border border-gray-500'}`}
            >
                {
                    attendance.some(attendanceRecord => attendanceRecord.student?._id === id && attendanceRecord.date.slice(0, 10) === date && attendanceRecord.present === "was") ? <MdCheck /> : attendance.some(attendanceRecord => attendanceRecord.student?._id === id && attendanceRecord.date.slice(0, 10) === date && attendanceRecord.present === "not") ? <MdClose /> : ""
                }
            </button >
        );
    };

    // Pagination'da ko'rsatiladigan student'larni hisoblash funksiyasi
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDates = group.course_days.slice(indexOfFirstItem, indexOfLastItem);

    // Sanani tegishli oy nomi bilan formatlash funksiyasi
    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    return (
        <>
            {
                isLoading ?
                    <div className="2xsm:w-[900px] 2xl:w-full">
                        <Skeleton
                            parentWidth={100}
                            firstChildWidth={85}
                            secondChildWidth={50}
                            thirdChildWidth={65}
                        />
                    </div> : <>
                        <div className="2xsm:w-[900px] 2xl:w-full flex flex-col gap-5 border p-5 bg-white shadow-smooth rounded">
                            <h2 className="text-xl">Davomat</h2>
                            <table>
                                <thead>
                                    <tr className="text-sm [&>*]:pb-2">
                                        <td className="w-52 text-left">Ism</td>
                                        {currentDates.map(date => (
                                            <td className="w-20 text-center lowercase" key={date}>{formatDate(date)}</td>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        group.students.map(student => (
                                            <tr className="border-y last:border-b-0 [&>*]:py-2" key={student._id}>
                                                <td className="w-52 text-left text-sm">
                                                    <NavLink
                                                        to={`/${getCookie("x-auth")}/student-info/${student._id}`}
                                                        className="hover:text-cyan-600"
                                                    >
                                                        {student.first_name} {student.last_name}
                                                    </NavLink>
                                                </td>
                                                {currentDates.map(date => (
                                                    <td
                                                        key={date}
                                                        className={`${(getCookie("x-auth") === "admin" ? today < date : today !== date) ? '' : 'group'} w-20 text-center text-xl relative`}
                                                    >
                                                        {renderCellContent(student._id, date)}

                                                        <div className="atd_modal bg-gray-200 text-sm gap-2 p-2 rounded-md absolute -top-7 hidden group-hover:flex">
                                                            <button onClick={() => handleCheckboxChange(student._id, date, "was")}><MdCheck className="text-green-500" /></button>
                                                            <button onClick={() => handleCheckboxChange(student._id, date, "not")}><MdClose className="text-red-500" /></button>
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                            {/* Pagination buttons */}
                            <div className="flex items-center gap-4 text-xl text-gray-600 [&>*]:cursor-pointer">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className="hover:text-gray-800 transition-all"
                                >
                                    <MdSkipPrevious />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="hover:text-gray-800 transition-all"
                                    disabled={currentPage === totalPages}
                                >
                                    <MdSkipNext />
                                </button>
                            </div>
                        </div>
                    </>
            }
        </>
    )
};