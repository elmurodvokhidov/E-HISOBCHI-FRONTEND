import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../config/authService";
import {
    getGroupSuccess,
    groupFailure,
    groupStart
} from "../../redux/slices/groupSlice";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import { useDispatch, useSelector } from "react-redux";
import { GoDotFill } from "react-icons/go";
import { IoMdMore } from "react-icons/io";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
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

function GroupInfo() {
    const { group, isLoading } = useSelector(state => state.group);
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
                const { _id, __v, students, createdAt, updatedAt, ...updatedGroupCred } = newGroup;
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
        <div className="w-full h-screen overflow-auto pt-24 px-10">
            <div className="flex items-center gap-3 text-2xl">
                {group && <>
                    <span>{group.name}</span>
                    <span><GoDotFill fontSize={10} /></span>
                    <span>{group.course.title}</span>
                    <span><GoDotFill fontSize={10} /></span>
                    <span>{group.teacher.first_name} {group.teacher.last_name}</span>
                </>}
            </div>

            <main className="flex mt-4">
                {
                    group ? <>
                        <div className="w-1/3 shadow-smooth p-6 bg-white">
                            <div className="flex justify-between border-b pb-4">
                                <div className="flex flex-col gap-4">
                                    <h1 className="w-fit rounded-sm px-2 bg-gray-200">{group.name}</h1>

                                    <div className="flex items-center gap-2 text-[18px]">
                                        <span>{group.course.title}</span>
                                        <span><GoDotFill fontSize={6} /></span>
                                        <span>{group.teacher.first_name} {group.teacher.last_name}</span>
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
                                                <span className="inline-block align-middle w-4 border border-gray-500"></span>
                                                <h1>{group.end_date}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="flex flex-col justify-start gap-2">
                                    <button
                                        onClick={openModal}
                                        className="w-8 h-8 flex items-center justify-center border border-cyan-600 rounded-full text-cyan-600 hover:text-white hover:bg-cyan-600"><LiaEditSolid /></button>
                                    <button
                                        onClick={() => deleteHandler(group._id)}
                                        className="w-8 h-8 flex items-center justify-center border border-red-500 rounded-full text-red-500 hover:text-white hover:bg-red-500">
                                        <RiDeleteBin7Line />
                                    </button>
                                </div>
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
                        <Skeleton parentWidth={90} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
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
        </div>
    )
}

export default GroupInfo