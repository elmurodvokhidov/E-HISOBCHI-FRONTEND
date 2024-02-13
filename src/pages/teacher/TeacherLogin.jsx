import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { authFailure, authStart, authSuccess } from "../../redux/slices/authSlice";
import AuthService from "../../config/authService";
import { NavLink, useNavigate } from "react-router-dom";
import { saveToLocalStorage } from "../../config/localStorageService";

function TeacherLogin() {
    const [teacher, setTeacher] = useState();
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
            const { data } = await AuthService.teacherLogin(teacher);
            saveToLocalStorage("x-auth", "teacher");
            saveToLocalStorage("x-token", data.token);
            dispatch(authSuccess(data));
        } catch (error) {
            dispatch(authFailure(error.message));
        }
    };

    useEffect(() => {
        if (isLogin) return navigate("/teacher/dashboard");
    }, [isLogin, navigate]);

    return (
        <div>
            <NavLink to="/">back</NavLink>
            <form>
                <input onChange={(e) => getTeacherDetails(e)} className="border-2" type="email" name="email" id="email" placeholder="enter your email..." /> <br />
                <input onChange={(e) => getTeacherDetails(e)} className="border-2" type="password" name="password" id="password" placeholder="enter your password..." /> <br />
                <button onClick={(e) => loginHandler(e)} className="border-2">{isLoading ? "loading..." : "login"}</button>
            </form>
        </div>
    )
}

export default TeacherLogin