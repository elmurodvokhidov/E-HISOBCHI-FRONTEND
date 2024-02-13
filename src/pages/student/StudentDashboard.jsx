import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authLogout, authStart } from "../../redux/slices/authSlice";

function StudentDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const exitHandler = () => {
        dispatch(authStart());
        dispatch(authLogout());
        navigate("/student/login");
    };

    return (
        <div>
            <button onClick={exitHandler} className="border-2">Exit</button>
        </div>
    )
}

export default StudentDashboard