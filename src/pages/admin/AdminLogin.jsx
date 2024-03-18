import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { authFailure, authStart, authSuccess } from "../../redux/slices/authSlice";
import AuthService from "../../config/authService";
import { NavLink, useNavigate } from "react-router-dom";
import { saveToLocalStorage } from "../../config/localStorageService";
import { MdAdminPanelSettings, MdKeyboardBackspace } from "react-icons/md";
import { Toast } from "../../config/sweetToast";

function AdminLogin() {
    const [admin, setAdmin] = useState({
        email: "",
        password: ""
    });
    const { isLoading, isLoggedIn } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function getAdminDetails(e) {
        setAdmin({
            ...admin,
            [e.target.name]: e.target.value
        });
    };

    async function loginHandler(e) {
        e.preventDefault();
        dispatch(authStart());
        try {
            if (admin.email !== "" && admin.password !== "") {
                const { data } = await AuthService.adminLogin(admin);
                saveToLocalStorage("x-auth", "admin");
                saveToLocalStorage("x-token", data.token);
                dispatch(authSuccess(data));
            }
            else {
                dispatch(authFailure());
                await Toast.fire({
                    icon: "error",
                    title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
                });
            }
        } catch (error) {
            dispatch(authFailure(error.response.data.message));
            await Toast.fire({
                icon: "error",
                title: error.response.data.message || error.message
            });
        }
    };

    useEffect(() => {
        if (isLoggedIn && localStorage.getItem("x-auth") === "admin") {
            navigate("/admin/dashboard");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4 font-montserrat">
            <NavLink to="/" className="flex items-center gap-2 fixed top-12 left-12 text-xl hover:text-slate-200 transition-all duration-200"><MdKeyboardBackspace /> Back to Homepage</NavLink>
            <MdAdminPanelSettings className="text-8xl" />
            <h1 className="text-4xl mb-4">Enter your account credentials</h1>
            <form className="w-1/4 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email Address</label>
                    <input disabled={isLoading ? true : false} onChange={(e) => getAdminDetails(e)} className="p-2 rounded border-2" type="email" name="email" id="email" placeholder="your email" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password">Password</label>
                    <input disabled={isLoading ? true : false} onChange={(e) => getAdminDetails(e)} className="p-2 rounded border-2" type="password" name="password" id="password" placeholder="your password" />
                </div>
                <button disabled={isLoading ? true : false} onClick={(e) => loginHandler(e)} className="rounded mt-5 p-2 border-2 bg-slate-400 hover:bg-slate-200 transition-all duration-200">{isLoading ? "Loading..." : "Login"}</button>
            </form>
        </div>
    )
}

export default AdminLogin