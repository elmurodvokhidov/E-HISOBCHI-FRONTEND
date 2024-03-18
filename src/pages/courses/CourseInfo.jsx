import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../config/authService";
import {
    courseFailure,
    courseStart,
    getCourseSuccess
} from "../../redux/slices/courseSlice";
import CourseImg from "../../img/sticker.webp";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import CourseEditModal from "../../components/modals/CourseEditModal";
import { Toast, ToastLeft } from "../../config/sweetToast";
import Swal from "sweetalert2";

function CourseInfo() {
    const { course } = useSelector(state => state.course);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [updatedCourse, setUpdatedCourse] = useState({
        title: "",
        code: "",
        lesson_duration: "",
        course_duration: "",
        price: "",
        description: "",
    });
    const navigate = useNavigate();

    const openModal = () => {
        setModal(true);
        setUpdatedCourse(course);
    };

    useEffect(() => {
        const getCourse = async () => {
            try {
                dispatch(courseStart());
                const { data } = await AuthService.getCourse(id);
                dispatch(getCourseSuccess(data));
            } catch (error) {
                dispatch(courseFailure(error.response?.data.message));
                await Toast.fire({
                    icon: "error",
                    title: error.response?.data.message || error.message,
                });
            }
        };

        getCourse();
    }, [id]);

    const updateHandler = async (e) => {
        e.preventDefault();
        if (
            updatedCourse.title !== "" &&
            updatedCourse.code !== "" &&
            updatedCourse.lesson_duration !== "" &&
            updatedCourse.course_duration !== "" &&
            updatedCourse.price !== "" &&
            updatedCourse.description !== ""
        ) {
            try {
                dispatch(courseStart());
                const { _id, __v, color, createdAt, updatedAt, ...newCourseCred } = updatedCourse;
                const { data } = await AuthService.updateCourse(updatedCourse._id, newCourseCred);
                dispatch(getCourseSuccess(data));
                setModal(false);
                await Toast.fire({
                    icon: "success",
                    title: data.message
                });
            } catch (error) {
                dispatch(courseFailure(error.response?.data.error));
                await ToastLeft.fire({
                    icon: "error",
                    title: error.response?.data.error || error.message
                });
            }
        }
        else {
            await ToastLeft.fire({
                icon: "error",
                title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
            });
        }
    };

    const deleteCourse = async () => {
        Swal.fire({
            title: "Ishonchingiz komilmi?",
            text: "Buni qaytara olmaysiz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Yo'q",
            confirmButtonText: "Ha, albatta!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(courseStart());
                AuthService.deleteCourse(id).then(() => {
                    navigate("/admin/courses");
                    Toast.fire({
                        icon: "success",
                        title: "Kurs muvaffaqiyatli o'chirildi!"
                    });
                }).catch((error) => {
                    dispatch(courseFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                });
            }
        });
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 pb-10 px-10">
            {
                course ? <>
                    <h1 className="text-3xl pb-4">{course.title}</h1>
                    <span className="text-gray-500">{course.code}</span>

                    <div className="flex gap-8">
                        <div className="w-1/3 shadow-dim bg-white">
                            <div className="flex flex-col items-center justify-center gap-8 relative pt-14" style={{ background: course.color }}>
                                <h1 className="text-[16px] font-bold text-white">{course.title}</h1>
                                <figure className="w-48">
                                    <img className="w-full" src={CourseImg} alt="course logo" />
                                </figure>
                                <div className="flex items-start justify-center gap-2 absolute top-5 right-6">
                                    <button onClick={openModal} className="w-8 h-8 flex items-center justify-center border rounded-full text-white hover:text-cyan-600 hover:bg-white"><LiaEditSolid /></button>
                                    <button onClick={deleteCourse} className="w-8 h-8 flex items-center justify-center border rounded-full text-white hover:text-cyan-600 hover:bg-white"><RiDeleteBin7Line /></button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 p-8">
                                <div>
                                    <span className="text-[12px] text-gray-500">Tavsif</span>
                                    <h1 className="text-[16px] text-black">{course.description}</h1>
                                </div>
                                <div>
                                    <span className="text-[12px] text-gray-500">Narx</span>
                                    <h1 className="text-[14px] text-black">{course.price} UZS</h1>
                                </div>
                                <div>
                                    <span className="text-[12px] text-gray-500">Kurs davomiyligi</span>
                                    <h1 className="text-[14px] text-black">{course.course_duration} oy</h1>
                                </div>
                                <div>
                                    <span className="text-[12px] text-gray-500">Dars davomiyligi</span>
                                    <h1 className="text-[14px] text-black">{course.lesson_duration} daqiqa</h1>
                                </div>
                            </div>
                        </div>

                        <div className="w-2/3">
                            <h1 className="text-gray-500 text-[14px] border-b-2 py-2">Guruhlar</h1>

                            <div>
                                {/* guruhlar */}
                            </div>
                        </div>
                    </div>
                </> :
                    <div className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                        <div className="w-[85%] h-4 rounded bg-gray-300">&nbsp;</div>
                        <div className="w-[50%] h-4 rounded bg-gray-300">&nbsp;</div>
                        <div className="w-[65%] h-4 rounded bg-gray-300">&nbsp;</div>
                    </div>
            }

            {/* course edit modal */}
            <CourseEditModal
                modal={modal}
                setModal={setModal}
                updatedCourse={updatedCourse}
                setUpdatedCourse={setUpdatedCourse}
                updateHandler={updateHandler}
            />
        </div>
    )
}

export default CourseInfo