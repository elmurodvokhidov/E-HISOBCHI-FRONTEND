import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import AuthService from "../../config/authService";
import { Toast, ToastLeft } from "../../config/sweetToast";
import { getStudentSuccess, studentFailure, studentStart } from "../../redux/slices/studentSlice";
import { useDispatch } from "react-redux";

function PaymentModal({
    handleModal,
    modals,
    student,
}) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [studentPayment, setStudentPayment] = useState({
        studentId: "",
        student_balance: "",
        method: "",
        amount: "",
        date: "",
        description: "",
    });

    const getStudent = async () => {
        try {
            dispatch(studentStart());
            const { data } = await AuthService.getStudent(student?._id);
            dispatch(getStudentSuccess(data));
        } catch (error) {
            dispatch(studentFailure(error.response?.data.message));
            await Toast.fire({
                icon: "error",
                title: error.response?.data.message || error.message,
            });
        }
    };

    const getPaymentCred = (e) => {
        setStudentPayment({
            ...studentPayment,
            [e.target.name]: e.target.value
        });
    };

    const clearModal = () => {
        setStudentPayment({
            ...studentPayment,
            method: "",
            amount: "",
            description: "",
        });
        handleModal("payModal", false);
    };

    useEffect(() => {
        const getCurrentDateFunction = async () => {
            try {
                const { data } = await AuthService.getCurrentDate();
                setStudentPayment({
                    ...studentPayment,
                    studentId: student?._id,
                    student_balance: student?.balance,
                    date: data.today
                });
            } catch (error) {
                console.log(error);
            }
        };

        getCurrentDateFunction();
    }, [student]);

    const studentPaymentFunction = async (e) => {
        e.preventDefault();
        try {
            if (studentPayment.method !== "" && studentPayment.amount !== "" && studentPayment.date !== "") {
                setIsLoading(true);
                const { data } = await AuthService.payForStudent(studentPayment);
                getStudent();
                clearModal();
                await Toast.fire({
                    icon: "success",
                    title: data.message
                });
                setIsLoading(false);
            }
            else {
                await ToastLeft.fire({
                    icon: "error",
                    title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
                });
            }
        } catch (error) {
            await ToastLeft.fire({
                icon: "error",
                title: error.message
            });
            console.log("Student payment error: " + error);
        }
    };

    return (
        <div
            onClick={() => clearModal()}
            className="w-full h-screen fixed top-0 left-0 z-20"
            style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modals.payModal ? "1" : "0", zIndex: modals.payModal ? "20" : "-1" }}>
            <form
                onClick={(e) => e.stopPropagation()}
                className="w-[27%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white"
                style={{ right: modals.payModal ? "0" : "-200%" }}>

                {/* Title and Close button */}
                <div className="flex justify-between text-xl p-5 border-b-2">
                    <h1>To'lov qo'shish</h1>
                    <button
                        type="button"
                        onClick={() => clearModal()}
                        className="text-gray-500 hover:text-black transition-all duration-300">
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Form's Body */}
                <div className="flex flex-col gap-4 px-5 py-7">
                    {/* Student */}
                    <div className="flex flex-col">
                        <label htmlFor="student" className="text-sm">Talaba</label>
                        <input
                            disabled={true}
                            value={student?.first_name + " " + student?.last_name}
                            type="text"
                            name="student"
                            id="student"
                            className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600 disabled:bg-gray-300" />
                    </div>

                    {/* Student's balance */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Balans</label>
                        <h1 className={`${student?.balance > 0 ? 'bg-green-700' : student?.balance < 0 ? 'bg-red-700' : 'bg-gray-500'} w-fit text-xs text-white px-3 py-1 rounded-xl`}>
                            {Math.floor(student?.balance).toLocaleString()} UZS
                        </h1>
                    </div>

                    {/* Payment method */}
                    <div className="w-full">
                        <p className="text-sm">
                            <span>To'lov usuli</span>
                            <span className="ml-1 text-red-500">*</span>
                        </p>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-1">
                                <input
                                    disabled={isLoading}
                                    onChange={getPaymentCred}
                                    checked={studentPayment.method === "cash"}
                                    value="cash"
                                    type="radio"
                                    name="method"
                                    id="cash"
                                    className="border-gray-300 outline-cyan-600" />
                                <label htmlFor="cash" className="text-sm">Naqd pul</label>
                            </div>

                            <div className="flex items-center gap-1">
                                <input
                                    disabled={isLoading}
                                    onChange={getPaymentCred}
                                    checked={studentPayment.method === "card"}
                                    value="card"
                                    type="radio"
                                    name="method"
                                    id="card"
                                    className="border-gray-300 outline-cyan-600" />
                                <label htmlFor="card" className="text-sm">Plastik kartasi</label>
                            </div>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="w-full flex flex-col">
                        <label htmlFor="amount" className="text-sm">
                            <span>Midor</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            disabled={isLoading}
                            onChange={getPaymentCred}
                            value={studentPayment.amount}
                            type="number"
                            name="amount"
                            id="amount"
                            className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600" />
                    </div>

                    {/* Date */}
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-sm">
                            <span>Sana</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            disabled={isLoading}
                            onChange={getPaymentCred}
                            value={studentPayment.date}
                            type="date"
                            name="date"
                            id="date"
                            className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="description" className="text-sm">Izoh</label>
                        <textarea
                            disabled={isLoading}
                            onChange={getPaymentCred}
                            value={studentPayment.description}
                            name="description"
                            id="description"
                            cols="30"
                            rows="3"
                            className="border-2 border-gray-300 rounded resize-none px-2 py-1 outline-cyan-600"
                        ></textarea>
                    </div>

                    {/* Button */}
                    <button
                        disabled={isLoading}
                        onClick={studentPaymentFunction}
                        className="w-fit px-6 py-1 mt-8 bg-cyan-600 outline-none rounded-2xl text-white">
                        {isLoading ? "Loading..." : "Saqlash"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default PaymentModal