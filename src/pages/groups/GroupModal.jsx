import { IoCloseOutline } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useSelector } from "react-redux";

function GroupModal({
    handleCreateAndUpdate,
    modal,
    newGroup,
    courses,
    teachers,
    rooms,
    days,
    closeModal,
    getGroupCred,
    isLoading,
}) {

    return (
        <div onClick={closeModal} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
            <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                <div className="flex justify-between text-xl p-5 border-b-2"><h1>{newGroup._id ? "Guruh ma'lumotlarini yangilash" : "Yangi guruh ma'lumotlari"}</h1> <button type="button" onClick={closeModal} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                <div className="flex flex-col gap-2 px-5 py-7">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-[14px]">Nomi</label>
                        <input onChange={getGroupCred} value={newGroup.name} type="text" name="name" id="name" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="course" className="text-[14px]">Kurs tanlash</label>
                        <select onChange={getGroupCred} value={newGroup.course} name="course" id="course" className="border-2 border-gray-500 rounded px-2 py-1">
                            <option value="" className="italic">None</option>
                            {
                                courses.map(course => (
                                    <option value={course._id} key={course._id}>{course.title}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="teacher" className="text-[14px]">O'qituvchini tanlang</label>
                        <select onChange={getGroupCred} value={newGroup.teacher} name="teacher" id="teacher" className="border-2 border-gray-500 rounded px-2 py-1">
                            <option value="" className="italic">None</option>
                            {
                                teachers.map(teacher => (
                                    <option value={teacher._id} key={teacher._id}>{teacher.first_name} {teacher.last_name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="day" className="text-[14px]">Kunlar</label>
                        <select onChange={getGroupCred} value={newGroup.day} name="day" id="day" className="border-2 border-gray-500 rounded px-2 py-1">
                            <option value="" className="italic">None</option>
                            {
                                days.map((day, index) => (
                                    <option value={day} key={index}>{day}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="room" className="text-[14px]">Xonani tanlang</label>
                        <select onChange={getGroupCred} value={newGroup.room} name="room" id="room" className="border-2 border-gray-500 rounded px-2 py-1">
                            <option value="" className="italic">None</option>
                            {
                                rooms.map(room => (
                                    <option value={room._id} key={room._id}>{room.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="start_time" className="text-[14px]">Darsning boshlanish vaqti</label>
                        <input onChange={getGroupCred} value={newGroup.start_time} type="time" name="start_time" id="start_time" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="start_date" className="text-[14px]">Guruh boshlanish sanasi</label>
                        <input onChange={getGroupCred} value={newGroup.start_date} type="date" name="start_date" id="start_date" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    {
                        newGroup.start_date !== "" ?
                            <div className="flex flex-col">
                                <label htmlFor="end_date" className="text-[14px]">Guruh tugash sanasi</label>
                                <input onChange={getGroupCred} value={newGroup.end_date} type="date" name="end_date" id="end_date" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            : null
                    }

                    <button disabled={isLoading ? true : false} onClick={handleCreateAndUpdate} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : newGroup._id ? "Saqlash" : "Qo'shish"}</button>
                </div>
            </form>
        </div>
    )
}

export default GroupModal