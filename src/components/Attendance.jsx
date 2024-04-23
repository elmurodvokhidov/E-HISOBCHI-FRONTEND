import { useEffect, useState } from "react";
import AuthService from "../config/authService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdCheck, MdClose, MdSkipNext, MdSkipPrevious } from "react-icons/md";

export default function Attendance({ start, end, day, students, groupId }) {
    const [attendance, setAttendance] = useState([]);
    const [loadingCell, setLoadingCell] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 13;

    const today = new Date().toISOString().slice(0, 10);

    // Guruhni dars bor kunlarini aniqlash
    function getDays(start_date, end_date, day, holidays = []) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const days = [];

        let currentDate = new Date(startDate);
        if (day === "odd") {
            while (currentDate <= endDate) {
                if (
                    (currentDate.getDay() === 1 || currentDate.getDay() === 3 || currentDate.getDay() === 5) &&
                    !holidays.includes(currentDate.toISOString().slice(0, 10))
                ) {
                    days.push(currentDate.toISOString().slice(0, 10));
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        else if (day === "even") {
            while (currentDate <= endDate) {
                if (
                    (currentDate.getDay() === 2 || currentDate.getDay() === 4 || currentDate.getDay() === 6) &&
                    !holidays.includes(currentDate.toISOString().slice(0, 10))
                ) {
                    days.push(currentDate.toISOString().slice(0, 10));
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        else if (day === "weekend") {
            while (currentDate <= endDate) {
                if (
                    (currentDate.getDay() === 0) &&
                    !holidays.includes(currentDate.toISOString().slice(0, 10))
                ) {
                    days.push(currentDate.toISOString().slice(0, 10));
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        else if (day === "everyday") {
            while (currentDate <= endDate) {
                if (!holidays.includes(currentDate.toISOString().slice(0, 10))) {
                    days.push(currentDate.toISOString().slice(0, 10));
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        return days;
    };

    let days = getDays(start, end, day);

    // Umumiy sahifalar sonini hisoblash
    const totalPages = Math.ceil(days.length / itemsPerPage);

    const getAllAttendanceFunction = async () => {
        try {
            const res = await AuthService.getAllAttendance();
            setAttendance(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllAttendanceFunction();

        // Check if today's date is within group days
        const todayIndex = days.findIndex(date => date >= today);
        if (todayIndex !== -1) {
            setCurrentPage(Math.ceil((todayIndex + 1) / itemsPerPage));
        };

    }, []);

    // Handle check function
    const handleCheckboxChange = async (studentId, date, present) => {
        try {
            setLoadingCell({ studentId, date });
            await AuthService.checkAttendance({ studentId, date, present }, groupId);
            getAllAttendanceFunction();
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingCell(null);
        }
    };

    // Handle delete attendance
    const deleteAtdFunction = async (studentId, date) => {
        try {
            setLoadingCell({ studentId, date });
            await AuthService.deleteAttendance(studentId, date);
            getAllAttendanceFunction();
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingCell(null);
        }
    };

    // Checkbox or loading
    const renderCellContent = (studentId, date) => {
        const isLoading = loadingCell && loadingCell.studentId === studentId && loadingCell.date === date;

        return isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-sm m-auto" />
        ) : (
            <button
                disabled={localStorage.getItem("x-auth") === "admin" ? today < date : today !== date}
                onClick={() => deleteAtdFunction(studentId, date)}
                className={`w-4 h-4 flex items-center justify-center cursor-pointer m-auto text-white text-sm rounded disabled:bg-zinc-100 disabled:border-gray-300 ${attendance.some(attendanceRecord => attendanceRecord.studentId._id === studentId && attendanceRecord.date.slice(0, 10) === date && attendanceRecord.present === "was") ? 'bg-green-500' : attendance.some(attendanceRecord => attendanceRecord.studentId._id === studentId && attendanceRecord.date.slice(0, 10) === date && attendanceRecord.present === "not") ? 'bg-red-500' : 'border border-gray-500'}`}
            >
                {
                    attendance.some(attendanceRecord => attendanceRecord.studentId._id === studentId && attendanceRecord.date.slice(0, 10) === date && attendanceRecord.present === "was") ? <MdCheck /> : attendance.some(attendanceRecord => attendanceRecord.studentId._id === studentId && attendanceRecord.date.slice(0, 10) === date && attendanceRecord.present === "not") ? <MdClose /> : ""
                }
            </button >
        );
    };

    // Pagination'da ko'rsatiladigan student'larni hisoblash funksiyasi
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDates = days.slice(indexOfFirstItem, indexOfLastItem);

    // Sanani tegishli oy nomi bilan formatlash funksiyasi
    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    return (
        <div className="2xsm:w-[900px] 2xl:w-full flex flex-col gap-5 border p-5 bg-white shadow-smooth">
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
                        students.map(student => (
                            <tr className="border-y last:border-b-0 [&>*]:py-2" key={student._id}>
                                <td className="w-52 text-left text-sm">{student.last_name} {student.first_name}</td>
                                {currentDates.map(date => (
                                    <td
                                        key={date}
                                        className={`${(localStorage.getItem("x-auth") === "admin" ? today < date : today !== date) ? '' : 'group'} w-20 text-center text-xl relative`}
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
    )
};