import { useDispatch } from "react-redux";
import { authLogout, authStart } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const exitHandler = () => {
        dispatch(authStart());
        dispatch(authLogout());
        navigate("/admin/login");
    };

    return (
        <div className="w-full h-fullVH overflow-auto pt-24 px-10">
            <h1>Admin Profile</h1>
            <button onClick={exitHandler} className="border-2 px-5">exit</button>
        </div>
    )
}

export default AdminProfile