import React from 'react'
import { IoCloseOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';

function CourseEditModal({
    updateHandler,
    modal,
    setModal,
    updatedCourse,
    setUpdatedCourse
}) {
    const { isLoading } = useSelector(state => state.course);

    const getCourseCred = (e) => {
        setUpdatedCourse({
            ...updatedCourse,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div onClick={() => setModal(false)} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
            <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                <div className="flex justify-between text-xl p-5 border-b-2"><h1>Kurs ma'lumotlarini yangilash</h1> <button type="button" onClick={() => setModal(false)} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                <div className="flex flex-col gap-2 px-5 py-7">
                    <div className="flex flex-col">
                        <label htmlFor="title" className="text-[14px]">Kurs nomi</label>
                        <input onChange={getCourseCred} value={updatedCourse.title} type="text" name="title" id="title" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="code" className="text-[14px]">Kurs kodi</label>
                        <input onChange={getCourseCred} value={updatedCourse.code} type="text" name="code" id="code" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="lesson_duration" className="text-[14px]">Dars davomiyligi</label>
                        <select onChange={getCourseCred} value={updatedCourse.lesson_duration} name="lesson_duration" id="lesson_duration" className="border-2 border-gray-500 rounded px-2 py-1">
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
                        <input onChange={getCourseCred} value={updatedCourse.course_duration} type="number" name="course_duration" id="course_duration" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="price" className="text-[14px]">Narx</label>
                        <input onChange={getCourseCred} value={updatedCourse.price} type="number" name="price" id="price" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="description" className="text-[14px]">Izoh</label>
                        <textarea onChange={getCourseCred} value={updatedCourse.description} name="description" id="description" cols="30" rows="3" className="border-2 border-gray-500 rounded px-2 py-1"></textarea>
                    </div>
                    <button disabled={isLoading ? true : false} onClick={updateHandler} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : "Saqlash"}</button>
                </div>
            </form>
        </div>
    )
}

export default CourseEditModal