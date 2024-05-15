import { useEffect, useState } from "react";
import {
    getTeacherSuccess,
    teacherFailure,
    teacherStart
} from "../../redux/slices/teacherSlice";
import AuthService from "../../config/authService";
import { Toast, ToastLeft } from "../../config/sweetToast";
import TeacherModal from "./TeacherModal";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Skeleton from "../../components/loaders/Skeleton";
import { GoDotFill } from "react-icons/go";
import { days } from "../../config/days";
import { IoPersonCircleOutline, IoRemoveOutline } from "react-icons/io5";
import { getCookie } from "../../config/cookiesService";
import { DateTime } from "../../components/DateTime";
import CostModal from "../cost/CostModal";
import { costFailure, costStart, costSuccess } from "../../redux/slices/costSlice";

export default function TeacherProfile({ teacher, isLoading }) {
    const { auth } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [newTeacher, setNewTeacher] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        phoneNumber: "",
        gender: "",
    });
    const [newPass, setNewPass] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [modals, setModals] = useState({
        modal: false,
        createModal: false,
        passModal: false,
        imageModal: false,
        more: null,
        costModal: false,
    });
    const [newCost, setNewCost] = useState({
        name: "",
        date: "",
        receiver: "",
        amount: "",
        method: "",
        author: "",
    });

    // Barcha xarajatlar ro'yhatini olish funksiyasi
    const getAllCostFunction = async () => {
        try {
            dispatch(costStart());
            const { data } = await AuthService.getAllCost();
            dispatch(costSuccess(data));
        } catch (error) {
            dispatch(costFailure(error.response?.data.message || error.message));
        }
    };

    useEffect(() => {
        getAllCostFunction();
    }, []);

    useEffect(() => {
        setNewCost({
            ...newCost,
            receiver: teacher?.first_name + " " + teacher?.last_name,
            amount: teacher?.balance,
        });
    }, [newCost.receiver === ""]);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewTeacher({
            first_name: "",
            last_name: "",
            dob: "",
            phoneNumber: "",
            gender: "",
        });
        setNewPass({ newPassword: "", confirmPassword: "" });
        setModals({
            modal: false,
            createModal: false,
            passModal: false,
            imageModal: false,
            more: null,
        })
    };

    const openModal = () => {
        setNewTeacher(teacher);
        handleModal("modal", true);
        handleModal("editModal", false);
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        // o'qituvchi parolini o'zgartirish
        if (modals.passModal && newTeacher._id) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(teacherStart());
                    const { data } = await AuthService.updateTeacherPass({ ...newPass, _id: newTeacher._id });
                    dispatch(getTeacherSuccess(data));
                    clearModal();
                    Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(teacherFailure(error.response?.data.message));
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
                newTeacher.first_name !== "" &&
                newTeacher.last_name !== "" &&
                newTeacher.phoneNumber !== "" &&
                newTeacher.gender !== ""
            ) {
                try {
                    // o'qituvchi ma'lumotlarini o'zgartirish
                    dispatch(teacherStart());
                    const { _id, __v, groups, password, createdAt, updatedAt, ...newTeacherCred } = newTeacher;
                    const { data } = await AuthService.updateTeacher(newTeacher._id, newTeacherCred);
                    dispatch(getTeacherSuccess(data));
                    clearModal();
                    Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(teacherFailure(error.response?.data.error));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.error || error.message
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

    const teacherSalaryModalFunction = () => {
        if (teacher.balance > 0) {
            handleModal("costModal", true);
        }
        else {
            Toast.fire({
                icon: "error",
                title: "Mablag' yetarli emas!"
            });
        }
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 px-10">
            {/* <div className="flex justify-between border-b-2 pb-16 relative">
                <h1 className="capitalize text-2xl">Hisob qaydnomalari</h1>
                <p className="absolute bottom-[-1px] border-b-2 uppercase text-xs pb-2 border-cyan-600 text-cyan-600">o'qituvchi</p>
            </div> */}

            <div className="xl:flex gap-8 mb-16">
                {isLoading || !teacher ?
                    <div className="w-[410px]">
                        <Skeleton parentWidth={100} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                    </div> : <>
                        <div className="md:w-[440px] border-2 py-8 px-6 rounded shadow-dim">
                            <div className="flex relative justify-start gap-10">
                                <div className="w-full flex flex-col gap-4 text-sm">
                                    <div className="flex items-center gap-4">
                                        <figure className={`size-20 rounded-full overflow-hidden ${isLoading ? "bg-gray-300 animate-pulse" : null}`}>
                                            {
                                                teacher?.avatar && teacher?.avatar !== "" ? <img
                                                    className="w-full h-full object-cover"
                                                    src={teacher?.avatar}
                                                    alt="logo"
                                                /> : <>
                                                    <IoPersonCircleOutline className="w-full h-full text-gray-400" />
                                                </>
                                            }
                                        </figure>
                                        <div>
                                            <h1 className="capitalize text-xl">
                                                {teacher?.first_name + " " + teacher?.last_name}
                                            </h1>
                                            {
                                                auth?.role === "admin" || auth?.role === "student" ?
                                                    <h1 className={`${teacher?.balance > 0 ? 'bg-green-700' : teacher?.balance < 0 ? 'bg-red-700' : 'bg-gray-500'} w-fit text-xs text-white px-3 py-px rounded-xl`}>
                                                        {Math.floor(teacher?.balance).toLocaleString()} UZS
                                                    </h1>
                                                    : null
                                            }
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-20">
                                        <span className="text-gray-500">Telefon:</span>
                                        <span className="text-blue-300">+(998) {teacher?.phoneNumber}</span>
                                    </div>

                                    <div className="flex justify-between gap-20">
                                        <span className="text-gray-500">Tug'ilgan kun:</span>
                                        {
                                            teacher?.dob ?
                                                <DateTime date={teacher?.dob} /> :
                                                <IoRemoveOutline />
                                        }
                                    </div>
                                    <div className="flex items-center justify-between gap-20">
                                        <p className="w-fit px-2 rounded bg-gray-200">{teacher?.gender}</p>
                                        {
                                            auth?.role === "admin" ?
                                                <button
                                                    onClick={teacherSalaryModalFunction}
                                                    className="global_add_btn"
                                                    style={{ fontSize: "12px", paddingTop: "2px", paddingBottom: "2px" }}
                                                >
                                                    To'lov
                                                </button>
                                                : null
                                        }
                                    </div>
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

                {/* Guruh haqida ma'lumot */}
                <div className="xl:mt-0 2xsm:mt-8">
                    <h1 className="text-xl">Guruhlar</h1>
                    <div className="flex flex-col gap-4 mt-2">
                        {
                            isLoading || !teacher ? <>
                                <h1>Loading...</h1>
                            </> : <>
                                {
                                    teacher?.groups.length > 0 ?
                                        teacher?.groups.map((group, index) => (
                                            <NavLink to={`/${getCookie("x-auth")}/group-info/${group._id}`} key={index}>
                                                <div className="courseCard flex gap-28 w-50% p-5 cursor-pointer bg-white shadow-smooth">
                                                    <div className="flex flex-col text-xs">
                                                        <h1 className="w-fit text-[10px] rounded px-2 py-1 bg-gray-200">{group.name}</h1>
                                                        {/* Problem fixed... */}
                                                        <h1>{group.course?.title}</h1>
                                                    </div>
                                                    <div className="flex items-center gap-10">
                                                        <div className="flex flex-col">
                                                            <div className="text-xs text-gray-500">
                                                                <h1 className="flex items-center gap-1">
                                                                    <DateTime date={group.start_date} />
                                                                    <IoRemoveOutline />
                                                                </h1>
                                                                <DateTime date={group.end_date} />
                                                            </div>
                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                <h1>{days.find(day => day.value === group.day)?.title}</h1>
                                                                <span><GoDotFill fontSize={8} /></span>
                                                                <h1>{group.start_time}</h1>
                                                            </div>
                                                        </div>
                                                        <h1 className="w-4 text-center text-xs text-white rounded bg-cyan-600">{group.students?.length}</h1>
                                                    </div>
                                                </div>
                                            </NavLink>
                                        )) : <h1>Guruh mavjud emas!</h1>
                                }
                            </>
                        }
                    </div>
                </div>

                {/* Guruhdagi barcha o'quvchilar ro'yxati */}
                <div></div>
            </div>

            {/* update teacher modal */}
            <TeacherModal
                modals={modals}
                handleModal={handleModal}
                newTeacher={newTeacher}
                setNewTeacher={setNewTeacher}
                newPass={newPass}
                setNewPass={setNewPass}
                handleCreateAndUpdate={updateHandler}
                isLoading={isLoading}
                clearModal={clearModal}
            />

            {/* create new cost modal */}
            <CostModal
                modals={modals}
                handleModal={handleModal}
                getAllCostFunction={getAllCostFunction}
                newCost={newCost}
                setNewCost={setNewCost}
            />
        </div>
    )
};