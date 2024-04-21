import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../config/authService";
import {
    getGroupSuccess,
    groupFailure,
    groupStart
} from "../../redux/slices/groupSlice";
import { Toast, ToastLeft } from "../../config/sweetToast";
import { useDispatch, useSelector } from "react-redux";
import { GoDotFill, GoHorizontalRule } from "react-icons/go";
import { IoMdMore } from "react-icons/io";
import Swal from "sweetalert2";
import GroupModal from "./GroupModal";
import {
    allCourseSuccess,
    courseFailure,
    courseStart
} from "../../redux/slices/courseSlice";
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
import Skeleton from "../../components/loaders/Skeleton";
import Attendance from "../../components/Attendance";

function GroupInfo() {
    const { group, isLoading } = useSelector(state => state.group);
    const { auth } = useSelector(state => state.auth);
    const { courses } = useSelector(state => state.course);
    const { teachers } = useSelector(state => state.teacher);
    const { rooms } = useSelector(state => state.room);
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
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

    const openModal = () => {
        setNewGroup(group);
        handleModal("modal", true);
    };

    const getGroupFunc = async () => {
        try {
            dispatch(groupStart());
            const { data } = await AuthService.getGroup(id);
            dispatch(getGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.response?.data.message));
            await Toast.fire({
                icon: "error",
                title: error.response?.data.message || error.message,
            });
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
        getGroupFunc();
        getAllCoursesFunc();
        getAllTeachersFunc();
        getAllRoomsFunc();
    }, [id]);

    const handleUpdate = async (e) => {
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
                const { _id, __v, students, color, attendance, createdAt, updatedAt, ...updatedGroupCred } = newGroup;
                const { data } = await AuthService.updateGroup(newGroup._id, updatedGroupCred);
                dispatch(getGroupSuccess(data));
                getGroupFunc();
                clearModal();
                await Toast.fire({
                    icon: "success",
                    title: data.message
                });
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
                    navigate("/admin/groups");
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
        <div className="container">
            <div className="flex items-center gap-3 text-2xl">
                {group && <>
                    <span>{group.name}</span>
                    <span><GoDotFill fontSize={10} /></span>
                    <span>{group.course.title}</span>
                    <span><GoDotFill fontSize={10} /></span>
                    <span>{group.teacher?.first_name} {group.teacher?.last_name}</span>
                </>}
            </div>

            <div className="2xl:flex">
                <main className="w-1/3 flex mt-4">
                    {
                        group ? <>
                            <div className="shadow-smooth p-6 bg-white">
                                <div className="flex justify-between border-b pb-4">
                                    <div className="flex flex-col gap-4">
                                        <h1 className="w-fit rounded-sm px-2 bg-gray-200">{group.name}</h1>

                                        <div className="flex items-center gap-2 text-[18px]">
                                            <span>{group.course.title}</span>
                                            <span><GoDotFill fontSize={6} /></span>
                                            <span>{group.teacher?.first_name} {group.teacher?.last_name}</span>
                                        </div>

                                        <div className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <b>Narx:</b>
                                                <span>{group.course.price} UZS</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <b>Vaqt:</b>
                                                <span>{group.day}</span>
                                                <span><GoDotFill fontSize={6} /></span>
                                                <span>{group.start_time}</span>
                                            </div>
                                        </div>

                                        <div className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <b>Xonalar:</b>
                                                <span>{group.room.name}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <b>Mashg'ulot sanalari:</b>
                                                <div className="flex items-center gap-1">
                                                    <h1 className="flex items-center gap-1">{group.start_date}</h1>
                                                    <GoHorizontalRule />
                                                    <h1>{group.end_date}</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {
                                        auth?.role === "admin" &&
                                        <div className="flex flex-col justify-start gap-2">
                                            <button
                                                onClick={openModal}
                                                className="w-8 h-8 flex items-center justify-center border border-cyan-600 rounded-full text-cyan-600 hover:text-white hover:bg-cyan-600">
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => deleteHandler(group._id)}
                                                className="w-8 h-8 flex items-center justify-center border border-red-500 rounded-full text-red-500 hover:text-white hover:bg-red-500">
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    }
                                </div>

                                <div className="flex flex-col gap-2 mt-6">
                                    {
                                        group.students.map((student, index) => (
                                            <div
                                                className="flex items-center justify-between text-xs"
                                                key={index}>
                                                <h1 className="w-6 text-gray-500">{index + 1}.</h1>
                                                <h1 className="w-48">{student.first_name} {student.last_name}</h1>
                                                <h1 className="w-28">{student.contactNumber}</h1>
                                                <button>
                                                    <IoMdMore className="text-[18px] text-cyan-600" />
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </> : <>
                            <Skeleton
                                parentWidth={90}
                                firstChildWidth={85}
                                secondChildWidth={50}
                                thirdChildWidth={65}
                            />
                        </>
                    }

                    {/* Davomat jadval */}
                    <div className="bg-red-200"></div>

                    {/* create and update group modal */}
                    <GroupModal
                        modals={modals}
                        newGroup={newGroup}
                        setNewGroup={setNewGroup}
                        handleCreateAndUpdate={handleUpdate}
                        courses={courses}
                        teachers={teachers}
                        rooms={rooms}
                        clearModal={clearModal}
                        isLoading={isLoading}
                    />
                </main>

                <div className="2xl:w-2/3 pt-4 overflow-x-auto">
                    {group && <Attendance
                        start={group.start_date}
                        end={group.end_date}
                        day={group.day}
                        students={group.students}
                        groupId={group._id}
                        groupAttendance={group.attendance}
                    />}
                </div>
            </div>
        </div>
    )
}

export default GroupInfo