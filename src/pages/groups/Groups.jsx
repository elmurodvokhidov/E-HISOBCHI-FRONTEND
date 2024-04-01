import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import AuthService from "../../config/authService";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import Swal from "sweetalert2";
import {
    allCourseSuccess,
    courseFailure,
    courseStart
} from "../../redux/slices/courseSlice";
import {
    allGroupSuccess,
    getGroupSuccess,
    groupFailure,
    groupStart
} from "../../redux/slices/groupSlice";
import {
    allTeacherSuccess,
    teacherFailure,
    teacherStart
} from "../../redux/slices/teacherSlice";
import {
    allRoomSuccess,
    roomFailure,
    roomStart
} from "../../redux/slices/roomSlice";
import GroupModal from "./GroupModal";

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
        // createModal: false,
        more: null,
    });
    const navigate = useNavigate();

    const getAllGroupsFunc = async () => {
        try {
            dispatch(groupStart());
            const { data } = await AuthService.getAllGroups();
            dispatch(allGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.message));
        }
    };

    const getAllCoursesFunc = async () => {
        try {
            dispatch(courseStart());
            const { data } = await AuthService.getAllCourses();
            dispatch(allCourseSuccess(data));
        } catch (error) {
            dispatch(courseFailure(error.message));
        }
    };

    const getAllTeachersFunc = async () => {
        try {
            dispatch(teacherStart());
            const { data } = await AuthService.getAllTeachers();
            dispatch(allTeacherSuccess(data));
        } catch (error) {
            dispatch(teacherFailure(error.message));
        }
    };

    const getAllRoomsFunc = async () => {
        try {
            dispatch(roomStart());
            const { data } = await AuthService.getAllRooms();
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
            // createModal: false,
            more: null,
        });
    };

    const openModal = (id) => {
        setNewGroup(groups.filter(group => group._id === id)[0]);
        handleModal("modal", true);
    };

    const handleCreateAndUpdate = async (e) => {
        e.preventDefault();
        if (
            newGroup.name !== "" &&
            newGroup.course !== "" &&
            newGroup.day !== "" &&
            newGroup.room !== "" &&
            newGroup.start_time !== "" &&
            newGroup.start_date !== "" &&
            newGroup.end_date !== ""
        ) {
            try {
                dispatch(groupStart());
                if (!newGroup._id) {
                    const { data } = await AuthService.addNewGroup(newGroup);
                    getAllGroupsFunc();
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } else {
                    const { _id, __v, students, createdAt, updatedAt, ...updatedGroupCred } = newGroup;
                    const { data } = await AuthService.updateGroup(newGroup._id, updatedGroupCred);
                    dispatch(getGroupSuccess(data));
                    getAllGroupsFunc();
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                }
            } catch (error) {
                dispatch(groupFailure(error.response?.data.message));
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
                AuthService.deleteGroup(id).then((res) => {
                    getAllGroupsFunc();
                    Toast.fire({
                        icon: "success",
                        title: res?.data.message
                    });
                }).catch((error) => {
                    dispatch(groupFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                });
            }
        });
    };

    return (
        <div className="students w-full h-screen overflow-auto pt-24 px-10" onClick={() => handleModal("more", null)}>
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">Guruhlar</h1>
                    <p>
                        <span>Miqdor</span>
                        <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span>
                        <span>{groups?.length}</span>
                    </p>
                </div>
                <button
                    onClick={() => handleModal("modal", true)}
                    className="global_add_btn">
                    Yangisini qo'shish
                </button>
            </div>

            <div className="flex gap-4 py-5">
                <input
                    className="px-4 py-1 text-[12px] outline-cyan-600 border-2 rounded"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search by name or phone" />

                <select
                    name=""
                    id=""
                    className="text-[12px] outline-cyan-600 border-2 rounded">
                    <option
                        value=""
                        className="text-gray-700 block px-4 py-2 text-sm italic">
                        None
                    </option>
                    {
                        courses.map(course => (
                            <option
                                key={course._id}
                                value={course?.title}
                                className="text-gray-700 block px-4 py-2 text-sm">
                                {course?.title}
                            </option>
                        ))
                    }
                </select>
            </div>

            <table className="w-full mt-4">
                <thead>
                    <tr className="font-semibold text-[14px] flex justify-between text-left px-4">
                        <th className="w-[130px] text-left">Guruh</th>
                        <th className="w-[200px] text-left">Kurslar</th>
                        <th className="w-[270px] text-left">O'qituvchi</th>
                        <th className="w-[130px] text-left">Kunlar</th>
                        <th className="w-[130px] text-left">Sanalar</th>
                        <th className="w-[100px] text-left">Xonalar</th>
                        <th className="w-[80px] text-left">Talabalar</th>
                        <th className="w-[80px] text-left">Amallar</th>
                    </tr>
                </thead>
                <tbody className="grid grid-cols-1 2xsm:gap-4 py-4">
                    {isLoading ? <>
                        <tr className="w-[90%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                            <td className="w-[85%] h-4 rounded bg-gray-300">&nbsp;</td>
                            <td className="w-[50%] h-4 rounded bg-gray-300">&nbsp;</td>
                            <td className="w-[65%] h-4 rounded bg-gray-300">&nbsp;</td>
                        </tr>
                    </> : groups.length > 0 ?
                        groups.map((group, index) => (
                            <tr
                                onClick={() => navigate(`/admin/group-info/${group._id}`)}
                                key={index}
                                className="2xsm:w-full flex items-center justify-between capitalize text-[15px] border-2 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-smooth">
                                <td className="w-[130px] text-left">{group.name}</td>
                                <td className="w-[200px] text-left">{group.course?.title}</td>
                                <td className="w-[270px] text-left">{group.teacher?.first_name} {group.teacher?.last_name}</td>
                                <td className="w-[130px] text-left text-sm">
                                    <div>
                                        <h1>{group.day}</h1>
                                        <h1>{group.start_time}</h1>
                                    </div>
                                </td>
                                <td className="w-[130px] text-left text-sm">
                                    <div>
                                        <h1 className="flex items-center gap-1">
                                            {group.start_date}
                                            <span className="inline-block align-middle w-4 border border-gray-500"></span>
                                        </h1>
                                        <h1>{group.end_date}</h1>
                                    </div>
                                </td>
                                <td className="w-[100px] text-left">{group.room.name}</td>
                                <td className="w-[80px] text-center">{group.students.length}</td>
                                <td className="w-[80px] flex justify-center gap-8">
                                    {/* more button */}
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                        handleModal("more", group._id)
                                    }} className="relative cursor-pointer text-cyan-600 text-xl">
                                        <IoMdMore />
                                        {/* more btn modal */}
                                        <div className={`${modals.more === group._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
                                            <button onClick={() => openModal(group._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"><LiaEditSolid />Tahrirlash</button>
                                            <button onClick={() => deleteHandler(group._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"><RiDeleteBin7Line />O'chirish</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )) : <tr><td>Ma'lumot topilmadi</td></tr>
                    }
                </tbody>
            </table>

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