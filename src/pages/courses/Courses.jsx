import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import {
    allCourseSuccess,
    courseFailure,
    courseStart,
} from "../../redux/slices/courseSlice";
import AuthService from "../../config/authService";
import CourseImg from "../../img/sticker.webp";
import { useNavigate } from "react-router-dom";
import CourseModal from "./CourseModal";
import Skeleton from "../../components/loaders/Skeleton";

function Courses() {
    const { courses, isLoading } = useSelector(state => state.course);
    const dispatch = useDispatch();
    const [newCourse, setNewCourse] = useState({
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

    // Tasodifiy ranglarni generatsiya qiladigan funksiya
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getAllCourses = async () => {
        try {
            dispatch(courseStart());
            const { data } = await AuthService.getAllCourses();
            dispatch(allCourseSuccess(data));
        } catch (error) {
            dispatch(courseFailure(error.message));
        }
    };

    useEffect(() => {
        getAllCourses();
    }, []);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewCourse({
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

    const createHandler = async (e) => {
        e.preventDefault();
        if (
            newCourse.title !== "" &&
            newCourse.code !== "" &&
            newCourse.lesson_duration !== "" &&
            newCourse.course_duration !== "" &&
            newCourse.price !== "" &&
            newCourse.description !== ""
        ) {
            try {
                dispatch(courseStart());
                const { data } = await AuthService.addNewCourse({ ...newCourse, color: getRandomColor() });
                getAllCourses();
                clearModal();
                await Toast.fire({
                    icon: "success",
                    title: data.message
                });
            } catch (error) {
                dispatch(courseFailure(error.response?.data.message));
                await ToastLeft.fire({
                    icon: "error",
                    title: error.response?.data.message || error.message
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

    return (
        <div className="w-full h-screen overflow-auto pt-24 pb-10 px-10">
            <div className="flex justify-between border-b-2 pb-4 relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">Kurslar</h1>
                </div>
                <button
                    onClick={() => {
                        handleModal("modal", true);
                        handleModal("createModal", true);
                    }}
                    className="global_add_btn">
                    Yangisini qo'shish
                </button>
            </div>

            {
                isLoading ? <div className="py-8">
                    <Skeleton parentWidth={90} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                </div> :
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-8 py-8">
                        {
                            courses.length > 0 ? courses.map((course, index) => (
                                <div key={index} onClick={() => navigate(`/admin/course-info/${course._id}`)} className="shadow-dim hover:shadow-2xl cursor-pointer bg-white">
                                    <div className="flex flex-col items-center justify-center gap-8 pt-14" style={{ background: course.color }}>
                                        <h1 className="text-[16px] font-bold text-white">{course.title}</h1>
                                        <figure className="w-48">
                                            <img className="w-full" src={CourseImg} alt="course logo" />
                                        </figure>
                                    </div>
                                    <div className="flex flex-col gap-4 p-8">
                                        <h1 className="text-[16px] text-black">{course.title}</h1>
                                        <h1 className="text-[14px] text-gray-500">{course.price} UZS</h1>
                                    </div>
                                </div>
                            )) : <h1>Ma'lumot topilmadi!</h1>
                        }
                    </div>
            }


            {/* add new course modal */}
            <CourseModal
                isLoading={isLoading}
                modals={modals}
                newCourse={newCourse}
                setNewCourse={setNewCourse}
                clearModal={clearModal}
                createAndUpdateHandler={createHandler}
            />
        </div>
    )
}

export default Courses