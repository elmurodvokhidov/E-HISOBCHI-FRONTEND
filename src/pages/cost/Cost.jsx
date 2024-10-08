import { useEffect, useState } from "react";
import { CiCoins1 } from "react-icons/ci";
import { MdFileDownload } from "react-icons/md";
import CostModal from "./CostModal";
import service from "../../config/service";
import { costFailure, costStart, costSuccess } from "../../redux/slices/costSlice";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../../components/loaders/Skeleton";
import Swal from "sweetalert2";
import { Toast, ToastLeft } from "../../config/sweetToast";
import * as XLSX from 'xlsx';
import { FormattedDate } from "../../components/FormattedDate";
import { Bin, Pencil } from "../../assets/icons/Icons";

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
            const { data } = await service.getAllCost();
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

            if (key === "searchBy") return cost.name.toLowerCase().includes(value.toLowerCase().trim()) || cost.receiver.toLowerCase().includes(value.toLowerCase().trim());

            if (key === 'amountFrom' || key === 'amountTo') {
                const sum = Math.round(Math.abs(cost.amount));
                const filterAmountFrom = parseInt(filters['amountFrom']);
                const filterAmountTo = parseInt(filters['amountTo']);

                if (filters['amountFrom'] && filters['amountTo']) return sum >= filterAmountFrom && sum <= filterAmountTo;
                else if (filters['amountFrom']) return sum >= filterAmountFrom;
                else if (filters['amountTo']) return sum <= filterAmountTo;
                else return true;
            };

            if (key === 'start_date' || key === 'end_date') {
                const costStartDate = new Date(cost.date);
                const costEndDate = new Date(cost.date);
                const filterStartDate = new Date(filters['start_date']);
                const filterEndDate = new Date(filters['end_date']);

                if (filters['start_date'] && filters['end_date']) return costStartDate >= filterStartDate && costEndDate <= filterEndDate;
                else if (filters['start_date']) return costStartDate >= filterStartDate;
                else if (filters['end_date']) return costEndDate <= filterEndDate;
                else return true;
            };

            return cost[key] === value;
        });
    });

    // Barcha xarajatlarni exel fayli sifatida yuklab olish funksiyasi
    const exportToExcel = () => {
        const fileName = 'costs.xlsx';
        const header = ["Sana", "Xarajat nomi", "Oluvchi", "To'lov turi", "To'langan summa", "Xodim"];

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
                service.deleteCost(id).then((res) => {
                    getAllCostFunction();
                    Toast.fire({ icon: "success", title: res?.data.message });
                }).catch((error) => {
                    dispatch(costFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
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
                    <div className="flex items-end gap-4 text-sm pc:text-base">
                        <h1 className="capitalize text-2xl pc:text-3xl">Xarajatlar</h1>
                    </div>
                    <button
                        onClick={() => handleModal("costModal", true)}
                        className="global_add_btn small:w-full small:mt-4 small:py-2 sm:w-fit sm:mt-0 sm:py-0">
                        Yangisini qo'shish
                    </button>
                </div>
                <div className="flex items-center justify-between mt-3 rounded-md shadow-md bg-white">
                    <div className="flex items-center gap-2 text-xl pc:text-2xl">
                        <div className="w-[5px] h-[70px] mr-2 rounded-md bg-main-1"></div>
                        <h1>Jami:</h1>
                        <h1>{Math.round(costs.reduce((total, cost) => total + (+cost.amount), 0)).toLocaleString()} UZS</h1>
                    </div>
                    <CiCoins1 className="text-3xl text-main-1 mr-4" />
                </div>
            </div>

            <div className="mt-6 px-[40px]">
                {/* filter */}
                <div className="flex items-center flex-wrap gap-4 py-5">
                    {/* Search by */}
                    <input
                        value={filters.searchBy}
                        onChange={handleFilterChange}
                        className="w-48 pc:w-60 p-2 text-xs pc:text-base outline-main-1 border rounded bg-main-2"
                        type="text"
                        name="searchBy"
                        id="searchBy"
                        placeholder="Nomi, oluvchi orqali qidirish" />

                    {/* Amount from */}
                    <input
                        value={filters.amountFrom}
                        onChange={handleFilterChange}
                        className="w-36 p-2 text-xs pc:text-base outline-main-1 border rounded bg-main-2"
                        type="number"
                        name="amountFrom"
                        id="amountFrom"
                        placeholder="Sumdan"
                    />

                    {/* Amount to */}
                    <input
                        value={filters.amountTo}
                        onChange={handleFilterChange}
                        className="w-36 p-2 text-xs pc:text-base outline-main-1 border rounded bg-main-2"
                        type="number"
                        name="amountTo"
                        id="amountTo"
                        placeholder="Sumgacha"
                    />


                    {/* Start Date */}
                    <div className="relative text-gray-500">
                        <label
                            htmlFor="start_date"
                            className="absolute text-xs pc:text-base bg-main-2 -top-1.5 pc:-top-3 left-3">
                            <span>Boshlanish</span>
                        </label>
                        <input
                            value={filters.start_date}
                            onChange={handleFilterChange}
                            type="date"
                            name="start_date"
                            id="start_date"
                            className="w-full p-1.5 text-sm pc:text-base rounded border outline-main-1 bg-main-2" />
                    </div>

                    {/* End Date */}
                    <div className="relative text-gray-500">
                        <label
                            htmlFor="end_date"
                            className="absolute text-xs pc:text-base bg-main-2 -top-1.5 pc:-top-3 left-3">
                            <span>Tugash</span>
                        </label>
                        <input
                            value={filters.end_date}
                            onChange={handleFilterChange}
                            type="date"
                            name="end_date"
                            id="end_date"
                            className="w-full p-1.5 text-sm pc:text-base rounded border outline-main-1 bg-main-2" />
                    </div>

                    <button
                        onClick={() => setFilters({
                            searchBy: "",
                            amountFrom: "",
                            amountTo: "",
                            start_date: "",
                            end_date: ""
                        })}
                        className="border rounded p-2 text-sm pc:text-base text-gray-700 bg-main-2 hover:bg-gray-100 hover:text-gray-500 transition-all outline-main-1"
                    >
                        Filterni tiklash
                    </button>
                </div>
            </div>

            <div className="max-h-[800px] overflow-y-auto pt-2 pb-6 pl-[40px] pr-4 mr-[24px] flex flex-col gap-4">
                {/* Barcha qarzdorlar */}
                <div className="flex justify-between pb-4 font-semibold text-sm pc:text-lg px-4 mt-6">
                    <h4 className="min-w-[150px]">Sana</h4>
                    <h4 className="min-w-[250px]">Nomi</h4>
                    <h4 className="min-w-[175px]">Oluvhi</h4>
                    <h4 className="min-w-[120px]">To'lov turi</h4>
                    <h4 className="min-w-[180px]">Sum</h4>
                    <h4 className="min-w-[175px]">Xodim</h4>
                    <h4 className="min-w-[100px]">Amallar</h4>
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
                                        <p className="min-w-[150px] text-base pc:text-lg">
                                            <FormattedDate date={cost.date} />
                                        </p>
                                        <p className="min-w-[250px] text-base pc:text-lg">
                                            {cost.name}
                                        </p>
                                        <p className="min-w-[175px] text-base pc:text-lg">
                                            {cost.receiver}
                                        </p>
                                        <p className="min-w-[120px] text-base pc:text-lg">
                                            {cost.method}
                                        </p>
                                        <p className="min-w-[180px] text-base pc:text-lg">
                                            <span>{Math.round(cost.amount).toLocaleString()}</span>
                                            <span> UZS</span>
                                        </p>
                                        <p className="min-w-[175px] text-base pc:text-lg">
                                            {cost.author?.first_name + " " + cost.author?.last_name}
                                        </p>
                                        <div className="min-w-[100px] flex items-center gap-2 pl-3 text-base pc:text-lg">
                                            <button onClick={() => updateBtnFunc(cost)}>
                                                <Pencil />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFunc(cost._id)}
                                                className="text-red-500"
                                            >
                                                <Bin />
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
                className="size-8 pc:size-10 relative float-end flex items-center justify-center mt-8 mr-[40px] text-gray-400 border border-gray-300 outline-main-1 text-xl pc:text-2xl rounded-full hover:text-main-1 hover:bg-blue-100 transition-all"
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