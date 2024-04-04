import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import AuthService from "../../config/authService";
import {
    courseFailure,
    courseStart,
    getCourseSuccess
} from "../../redux/slices/courseSlice";
import CourseImg from "../../img/sticker.webp";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import CourseModal from "./CourseModal";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import Swal from "sweetalert2";
import Skeleton from "../../components/loaders/Skeleton";

function CourseInfo() {
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
                dispatch(getCourseSuccess(data));
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
        <div className="w-full h-screen overflow-auto pt-24 pb-10 px-10">
            {
                course ? <>
                    <h1 className="text-3xl pb-4">{course.title}</h1>
                    <span className="text-gray-500">{course.code}</span>

                    <div className="flex gap-8">
                        <div className="w-[30%] shadow-dim bg-white">
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
                                    {/* <span className="text-[12px] text-gray-500">Kurs davomiyligi</span>
                                    <h1 className="text-[14px] text-black">{course.course_duration} oy</h1> */}

                                    <span className="text-[12px] text-gray-500">Talabalar</span>
                                    <h1 className="text-[14px] text-black">{course.groups.reduce((total, group) => total + group.students.length, 0)}</h1>
                                </div>
                                <div>
                                    <span className="text-[12px] text-gray-500">Dars davomiyligi</span>
                                    <h1 className="text-[14px] text-black">{course.lesson_duration} daqiqa</h1>
                                </div>
                            </div>
                        </div>

                        <div className="w-2/3">
                            <h1 className="text-gray-500 text-[14px] border-b-2 py-2">Guruhlar</h1>

                            <div className="grid grid-cols-2 gap-8 mt-8">
                                {
                                    course.groups.length > 0 ?
                                        course.groups.map((group, index) => (
                                            <NavLink to={`/${localStorage.getItem("x-auth")}/group-info/${group._id}`} key={index}>
                                                <div className="courseCard w-50% p-4 cursor-pointer bg-white shadow-smooth">
                                                    <h1 className="w-fit text-xs rounded px-2 py-1 bg-gray-200">{group.name}</h1>
                                                    <div className="flex items-start justify-between gap-8">
                                                        <h2 className="text-sm transition-all duration-300">{group.teacher.first_name} {group.teacher.last_name}</h2>
                                                        <div className="text-xs text-gray-500">
                                                            <h1 className="flex items-center gap-1">{group.start_date}<span className="inline-block align-middle w-4 border border-gray-300"></span></h1>
                                                            <h1>{group.end_date}</h1>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            <h1>{group.day}</h1>
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