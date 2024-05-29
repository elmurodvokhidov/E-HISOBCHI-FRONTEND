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
import TimeTable from "../../components/charts/TimeTable";
import { BsExclamationTriangle } from "react-icons/bs";
import { SlLayers } from "react-icons/sl";
import { allGroupSuccess } from "../../redux/slices/groupSlice";
import { allLeadSuccess } from "../../redux/slices/leadSlice";
import { allRoomSuccess } from "../../redux/slices/roomSlice";

function AdminDashboard() {
    const { admins } = useSelector(state => state.admin);
    const { teachers } = useSelector(state => state.teacher);
    const { students } = useSelector(state => state.student);
    const { groups } = useSelector(state => state.group);
    const { leads } = useSelector(state => state.lead);
    const { rooms } = useSelector(state => state.room);
    const dispatch = useDispatch();

    useEffect(() => {
        const getAllAdminsFunction = async () => {
            const { data } = await AuthService.getAllAdmin();
            dispatch(allAdminSuccess(data));
        };
        const getAllTeachersFunction = async () => {
            const { data } = await AuthService.getAllTeachers();
            dispatch(allTeacherSuccess(data));
        };
        const getAllStudentsFunction = async () => {
            const { data } = await AuthService.getAllStudents();
            dispatch(allStudentSuccess(data));
        };
        const getAllGroupsFunction = async () => {
            const { data } = await AuthService.getAllGroups();
            dispatch(allGroupSuccess(data));
        };
        const getAllLeadFunction = async () => {
            const { data } = await AuthService.getAllLead();
            dispatch(allLeadSuccess(data));
        };
        const getAllRoomsFunction = async () => {
            const { data } = await AuthService.getAllRooms();
            dispatch(allRoomSuccess(data));
        };

        getAllAdminsFunction();
        getAllTeachersFunction();
        getAllStudentsFunction();
        getAllGroupsFunction();
        getAllLeadFunction();
        getAllRoomsFunction();
    }, []);


    return (
        <div className="container">
            <section className="w-full grid lg:grid-cols-6 sm:grid-cols-3 small:grid-cols-2 items-center justify-start gap-6">
                <div className="sm:size-36 small:size-28 flex flex-col items-center justify-center border shadow-smooth">
                    <FaRegUser className="sm:text-4xl small:text-2xl text-cyan-600" />
                    <h1 className="sm:text-sm small:text-xs pc:text-lg text-gray-500 mt-1">Faol Lidlar</h1>
                    <h1 className="text-2xl text-cyan-600 mt-3">{admins ? leads.length : 0}</h1>
                </div>

                <div className="sm:size-36 small:size-28 flex flex-col items-center justify-center border shadow-smooth">
                    <RiAdminLine className="sm:text-4xl small:text-2xl text-cyan-600" />
                    <h1 className="sm:text-sm small:text-xs pc:text-lg text-gray-500 mt-1">Adminlar</h1>
                    <h1 className="text-2xl text-cyan-600 mt-3">{admins ? admins.length : 0}</h1>
                </div>

                <div className="sm:size-36 small:size-28 flex flex-col items-center justify-center border shadow-smooth">
                    <FaChalkboardTeacher className="sm:text-4xl small:text-2xl text-cyan-600" />
                    <h1 className="sm:text-sm small:text-xs pc:text-lg text-gray-500 mt-1">O'qituvchilar</h1>
                    <h1 className="text-2xl text-cyan-600 mt-3">{teachers ? teachers.length : 0}</h1>
                </div>

                <div className="sm:size-36 small:size-28 flex flex-col items-center justify-center border shadow-smooth">
                    <PiStudent className="sm:text-4xl small:text-2xl text-cyan-600" />
                    <h1 className="sm:text-sm small:text-xs pc:text-lg text-gray-500 mt-1">O'quvchilar</h1>
                    <h1 className="text-2xl text-cyan-600 mt-3">{students ? students.length : 0}</h1>
                </div>

                <div className="sm:size-36 small:size-28 flex flex-col items-center justify-center border shadow-smooth">
                    <SlLayers className="sm:text-4xl small:text-2xl text-cyan-600" />
                    <h1 className="sm:text-sm small:text-xs pc:text-lg text-gray-500 mt-1">Guruhlar</h1>
                    <h1 className="text-2xl text-cyan-600 mt-3">{groups ? groups.length : 0}</h1>
                </div>

                <div className="sm:size-36 small:size-28 flex flex-col items-center justify-center border shadow-smooth">
                    <BsExclamationTriangle className="sm:text-4xl small:text-2xl text-cyan-600" />
                    <h1 className="sm:text-sm small:text-xs pc:text-lg text-gray-500 mt-1">Qarzdorlar</h1>
                    <h1 className="text-2xl text-cyan-600 mt-3">
                        {students ? students.filter(student => student.balance < 0).length : 0}
                    </h1>
                </div>
            </section>

            <section className="my-8 shadow-smooth">
                <SplineChart />
            </section>

            <section className="shadow-smooth">
                <TimeTable
                    rooms={rooms}
                    groups={groups}
                />
            </section>
        </div>
    )
}

export default AdminDashboard