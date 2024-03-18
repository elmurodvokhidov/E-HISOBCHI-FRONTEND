import { useEffect, useState } from "react"
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastLeft } from "../../config/sweetToast";
import {
    allCourseSuccess,
    courseFailure,
    courseStart,
    // newCourseSuccess
} from "../../redux/slices/courseSlice";
import AuthService from "../../config/authService";
import CourseImg from "../../img/sticker.webp";
import { useNavigate } from "react-router-dom";

function Courses() {
    const { courses, isLoading } = useSelector(state => state.course);
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: "",
        code: "",
        lesson_duration: "",
        course_duration: "",
        price: "",
        description: "",
    });
    const colors = ["#FF7BA3", "#FF7092", "#3ADDAE", "#8BCDCD", "#9AD3BC", "#67DB73", "#94D652", "#F87561", "#C38CEE"];
    const navigate = useNavigate();

    const getNewCourseCred = (e) => {
        setNewCourse({
            ...newCourse,
            [e.target.name]: e.target.value
        });
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

    const addNewCourse = async (e) => {
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
                const { data } = await AuthService.addNewCourse({ ...newCourse, color: colors[Math.floor(Math.random() * colors.length)] });
                // dispatch(newCourseSuccess(data));
                clearModal();
                setModal(false);
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
        getAllCourses();
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 pb-10 px-10">
            <div className="flex justify-between border-b-2 pb-4 relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">Kurslar</h1>
                </div>
                <button onClick={() => setModal(true)} className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">Yangisini qo'shish</button>
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-8 py-8">
                {
                    courses && courses.map((course, index) => (
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
                    ))
                }
            </div>


            {/* add new modal */}
            <div onClick={() => setModal(false)} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
                <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                    <div className="flex justify-between text-xl p-5 border-b-2"><h1>Yangi kurs ma'lumotlari</h1> <button type="button" onClick={() => setModal(false)} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                    <div className="flex flex-col gap-2 px-5 py-7">
                        <div className="flex flex-col">
                            <label htmlFor="title" className="text-[14px]">Kurs nomi</label>
                            <input onChange={getNewCourseCred} value={newCourse.title} type="text" name="title" id="title" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="code" className="text-[14px]">Kurs kodi</label>
                            <input onChange={getNewCourseCred} value={newCourse.code} type="text" name="code" id="code" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="lesson_duration" className="text-[14px]">Dars davomiyligi</label>
                            <select onChange={getNewCourseCred} value={newCourse.lesson_duration} name="lesson_duration" id="lesson_duration" className="border-2 border-gray-500 rounded px-2 py-1">
                                <option value="30">30 daqiqa</option>
                                <option value="40">40 daqiqa</option>
                                <option value="60">60 daqiqa</option>
                                <option value="80">80 daqiqa</option>
                                <option value="90">90 daqiqa</option>
                                <option value="120">120 daqiqa</option>
                                <option value="150">150 daqiqa</option>
                                <option value="180">180 daqiqa</option>
                                <option value="240">240 daqiqa</option>
                                <option value="280">280 daqiqa</option>
                                <option value="300">300 daqiqa</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="course_duration" className="text-[14px]">Kurs davomiyligi (oylarda)</label>
                            <input onChange={getNewCourseCred} value={newCourse.course_duration} type="number" name="course_duration" id="course_duration" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="price" className="text-[14px]">Narx</label>
                            <input onChange={getNewCourseCred} value={newCourse.price} type="number" name="price" id="price" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="description" className="text-[14px]">Izoh</label>
                            <textarea onChange={getNewCourseCred} value={newCourse.description} name="description" id="description" cols="30" rows="3" className="border-2 border-gray-500 rounded px-2 py-1"></textarea>
                        </div>

                        <button disabled={isLoading ? true : false} onClick={addNewCourse} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : "Qo'shish"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Courses