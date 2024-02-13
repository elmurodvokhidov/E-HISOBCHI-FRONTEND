import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { authFailure, authStart, authSuccess } from "../../redux/slices/authSlice";
import AuthService from "../../config/authService";
import { NavLink, useNavigate } from "react-router-dom";
import { saveToLocalStorage } from "../../config/localStorageService";

function AdminLogin() {
    const [admin, setAdmin] = useState();
    const { isLoading, isLogin } = useSelector(state => state.auth);
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
            const { data } = await AuthService.adminLogin(admin);
            saveToLocalStorage("x-auth", "admin");
            saveToLocalStorage("x-token", data.token);
            dispatch(authSuccess(data));
        } catch (error) {
            dispatch(authFailure(error.message));
        }
    };

    useEffect(() => {
        if (isLogin) return navigate("/admin/dashboard");
    }, [isLogin, navigate]);

    return (
        <div>
            <NavLink to="/">back</NavLink>
            <form>
                <input onChange={(e) => getAdminDetails(e)} className="border-2" type="email" name="email" id="email" placeholder="enter your email..." /> <br />
                <input onChange={(e) => getAdminDetails(e)} className="border-2" type="password" name="password" id="password" placeholder="enter your password..." /> <br />
                <button onClick={(e) => loginHandler(e)} className="border-2">{isLoading ? "loading..." : "login"}</button>
            </form>
        </div>
    )
}

export default AdminLogin