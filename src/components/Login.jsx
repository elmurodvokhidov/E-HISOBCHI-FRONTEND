import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authFailure, authStart, authSuccess } from '../redux/slices/authSlice';
import { Toast } from '../config/sweetToast';
import service from '../config/service';
import { setCookie } from '../config/cookiesService';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import bgImg from "../assets/images/Group 3.png";

export default function Login() {
    const { isLoading, isLoggedIn } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [auth, setAuth] = useState({ phoneNumber: "", password: "", });
    const [showPass, setShowPass] = useState(false);
    const getAuthDetails = (e) => setAuth({ ...auth, [e.target.name]: e.target.value });

    const loginHandler = async (e) => {
        e.preventDefault();
        if (auth.phoneNumber !== "" && auth.password !== "") {
            try {
                dispatch(authStart());
                const { data } = await service.adminLogin(auth);
                setCookie("x-token", data.token, 30);
                dispatch(authSuccess(data));
            } catch (error) {
                dispatch(authFailure(error.response?.data.message));
                Toast.fire({ icon: "error", title: error.response?.data.message || error.message });
            }
        }
        else {
            dispatch(authFailure());
            Toast.fire({ icon: "warning", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
        }
    };

    useEffect(() => {
        if (isLoggedIn) navigate("/");
    }, [isLoggedIn]);

    return (
        <div className="w-full h-screen relative overflow-y-auto flex flex-col items-center justify-center gap-4 p-6">
            {/* <img
                src={bgImg}
                alt="background image"
                className='size-full fixed object-cover'
            /> */}
            <form className="pc:w-[30%] md:w-[40%] sm:w-[80%] small:w-full flex flex-col items-center gap-10 px-20 py-10 rounded-3xl shadow-smooth z-0 bg-white">
                <h1 className='text-3xl'>Welcome back 👋</h1>
                <div className="w-full flex flex-col gap-6">
                    {/* Contact Number */}
                    <div className="flex flex-col relative">
                        <label
                            htmlFor="phoneNumber"
                            className="absolute text-xs bg-white -top-2 left-3">
                            <span>Telefon</span>
                            <span className="text-sm text-main-1 ml-1">*</span>
                        </label>
                        <div className="flex">
                            <label
                                htmlFor="phoneNumber"
                                className="text-base border-2 border-r-0 rounded-l px-3 py-2">
                                +998
                            </label>
                            <input
                                disabled={isLoading ? true : false}
                                onChange={getAuthDetails}
                                type="number"
                                name="phoneNumber"
                                id="phoneNumber"
                                className="w-full border-2 rounded-lg rounded-l-none px-2 py-2 outline-main-1"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className="absolute text-xs bg-white -top-1.5 left-3">
                            <span>Parol</span>
                            <span className="text-sm text-main-1 ml-1">*</span>
                        </label>
                        <input
                            disabled={isLoading ? true : false}
                            onChange={getAuthDetails}
                            type={showPass ? "text" : "password"}
                            name="password"
                            id="password"
                            className="w-full p-2 rounded-lg border-2 outline-main-1" />
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
                        className="w-fit mx-auto text-white rounded-3xl text-sm px-10 py-2 uppercase bg-main-1 hover:bg-cyan-700">
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </div>
            </form>
        </div>
    )
}