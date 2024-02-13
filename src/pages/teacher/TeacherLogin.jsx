import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { authFailure, authStart, authSuccess } from "../../redux/slices/authSlice";
import AuthService from "../../config/authService";
import { NavLink, useNavigate } from "react-router-dom";
import { saveToLocalStorage } from "../../config/localStorageService";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdKeyboardBackspace } from "react-icons/md";
import { Toast } from "../../config/sweetToast";

function TeacherLogin() {
    const [teacher, setTeacher] = useState({
        email: "",
        password: ""
    });
    const { isLoading, isLogin } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function getTeacherDetails(e) {
        setTeacher({
            ...teacher,
            [e.target.name]: e.target.value
        });
    };

    async function loginHandler(e) {
        e.preventDefault();
        dispatch(authStart());
        try {
            if (teacher.email !== "" && teacher.password !== "") {
                const { data } = await AuthService.teacherLogin(teacher);
                saveToLocalStorage("x-auth", "teacher");
                saveToLocalStorage("x-token", data.token);
                dispatch(authSuccess(data));
            }
            else {
                dispatch(authFailure());
                await Toast.fire({
                    icon: "error",
                    title: "Please fill in the all blanks!"
                });
            }
        } catch (error) {
            dispatch(authFailure(error.response.data.message));
            await Toast.fire({
                icon: "error",
                title: error.response.data.message
            });
        }
    };

    useEffect(() => {
        if (isLogin) return navigate("/teacher/dashboard");
    }, [isLogin, navigate]);

    return (
        <div className="w-full h-fullVH flex flex-col items-center justify-center gap-4 font-montserrat bg-slate-400">
            <NavLink to="/" className="flex items-center gap-2 fixed top-12 left-12 text-xl hover:text-slate-200 transition-all duration-200"><span><MdKeyboardBackspace /></span> Back to Homepage</NavLink>
            <span className="text-8xl"><FaChalkboardTeacher /></span>
            <h1 className="text-4xl mb-4">Enter your account credentials</h1>
            <form className="w-1/4 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email Address</label>
                    <input onChange={(e) => getTeacherDetails(e)} className="p-2 rounded border-2" type="email" name="email" id="email" placeholder="your email" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => getTeacherDetails(e)} className="p-2 rounded border-2" type="password" name="password" id="password" placeholder="your password" />
                </div>
                <button disabled={isLoading ? true : false} onClick={(e) => loginHandler(e)} className="rounded mt-5 p-2 border-2 hover:bg-slate-200 transition-all duration-200">{isLoading ? "Loading..." : "Login"}</button>
            </form>
        </div>
    )
}

export default TeacherLogin