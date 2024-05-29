import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import AuthService from "../../config/authService";
import { Toast, ToastLeft } from "../../config/sweetToast";
import { useDispatch, useSelector } from "react-redux";
import { costFailure, costStart } from "../../redux/slices/costSlice";

export default function CostModal({
    handleModal,
    modals,
    getAllCostFunction,
    newCost,
    setNewCost,
}) {
    const { auth } = useSelector(state => state.auth);
    const { isLoading } = useSelector(state => state.cost);
    const dispatch = useDispatch();

    // Input, modal, newStudent qiymatlarini tozalash
    const clearModal = () => {
        setNewCost({
            name: "",
            receiver: "",
            amount: "",
            method: "",
            author: "",
            date: "",
        });
        handleModal("costModal", false);
    };

    // Inputdan ma'lumot olish
    const getCostCred = (e) => {
        setNewCost({
            ...newCost,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        // Xozirgi sanani olish funksiyasi
        const getCurrentDateFunction = async () => {
            try {
                const { data } = await AuthService.getCurrentDate();
                setNewCost({
                    ...newCost,
                    author: auth?._id,
                    date: data.today
                });
            } catch (error) {
                console.log(error);
            }
        };

        getCurrentDateFunction();
    }, [newCost.date === ""]);

    // Yangi xarajat qo'shish funksiyasi
    const createAndUpdateHandle = async (e) => {
        e.preventDefault();
        try {
            if (
                newCost.name !== "" &&
                newCost.date !== "" &&
                newCost.receiver !== "" &&
                newCost.method !== "" &&
                newCost.amount !== ""

            ) {
                dispatch(costStart());
                if (!newCost._id) {
                    // yangi xarajat qo'shish
                    const { data } = await AuthService.createNewCost({ ...newCost, author: auth?._id });
                    getAllCostFunction();
                    clearModal();
                    Toast.fire({
                        icon: "success",
                        title: data?.message
                    });
                } else {
                    // xarajat ma'lumotlarini tahrirlash
                    const { date, ...others } = newCost;
                    const { data } = await AuthService.updateCost(newCost._id, { ...others, author: auth?._id });
                    getAllCostFunction();
                    clearModal();
                    Toast.fire({
                        icon: "success",
                        title: data?.message
                    });
                }
            }
            else {
                ToastLeft.fire({
                    icon: "error",
                    title: "Iltimos barcha bo'sh joylarni to'ldiring!"
                })
            }
        } catch (error) {
            dispatch(costFailure(error.response?.data.message || error.message));
            ToastLeft.fire({
                icon: "error",
                title: error.response?.data.message || error.message
            });
        }
    };

    return (
        <div
            onClick={() => clearModal()}
            className="w-full h-screen fixed top-0 left-0 z-20"
            style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modals.costModal ? "1" : "0", zIndex: modals.costModal ? "20" : "-1" }}>
            <form
                onClick={(e) => e.stopPropagation()}
                className="lg:w-[27%] small:w-[60%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white"
                style={{ right: modals.costModal ? "0" : "-200%" }}>

                {/* Title and Close button */}
                <div className="flex justify-between text-xl p-5 border-b-2">
                    <h1>
                        {newCost._id ? "Ma'lumotlarni yangilash" : "Yangi xarajatlar"}
                    </h1>
                    <button
                        type="button"
                        onClick={() => clearModal()}
                        className="text-gray-500 hover:text-black transition-all duration-300">
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Form's Body */}
                <div className="flex flex-col gap-4 px-5 py-7">
                    {/* Name */}
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-sm pc:text-lg">
                            <span>Nomi</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            disabled={isLoading}
                            onChange={getCostCred}
                            value={newCost.name}
                            type="text"
                            name="name"
                            id="name"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-cyan-600" />
                    </div>

                    {/* Date */}
                    {
                        !newCost._id ?
                            <div className="flex flex-col">
                                <label htmlFor="date" className="text-sm pc:text-lg">
                                    <span>Sana</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <input
                                    disabled={isLoading}
                                    onChange={getCostCred}
                                    value={newCost.date}
                                    type="date"
                                    name="date"
                                    id="date"
                                    className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-cyan-600" />
                            </div>
                            : null
                    }

                    {/* Receiver */}
                    <div className="flex flex-col">
                        <label htmlFor="receiver" className="text-sm pc:text-lg">
                            <span>Oluvchi</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            disabled={isLoading}
                            onChange={getCostCred}
                            value={newCost.receiver}
                            type="text"
                            name="receiver"
                            id="receiver"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-cyan-600" />
                    </div>

                    {/* Method */}
                    <div className="w-full">
                        <p className="text-sm pc:text-lg">
                            <span>To'lov usuli</span>
                            <span className="ml-1 text-red-500">*</span>
                        </p>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-1">
                                <input
                                    disabled={isLoading}
                                    onChange={getCostCred}
                                    checked={newCost.method === "cash"}
                                    value="cash"
                                    type="radio"
                                    name="method"
                                    id="cash"
                                    className="border-gray-300 outline-cyan-600" />
                                <label htmlFor="cash" className="text-sm pc:text-lg">Naqd pul</label>
                            </div>

                            <div className="flex items-center gap-1">
                                <input
                                    disabled={isLoading}
                                    onChange={getCostCred}
                                    checked={newCost.method === "card"}
                                    value="card"
                                    type="radio"
                                    name="method"
                                    id="card"
                                    className="border-gray-300 outline-cyan-600" />
                                <label htmlFor="card" className="text-sm pc:text-lg">Plastik kartasi</label>
                            </div>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="w-full flex flex-col">
                        <label htmlFor="amount" className="text-sm pc:text-lg">
                            <span>Midor</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            disabled={isLoading}
                            onChange={getCostCred}
                            value={newCost.amount}
                            type="number"
                            name="amount"
                            id="amount"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-cyan-600" />
                    </div>

                    {/* Button */}
                    <button
                        disabled={isLoading}
                        onClick={createAndUpdateHandle}
                        className="w-fit px-6 py-1 mt-8 pc:text-lg bg-cyan-600 outline-none rounded-2xl text-white">
                        {isLoading ? "Loading..." : "Saqlash"}
                    </button>
                </div>
            </form>
        </div>
    )
};