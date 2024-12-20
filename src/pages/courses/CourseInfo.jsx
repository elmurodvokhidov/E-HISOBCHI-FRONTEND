import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import service from "../../config/service";
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
import { FormattedDate } from "../../components/FormattedDate";
import { Bin, Pencil } from "../../assets/icons/Icons";

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
            const { data } = await service.getCourse(id);
            dispatch(getCourseSuccess(data));
        } catch (error) {
            dispatch(courseFailure(error.response?.data.message));
            Toast.fire({ icon: "error", title: error.response?.data.message || error.message });
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
                const { _id, __v, createdAt, updatedAt, ...newCourseCred } = updatedCourse;
                const { data } = await service.updateCourse(updatedCourse._id, newCourseCred);
                // dispatch(getCourseSuccess(data));
                getCourse();
                clearModal();
                Toast.fire({
                    icon: "success",
                    title: data.message
                });
            } catch (error) {
                dispatch(courseFailure(error.response?.data.error));
                ToastLeft.fire({ icon: "error", title: error.response?.data.error || error.message });
            }
        }
        else {
            ToastLeft.fire({ icon: "error", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
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
                service.deleteCourse(id).then(() => {
                    navigate("/courses");
                    Toast.fire({ icon: "success", title: "Kurs muvaffaqiyatli o'chirildi!" });
                }).catch((error) => {
                    dispatch(courseFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                });
            }
        });
    };

    return (
        <div className="container">
            {
                course ? <>
                    <h1 className="text-3xl pc:text-4xl pb-4">{course.title}</h1>
                    {/* <span className="text-gray-500">{course.code}</span> */}

                    <div className="lg:flex gap-8">
                        <div className="lg:w-[30%] small:w-full shadow-smooth rounded overflow-hidden bg-white">
                            <div className="flex flex-col items-center justify-center gap-8 relative pt-14" style={{ background: course.color }}>
                                <h1 className="text-base pc:text-lg font-bold text-white">{course.title}</h1>
                                <figure className="w-48">
                                    <img className="w-full" src={CourseImg} alt="course logo" />
                                </figure>
                                <div className="flex items-start justify-center gap-2 absolute pc:text-lg top-5 right-6">
                                    <button
                                        onClick={openModal}
                                        className="size-8 pc:size-10 flex items-center justify-center border rounded-full text-white hover:text-main-1 hover:bg-white"
                                    >
                                        <Pencil />
                                    </button>
                                    <button
                                        onClick={deleteCourse}
                                        className="size-8 pc:size-10 flex items-center justify-center border rounded-full text-white hover:text-main-1 hover:bg-white"
                                    >
                                        <Bin />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 p-8">
                                <div>
                                    <span className="text-xs pc:text-base text-gray-500">Tavsif</span>
                                    <h1 className="text-base pc:text-lg text-black">{course.description}</h1>
                                </div>
                                <div>
                                    <span className="text-xs pc:text-base text-gray-500">Narx</span>
                                    <h1 className="text-sm pc:text-base text-black">{course.price.toLocaleString()} UZS</h1>
                                </div>
                                <div>
                                    <span className="text-xs pc:text-base text-gray-500">Kurs davomiyligi</span>
                                    <h1 className="text-sm pc:text-base text-black">{course.course_duration} oy</h1>
                                </div>
                                <div>
                                    <span className="text-xs pc:text-base text-gray-500">Talabalar</span>
                                    <h1 className="text-sm pc:text-base text-black">
                                        {course.groups.reduce((total, group) => total + group.students?.length, 0)}
                                    </h1>
                                </div>
                                <div>
                                    <span className="text-xs pc:text-base text-gray-500">Dars davomiyligi</span>
                                    <h1 className="text-sm pc:text-base text-black">{course.lesson_duration} daqiqa</h1>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-2/3 lg:mt-0 small:w-full small:mt-8">
                            <h1 className="text-gray-500 text-sm pc:text-base border-b-2 py-2">Guruhlar</h1>

                            <div className="grid md:grid-cols-2 small:grid-cols-1 gap-8 mt-8">
                                {
                                    course.groups.length > 0 ?
                                        course.groups.map((group, index) => (
                                            <NavLink to={`/group-info/${group._id}`} key={index}>
                                                <div className="courseCard md:w-50% small:w-full p-4 cursor-pointer bg-white shadow-smooth rounded">
                                                    <h1 className="w-fit text-xs pc:text-base rounded px-2 py-1 bg-gray-200">{group.name}</h1>
                                                    <div className="flex items-start justify-between gap-8">
                                                        <h2 className="text-sm pc:text-base transition-all duration-300">{group.teacher?.first_name} {group.teacher?.last_name}</h2>
                                                        <div className="text-xs pc:text-base text-gray-500">
                                                            <h1 className="flex items-center gap-1">
                                                                <FormattedDate date={group.start_date} />
                                                                <GoHorizontalRule />
                                                            </h1>
                                                            <FormattedDate date={group.end_date} />
                                                        </div>
                                                        <div className="text-xs pc:text-base text-gray-500">
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