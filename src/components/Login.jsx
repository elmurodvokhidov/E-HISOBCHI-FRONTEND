import { MdAdminPanelSettings } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { NavLink } from 'react-router-dom';
import logo from "../img/uitc_logo.png";

function Login() {
    return (
        <div className="w-full h-screen font-montserrat flex flex-col items-center justify-center gap-10">
            <figure className="w-96">
                <img className="w-full h-full object-cover" src={logo} alt="logo" />
            </figure>
            {/* <h1 className="text-6xl">Who are you?</h1> */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-10">
                    <NavLink className="hover:text-cyan-600 transition-all duration-200 text-2xl flex flex-col justify-center items-center" to="admin/login">
                        <span className="text-3xl"><MdAdminPanelSettings /></span>
                        <h1 className="text-xl">Admin</h1>
                    </NavLink>
                    <NavLink className="hover:text-cyan-600 transition-all duration-200 text-2xl flex flex-col justify-center items-center" to="teacher/login">
                        <span className="text-3xl"><FaChalkboardTeacher /></span>
                        <h1 className="text-xl">Teacher</h1>
                    </NavLink>
                    <NavLink className="hover:text-cyan-600 transition-all duration-200 text-2xl flex flex-col justify-center items-center" to="student/login">
                        <span className="text-3xl"><PiStudentFill /></span>
                        <h1 className="text-xl">Student</h1>
                    </NavLink>
                </div>
                <h1 className="text-[18px]">Enter your Account</h1>
            </div>
        </div>
    )
}

export default Login