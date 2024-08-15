import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import service from "../../config/service";
import { getGroupSuccess, groupFailure, groupStart } from "../../redux/slices/groupSlice";
import { Toast, ToastLeft } from "../../config/sweetToast";
import { useDispatch, useSelector } from "react-redux";
import { GoDotFill, GoHorizontalRule } from "react-icons/go";
import { IoIosArrowRoundForward, IoMdMore } from "react-icons/io";
import Swal from "sweetalert2";
import GroupModal from "./GroupModal";
import { allCourseSuccess, courseFailure } from "../../redux/slices/courseSlice";
import { allTeacherSuccess, teacherFailure } from "../../redux/slices/teacherSlice";
import { allRoomSuccess, roomFailure } from "../../redux/slices/roomSlice";
import Skeleton from "../../components/loaders/Skeleton";
import Attendance from "../../components/Attendance";
import { days } from "../../config/days";
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";
import { MdFileDownload } from "react-icons/md";
import * as XLSX from 'xlsx';
import { FormattedDate } from "../../components/FormattedDate";
import { Bin, Pencil } from "../../assets/icons/Icons";

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
        about: null,
    });
    const [copied, setCopied] = useState("");
    // const isAdmin = auth?.role === "ceo";

    // Matnni nusxalash funksiyasi
    const handleCopy = (text) => {
        setCopied(text);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            setCopied("");
        }, 3000);
    };

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
        setNewGroup({
            ...group,
            course: group?.course?._id,
            room: group?.room?._id,
            teacher: group?.teacher?._id,
        });
        handleModal("modal", true);
    };

    const getGroupFunc = async () => {
        try {
            dispatch(groupStart());
            const { data } = await service.getGroup(id);
            dispatch(getGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.response?.data.message));
            Toast.fire({
                icon: "error",
                title: error.response?.data.message || error.message,
            });
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
                const { _id, __v, createdAt, updatedAt, ...updatedGroupCred } = newGroup;
                const { data } = await service.updateGroup(newGroup._id, updatedGroupCred);
                dispatch(getGroupSuccess(data));
                getGroupFunc();
                clearModal();
                Toast.fire({ icon: "success", title: data.message });
            } catch (error) {
                dispatch(groupFailure(error.response?.data.message));
                ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
            }
        }
        else {
            ToastLeft.fire({ icon: "error", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
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
                service.deleteGroup(id).then((res) => {
                    navigate("/admin/groups");
                    Toast.fire({ icon: "success", title: res?.data.message });
                }).catch((error) => {
                    dispatch(groupFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                });
            }
        });
    };

    // Guruhdagi barcha o'quvchilar ma'lumotlarini exel fayli sifatida yuklab olish funksiyasi
    const exportToExcel = () => {
        const fileName = 'group_students.xlsx';
        const header = ["Ism", "Familya", "Otasining ismi", "Onasining ismi", "Tug'ilgan sana", "Telefon raqam", "Otasining raqami", "Onasining raqami", "Guruh nomi"];

        const wb = XLSX.utils.book_new();
        const data = group?.students.map(student => [
            student.first_name || '',
            student.last_name || '',
            student.father_name || '',
            student.mother_name || '',
            student.dob || '',
            (student.phoneNumber || '').toString(),
            (student.fatherPhoneNumber || '').toString(),
            (student.motherPhoneNumber || '').toString(),
            student.group.name || ''
        ]);
        data.unshift(header);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex]).length), 0)
        }));
        ws['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        XLSX.writeFile(wb, fileName);
    };

    // Xabar jo'natish
    const sendSms = () => { };

    // O'quvchini guruhdan chiqarish
    const removeFromGroup = (studentId) => {
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
                service.removeFromGroup(studentId).then((res) => {
                    getGroupFunc();
                    Toast.fire({ icon: "success", title: res?.data.message });
                }).catch((error) => {
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                });
            }
        });
    };

    return (
        <div className="container" onClick={() => handleModal("more", null)}>
            <div className="flex items-center gap-3 text-2xl pc:text-3xl">
                {group && <>
                    <span>{group.name}</span>
                    <span><GoDotFill fontSize={10} /></span>
                    <span>{group.course.title}</span>
                    <span><GoDotFill fontSize={10} /></span>
                    <span>{group.teacher?.first_name + " " + group.teacher?.last_name}</span>
                </>}
            </div>

            <div className="2xl:flex gap-10">
                {group ? <>
                    <main className="w-[410px] pc:w-[460px] flex mt-4">
                        <div className="w-full shadow-md p-6 pb-4 rounded bg-white">
                            <div className="flex justify-between border-b pb-4">
                                <div className="flex flex-col gap-4">
                                    <h1 className="w-fit rounded-sm px-2 pc:text-lg bg-gray-200">{group.name}</h1>

                                    <div className="flex items-center gap-2 text-lg pc:text-xl">
                                        <NavLink
                                            className="hover:text-main-1 transition-all"
                                            to={`/admin/course-info/${group.course?._id}`}>
                                            {group.course.title}
                                        </NavLink>
                                        <span><GoDotFill fontSize={6} /></span>
                                        <NavLink
                                            className="hover:text-main-1 transition-all"
                                            to={`/admin/teacher-info/${group.teacher?._id}`}>
                                            {group.teacher?.first_name + " " + group.teacher?.last_name}
                                        </NavLink>
                                    </div>

                                    <div className="text-xs pc:text-base">
                                        <div className="flex items-center gap-2">
                                            <b>Narx:</b>
                                            <span>{group.course.price?.toLocaleString()} UZS</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <b>Vaqt:</b>
                                            <span>{days.find(day => day.value === group.day)?.title}</span>
                                            <span><GoDotFill fontSize={6} /></span>
                                            <span>{group.start_time}</span>
                                        </div>
                                    </div>

                                    <div className="text-xs pc:text-base">
                                        <div className="flex items-center gap-2">
                                            <b>Xonalar:</b>
                                            <span>{group.room.name}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <b>Mashg'ulot sanalari:</b>
                                            <div className="flex items-center gap-1">
                                                <h1 className="flex items-center gap-1">
                                                    <FormattedDate date={group.start_date} />
                                                </h1>
                                                <GoHorizontalRule />
                                                <FormattedDate date={group.end_date} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-start gap-2 pc:text-xl">
                                    <button
                                        onClick={openModal}
                                        className="size-8 pc:size-10 flex items-center justify-center border border-main-1 rounded-full text-main-1 hover:text-white hover:bg-main-1">
                                        <Pencil />
                                    </button>
                                    <button
                                        onClick={() => deleteHandler(group._id)}
                                        className="size-8 pc:size-10 flex items-center justify-center border border-red-500 rounded-full text-red-500 hover:text-white hover:bg-red-500">
                                        <Bin />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-6">
                                {!isLoading ?
                                    group.students.length > 0 ?
                                        <>{group.students.map((student, index) => (
                                            <div
                                                className="flex items-center justify-between text-xs pc:text-base"
                                                key={index}>
                                                <h1 className="w-6 text-gray-500">{index + 1}.</h1>
                                                {student.balance < 0 ?
                                                    <GoDotFill className="text-red-600" />
                                                    : null}
                                                <div
                                                    onMouseEnter={() => handleModal("about", student._id)}
                                                    onMouseLeave={() => handleModal("about", null)}
                                                    className="w-48 relative hover:text-main-1 cursor-pointer"
                                                >
                                                    <h1 className="w-fit">{student.first_name + " " + student.last_name}</h1>

                                                    {modals.about === student._id ? <>
                                                        <div className="w-64 pc:w-80 absolute -top-32 pc:-top-36 -right-44 pc:-right-60 z-10 text-black border rounded-md p-4 cursor-auto shadow-smooth bg-white before:w-4 before:h-4 before:bg-white before:absolute before:top-[48%] before:rotate-45 before:-left-2 before:border-b before:border-l">
                                                            <div className="border-b pb-4">
                                                                <p className="text-sm pc:text-lg">{student.first_name} {student.last_name}</p>
                                                                <p className={`w-fit px-2 py-1 mt-1 rounded-md text-white ${student.balance < 0 ? "bg-red-500" : ""}`}>{student.balance < 0 ? "Qarzdor" : ""}</p>
                                                            </div>

                                                            <div className="flex items-center justify-between py-4 border-b">
                                                                <p className="text-gray-500">Telefon:</p>
                                                                <p className="text-blue-500">{student.phoneNumber}</p>
                                                            </div>

                                                            <div className="flex items-center justify-between py-4 border-b">
                                                                <p className="text-gray-500">Balans:</p>
                                                                <p>{Math.round(student?.balance).toLocaleString()} UZS</p>
                                                            </div>

                                                            <div className="flex items-center justify-between py-4 border-b">
                                                                <p className="text-gray-500">Talaba qo'shilgan sana:</p>
                                                                <FormattedDate date={student.join_date} />
                                                            </div>

                                                            <div className="flex justify-end pt-4">
                                                                <NavLink
                                                                    to={`/admin/student-info/${student._id}`}
                                                                    className="flex items-center gap-1 hover:text-main-1">
                                                                    <span>Profilga o'tish</span>
                                                                    <IoIosArrowRoundForward className="text-gray-500" />
                                                                </NavLink>
                                                            </div>
                                                        </div>
                                                    </> : null}
                                                </div>
                                                <h1
                                                    onClick={() => handleCopy(student.phoneNumber)}
                                                    className="w-28 flex items-center gap-1 cursor-pointer"
                                                >
                                                    {student.phoneNumber}
                                                    <img
                                                        src={copied === student.phoneNumber ? tick : copy}
                                                        alt="copy svg"
                                                        className="size-3" />
                                                </h1>
                                                {/* more button */}
                                                <div onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleModal("more", student._id)
                                                }} className="relative cursor-pointer text-main-1 text-xl">
                                                    <IoMdMore />
                                                    {/* more btn modal */}
                                                    <div className={`${modals.more === student._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute small:left-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] pc:text-base pc:p-2 bg-white whitespace-nowrap`}>
                                                        <button
                                                            onClick={() => sendSms(student)}
                                                            className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"
                                                        >
                                                            Xabar jo'natish
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromGroup(student._id)}
                                                            className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"
                                                        >
                                                            Guruhdan chiqarish
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                            {/* Export to Excel button */}
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    onClick={exportToExcel}
                                                    id="downloadExelBtn"
                                                    className="size-8 pc:size-10 relative float-start flex items-center justify-center text-gray-400 border border-gray-300 outline-main-1 text-xl pc:text-2xl rounded-full hover:text-main-1 hover:bg-blue-100 transition-all"
                                                >
                                                    <MdFileDownload />
                                                </button>
                                            </div>
                                        </> : <h1 className="text-base">O'quvchilar mavjud emas!</h1> :
                                    <h1 className="pc:text-lg">Loading...</h1>}
                            </div>
                        </div>

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

                    {/* Davomat jadval */}
                    <div className="2xl:w-2/3 pt-4 px-4 overflow-x-auto">
                        {
                            group?.students?.length > 0 &&
                            <Attendance group={group} isLoading={isLoading} />
                        }
                    </div>
                </> :
                    <div className="w-full mt-5">
                        <Skeleton
                            parentWidth={100}
                            firstChildWidth={85}
                            secondChildWidth={50}
                            thirdChildWidth={65}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default GroupInfo