import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import AuthService from "../../config/authService";
import {
    courseFailure,
    courseStart,
    getCourseSuccess
} from "../../redux/slices/courseSlice";
import CourseImg from "../../assets/images/sticker.webp";
import CourseModal from "./CourseModal";
import { Toast, ToastLeft } from "../../config/sweetToast";
import Swal from "sweetalert2";
import Skeleton from "../../components/loaders/Skeleton";
import { GoHorizontalRule } from "react-icons/go";
import { days } from "../../config/days";
import { getCookie } from "../../config/cookiesService";

function CourseInfo() {
    const { auth } = useSelector(state => state.auth);
    const { course, isLoading } = useSelector(state => state.course);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [updatedCourse, setUpdatedCourse] = useState({
        title: "",
        code: "",
        lesson_duration: "",
        course_duration: "",
        price: "",
        description: "",
    });
    const [modals, setModals] = useState({
        modal: false,
        createModal: false,
    });
    const navigate = useNavigate();

    const openModal = () => {
        setUpdatedCourse(course);
        handleModal("modal", true);
        handleModal("createModal", false);
    };

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

    useEffect(() => {
        getCourse();
    }, [id]);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setUpdatedCourse({
            title: "",
            code: "",
            lesson_duration: "",
            course_duration: "",
            price: "",
            description: "",
        });
        setModals({
            modal: false,
            createModal: false,
        });
    };

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
                const { _id, __v, color, groups, createdAt, updatedAt, ...newCourseCred } = updatedCourse;
                const { data } = await AuthService.updateCourse(updatedCourse._id, newCourseCred);
                // dispatch(getCourseSuccess(data));
                getCourse();
                clearModal();
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
        <div className="container">
            {
                course ? <>
                    <h1 className="text-3xl pb-4">{course.title}</h1>
                    {/* <span className="text-gray-500">{course.code}</span> */}

                    <div className="lg:flex gap-8">
                        <div className="lg:w-[30%] 2xsm:w-full shadow-smooth rounded overflow-hidden bg-white">
                            <div className="flex flex-col items-center justify-center gap-8 relative pt-14" style={{ background: course.color }}>
                                <h1 className="text-base font-bold text-white">{course.title}</h1>
                                <figure className="w-48">
                                    <img className="w-full" src={CourseImg} alt="course logo" />
                                </figure>
                                {
                                    auth?.role === "admin" ?
                                        <div className="flex items-start justify-center gap-2 absolute top-5 right-6">
                                            <button
                                                onClick={openModal}
                                                className="w-8 h-8 flex items-center justify-center border rounded-full text-white hover:text-cyan-600 hover:bg-white"
                                            >
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={deleteCourse}
                                                className="w-8 h-8 flex items-center justify-center border rounded-full text-white hover:text-cyan-600 hover:bg-white"
                                            >
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                        : null
                                }
                            </div>
                            <div className="flex flex-col gap-4 p-8">
                                <div>
                                    <span className="text-xs text-gray-500">Tavsif</span>
                                    <h1 className="text-base text-black">{course.description}</h1>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Narx</span>
                                    <h1 className="text-sm text-black">{course.price} UZS</h1>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Kurs davomiyligi</span>
                                    <h1 className="text-sm text-black">{course.course_duration} oy</h1>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Talabalar</span>
                                    <h1 className="text-sm text-black">
                                        {course.groups.reduce((total, group) => total + group.students?.length, 0)}
                                    </h1>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Dars davomiyligi</span>
                                    <h1 className="text-sm text-black">{course.lesson_duration} daqiqa</h1>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-2/3 lg:mt-0 2xsm:w-full 2xsm:mt-8">
                            <h1 className="text-gray-500 text-sm border-b-2 py-2">Guruhlar</h1>

                            <div className="grid md:grid-cols-2 2xsm:grid-cols-1 gap-8 mt-8">
                                {
                                    course.groups.length > 0 ?
                                        course.groups.map((group, index) => (
                                            <NavLink to={`/${getCookie("x-auth")}/group-info/${group._id}`} key={index}>
                                                <div className="courseCard md:w-50% 2xsm:w-full p-4 cursor-pointer bg-white shadow-smooth rounded">
                                                    <h1 className="w-fit text-xs rounded px-2 py-1 bg-gray-200">{group.name}</h1>
                                                    <div className="flex items-start justify-between gap-8">
                                                        <h2 className="text-sm transition-all duration-300">{group.teacher?.first_name} {group.teacher?.last_name}</h2>
                                                        <div className="text-xs text-gray-500">
                                                            <h1 className="flex items-center gap-1">
                                                                {group.start_date}
                                                                <GoHorizontalRule />
                                                            </h1>
                                                            <h1>{group.end_date}</h1>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            <h1>{days.find(day => day.value === group.day)?.title}</h1>
                                                            <h1>{group.start_time}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </NavLink>
                                        )) : <h1>Ma'lumot topilmadi!</h1>
                                }
                            </div>
                        </div>
                    </div>
                </> :
                    <Skeleton parentWidth={90} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
            }

            {/* course edit modal */}
            <CourseModal
                isLoading={isLoading}
                modals={modals}
                newCourse={updatedCourse}
                setNewCourse={setUpdatedCourse}
                clearModal={clearModal}
                createAndUpdateHandler={updateHandler}
            />
        </div>
    )
}

export default CourseInfo