import { MdAdminPanelSettings } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { NavLink } from 'react-router-dom'

function Login() {
    return (
        <div className="w-full h-fullVH font-montserrat flex flex-col items-center justify-center gap-8 bg-slate-400">
            <h1 className="text-6xl">Who are you?</h1>
            <div className="flex items-center gap-10">
                <NavLink className="hover:text-slate-200 transition-all duration-200 text-2xl flex flex-col justify-center items-center" to="admin/login">
                    <span className="text-3xl"><MdAdminPanelSettings /></span>
                    <h1 className="text-xl">Admin</h1>
                </NavLink>
                <NavLink className="hover:text-slate-200 transition-all duration-200 text-2xl flex flex-col justify-center items-center" to="teacher/login">
                    <span className="text-3xl"><FaChalkboardTeacher /></span>
                    <h1 className="text-xl">Teacher</h1>
                </NavLink>
                <NavLink className="hover:text-slate-200 transition-all duration-200 text-2xl flex flex-col justify-center items-center" to="student/login">
                    <span className="text-3xl"><PiStudentFill /></span>
                    <h1 className="text-xl">Student</h1>
                </NavLink>
            </div>
            <h1 className="text-[18px]">Enter your Account</h1>
        </div>
    )
}

export default Login