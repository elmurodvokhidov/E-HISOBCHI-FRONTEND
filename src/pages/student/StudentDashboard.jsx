import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authLogout, authStart } from "../../redux/slices/authSlice";
import { useEffect } from "react";

function StudentDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const exitHandler = () => {
        dispatch(authStart());
        dispatch(authLogout());
        navigate("/student/login");
    };

    useEffect(() => {
        if (!localStorage.getItem("x-token")) {
            navigate("/student/login");
        }
    }, [navigate]);

    return (
        <div>
            <button onClick={exitHandler} className="border-2">Exit</button>
        </div>
    )
}

export default StudentDashboard