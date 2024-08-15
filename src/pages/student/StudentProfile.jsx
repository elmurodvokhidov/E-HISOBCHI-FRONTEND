import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import service from "../../config/service";
import { allGroupSuccess, groupFailure, groupStart } from "../../redux/slices/groupSlice";
import { getStudentSuccess, studentFailure, studentStart } from "../../redux/slices/studentSlice";
import { Toast, ToastLeft } from "../../config/sweetToast";
import StudentModal from "./StudentModal";
import Skeleton from "../../components/loaders/Skeleton";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import { days } from "../../config/days";
import { IoPersonCircleOutline, IoRemoveOutline } from "react-icons/io5";
import PaymentModal from "./PaymentModal";
import { MdOutlinePrint } from "react-icons/md";
import Swal from "sweetalert2";
import { FormattedDate } from "../../components/FormattedDate";
import Receipt from "../../components/Receipt";
import { companyFailure, companyStart, companySuccess } from "../../redux/slices/companySlice";
import { Bin, Pencil } from "../../assets/icons/Icons";

function StudentProfile() {
    const { auth } = useSelector(state => state.auth);
    const { groups } = useSelector(state => state.group);
    const { student, isLoading } = useSelector(state => state.student);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [studentPayment, setStudentPayment] = useState({
        student_balance: "",
        method: "",
        amount: "",
        date: "",
        description: "",
        createdAt: "",
    });
    const [newStudent, setNewStudent] = useState({
        first_name: "",
        last_name: "",
        father_name: "",
        mother_name: "",
        dob: "",
        phoneNumber: "",
        fatherPhoneNumber: "",
        motherPhoneNumber: "",
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
        receiptModal: false,
    });

    const isAdmin = auth?.role === "admin" || auth?.role === "ceo";

    const getStudentFunction = async () => {
        try {
            dispatch(studentStart());
            const { data } = await service.getStudent(id);
            dispatch(getStudentSuccess(data));
        } catch (error) {
            dispatch(studentFailure(error.response?.data.message));
            Toast.fire({ icon: "error", title: error.response?.data.message || error.message, });
        }
    };

    const getAllGroupsFunc = async () => {
        try {
            dispatch(groupStart());
            const { data } = await service.getAllGroups();
            dispatch(allGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.message));
        }
    };

    // Mavjud kompaniyani olish funksiyasi
    const getCompanyFunction = async () => {
        try {
            dispatch(companyStart());
            const { data } = await service.getCompany();
            dispatch(companySuccess(data));
        } catch (error) {
            dispatch(companyFailure(error.response?.data.message));
            if (!error.success) navigate('/company');
        }
    };

    useEffect(() => {
        getStudentFunction();
        getAllGroupsFunc();
    }, []);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    // O'quvchi ma'lumotlarini o'zgartirish uchun modal oynani ochish
    const openModal = () => {
        setNewStudent({ ...student, group: student?.group?._id });
        handleModal("modal", true);
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
            receiptModal: false,
        });
        setStudentPayment({
            student_balance: "",
            method: "",
            amount: "",
            date: "",
            description: "",
            createdAt: "",
        });
    };

    // O'quvchini ma'lumotlarini o'zgartirish
    const updateHandler = async (e) => {
        e.preventDefault();
        // o'quvchi parolini o'zgartirish
        if (modals.passModal && newStudent._id) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(studentStart());
                    const { data } = await service.updateStudentPass({ ...newPass, _id: newStudent._id });
                    dispatch(getStudentSuccess(data));
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "error", title: "Parol 8 ta belgidan kam bo'lmasligi kerak!" });
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
                    const { _id, __v, createdAt, updatedAt, ...newStudentCred } = newStudent;
                    const { data } = await service.updateStudent(newStudent._id, newStudentCred);
                    await service.caclStudentBalance();
                    dispatch(getStudentSuccess(data));
                    getStudentFunction();
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "error", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
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
                service.deleteStudentPay(id).then((res) => {
                    getStudentFunction();
                    clearModal();
                    Toast.fire({ icon: "success", title: res?.data.message });
                }).catch((error) => {
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                });
            }
        });
    };

    // O'quvchini to'lov tarixini yangilash uchun modal oynani ochish
    const updateBtnFunc = (cost) => {
        setStudentPayment({ ...cost, student_balance: student?.balance });
        handleModal("payModal", true);
    };

    // O'quvchi to'lov tarixini print qilish uchun modal oynani ochish
    const printReceipt = (pay) => {
        setStudentPayment(pay);
        handleModal("receiptModal", true);
    };

    return (
        <div className="container" onClick={() => handleModal("more", null)}>
            <div className="lg:flex gap-8">
                {isLoading || !student ?
                    <div className="w-[410px] pc:w-[460px]">
                        <Skeleton
                            parentWidth={100}
                            firstChildWidth={85}
                            secondChildWidth={50}
                            thirdChildWidth={65}
                        />
                    </div> : <>
                        <div className="sm:w-[410px] pc:w-[460px] h-fit border py-8 px-6 rounded shadow-dim">
                            <div className="flex relative justify-start gap-10">
                                <div className="w-full flex flex-col gap-4 text-sm pc:text-base">
                                    <div className="flex items-center gap-4">
                                        <figure className={`size-20 rounded-[50%] overflow-hidden ${isLoading ? "bg-gray-300 animate-pulse" : null}`}>
                                            {
                                                student?.avatar && student?.avatar !== "" ? <img
                                                    className="w-full h-full object-cover"
                                                    src={student?.avatar}
                                                    alt="logo"
                                                /> : <IoPersonCircleOutline className="w-full h-full text-gray-400" />
                                            }
                                        </figure>
                                        <div>
                                            <h1 className="capitalize text-xl pc:text-2xl">{student?.first_name} {student?.last_name}</h1>
                                            {
                                                isAdmin || auth?.role === "student" ?
                                                    <h1 className={`${student?.balance > 0 ? 'bg-green-700' : student?.balance < 0 ? 'bg-red-700' : 'bg-gray-500'} w-fit text-xs pc:text-sm text-white px-3 py-px rounded-xl`}>
                                                        {Math.round(student?.balance).toLocaleString()} UZS
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
                                                <FormattedDate date={student?.dob} /> :
                                                <IoRemoveOutline />
                                        }
                                    </div>

                                    <div className="flex items-center justify-end gap-20">
                                        {
                                            isAdmin ?
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
                                        className="flex items-center justify-end gap-1 text-sm pc:text-base outline-none mt-2">
                                        {modals.extra ? <FaAngleUp /> : <FaAngleDown />}
                                        Batafsil
                                    </button>
                                    {
                                        modals.extra ? <>
                                            <div className="flex flex-col gap-2 text-sm pc:text-base">
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

                                <div className="w-fit h-fit absolute top-0 right-0">
                                    <button
                                        disabled={isLoading}
                                        onClick={openModal}
                                        className="size-8 pc:size-10 flex items-center justify-center text-lg pc:text-xl border rounded-full text-main-1 border-main-1 hover:bg-main-1 hover:text-white transition-all duration-300">
                                        <Pencil />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                }

                <div className="lg:w-2/3 small:w-full">
                    {/* Guruhlar */}
                    <div className="lg:mt-0 small:mt-8">
                        <h1 className="text-gray-500 text-base pc:text-lg border-b-2 pb-2">Guruhlar</h1>

                        <div className="grid xl:grid-cols-2 small:grid-cols-1 gap-8 mt-6">
                            {
                                isLoading || !student ? <>
                                    <h1 className="pc:text-lg">Loading...</h1>
                                </> : <>
                                    {
                                        student?.group ?
                                            <NavLink to={`/admin/group-info/${student?.group._id}`}>
                                                <div className="courseCard xl:w-50% p-4 cursor-pointer bg-white shadow-smooth rounded">
                                                    <h1 className="w-fit text-xs pc:text-sm rounded px-2 py-1 bg-gray-200">{student?.group.name}</h1>
                                                    <div className="flex items-start justify-between gap-8">
                                                        <h2 className="text-sm pc:text-base transition-all duration-300">
                                                            {student?.group.teacher?.first_name} {student?.group.teacher?.last_name}
                                                        </h2>
                                                        <div className="text-xs pc:text-sm text-gray-500">
                                                            <h1 className="flex items-center gap-1">
                                                                <FormattedDate date={student?.group?.start_date} />
                                                                <span className="inline-block align-middle w-4 border border-gray-300"></span>
                                                            </h1>
                                                            <FormattedDate date={student?.group?.end_date} />
                                                        </div>
                                                        <div className="text-xs pc:text-sm text-gray-500">
                                                            <h1>{days.find(day => day.value === student?.group.day)?.title}</h1>
                                                            <h1>{student?.group.start_time}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </NavLink>
                                            : <h1 className="pc:text-lg">Guruh mavjud emas!</h1>
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
                                <h1 className="text-gray-500 text-base pc:text-lg border-b-2 pb-2">To'lovlar</h1>
                                <div className="shadow-smooth rounded px-6 pb-4 mt-6 overflow-y-auto bg-white">
                                    <div className="w-fit flex lg:gap-4 p-2 text-sm pc:text-sm sticky top-0 bg-white pt-6">
                                        <h1 className="min-w-[150px] pc:min-w-[200px]">Sana</h1>
                                        <h1 className="min-w-[200px] pc:min-w-[250px]">Miqdor</h1>
                                        <h1 className="min-w-[440px] pc:min-w-[410px]">Izoh</h1>
                                    </div>
                                    <div className="w-fit max-h-60">
                                        {
                                            student?.payment_history.map(pay => (
                                                <div
                                                    key={pay._id}
                                                    className="studentPayHistory flex lg:gap-4 p-2 rounded odd:bg-gray-100"
                                                >
                                                    <h1 className="min-w-[150px] pc:min-w-[200px] text-sm pc:text-lg">
                                                        <FormattedDate date={pay.date} />
                                                    </h1>
                                                    <h1 className={`min-w-[200px] pc:min-w-[250px] text-base pc:text-lg text-${pay.amount >= 0 ? 'green' : 'red'}-500`}>
                                                        {pay.amount >= 0 && <span>+</span>}
                                                        {Math.round(pay.amount).toLocaleString()}
                                                        <span className="text-black text-xs pc:text-sm"> UZS</span>
                                                    </h1>
                                                    <h1 className="min-w-[360px] pc:min-w-[410px] flex items-center text-sm pc:text-base">
                                                        {
                                                            pay.description !== "" ?
                                                                pay.description : <IoRemoveOutline className="text-gray-500" />
                                                        }
                                                    </h1>
                                                    {/* more button */}
                                                    {
                                                        isAdmin &&
                                                        <div className="flex items-center gap-2 w-fit text-sm pc:text-base">
                                                            <button
                                                                className="text-green-500"
                                                            >
                                                                <MdOutlinePrint onClick={() => printReceipt(pay)} className="text-lg pc:text-xl" />
                                                            </button>
                                                            <button onClick={() => updateBtnFunc(pay)}>
                                                                <Pencil />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteStudentPayHistory(pay._id)}
                                                                className="text-red-500"
                                                            >
                                                                <Bin />
                                                            </button>
                                                        </div>
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
                studentPayment={studentPayment}
                setStudentPayment={setStudentPayment}
                getCompanyFunction={getCompanyFunction}
            />

            {/* receipt modal */}
            <Receipt
                modals={modals}
                handleModal={handleModal}
                closeModal={clearModal}
                payment={studentPayment}
                student={student}
                getCompanyFunction={getCompanyFunction}
            />
        </div >
    )
}

export default StudentProfile