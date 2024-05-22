import { useEffect, useState } from "react";
import { CiCoins1 } from "react-icons/ci";
import { MdFileDownload } from "react-icons/md";
import CostModal from "./CostModal";
import AuthService from "../../config/authService";
import { costFailure, costStart, costSuccess } from "../../redux/slices/costSlice";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../../components/loaders/Skeleton";
import Swal from "sweetalert2";
import { Toast, ToastLeft } from "../../config/sweetToast";
import * as XLSX from 'xlsx';
import { FormattedDate } from "../../components/FormattedDate";

export default function Cost() {
    const { costs, isLoading } = useSelector(state => state.cost);
    const dispatch = useDispatch();
    const [newCost, setNewCost] = useState({
        name: "",
        date: "",
        receiver: "",
        amount: "",
        method: "",
        author: "",
    });
    const [modals, setModals] = useState({
        costModal: false,
    });
    const [filters, setFilters] = useState({
        searchBy: "",
        amountFrom: "",
        amountTo: "",
        start_date: "",
        end_date: ""
    });

    // Modal state-ni optimal tarzda o'zgartirish
    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

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

    // Filterlash uchun qiymat olish
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Xarajatlarni filterlash funksiyasi
    const filteredCosts = costs.filter(cost => {
        return Object.entries(filters).every(([key, value]) => {
            if (value === "") return true;

            if (key === "searchBy") {
                return cost.name.toLowerCase().includes(value.toLowerCase().trim()) || cost.receiver.toLowerCase().includes(value.toLowerCase().trim());
            };

            if (key === 'amountFrom' || key === 'amountTo') {
                const sum = Math.round(Math.abs(cost.amount));
                const filterAmountFrom = parseInt(filters['amountFrom']);
                const filterAmountTo = parseInt(filters['amountTo']);

                if (filters['amountFrom'] && filters['amountTo']) {
                    return sum >= filterAmountFrom && sum <= filterAmountTo;
                } else if (filters['amountFrom']) {
                    return sum >= filterAmountFrom;
                } else if (filters['amountTo']) {
                    return sum <= filterAmountTo;
                } else {
                    return true;
                }
            };

            if (key === 'start_date' || key === 'end_date') {
                const costStartDate = new Date(cost.date);
                const costEndDate = new Date(cost.date);
                const filterStartDate = new Date(filters['start_date']);
                const filterEndDate = new Date(filters['end_date']);

                if (filters['start_date'] && filters['end_date']) {
                    return costStartDate >= filterStartDate && costEndDate <= filterEndDate;
                }
                else if (filters['start_date']) {
                    return costStartDate >= filterStartDate;
                }
                else if (filters['end_date']) {
                    return costEndDate <= filterEndDate;
                }
                else {
                    return true;
                }
            };

            return cost[key] === value;
        });
    });

    // Barcha xarajatlarni exel fayli sifatida yuklab olish funksiyasi
    const exportToExcel = () => {
        const fileName = 'costs.xlsx';
        const header = ['Sana', 'Xarajat nomi', 'Oluvchi', 'To\'lov turi', 'To\'langan summa', 'Xodim'];

        const wb = XLSX.utils.book_new();
        const data = filteredCosts.map(cost => [
            cost.date || '',
            cost.name || '',
            cost.receiver || '',
            cost.method || '',
            (cost.amount || '').toString(),
            cost.author?.first_name + " " + cost.author?.last_name || '',
        ]);
        data.unshift(header);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex]).length), 0)
        }));
        ws['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Costs');
        XLSX.writeFile(wb, fileName);
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
                AuthService.deleteCost(id).then((res) => {
                    getAllCostFunction();
                    Toast.fire({
                        icon: "success",
                        title: res?.data.message
                    });
                }).catch((error) => {
                    dispatch(costFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                });
            }
        });
    };

    const updateBtnFunc = (cost) => {
        setNewCost(cost);
        handleModal("costModal", true);
    };

    return (
        <div className="container !px-0">
            <div className="relative px-[40px]">
                <div className="sm:flex justify-between relative mb-6">
                    <div className="flex items-end gap-4 text-sm">
                        <h1 className="capitalize text-2xl">Xarajatlar</h1>
                    </div>
                    <button
                        onClick={() => handleModal("costModal", true)}
                        className="global_add_btn 2xsm:w-full 2xsm:mt-4 2xsm:py-2 sm:w-fit sm:mt-0 sm:py-0">
                        Yangisini qo'shish
                    </button>
                </div>
                <div className="flex items-center justify-between mt-3 rounded-md shadow-md bg-white">
                    <div className="flex items-center gap-2 text-xl">
                        <div className="w-[5px] h-[70px] mr-2 rounded-md bg-cyan-600"></div>
                        <h1>Jami:</h1>
                        <h1>{Math.round(costs.reduce((total, cost) => total + (+cost.amount), 0)).toLocaleString()} UZS</h1>
                    </div>
                    <CiCoins1 className="text-3xl text-cyan-600 mr-4" />
                </div>
            </div>

            <div className="mt-6 px-[40px]">
                {/* filter */}
                <div className="flex items-center flex-wrap gap-4 py-5">
                    {/* Search by */}
                    <input
                        value={filters.searchBy}
                        onChange={handleFilterChange}
                        className="w-48 p-2 text-xs outline-cyan-600 border rounded bg-[#f8f8f8]"
                        type="text"
                        name="searchBy"
                        id="searchBy"
                        placeholder="Nomi, oluvchi orqali qidirish" />

                    {/* Amount from */}
                    <input
                        value={filters.amountFrom}
                        onChange={handleFilterChange}
                        className="w-36 p-2 text-xs outline-cyan-600 border rounded bg-[#f8f8f8]"
                        type="number"
                        name="amountFrom"
                        id="amountFrom"
                        placeholder="Sumdan"
                    />

                    {/* Amount to */}
                    <input
                        value={filters.amountTo}
                        onChange={handleFilterChange}
                        className="w-36 p-2 text-xs outline-cyan-600 border rounded bg-[#f8f8f8]"
                        type="number"
                        name="amountTo"
                        id="amountTo"
                        placeholder="Sumgacha"
                    />


                    {/* Start Date */}
                    <div className="relative text-gray-500">
                        <label
                            htmlFor="start_date"
                            className="absolute text-xs bg-[#f8f8f8] -top-1.5 left-3">
                            <span>Boshlanish</span>
                        </label>
                        <input
                            value={filters.start_date}
                            onChange={handleFilterChange}
                            type="date"
                            name="start_date"
                            id="start_date"
                            className="w-full p-1.5 text-sm rounded border outline-cyan-600 bg-[#f8f8f8]" />
                    </div>

                    {/* End Date */}
                    <div className="relative text-gray-500">
                        <label
                            htmlFor="end_date"
                            className="absolute text-xs bg-[#f8f8f8] -top-1.5 left-3">
                            <span>Tugash</span>
                        </label>
                        <input
                            value={filters.end_date}
                            onChange={handleFilterChange}
                            type="date"
                            name="end_date"
                            id="end_date"
                            className="w-full p-1.5 text-sm rounded border outline-cyan-600 bg-[#f8f8f8]" />
                    </div>

                    <button
                        onClick={() => setFilters({
                            searchBy: "",
                            amountFrom: "",
                            amountTo: "",
                            start_date: "",
                            end_date: ""
                        })}
                        className="border rounded p-2 text-sm text-gray-700 bg-[#f8f8f8] hover:bg-gray-100 hover:text-gray-500 transition-all outline-cyan-600"
                    >
                        Filterni tiklash
                    </button>
                </div>
            </div>

            <div className="max-h-[800px] overflow-y-auto pt-2 pb-6 pl-[40px] pr-4 mr-[24px] flex flex-col gap-4">
                {/* Barcha qarzdorlar */}
                <div className="flex justify-between pb-4 font-semibold text-sm px-4 mt-6">
                    <h4 className="min-w-[150px] text-base">Sana</h4>
                    <h4 className="min-w-[250px] text-base">Nomi</h4>
                    <h4 className="min-w-[175px] text-base">Oluvhi</h4>
                    <h4 className="min-w-[120px] text-base">To'lov turi</h4>
                    <h4 className="min-w-[180px] text-base">Sum</h4>
                    <h4 className="min-w-[175px] text-base">Xodim</h4>
                    <h4 className="min-w-[100px] text-base">Amallar</h4>
                </div>
                {
                    isLoading ?
                        <>
                            <Skeleton
                                parentWidth={100}
                                firstChildWidth={85}
                                secondChildWidth={50}
                                thirdChildWidth={65}
                            />
                        </> :
                        filteredCosts.length > 0 ? <>
                            {
                                filteredCosts.map(cost => (
                                    <div
                                        key={cost._id}
                                        className="min-w-fit flex items-center justify-between p-4 rounded-md shadow-md hover:shadow-smooth transition-all bg-white">
                                        <p className="min-w-[150px] text-base">
                                            <FormattedDate date={cost.date} />
                                        </p>
                                        <p className="min-w-[250px] text-base">
                                            {cost.name}
                                        </p>
                                        <p className="min-w-[175px] text-base">
                                            {cost.receiver}
                                        </p>
                                        <p className="min-w-[120px] text-base">
                                            {cost.method}
                                        </p>
                                        <p className="min-w-[180px] text-base">
                                            <span>{Math.round(cost.amount).toLocaleString()}</span>
                                            <span> UZS</span>
                                        </p>
                                        <p className="min-w-[175px] text-base">
                                            {cost.author?.first_name + " " + cost.author?.last_name}
                                        </p>
                                        <div className="min-w-[100px] flex items-center gap-2 pl-3 text-base">
                                            <button onClick={() => updateBtnFunc(cost)}>
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFunc(cost._id)}
                                                className="text-red-500"
                                            >
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </> : <h1 className="text-base mt-6 text-center">Ma'lumot topilmadi!</h1>
                }
            </div>

            {/* Export to Excel button */}
            <button
                disabled={isLoading}
                onClick={exportToExcel}
                id="downloadExelBtn"
                className="size-8 relative float-end flex items-center justify-center mt-8 mr-[40px] text-gray-400 border border-gray-300 outline-cyan-600 text-xl rounded-full hover:text-cyan-600 hover:bg-blue-100 transition-all"
            >
                <MdFileDownload />
            </button>

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