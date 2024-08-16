import { useEffect, useState } from "react";
import { getTeacherSuccess, teacherFailure, teacherStart } from "../../redux/slices/teacherSlice";
import service from "../../config/service";
import { Toast, ToastLeft } from "../../config/sweetToast";
import TeacherModal from "./TeacherModal";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import Skeleton from "../../components/loaders/Skeleton";
import { GoDotFill } from "react-icons/go";
import { days } from "../../config/days";
import { IoPersonCircleOutline, IoRemoveOutline } from "react-icons/io5";
import { FormattedDate } from "../../components/FormattedDate";
import CostModal from "../cost/CostModal";
import { costFailure, costStart } from "../../redux/slices/costSlice";
import Swal from "sweetalert2";
import { Bin, Pencil } from "../../assets/icons/Icons";

export default function TeacherProfile() {
    const { auth } = useSelector(state => state.auth);
    const { teacher, isLoading } = useSelector(state => state.teacher);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [newTeacher, setNewTeacher] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        phoneNumber: "",
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
    const isAdmin = auth?.role === "admin" || auth?.role === "ceo";

    const getTeacherFunction = async () => {
        try {
            dispatch(teacherStart());
            const { data } = await service.getTeacher(id);
            dispatch(getTeacherSuccess(data));
        } catch (error) {
            dispatch(teacherFailure(error.response?.data.message));
            Toast.fire({
                icon: "error",
                title: error.response?.data.message || error.message,
            });
        }
    };

    useEffect(() => {
        getTeacherFunction();
    }, []);

    useEffect(() => {
        setNewCost({
            ...newCost,
            name: "Oylik maosh",
            receiver: teacher?.first_name + " " + teacher?.last_name,
            amount: Math.round(teacher?.balance) || 0,
            type: teacher?._id,
        });
    }, [newCost.receiver === "", teacher]);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewTeacher({
            first_name: "",
            last_name: "",
            dob: "",
            phoneNumber: "",
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

    // Ma'lumotlarni o'zgartirish uchun modalni ochish
    const openModal = () => {
        setNewTeacher(teacher);
        handleModal("modal", true);
    };

    // O'qituchi ma'lumotlarini o'zgartirish
    const updateHandler = async (e) => {
        e.preventDefault();
        // o'qituvchi parolini o'zgartirish
        if (modals.passModal && newTeacher._id) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(teacherStart());
                    const { data } = await service.updateTeacherPass({ ...newPass, id: newTeacher._id });
                    dispatch(getTeacherSuccess(data));
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                } catch (error) {
                    dispatch(teacherFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "error", title: "Parol 8 ta belgidan kam bo'lmasligi kerak!" });
            }
        }
        else {
            if (
                newTeacher.first_name !== "" &&
                newTeacher.last_name !== "" &&
                newTeacher.phoneNumber !== ""
            ) {
                try {
                    // o'qituvchi ma'lumotlarini o'zgartirish
                    dispatch(teacherStart());
                    const { _id, __v, createdAt, updatedAt, ...newTeacherCred } = newTeacher;
                    const { data } = await service.updateTeacher(newTeacher._id, newTeacherCred);
                    dispatch(getTeacherSuccess(data));
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                } catch (error) {
                    dispatch(teacherFailure(error.response?.data.error));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.error || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "error", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
            }
        }
    };

    // Salary to'lash uchun modal oynani ochish
    const teacherSalaryModalFunction = () => {
        if (teacher.balance > 0) {
            handleModal("costModal", true);
        }
        else {
            Toast.fire({ icon: "error", title: "Mablag' yetarli emas!" });
        }
    };

    // Xarajatni o'chirish funksiyasi
    const handleDeleteFunc = async (id) => {
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
                dispatch(costStart());
                service.deleteCost(id).then((res) => {
                    getTeacherFunction();
                    Toast.fire({ icon: "success", title: res?.data.message });
                }).catch((error) => {
                    dispatch(costFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                });
            }
        });
    };

    // Salary tahrirlash uchun modalni ochish
    const updateBtnFunc = (cost) => {
        setNewCost(cost);
        handleModal("costModal", true);
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 pc:pt-28 px-10">
            {/* <div className="flex justify-between border-b-2 pb-16 relative">
                <h1 className="capitalize text-2xl">Hisob qaydnomalari</h1>
                <p className="absolute bottom-[-1px] border-b-2 uppercase text-xs pb-2 border-main-1 text-main-1">o'qituvchi</p>
            </div> */}

            <div className="xl:flex gap-8 mb-16">
                {isLoading || !teacher ?
                    <div className="w-[410px]">
                        <Skeleton parentWidth={100} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                    </div> : <>
                        <div className="md:min-w-[440px] pc:min-w-[500px] h-fit border-2 py-8 px-6 rounded shadow-dim">
                            <div className="flex relative justify-start gap-10">
                                <div className="w-full flex flex-col gap-4 text-sm pc:text-base">
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
                                            <h1 className="capitalize text-xl pc:text-2xl">
                                                {teacher?.first_name + " " + teacher?.last_name}
                                            </h1>
                                            {
                                                isAdmin || auth?.role === "teacher" ?
                                                    <h1 className={`${teacher?.balance > 0 ? 'bg-green-700' : teacher?.balance < 0 ? 'bg-red-700' : 'bg-gray-500'} w-fit text-xs pc:text-sm text-white px-3 py-px rounded-xl`}>
                                                        {Math.round(teacher?.balance).toLocaleString()} UZS
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
                                                <FormattedDate date={teacher?.dob} /> :
                                                <IoRemoveOutline />
                                        }
                                    </div>
                                    <div className="flex items-center justify-end gap-20">
                                        {
                                            isAdmin &&
                                            <button
                                                onClick={teacherSalaryModalFunction}
                                                className="global_add_btn text-xs py-0.5 pc:text-sm"
                                            >
                                                To'lov
                                            </button>
                                        }
                                    </div>
                                </div>

                                <div className="w-fit h-fit absolute top-0 right-0">
                                    <button
                                        disabled={isLoading}
                                        onClick={openModal}
                                        className="size-8 flex items-center justify-center text-lg pc:text-xl border rounded-full text-main-1 border-main-1 hover:bg-main-1 hover:text-white transition-all duration-300">
                                        <Pencil />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                }

                <div className="lg:w-2/3 small:w-full">
                    {/* Guruh haqida ma'lumot */}
                    <div className="xl:mt-0 small:mt-8">
                        <h1 className="text-xl pc:text-2xl">Guruhlar</h1>
                        <div className="flex flex-wrap gap-8 mt-2">
                            {
                                isLoading || !teacher ? <>
                                    <h1>Loading...</h1>
                                </> : <>
                                    {
                                        teacher?.groups.length > 0 ?
                                            teacher?.groups.map((group, index) => (
                                                <NavLink to={`/admin/group-info/${group._id}`} key={index}>
                                                    <div className="courseCard flex gap-28 w-50% p-5 cursor-pointer bg-white shadow-smooth">
                                                        <div className="flex flex-col text-xs pc:text-base">
                                                            <h1 className="w-fit text-[10px] pc:text-xs rounded px-2 py-1 bg-gray-200">{group.name}</h1>
                                                            {/* Problem fixed... */}
                                                            <h1>{group.course?.title}</h1>
                                                        </div>
                                                        <div className="flex items-center gap-10">
                                                            <div className="flex flex-col">
                                                                <div className="text-xs pc:text-sm text-gray-500">
                                                                    <h1 className="flex items-center gap-1">
                                                                        <FormattedDate date={group?.start_date} />
                                                                        <IoRemoveOutline />
                                                                    </h1>
                                                                    <FormattedDate date={group?.end_date} />
                                                                </div>
                                                                <div className="flex items-center gap-1 text-xs pc:text-sm text-gray-500">
                                                                    <h1>{days.find(day => day.value === group.day)?.title}</h1>
                                                                    <span><GoDotFill fontSize={8} /></span>
                                                                    <h1>{group.start_time}</h1>
                                                                </div>
                                                            </div>
                                                            <h1 className="w-4 text-center text-xs pc:text-sm text-white rounded bg-main-1">{group.students?.length}</h1>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            )) : <h1 className="pc:text-lg">Guruh mavjud emas!</h1>
                                    }
                                </>
                            }
                        </div>
                    </div>

                    {/* To'lovlar */}
                    {
                        !isLoading &&
                            teacher?.payment_history.length > 0 ? <>
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
                                            teacher?.payment_history.map(pay => (
                                                <div
                                                    key={pay._id}
                                                    className="studentPayHistory flex lg:gap-4 p-2 rounded odd:bg-gray-100"
                                                >
                                                    <p className="min-w-[150px] text-sm">
                                                        <FormattedDate date={pay?.date} />
                                                    </p>
                                                    <p className="min-w-[200px] text-base text-red-500">
                                                        <span>-</span>
                                                        {Math.round(pay.amount).toLocaleString()}
                                                        <span className="text-black text-xs"> UZS</span>
                                                    </p>
                                                    <p className="min-w-[380px] flex items-center text-sm">
                                                        {pay.name}
                                                    </p>
                                                    {
                                                        isAdmin ?
                                                            <div className="flex gap-2 items-center">
                                                                <button onClick={() => updateBtnFunc(pay)}>
                                                                    <Pencil />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteFunc(pay._id)}
                                                                    className="text-red-500"
                                                                >
                                                                    <Bin />
                                                                </button>
                                                            </div>
                                                            : null
                                                    }
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
                getAllCostFunction={getTeacherFunction}
                newCost={newCost}
                setNewCost={setNewCost}
            />
        </div>
    )
};