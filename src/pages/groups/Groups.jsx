import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastLeft } from "../../config/sweetToast";
import service from "../../config/service";
import { useNavigate } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import Swal from "sweetalert2";
import { allCourseSuccess, courseFailure } from "../../redux/slices/courseSlice";
import { allGroupSuccess, getGroupSuccess, groupFailure, groupStart } from "../../redux/slices/groupSlice";
import { allTeacherSuccess, teacherFailure } from "../../redux/slices/teacherSlice";
import { allRoomSuccess, roomFailure } from "../../redux/slices/roomSlice";
import GroupModal from "./GroupModal";
import { GoHorizontalRule } from "react-icons/go";
import * as XLSX from 'xlsx';
import { MdFileDownload } from "react-icons/md";
import { days } from "../../config/days";
import { FormattedDate } from "../../components/FormattedDate";
import { Bin, Pencil } from "../../assets/icons/Icons";

function Groups() {
    const { groups, isLoading } = useSelector(state => state.group);
    const { courses } = useSelector(state => state.course);
    const { teachers } = useSelector(state => state.teacher);
    const { rooms } = useSelector(state => state.room);
    const dispatch = useDispatch();
    const [newGroup, setNewGroup] = useState({
        name: "",
        course: "",
        teacher: "",
        day: "",
        room: "",
        start_time: "",
        start_date: "",
        end_date: "",
    });
    const [modals, setModals] = useState({
        modal: false,
        more: null,
    });
    const [filters, setFilters] = useState({
        teacher: "",
        course: "",
        day: "",
        start_date: "",
        end_date: ""
    });
    const navigate = useNavigate();

    const getAllGroupsFunc = async () => {
        try {
            dispatch(groupStart());
            const { data } = await service.getAllGroups();
            dispatch(allGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.message));
        }
    };

    const getAllCoursesFunc = async () => {
        try {
            const { data } = await service.getAllCourses();
            dispatch(allCourseSuccess(data));
        } catch (error) {
            dispatch(courseFailure(error.message));
        }
    };

    const getAllTeachersFunc = async () => {
        try {
            const { data } = await service.getAllTeachers();
            dispatch(allTeacherSuccess(data));
        } catch (error) {
            dispatch(teacherFailure(error.message));
        }
    };

    const getAllRoomsFunc = async () => {
        try {
            const { data } = await service.getAllRooms();
            dispatch(allRoomSuccess(data));
        } catch (error) {
            dispatch(roomFailure(error.message));
        }
    };

    useEffect(() => {
        getAllGroupsFunc();
        getAllCoursesFunc();
        getAllTeachersFunc();
        getAllRoomsFunc();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Guruhlarni filterlash funksiyasi
    const filteredGroups = groups.filter(group => {
        return Object.entries(filters).every(([key, value]) => {
            if (value === "") return true;

            if (key === "teacher") return `${group[key].first_name} ${group[key].last_name}` === value;
            if (key === "course") return group[key].title === value;
            if (key === "day") return group[key] === value;

            if (key === 'start_date' || key === 'end_date') {
                const groupStartDate = new Date(group['start_date']);
                const groupEndDate = new Date(group['end_date']);
                const filterStartDate = new Date(filters['start_date']);
                const filterEndDate = new Date(filters['end_date']);

                if (filters['start_date'] && filters['end_date']) return groupStartDate >= filterStartDate && groupEndDate <= filterEndDate;
                else if (filters['start_date']) return groupStartDate >= filterStartDate;
                else if (filters['end_date']) return groupEndDate <= filterEndDate;
                else return true;
            }

            return group[key] === value;
        });
    });

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewGroup({
            name: "",
            course: "",
            teacher: "",
            day: "",
            room: "",
            start_time: "",
            start_date: "",
            end_date: "",
        });
        setModals({
            modal: false,
            more: null,
        });
    };

    const openModal = (group) => {
        setNewGroup({
            ...group,
            course: group?.course?._id,
            room: group?.room?._id,
            teacher: group?.teacher?._id,
        });
        handleModal("modal", true);
    };

    // Barcha guruh ma'lumotlarini exel fayli sifatida yuklab olish funksiyasi
    const exportToExcel = () => {
        const fileName = 'groups.xlsx';
        const header = ["Guruh nomi", "Kurs nomi", "O'qituvchi ismi", "Dars kunlari", "Boshlanish sanasi", "Tugash sanasi", "Xona", "O'quvchilar soni"];

        const data = filteredGroups.map(group => [
            group.name || '',
            group.course?.title || '',
            `${group.teacher?.first_name} ${group.teacher?.last_name}` || '',
            group.day || '',
            group.start_date || '',
            group.end_date || '',
            group.room?.name || '',
            group.students.length.toString() || '',
        ]);

        data.unshift(header);
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex]).length), 0)
        }));
        ws['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Groups');
        XLSX.writeFile(wb, fileName);
    };

    // Yangi guruh qo'shish hamda guruhni tahrirlash funksiyasi
    const handleCreateAndUpdate = async (e) => {
        e.preventDefault();
        if (
            newGroup.name !== "" &&
            newGroup.course !== "" &&
            newGroup.day !== "" &&
            newGroup.room !== "" &&
            newGroup.start_time !== "" &&
            newGroup.start_date !== ""
        ) {
            try {
                dispatch(groupStart());
                if (!newGroup._id) {
                    const { data } = await service.addNewGroup(newGroup);
                    getAllGroupsFunc();
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                } else {
                    const { _id, __v, createdAt, updatedAt, ...updatedGroupCred } = newGroup;
                    const { data } = await service.updateGroup(newGroup._id, updatedGroupCred);
                    dispatch(getGroupSuccess(data));
                    getAllGroupsFunc();
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                }
            } catch (error) {
                dispatch(groupFailure(error.response?.data.message));
                ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
            }
        }
        else {
            ToastLeft.fire({ icon: "error", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
        }
    };

    // Guruhni o'chirish funksiyasi
    const deleteHandler = async (id) => {
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
                dispatch(groupStart());
                service.deleteGroup(id).then((res) => {
                    getAllGroupsFunc();
                    Toast.fire({ icon: "success", title: res?.data.message });
                }).catch((error) => {
                    dispatch(groupFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                });
            }
        });
    };

    return (
        <div
            onClick={() => handleModal("more", null)}
            className="students container"
            style={{ paddingLeft: 0, paddingRight: 0 }}
        >
            <div className="sm:flex justify-between relative px-[40px]">
                <div className="flex items-end gap-4 text-sm pc:text-base">
                    <h1 className="capitalize text-2xl pc:text-3xl">Guruhlar</h1>
                    <p>
                        <span>Miqdor</span>
                        <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span>
                        <span>{groups?.length}</span>
                    </p>
                </div>
                <button
                    onClick={() => handleModal("modal", true)}
                    className="global_add_btn small:w-full small:mt-4 small:py-2 sm:w-fit sm:mt-0 sm:py-0">
                    Yangisini qo'shish
                </button>
            </div>

            <div className="flex items-center flex-wrap gap-4 py-8 px-[40px]">
                {/* Teachers */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="teacher"
                        className="absolute text-xs pc:text-base bg-main-2 -top-1.5 pc:-top-3 left-3">
                        <span>O'qituvchi</span>
                    </label>
                    <select
                        value={filters.teacher}
                        onChange={handleFilterChange}
                        name="teacher"
                        id="teacher"
                        className="w-full p-2 text-sm pc:text-base rounded border outline-main-1 bg-main-2">
                        <option
                            value=""
                            className="text-sm pc:text-base italic">
                            None
                        </option>
                        {
                            teachers.map(teacher => (
                                <option
                                    key={teacher._id}
                                    value={`${teacher.first_name} ${teacher.last_name}`}
                                    className="text-sm pc:text-lg">
                                    {teacher?.first_name} {teacher?.last_name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Courses */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="course"
                        className="absolute text-xs pc:text-base bg-main-2 -top-1.5 pc:-top-3 left-3">
                        <span>Kurslar</span>
                    </label>
                    <select
                        value={filters.course}
                        onChange={handleFilterChange}
                        name="course"
                        id="course"
                        className="w-full p-2 text-sm pc:text-base rounded border outline-main-1 bg-main-2">
                        <option
                            value=""
                            className="text-sm italic">
                            None
                        </option>
                        {
                            courses.map(course => (
                                <option
                                    key={course._id}
                                    value={course?.title}
                                    className="text-sm pc:text-lg">
                                    {course?.title}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Days */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="day"
                        className="absolute text-xs pc:text-base bg-main-2 -top-1.5 pc:-top-3 left-3">
                        <span>Kunlar</span>
                    </label>
                    <select
                        value={filters.day}
                        onChange={handleFilterChange}
                        name="day"
                        id="day"
                        className="w-full p-2 text-sm pc:text-base rounded border outline-main-1 bg-main-2">
                        <option
                            value=""
                            className="text-sm pc:text-base italic">
                            None
                        </option>
                        {
                            days.map((day, index) => (
                                <option
                                    value={day.value}
                                    key={index}
                                    className="text-sm pc:text-lg">
                                    {day.title}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* Start Date */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="start_date"
                        className="absolute text-xs pc:text-base bg-main-2 -top-1.5 pc:-top-3 left-3">
                        <span>Boshlanish</span>
                    </label>
                    <input
                        value={filters.start_date}
                        onChange={handleFilterChange}
                        type="date"
                        name="start_date"
                        id="start_date"
                        className="w-full p-1.5 text-sm pc:text-base rounded border outline-main-1 bg-main-2" />
                </div>

                {/* End Date */}
                <div className="relative text-gray-500">
                    <label
                        htmlFor="end_date"
                        className="absolute text-xs pc:text-base bg-main-2 -top-1.5 pc:-top-3 left-3">
                        <span>Tugash</span>
                    </label>
                    <input
                        value={filters.end_date}
                        onChange={handleFilterChange}
                        type="date"
                        name="end_date"
                        id="end_date"
                        className="w-full p-1.5 text-sm pc:text-base rounded border outline-main-1 bg-main-2" />
                </div>

                {/* Clear Filter */}
                <button
                    onClick={() => setFilters({ teacher: "", course: "", day: "", start_date: "", end_date: "" })}
                    className="border rounded p-2 text-sm pc:text-lg text-gray-700 bg-main-2 hover:bg-gray-100 hover:text-gray-500 transition-all"
                >
                    Filterni tiklash
                </button>
            </div>

            <div className="min-h-[200px] overflow-x-auto px-[40px] pb-[70px]">
                <table className="w-full mt-4">
                    <thead>
                        <tr className="font-semibold text-xs pc:text-lg flex justify-between text-left px-4">
                            <th className="w-[130px] text-left">Guruh</th>
                            <th className="w-[200px] text-left">Kurslar</th>
                            <th className="w-[270px] text-left">O'qituvchi</th>
                            <th className="w-[130px] text-left">Kunlar</th>
                            <th className="w-[130px] text-left">Sanalar</th>
                            <th className="w-[100px] text-left">Xonalar</th>
                            <th className="w-[80px] text-center">Talabalar</th>
                            <th className="w-[80px] text-center">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="grid grid-cols-1 small:gap-4 py-4">
                        {isLoading ? <>
                            <tr className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                                <td className="w-[85%] h-4 rounded bg-gray-300"></td>
                                <td className="w-[50%] h-4 rounded bg-gray-300"></td>
                                <td className="w-[65%] h-4 rounded bg-gray-300"></td>
                            </tr>
                        </> : filteredGroups.length > 0 ?
                            filteredGroups.map((group, index) => (
                                <tr
                                    onClick={() => navigate(`/admin/group-info/${group._id}`)}
                                    key={index}
                                    className="small:w-full flex items-center justify-between capitalize text-sm pc:text-base border rounded-lg px-4 py-3 cursor-pointer shadow-sm hover:shadow-md transition-all">
                                    <td className="w-[130px] text-left">{group.name}</td>
                                    <td className="w-[200px] text-left text-xs pc:text-base">{group.course?.title}</td>
                                    <td className="w-[270px] text-left pc:text-base">{group.teacher?.first_name} {group.teacher?.last_name}</td>
                                    <td className="w-[130px] text-left text-xs pc:text-base">
                                        <div>
                                            <h1>{days.find(day => day.value === group.day)?.title}</h1>
                                            <h1>{group.start_time}</h1>
                                        </div>
                                    </td>
                                    <td className="w-[130px] text-left text-xs pc:text-base">
                                        <div className="pc:text-base">
                                            <h1 className="flex items-center gap-1">
                                                <FormattedDate date={group.start_date} />
                                                <GoHorizontalRule />
                                            </h1>
                                            <FormattedDate date={group.end_date} />
                                        </div>
                                    </td>
                                    <td className="w-[100px] text-left text-xs pc:text-base">{group.room.name}</td>
                                    <td className="w-[80px] text-center pc:text-base">{group.students.length}</td>
                                    <td className="w-[80px] flex justify-center gap-8">
                                        {/* more button */}
                                        <div onClick={(e) => {
                                            e.stopPropagation();
                                            handleModal("more", group._id);
                                        }} className="relative cursor-pointer text-main-1 text-xl">
                                            <IoMdMore />
                                            {/* more btn modal */}
                                            <div className={`${modals.more === group._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute small:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] pc:text-base bg-white`}>
                                                <button
                                                    onClick={() => openModal(group)}
                                                    className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"
                                                >
                                                    <Pencil />
                                                    Tahrirlash
                                                </button>


                                                <button
                                                    onClick={() => deleteHandler(group._id)}
                                                    className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"
                                                >
                                                    <Bin />
                                                    O'chirish
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )) : <tr className="mx-auto my-6"><td>Guruh mavjud emas!</td></tr>
                        }
                    </tbody>
                </table>
            </div>

            {
                !isLoading &&
                <button
                    onClick={exportToExcel}
                    id="downloadExelBtn"
                    className="size-8 pc:size-10 relative float-end flex items-center justify-center small:mt-2 sm:mt-0 text-gray-400 border border-gray-300 outline-main-1 text-xl pc:text-2xl rounded-full hover:text-main-1 hover:bg-blue-100 transition-all mx-[40px]">
                    <MdFileDownload />
                </button>
            }

            {/* create and update group modal */}
            <GroupModal
                modals={modals}
                newGroup={newGroup}
                setNewGroup={setNewGroup}
                handleCreateAndUpdate={handleCreateAndUpdate}
                courses={courses}
                teachers={teachers}
                rooms={rooms}
                clearModal={clearModal}
                isLoading={isLoading}
            />
        </div>
    )
}

export default Groups