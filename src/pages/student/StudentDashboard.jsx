import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authLogout, authStart } from "../../redux/slices/authSlice";
export default function StudentDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const exitHandler = () => {
        dispatch(authStart());
        dispatch(authLogout());
        navigate("/");
    };

    return (
        <div>
            <button onClick={exitHandler} className="border-2">Exit</button>
        </div>
    )
};