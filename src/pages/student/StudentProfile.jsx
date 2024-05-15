import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../config/authService";
import {
    allGroupSuccess,
    groupFailure,
    groupStart
} from "../../redux/slices/groupSlice";
import {
    getStudentSuccess,
    studentFailure,
    studentStart
} from "../../redux/slices/studentSlice";
import { Toast, ToastLeft } from "../../config/sweetToast";
import StudentModal from "./StudentModal";
import Skeleton from "../../components/loaders/Skeleton";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { days } from "../../config/days";
import { IoPersonCircleOutline, IoRemoveOutline } from "react-icons/io5";
import PaymentModal from "./PaymentModal";
import { getCookie } from "../../config/cookiesService";
import { MdOutlinePrint } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import Swal from "sweetalert2";
import { DateTime } from "../../components/DateTime";

function StudentProfile({ student, isLoading, getStudentFunction }) {
    const { auth } = useSelector(state => state.auth);
    const { groups } = useSelector(state => state.group);
    const dispatch = useDispatch();
    const [newStudent, setNewStudent] = useState({
        first_name: "",
        last_name: "",
        father_name: "",
        mother_name: "",
        dob: "",
        phoneNumber: "",
        fatherPhoneNumber: "",
        motherPhoneNumber: "",
        gender: "",
        group: "",
    });
    const [newPass, setNewPass] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [modals, setModals] = useState({
        modal: false,
        createModal: false,
        passModal: false,
        parentsModal: false,
        imageModal: false,
        more: null,
        extra: false,
        payModal: false,
    });

    const getAllGroupsFunc = async () => {
        try {
            dispatch(groupStart());
            const { data } = await AuthService.getAllGroups();
            dispatch(allGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.message));
        }
    };

    useEffect(() => {
        getAllGroupsFunc();
    }, []);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const openModal = () => {
        setNewStudent(student);
        handleModal("modal", true);
        handleModal("editModal", false);
    };

    const clearModal = () => {
        setNewStudent({
            first_name: "",
            last_name: "",
            father_name: "",
            mother_name: "",
            dob: "",
            phoneNumber: "",
            fatherPhoneNumber: "",
            motherPhoneNumber: "",
            gender: "",
            group: "",
        });
        setNewPass({ newPassword: "", confirmPassword: "" });
        setModals({
            modal: false,
            createModal: false,
            passModal: false,
            parentsModal: false,
            imageModal: false,
            more: null,
            payModal: false,
        });
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        // o'quvchi parolini o'zgartirish
        if (modals.passModal && newStudent._id) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(studentStart());
                    const { data } = await AuthService.updateStudentPass({ ...newPass, _id: newStudent._id });
                    dispatch(getStudentSuccess(data));
                    clearModal();
                    Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                }
            }
            else {
                ToastLeft.fire({
                    icon: "error",
                    title: "Parol 8 ta belgidan kam bo'lmasligi kerak!"
                });
            }
        }
        else {
            if (
                newStudent.first_name !== "" &&
                newStudent.last_name !== "" &&
                newStudent.phoneNumber !== "" &&
                newStudent.group !== ""
            ) {
                dispatch(studentStart());
                try {
                    // o'quvchi ma'lumotlarini o'zgartirish
                    const { _id, __v, password, createdAt, updatedAt, ...newStudentCred } = newStudent;
                    const { data } = await AuthService.updateStudent(newStudent._id, newStudentCred);
                    await AuthService.caclStudentBalance();
                    dispatch(getStudentSuccess(data));
                    getStudentFunction();
                    clearModal();
                    Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                }
            }
            else {
                ToastLeft.fire({
                    icon: "error",
                    title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
                });
            }
        }
    };

    // O'quvchi to'lov tarixini o'chirish
    const deleteStudentPayHistory = async (id) => {
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
                AuthService.deleteStudentPay(id).then((res) => {
                    getStudentFunction();
                    clearModal();
                    Toast.fire({
                        icon: "success",
                        title: res?.data.message
                    });
                }).catch((error) => {
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                });
            }
        });
    };

    return (
        <div
            className="container"
            onClick={() => handleModal("more", null)}
        >
            <div className="lg:flex gap-8">
                {isLoading || !student ?
                    <div className="w-[410px]">
                        <Skeleton
                            parentWidth={100}
                            firstChildWidth={85}
                            secondChildWidth={50}
                            thirdChildWidth={65}
                        />
                    </div> : <>
                        <div className="sm:w-[410px] h-fit border py-8 px-6 rounded shadow-dim">
                            <div className="flex relative justify-start gap-10">
                                <div className="w-full flex flex-col gap-4 text-sm">
                                    <div className="flex items-center gap-4">
                                        <figure className={`size-20 rounded-[50%] overflow-hidden ${isLoading ? "bg-gray-300 animate-pulse" : null}`}>
                                            {
                                                student?.avatar && student?.avatar !== "" ? <img
                                                    className="w-full h-full object-cover"
                                                    src={student?.avatar}
                                                    alt="logo"
                                                /> : <>
                                                    <IoPersonCircleOutline className="w-full h-full text-gray-400" />
                                                </>
                                            }
                                        </figure>
                                        <div>
                                            <h1 className="capitalize text-xl">{student?.first_name} {student?.last_name}</h1>
                                            {
                                                auth?.role === "admin" || auth?.role === "student" ?
                                                    <h1 className={`${student?.balance > 0 ? 'bg-green-700' : student?.balance < 0 ? 'bg-red-700' : 'bg-gray-500'} w-fit text-xs text-white px-3 py-px rounded-xl`}>
                                                        {Math.floor(student?.balance).toLocaleString()} UZS
                                                    </h1>
                                                    : null
                                            }
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-20">
                                        <span className="text-gray-500">Telefon:</span>
                                        <span className="text-blue-300">+(998) {student?.phoneNumber}</span>
                                    </div>

                                    <div className="flex justify-between gap-20">
                                        <span className="text-gray-500">Tug'ilgan kun:</span>
                                        {
                                            student?.dob ?
                                                <DateTime date={student?.dob} /> :
                                                <IoRemoveOutline />
                                        }
                                    </div>

                                    <div className="flex items-center justify-between gap-20">
                                        <p className="w-fit px-2 rounded bg-gray-200">{student?.gender}</p>
                                        {
                                            auth?.role === "admin" ?
                                                <button
                                                    onClick={() => handleModal("payModal", true)}
                                                    className="global_add_btn"
                                                    style={{ fontSize: "12px", paddingTop: "2px", paddingBottom: "2px" }}
                                                >
                                                    To'lov
                                                </button>
                                                : null
                                        }
                                    </div>

                                    {/* Batafsil */}
                                    <button
                                        onClick={() => handleModal("extra", !modals.extra)}
                                        type="button"
                                        className="flex items-center justify-end gap-1 text-sm outline-none mt-2">
                                        {
                                            modals.extra
                                                ?
                                                <FaAngleUp />
                                                :
                                                <FaAngleDown />
                                        }
                                        Batafsil
                                    </button>
                                    {
                                        modals.extra ? <>
                                            <div className="flex flex-col gap-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Otasining ismi:</span>
                                                    <span>
                                                        {
                                                            student?.father_name !== "" ?
                                                                student?.father_name :
                                                                <IoRemoveOutline className="text-gray-500" />
                                                        }
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Telefon:</span>
                                                    <span style={{ color: student?.fatherPhoneNumber ? "#93C5FD" : "#6B7280" }}>
                                                        {
                                                            student?.fatherPhoneNumber ?
                                                                `+(998) ${student?.fatherPhoneNumber}` :
                                                                <IoRemoveOutline />
                                                        }
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Onasining ismi:</span>
                                                    <span>
                                                        {
                                                            student?.mother_name !== "" ?
                                                                student?.mother_name :
                                                                <IoRemoveOutline className="text-gray-500" />
                                                        }
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Telefon:</span>
                                                    <span style={{ color: student?.motherPhoneNumber ? "#93C5FD" : "#6B7280" }}>
                                                        {
                                                            student?.motherPhoneNumber ?
                                                                `+(998) ${student?.motherPhoneNumber}` :
                                                                <IoRemoveOutline />
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </> : null
                                    }
                                </div>

                                {
                                    auth?.role === "admin" ?
                                        <div className="w-fit h-fit absolute top-0 right-0">
                                            <button
                                                disabled={isLoading}
                                                onClick={openModal}
                                                className="size-8 flex items-center justify-center text-lg border rounded-full text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300">
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                        : null
                                }
                            </div>
                        </div>
                    </>
                }

                <div className="lg:w-2/3 2xsm:w-full">
                    {/* Guruhlar */}
                    <div className="lg:mt-0 2xsm:mt-8">
                        <h1 className="text-gray-500 text-base border-b-2 pb-2">Guruhlar</h1>

                        <div className="grid xl:grid-cols-2 2xsm:grid-cols-1 gap-8 mt-6">
                            {
                                isLoading || !student ? <>
                                    <h1>Loading...</h1>
                                </> : <>
                                    {
                                        student?.group ?
                                            <NavLink to={`/${getCookie("x-auth")}/group-info/${student?.group._id}`}>
                                                <div className="courseCard xl:w-50% p-4 cursor-pointer bg-white shadow-smooth rounded">
                                                    <h1 className="w-fit text-xs rounded px-2 py-1 bg-gray-200">{student?.group.name}</h1>
                                                    <div className="flex items-start justify-between gap-8">
                                                        <h2 className="text-sm transition-all duration-300">
                                                            {student?.group.teacher?.first_name} {student?.group.teacher?.last_name}
                                                        </h2>
                                                        <div className="text-xs text-gray-500">
                                                            <h1 className="flex items-center gap-1">
                                                                <DateTime date={student?.group.start_date} />
                                                                <span className="inline-block align-middle w-4 border border-gray-300"></span>
                                                            </h1>
                                                            <DateTime date={student?.group.end_date} />
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            <h1>{days.find(day => day.value === student?.group.day)?.title}</h1>
                                                            <h1>{student?.group.start_time}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </NavLink>
                                            : <h1>Guruh mavjud emas!</h1>
                                    }
                                </>
                            }
                        </div>
                    </div>


                    {/* To'lovlar */}
                    {
                        !isLoading &&
                            student?.payment_history.length > 0 ? <>
                            <div className="mt-10">
                                <h1 className="text-gray-500 text-base border-b-2 pb-2">To'lovlar</h1>
                                <div className="shadow-smooth rounded px-6 py-4 mt-6 overflow-y-auto bg-white">
                                    <div className="w-fit flex lg:gap-4 p-2 text-sm">
                                        <h1 className="min-w-[150px]">Sana</h1>
                                        <h1 className="min-w-[200px]">Miqdor</h1>
                                        <h1 className="min-w-[400px]">Izoh</h1>
                                    </div>
                                    <div className="w-fit max-h-60">
                                        {
                                            student?.payment_history.map(pay => (
                                                <div
                                                    key={pay._id}
                                                    className="studentPayHistory flex lg:gap-4 p-2 rounded odd:bg-gray-100"
                                                >
                                                    <h1 className="min-w-[150px] text-sm">
                                                        <DateTime date={pay.date} />
                                                    </h1>
                                                    <h1 className="min-w-[200px] text-base text-green-500">
                                                        <span>+</span>
                                                        {pay.amount?.toLocaleString()}
                                                        <span className="text-black text-xs"> UZS</span>
                                                    </h1>
                                                    <h1 className="min-w-[400px] flex items-center text-sm">
                                                        {
                                                            pay.description !== "" ?
                                                                pay.description : <IoRemoveOutline className="text-gray-500" />
                                                        }
                                                    </h1>
                                                    {/* more button */}
                                                    <div onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleModal("more", pay._id)
                                                    }} className="relative cursor-pointer text-cyan-600 text-xl">
                                                        <IoMdMore />
                                                        {/* more btn modal */}
                                                        <div className={`${modals.more === pay._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-xs bg-white`}>
                                                            <button
                                                                className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"
                                                            >
                                                                <MdOutlinePrint className="text-base" />
                                                                Print
                                                            </button>
                                                            <button
                                                                onClick={() => deleteStudentPayHistory(pay._id)}
                                                                className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"
                                                            >
                                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                                                </svg>
                                                                O'chirish
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </> : null
                    }
                </div>
            </div>

            {/* create new student and update student modal */}
            <StudentModal
                modals={modals}
                handleModal={handleModal}
                newStudent={newStudent}
                setNewStudent={setNewStudent}
                newPass={newPass}
                setNewPass={setNewPass}
                handleCreateAndUpdate={updateHandler}
                isLoading={isLoading}
                clearModal={clearModal}
                groups={groups}
            />

            {/* payment modal */}
            <PaymentModal
                handleModal={handleModal}
                modals={modals}
                isLoading={isLoading}
                student={student}
            />
        </div >
    )
}

export default StudentProfile