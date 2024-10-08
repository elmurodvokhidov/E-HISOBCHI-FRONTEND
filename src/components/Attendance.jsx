import { useEffect, useState } from "react";
import service from "../config/service";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdCheck, MdClose, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import Skeleton from "./loaders/Skeleton";
import { Toast } from "../config/sweetToast";
import calculateCourseDays from "../config/courseDays";

export default function Attendance({ group, isLoading }) {
    const [today, setToday] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loadingCell, setLoadingCell] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 13;
    const { start_date, end_date, day } = group;

    // Guruhni dars bor kunlarini aniqlash
    const courseDays = calculateCourseDays(start_date, end_date, day);
    // Umumiy sahifalar sonini hisoblash
    const totalPages = Math.ceil(courseDays.length / itemsPerPage);

    // Barcha davomat ro'yhatini olish funksiyasi
    const getAllAttendanceFunction = async () => {
        try {
            const res = await service.getAllAttendance();
            setAttendance(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // Bugungi sanani olish
        const getCurrentDateFunction = async () => {
            try {
                const { data } = await service.getCurrentDate();
                setToday(data.today);
                // Bugungi sana guruh kunlari ichida ekanligini tekshirish
                const todayIndex = courseDays.findIndex(date => date >= data.today);
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

            // First, try to calculate the teacher's salary
            try {
                await service.calcTeacherSalary(student, date);
            } catch (error) {
                console.log(error.response?.data.message || error.message);
                Toast.fire({ icon: "error", title: error.response?.data.message || error.message });
            }

            // Then, update the attendance record
            try {
                await service.checkAttendance({ student, date, present }, group._id);
            } catch (error) {
                Toast.fire({ icon: "error", title: "Davomatni yangilab bo'lmadi!" });
            }

            // Fetch updated attendance data
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
            await service.deleteAttendance(student, date);
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
            <AiOutlineLoading3Quarters className="animate-spin text-sm pc:text-base m-auto" />
        ) : (
            <button
                disabled={today < date}
                // onClick={() => deleteAtdFunction(id, date)}
                className={`size-4 pc:size-[18px] flex items-center justify-center cursor-pointer m-auto text-white text-sm pc:text-base rounded disabled:opacity-20 ${attendance.some(attendanceRecord => attendanceRecord?.student?._id === id && attendanceRecord.date.slice(0, 10) === date && attendanceRecord.present === "was") ? 'bg-green-500' : attendance.some(attendanceRecord => attendanceRecord.student?._id === id && attendanceRecord.date.slice(0, 10) === date && attendanceRecord.present === "not") ? 'bg-red-500' : 'border border-gray-500'}`}
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
    const currentDates = courseDays.slice(indexOfFirstItem, indexOfLastItem);

    // Sanani tegishli oy nomi bilan formatlash funksiyasi
    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    return (
        <>
            {
                isLoading ?
                    <div className="small:w-[900px] 2xl:w-full">
                        <Skeleton
                            parentWidth={100}
                            firstChildWidth={85}
                            secondChildWidth={50}
                            thirdChildWidth={65}
                        />
                    </div> : <>
                        <div className="small:w-[900px] 2xl:w-full flex flex-col gap-5 border p-5 bg-white shadow-md rounded">
                            <h2 className="text-xl pc:text-2xl">Davomat</h2>
                            <table>
                                <thead>
                                    <tr className="text-sm pc:text-base [&>*]:pb-2">
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
                                                <td className="w-52 pc:w-60 text-left text-sm pc:text-base">
                                                    {student.first_name} {student.last_name}
                                                </td>
                                                {currentDates.map(date => (
                                                    <td
                                                        key={date}
                                                        className={`${(today < date) ? '' : 'group'} w-20 pc:w-24 text-center text-xl pc:text-2xl relative`}
                                                    >
                                                        {renderCellContent(student._id, date)}

                                                        <div className="atd_modal bg-gray-200 text-sm pc:text-lg gap-2 p-2 rounded-md absolute -top-7 pc:-top-8 pc:left-1 hidden group-hover:flex">
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
                            <div className="flex items-center gap-4 text-xl pc:text-2xl text-gray-600 [&>*]:cursor-pointer">
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