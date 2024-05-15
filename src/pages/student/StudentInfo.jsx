import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { Toast } from "../../config/sweetToast";
import {
    getStudentSuccess,
    studentFailure,
    studentStart
} from "../../redux/slices/studentSlice";
import StudentProfile from "./StudentProfile";
import AuthService from "../../config/authService";

function StudentInfo() {
    const { student, isLoading } = useSelector(state => state.student);
    const dispatch = useDispatch();
    const { id } = useParams();

    const getStudentFunction = async () => {
        try {
            dispatch(studentStart());
            const { data } = await AuthService.getStudent(id);
            dispatch(getStudentSuccess(data));
        } catch (error) {
            dispatch(studentFailure(error.response?.data.message));
            Toast.fire({
                icon: "error",
                title: error.response?.data.message || error.message,
            });
        }
    };

    useEffect(() => {
        getStudentFunction();
    }, []);

    return <StudentProfile
        student={student}
        isLoading={isLoading}
        getStudentFunction={getStudentFunction}
    />
}

export default StudentInfo