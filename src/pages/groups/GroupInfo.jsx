import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthService from "../../config/authService";
import {
    getGroupSuccess,
    groupFailure,
    groupStart
} from "../../redux/slices/groupSlice";
import { Toast } from "../../assets/sweetToast";
import { useDispatch, useSelector } from "react-redux";

function GroupInfo() {
    const { group } = useSelector(state => state.group);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        const getGroupFunc = async () => {
            try {
                dispatch(groupStart());
                const { data } = await AuthService.getGroup(id);
                dispatch(getGroupSuccess(data));
            } catch (error) {
                dispatch(groupFailure(error.response?.data.message));
                await Toast.fire({
                    icon: "error",
                    title: error.response?.data.message || error.message,
                });
            }
        };

        getGroupFunc();
    }, [id]);

    return (
        <div className="w-full h-screen overflow-auto pt-24 px-10">{group?.name}</div>
    )
}

export default GroupInfo