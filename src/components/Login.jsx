import { useNavigate } from 'react-router-dom';
import logo from "../img/uitc_logo.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import bgImg from "../img/bg.jpg";
import { authFailure, authStart, authSuccess } from '../redux/slices/authSlice';
import { Toast } from '../assets/sweetToast';
import AuthService from '../config/authService';
import { saveToLocalStorage } from '../assets/localStorageService';

function Login() {
    const { isLoading, isLoggedIn } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [auth, setAuth] = useState({
        email: "",
        password: "",
        huru: "",
    });

    function getAuthDetails(e) {
        setAuth({
            ...auth,
            [e.target.name]: e.target.value
        });
    };

    async function loginHandler(e) {
        e.preventDefault();
        dispatch(authStart());
        try {
            if (auth.huru !== "" && auth.email !== "" && auth.password !== "") {
                const { huru, ...others } = auth;
                if (auth.huru === "admin") {
                    const { data } = await AuthService.adminLogin(others);
                    saveToLocalStorage("x-auth", "admin");
                    saveToLocalStorage("x-token", data.token);
                    dispatch(authSuccess(data));
                }
                else if (auth.huru === "teacher") {
                    const { data } = await AuthService.teacherLogin(others);
                    saveToLocalStorage("x-auth", "teacher");
                    saveToLocalStorage("x-token", data.token);
                    dispatch(authSuccess(data));
                }
                else if (auth.huru === "student") {
                    const { data } = await AuthService.studentLogin(others);
                    saveToLocalStorage("x-auth", "student");
                    saveToLocalStorage("x-token", data.token);
                    dispatch(authSuccess(data));
                }
            }
            else {
                dispatch(authFailure());
                await Toast.fire({
                    icon: "error",
                    title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
                });
            }
        } catch (error) {
            dispatch(authFailure(error.response?.data.message));
            await Toast.fire({
                icon: "error",
                title: error.response?.data.message || error.message
            });
        }
    };

    useEffect(() => {
        if (isLoggedIn && localStorage.getItem("x-auth") === "admin") {
            navigate("/admin/dashboard");
        }
        if (isLoggedIn && localStorage.getItem("x-auth") === "teacher") {
            navigate("/teacher/dashboard");
        }
        if (isLoggedIn && localStorage.getItem("x-auth") === "student") {
            navigate("/student/dashboard");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-start gap-4 pt-6 bg-gray-200">
            <div className="w-[45%] flex flex-col gap-4">
                <figure className="w-full h-44 rounded-lg overflow-hidden bg-red-100">
                    <img className='size-full object-cover' src={bgImg} alt="background image" />
                </figure>
                <form className="w-full flex items-center gap-10 px-6 py-10 rounded shadow-smooth bg-white">
                    {/* Cover Image */}
                    <figure>
                        <img
                            src={logo}
                            alt="logo"
                            className="w-52" />
                    </figure>

                    <div className="w-full flex flex-col gap-6">
                        <div className="flex justify-between">
                            <h1>Login</h1>
                            <select onChange={getAuthDetails} name="huru" id="huru" className="border-2 px-2 py-1 rounded outline-cyan-600">
                                <option value="" className='italic'>None</option>
                                <option value="admin">Adminstator</option>
                                <option value="teacher">O'qituvchi</option>
                                <option value="student">O'quvchi</option>
                            </select>
                        </div>
                        {/* Email Adress */}
                        <div className="relative">
                            <label
                                htmlFor="email"
                                className="absolute text-xs bg-white -top-1.5 left-3">
                                <span>Email</span>
                                <span className="text-sm text-cyan-600 ml-1">*</span>
                            </label>
                            <input
                                disabled={isLoading ? true : false}
                                onChange={getAuthDetails}
                                type="email"
                                name="email"
                                id="email"
                                className="w-full p-2 rounded border-2 outline-cyan-600" />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="absolute text-xs bg-white -top-1.5 left-3">
                                <span>Parol</span>
                                <span className="text-sm text-cyan-600 ml-1">*</span>
                            </label>
                            <input
                                disabled={isLoading ? true : false}
                                onChange={getAuthDetails}
                                type="password"
                                name="password"
                                id="password"
                                className="w-full p-2 rounded border-2 outline-cyan-600" />
                        </div>

                        {/* Login Button */}
                        <button
                            disabled={isLoading ? true : false}
                            onClick={loginHandler}
                            className="w-fit text-white rounded-2xl text-[16px] px-10 py-2 uppercase bg-cyan-600 hover:bg-cyan-700">
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login