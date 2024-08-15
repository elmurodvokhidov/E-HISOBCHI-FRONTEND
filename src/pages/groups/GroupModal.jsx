import { IoCloseOutline } from "react-icons/io5";
import { days } from "../../config/days";

function GroupModal({
    handleCreateAndUpdate,
    modals,
    newGroup,
    setNewGroup,
    courses,
    teachers,
    rooms,
    clearModal,
    isLoading,
}) {
    const getGroupCred = (e) => {
        setNewGroup({
            ...newGroup,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div
            onClick={clearModal}
            className="w-full h-screen fixed top-0 left-0 z-20"
            style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modals.modal ? "1" : "0", zIndex: modals.modal ? "20" : "-1" }}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleCreateAndUpdate}
                className="lg:w-[27%] small:w-[60%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white"
                style={{ right: modals.modal ? "0" : "-200%" }}>
                <div
                    className="flex justify-between text-xl p-5 border-b-2">
                    <h1>{newGroup._id ? "Guruh ma'lumotlarini yangilash" : "Yangi guruh ma'lumotlari"}</h1>
                    <button
                        type="button"
                        onClick={clearModal}
                        className="hover:text-red-500 transition-all duration-300">
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Form's Body */}
                <div className="flex flex-col gap-2 px-5 py-7">
                    {/* Group name */}
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-sm pc:text-lg">
                            <span>Nomi</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            onChange={getGroupCred}
                            value={newGroup.name}
                            type="text"
                            name="name"
                            id="name"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                    </div>

                    {/* Course */}
                    <div className="flex flex-col">
                        <label htmlFor="course" className="text-sm pc:text-lg">
                            <span>Kurs tanlash</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <select
                            onChange={getGroupCred}
                            value={newGroup.course}
                            name="course"
                            id="course"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1">
                            <option value="" className="italic">None</option>
                            {
                                courses.map(course => (
                                    <option value={course._id} key={course._id}>{course.title}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Teacher */}
                    <div className="flex flex-col">
                        <label htmlFor="teacher" className="text-sm pc:text-lg">
                            <span>O'qituvchini tanlang</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <select
                            onChange={getGroupCred}
                            value={newGroup.teacher}
                            name="teacher"
                            id="teacher"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1">
                            <option value="" className="italic">None</option>
                            {
                                teachers.map(teacher => (
                                    <option value={teacher._id} key={teacher._id}>
                                        {teacher.first_name + " " + teacher.last_name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Day */}
                    <div className="flex flex-col">
                        <label htmlFor="day" className="text-sm pc:text-lg">
                            <span>Kunlar</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <select
                            onChange={getGroupCred}
                            value={newGroup.day}
                            name="day"
                            id="day"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1">
                            <option value="" className="italic">None</option>
                            {
                                days.map((day, index) => (
                                    <option value={day.value} key={index}>{day.title}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Room */}
                    <div className="flex flex-col">
                        <label htmlFor="room" className="text-sm pc:text-lg">
                            <span>Xonani tanlang</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <select
                            onChange={getGroupCred}
                            value={newGroup.room}
                            name="room"
                            id="room"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1">
                            <option value="" className="italic">None</option>
                            {
                                rooms.map(room => (
                                    <option value={room._id} key={room._id}>{room.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Start lesson time */}
                    <div className="flex flex-col">
                        <label htmlFor="start_time" className="text-sm pc:text-lg">
                            <span>Darsning boshlanish vaqti</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            onChange={getGroupCred}
                            value={newGroup.start_time}
                            type="time"
                            name="start_time"
                            id="start_time"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                    </div>

                    {/* Start lesson date */}
                    <div className="flex flex-col">
                        <label htmlFor="start_date" className="text-sm pc:text-lg">
                            <span>Guruh boshlanish sanasi</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            onChange={getGroupCred}
                            value={newGroup.start_date}
                            type="date"
                            name="start_date"
                            id="start_date"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                    </div>

                    {/* End lesson date */}
                    {
                        newGroup._id &&
                        <div className="flex flex-col">
                            <label htmlFor="end_date" className="text-sm pc:text-lg">
                                <span>Guruh tugash sanasi</span>
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                                onChange={getGroupCred}
                                value={newGroup.end_date}
                                type="date"
                                name="end_date"
                                id="end_date"
                                className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                        </div>
                    }

                    {/* Button */}
                    <button
                        disabled={isLoading ? true : false}
                        type="submit"
                        className="w-fit px-6 py-1 mt-8 pc:text-lg bg-main-1 rounded-2xl text-white">
                        {isLoading ? "Loading..." : newGroup._id ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default GroupModal