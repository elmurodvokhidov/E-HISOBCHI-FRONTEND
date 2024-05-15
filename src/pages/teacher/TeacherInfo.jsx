import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { Toast } from "../../config/sweetToast";
import {
    getTeacherSuccess,
    teacherFailure,
    teacherStart
} from "../../redux/slices/teacherSlice";
import AuthService from "../../config/authService";
import TeacherProfile from "./TeacherProfile";

export default function TeacherInfo() {
    const { teacher, isLoading } = useSelector(state => state.teacher);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        const getTeacherFunction = async () => {
            try {
                dispatch(teacherStart());
                const { data } = await AuthService.getTeacher(id);
                dispatch(getTeacherSuccess(data));
            } catch (error) {
                dispatch(teacherFailure(error.response?.data.message));
                Toast.fire({
                    icon: "error",
                    title: error.response?.data.message || error.message,
                });
            }
        };

        getTeacherFunction();
    }, []);

    return <TeacherProfile teacher={teacher} isLoading={isLoading} />
};