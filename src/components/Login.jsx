import { useNavigate } from 'react-router-dom';
import logo from "../assets/images/uitc_logo.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import bgImg from "../assets/images/bg.jpg";
import { authFailure, authStart, authSuccess } from '../redux/slices/authSlice';
import { Toast } from '../config/sweetToast';
import AuthService from '../config/authService';
import { getCookie, setCookie } from '../config/cookiesService';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

function Login() {
    const { isLoading, isLoggedIn } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [auth, setAuth] = useState({
        phoneNumber: "",
        password: "",
        huru: "",
    });
    const [showPass, setShowPass] = useState(false);

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
            if (auth.huru !== "" && auth.phoneNumber !== "" && auth.password !== "") {
                const { huru, ...others } = auth;
                if (auth.huru === "admin") {
                    const { data } = await AuthService.adminLogin(others);
                    setCookie("x-auth", "admin", 30);
                    setCookie("x-token", data.token, 30);
                    dispatch(authSuccess(data));
                }
                else if (auth.huru === "teacher") {
                    const { data } = await AuthService.teacherLogin(others);
                    setCookie("x-auth", "teacher", 30);
                    setCookie("x-token", data.token, 30);
                    dispatch(authSuccess(data));
                }
                else if (auth.huru === "student") {
                    const { data } = await AuthService.studentLogin(others);
                    setCookie("x-auth", "student", 30);
                    setCookie("x-token", data.token, 30);
                    dispatch(authSuccess(data));
                }
            }
            else {
                dispatch(authFailure());
                Toast.fire({
                    icon: "error",
                    title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
                });
            }
        } catch (error) {
            dispatch(authFailure(error.response?.data.message));
            Toast.fire({
                icon: "error",
                title: error.response?.data.message || error.message
            });
        }
    };

    useEffect(() => {
        if (isLoggedIn && getCookie("x-auth") === "admin") {
            navigate("/company");
        }
        if (isLoggedIn && getCookie("x-auth") === "teacher") {
            navigate("/teacher/dashboard");
        }
        if (isLoggedIn && getCookie("x-auth") === "student") {
            navigate("/student/dashboard");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="w-full h-screen overflow-y-auto flex flex-col items-center justify-start gap-4 p-6 bg-gray-200">
            <div className="md:w-[45%] sm:w-[80%] 2xsm:w-full flex flex-col gap-4">
                {/* Cover Image */}
                <figure className="w-full h-44 rounded-lg overflow-hidden">
                    <img className='size-full object-cover' src={bgImg} alt="background image" />
                </figure>
                <form className="w-full flex lg:flex-row 2xsm:flex-col items-center gap-10 px-6 py-10 rounded shadow-smooth bg-white">
                    {/* Logo */}
                    <figure>
                        <img
                            src={logo}
                            alt="logo"
                            className="lg:w-52 2xsm:w-40" />
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

                        {/* Contact Number */}
                        <div className="flex flex-col relative">
                            <label
                                htmlFor="phoneNumber"
                                className="absolute text-xs bg-white -top-2 left-3">
                                <span>Telefon</span>
                                <span className="text-sm text-cyan-600 ml-1">*</span>
                            </label>
                            <div className="flex">
                                <label htmlFor="phoneNumber" className="text-base border-2 border-r-0 rounded-l px-3 py-2">+998</label>
                                <input
                                    disabled={isLoading ? true : false}
                                    onChange={getAuthDetails}
                                    type="number"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    className="w-full border-2 rounded rounded-l-none px-2 py-2 outline-cyan-600"
                                />
                            </div>
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
                                type={showPass ? "text" : "password"}
                                name="password"
                                id="password"
                                className="w-full p-2 rounded border-2 outline-cyan-600" />
                            <button
                                type='button'
                                onClick={() => setShowPass(!showPass)}
                                className='absolute top-2.5 right-2.5 text-xl text-gray-500'
                            >
                                {showPass ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            disabled={isLoading ? true : false}
                            onClick={loginHandler}
                            className="w-fit text-white rounded-3xl text-sm px-10 py-2 uppercase bg-cyan-600 hover:bg-cyan-700">
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login