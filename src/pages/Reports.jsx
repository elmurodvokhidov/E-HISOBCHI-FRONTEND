import { useDispatch, useSelector } from "react-redux"
import Skeleton from "../components/loaders/Skeleton";
import { useEffect, useState } from "react";
import service from "../config/service";
import { useNavigate } from "react-router-dom";
import { allCourseSuccess, courseFailure, courseStart } from "../redux/slices/courseSlice";
import { allStudentPayHistorySuccess, studentPayHistoryFailure, studentPayHistoryStart } from "../redux/slices/studentPayHistory";

const Reports = () => {
    const { auth } = useSelector(state => state.auth);
    const { courses } = useSelector(state => state.course);
    const [payments, setPayments] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const getAllCourses = async () => {
            try {
                dispatch(courseStart());
                const { data } = await service.getAllCourses();
                dispatch(allCourseSuccess(data));
            } catch (error) {
                dispatch(courseFailure(error.message));
            }
        };

        // Barcha o'quvchilar to'lov tarixini olish funksiyasi
        const getAllStudentPayHistoryFunction = async () => {
            try {
                dispatch(studentPayHistoryStart());
                const { data } = await service.getStudentPayHistory();
                dispatch(allStudentPayHistorySuccess(data));
                setPayments(data.data.filter(pay => pay.type === "pay"));
            } catch (error) {
                dispatch(studentPayHistoryFailure(error.message));
            }
        };

        getAllCourses();
        getAllStudentPayHistoryFunction();

        if (auth?.role !== "ceo") navigate("/admin/dashboard");
    }, [auth?.role]);

    // Davomat foizini belgilash
    const calcAtdPerFunction = (courseId) => {
        const attendance = courses?.flatMap(course => course?._id === courseId ? course?.groups?.flatMap(group => group?.attendance) : course);
        const totalRecords = attendance?.length;
        const presentWasCount = attendance?.filter(student => student?.present === "was").length;
        const percentage = (presentWasCount / totalRecords) * 100;
        return Math.round(percentage) || 0;
    }

    const calcPaymentFunction = (courseId) => {
        const total = payments.filter(pay => pay?.studentId?.group?.course?._id === courseId);
        return Math.round(total.reduce((total, pay) => total + pay?.amount, 0)).toLocaleString()
    }

    return (
        <div className="container reports">
            <h1 className="text-2xl mb-4 pc:text-3xl">Umumiy hisobot</h1>

            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2" rowSpan="2">№</th>
                            <th className="border border-gray-300 px-4 py-2" rowSpan="2">Yo'nalish nomi</th>
                            <th className="border border-gray-300 px-4 py-2" rowSpan="2">Jami o'quvchilar soni</th>
                            <th className="border border-gray-300 px-4 py-2" colSpan="2">Shundan:</th>
                            <th className="border border-gray-300 px-4 py-2" rowSpan="2">O'quvchilar davomati (%)</th>
                            <th className="border border-gray-300 px-4 py-2" rowSpan="2">To'lovlar (so'm)</th>
                            <th className="border border-gray-300 px-4 py-2" rowSpan="2">Qolgan qarz (so'm)</th>
                        </tr>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">O'qiyotganlar</th>
                            <th className="border border-gray-300 px-4 py-2">Ketganlar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses?.map((course, index) => (
                            <tr key={course?._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                <td className="border border-gray-300 px-4 py-2">{course?.title}</td>
                                <td className="border border-gray-300 px-4 py-2">{course?.groups?.map(group => group?.students?.length)}</td>
                                <td className="border border-gray-300 px-4 py-2">{course?.groups?.map(group => group?.students?.length)}</td>
                                <td className="border border-gray-300 px-4 py-2">{0}</td>
                                <td className="border border-gray-300 px-4 py-2">{calcAtdPerFunction(course?._id)}%</td>
                                <td className="border border-gray-300 px-4 py-2">{calcPaymentFunction(course?._id)} UZS</td>
                                <td className="border border-gray-300 px-4 py-2">{course?.groups?.map(group => group?.students?.reduce((total, student) => Math.round(total + (student?.balance < 0 ? student?.balance : 0)), 0)?.toLocaleString())} UZS</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Reports