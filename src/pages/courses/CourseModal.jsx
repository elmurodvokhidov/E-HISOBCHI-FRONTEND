import { IoCloseOutline } from 'react-icons/io5';

function CourseModal({
    isLoading,
    modals,
    newCourse,
    setNewCourse,
    clearModal,
    createAndUpdateHandler,
}) {
    const times = ["30", "40", "60", "80", "90", "120", "150", "180", "240", "280", "300"];

    const getCourseCred = (e) => {
        setNewCourse({
            ...newCourse,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div
            onClick={() => clearModal()}
            className="w-full h-screen fixed top-0 left-0 z-20"
            style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modals.modal ? "1" : "0", zIndex: modals.modal ? "20" : "-1" }}>
            <form
                onClick={(e) => e.stopPropagation()}
                className="lg:w-[27%] small:w-[60%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white"
                style={{ right: modals.modal ? "0" : "-200%" }}>
                <div
                    className="flex justify-between text-xl p-5 border-b-2">
                    <h1>{newCourse._id ? "Kurs ma'lumotlarini yangilash" : "Yangi kurs ma'lumotlari"}</h1>
                    <button
                        type="button"
                        onClick={() => clearModal()}
                        className="hover:text-red-500 transition-all duration-300">
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Form's body */}
                <div className="flex flex-col gap-2 px-5 py-7">
                    {/* Course name */}
                    <div className="flex flex-col">
                        <label htmlFor="title" className="text-sm pc:text-lg">
                            <span>Kurs nomi</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            onChange={getCourseCred}
                            value={newCourse.title}
                            type="text"
                            name="title"
                            id="title"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                    </div>

                    {/* Course code */}
                    <div className="flex flex-col">
                        <label htmlFor="code" className="text-sm pc:text-lg">
                            <span>Kurs kodi</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            onChange={getCourseCred}
                            value={newCourse.code}
                            type="text"
                            name="code"
                            id="code"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                    </div>

                    {/* Lesson duration */}
                    <div className="flex flex-col">
                        <label htmlFor="lesson_duration" className="text-sm pc:text-lg">
                            <span>Dars davomiyligi</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <select
                            onChange={getCourseCred}
                            value={newCourse.lesson_duration}
                            name="lesson_duration"
                            id="lesson_duration"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1">
                            {
                                times.map((time, index) => (
                                    <option value={time} key={index}>{time} daqiqa</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Course duration */}
                    <div className="flex flex-col">
                        <label htmlFor="course_duration" className="text-sm pc:text-lg">
                            <span>Kurs davomiyligi (oylarda)</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            onChange={getCourseCred}
                            value={newCourse.course_duration}
                            type="number"
                            name="course_duration"
                            id="course_duration"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col">
                        <label htmlFor="price" className="text-sm pc:text-lg">
                            <span>Narx</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            onChange={getCourseCred}
                            value={newCourse.price}
                            type="number"
                            name="price"
                            id="price"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                    </div>

                    {/* Commentary */}
                    <div className="flex flex-col">
                        <label htmlFor="description" className="text-sm pc:text-lg">Izoh</label>
                        <textarea
                            onChange={getCourseCred}
                            value={newCourse.description}
                            name="description"
                            id="description"
                            cols="30"
                            rows="3"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1"></textarea>
                    </div>

                    {/* Button */}
                    <button
                        disabled={isLoading ? true : false}
                        onClick={createAndUpdateHandler}
                        className="w-fit px-6 py-1 mt-8 pc:text-lg bg-main-1 rounded-2xl text-white">
                        {isLoading ? "Loading..." : newCourse._id ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CourseModal