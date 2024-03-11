import { RiAdminLine } from "react-icons/ri";
import { FaChalkboardTeacher, FaRegUser } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AuthService from "../../config/authService";
import { allAdminSuccess } from "../../redux/slices/adminSlice";
import { allTeacherSuccess } from "../../redux/slices/teacherSlice";
import { allStudentSuccess } from "../../redux/slices/studentSlice";
import SplineChart from "../../components/charts/SplineChart";
import TimelineChart from "../../components/charts/TimelineChart";

function Dashboard() {
    const { admins } = useSelector(state => state.admin);
    const { teachers } = useSelector(state => state.teacher);
    const { students } = useSelector(state => state.student);
    const dispatch = useDispatch();

    useEffect(() => {
        const getAllAdmins = async () => {
            const { data } = await AuthService.getAllAdmin();
            dispatch(allAdminSuccess(data));
        };
        const getAllTeachers = async () => {
            const { data } = await AuthService.getAllTeachers();
            dispatch(allTeacherSuccess(data));
        };
        const getAllStudents = async () => {
            const { data } = await AuthService.getAllStudents();
            dispatch(allStudentSuccess(data));
        };

        getAllAdmins();
        getAllTeachers();
        getAllStudents();
    }, [])


    return (
        <div className="w-full h-screen overflow-auto pt-24 pb-10 px-10">
            <section className="w-full flex items-center gap-5">
                <div className="w-40 h-40 flex flex-col items-center justify-center border shadow-smooth">
                    <FaRegUser className="text-5xl text-cyan-600" />
                    <h1 className="text-[14px] text-gray-500 mt-1">Faol Lidlar</h1>
                    <h1 className="text-3xl text-cyan-600 mt-3">0</h1>
                </div>

                <div className="w-40 h-40 flex flex-col items-center justify-center border shadow-smooth">
                    <RiAdminLine className="text-5xl text-cyan-600" />
                    <h1 className="text-[14px] text-gray-500 mt-1">Adminlar</h1>
                    <h1 className="text-3xl text-cyan-600 mt-3">{admins ? admins.length : 0}</h1>
                </div>

                <div className="w-40 h-40 flex flex-col items-center justify-center border shadow-smooth">
                    <FaChalkboardTeacher className="text-5xl text-cyan-600" />
                    <h1 className="text-[14px] text-gray-500 mt-1">O'qituvchilar</h1>
                    <h1 className="text-3xl text-cyan-600 mt-3">{teachers ? teachers.length : 0}</h1>
                </div>

                <div className="w-40 h-40 flex flex-col items-center justify-center border shadow-smooth">
                    <PiStudent className="text-5xl text-cyan-600" />
                    <h1 className="text-[14px] text-gray-500 mt-1">O'quvchilar</h1>
                    <h1 className="text-3xl text-cyan-600 mt-3">{students ? students.length : 0}</h1>
                </div>
            </section>

            <section className="my-8 shadow-smooth">
                <SplineChart />
            </section>

            <section className="shadow-smooth">
                <TimelineChart />
            </section>
        </div>
    )
}

export default Dashboard