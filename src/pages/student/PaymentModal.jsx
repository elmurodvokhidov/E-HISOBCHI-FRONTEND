import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

function PaymentModal({
    handleModal,
    modals,
    isLoading,
    student,
}) {
    const { today } = useSelector(state => state.auth);
    const [studentPayment, setStudentPayment] = useState({
        student: "",
        method: "",
        amount: "",
        date: "",
        description: "",
    });

    const getPaymentCred = (e) => {
        setStudentPayment({
            ...studentPayment,
            [e.target.name]: e.target.value
        });
    };

    const clearModal = () => {
        // setStudentPayment({
        //     method: "",
        //     amount: "",
        //     // date: "",
        //     description: "",
        // });
        handleModal("payModal", false);
    };

    useEffect(() => {
        setStudentPayment({
            ...studentPayment,
            student: student ? (student.first_name + " " + student.last_name) : "",
            date: today ? today : ""
        });
    }, [student, today]);

    const studentPaymentFunction = async (e) => {
        e.preventDefault();
        console.log(studentPayment);
        clearModal();
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
                            value={studentPayment.student}
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
                        <p className="text-sm">To'lov usuli</p>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-1">
                                <input
                                    onChange={getPaymentCred}
                                    value="cash"
                                    type="radio"
                                    name="method"
                                    id="cash"
                                    className="border-gray-300 outline-cyan-600" />
                                <label htmlFor="cash" className="text-sm">Naqd pul</label>
                            </div>

                            <div className="flex items-center gap-1">
                                <input
                                    onChange={getPaymentCred}
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
                        <label htmlFor="amount" className="text-sm">Midor</label>
                        <input
                            onChange={getPaymentCred}
                            type="number"
                            name="amount"
                            id="amount"
                            className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600" />
                    </div>

                    {/* Date */}
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-sm">Sana</label>
                        <input
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
                        className="w-fit px-6 py-1 mt-8 bg-cyan-600 rounded-2xl text-white">
                        {isLoading ? "Loading..." : "Saqlash"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default PaymentModal