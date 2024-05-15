import { useEffect, useState } from "react";
import { CiCoins1 } from "react-icons/ci";
import Skeleton from "../components/loaders/Skeleton";
import { MdFileDownload } from "react-icons/md";
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from "react-redux";
import {
    allStudentSuccess,
    studentFailure,
    studentStart
} from "../redux/slices/studentSlice";
import AuthService from "../config/authService";
import { NavLink } from "react-router-dom";
import tick from "../assets/icons/tick.svg";
import copy from "../assets/icons/copy.svg";

export default function Debtors() {
    const { isLoading } = useSelector(state => state.student);
    const dispatch = useDispatch();
    const [debtors, setDebtors] = useState([]);
    const [copied, setCopied] = useState("");
    const [filters, setFilters] = useState({
        searchBy: "",
        amountFrom: "",
        amountTo: "",
    });

    // Barcha o'quvchilarni olish
    const getAllStudentsFunction = async () => {
        try {
            dispatch(studentStart());
            const { data } = await AuthService.getAllStudents();
            dispatch(allStudentSuccess(data));
            setDebtors(data.data.filter(student => student.balance < 0));
        } catch (error) {
            dispatch(studentFailure(error.message));
        }
    };

    useEffect(() => {
        getAllStudentsFunction();
    }, []);

    // Matnni nusxalash funksiyasi
    const handleCopy = (text) => {
        setCopied(text);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            setCopied("");
        }, 3000);
    };

    // Filterlash uchun qiymat olish
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Qarzdorlarni filterlash funksiyasi
    const filteredDebtors = debtors.filter(debtor => {
        return Object.entries(filters).every(([key, value]) => {
            if (value === "") return true;

            if (key === "searchBy") {
                return debtor.first_name.toLowerCase().includes(value.toLowerCase().trim()) || debtor.last_name.toLowerCase().includes(value.toLowerCase().trim()) || debtor.phoneNumber.toString().includes(value.toString().trim());
            }

            if (key === 'amountFrom' || key === 'amountTo') {
                const deb = Math.floor(Math.abs(debtor.balance));
                const filterAmountFrom = parseInt(filters['amountFrom']);
                const filterAmountTo = parseInt(filters['amountTo']);

                if (filters['amountFrom'] && filters['amountTo']) {
                    return deb >= filterAmountFrom && deb <= filterAmountTo;
                } else if (filters['amountFrom']) {
                    return deb >= filterAmountFrom;
                } else if (filters['amountTo']) {
                    return deb <= filterAmountTo;
                } else {
                    return true;
                }
            }

            return debtor[key] === value;
        });
    });

    // Barcha qarzdorlar ma'lumotlarini exel fayli sifatida yuklab olish funksiyasi
    const exportToExcel = () => {
        const fileName = 'debtors.xlsx';
        const header = ['O\'quvchi ismi', 'Telefon', 'Qarz', 'Guruh nomi', 'Kurs nomi', 'O\'qituvchi ismi'];

        const wb = XLSX.utils.book_new();
        const data = filteredDebtors.map(debtor => [
            debtor.first_name + " " + debtor.last_name || '',
            debtor.phoneNumber || '',
            (Math.floor(debtor.balance) || '').toLocaleString(),
            debtor.group?.name || '',
            debtor.group?.course?.title || '',
            debtor.group?.teacher?.first_name + " " +
            debtor.group?.teacher?.last_name || '',
        ]);
        data.unshift(header);
        const ws = XLSX.utils.aoa_to_sheet(data);
        const columnWidths = data[0].map((_, colIndex) => ({
            wch: data.reduce((acc, row) => Math.max(acc, String(row[colIndex]).length), 0)
        }));
        ws['!cols'] = columnWidths;
        XLSX.utils.book_append_sheet(wb, ws, 'Debtors');
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div className="container !px-0">
            <div className="relative px-[40px]">
                <div className="flex items-end gap-4 text-sm">
                    <h1 className="capitalize text-2xl">Qarzdorlar</h1>
                    <p>Miqdor <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{debtors.length || 0}</span></p>
                </div>
                <div className="flex items-center justify-between mt-3 rounded-md shadow-md bg-white">
                    <div className="flex items-center gap-2 text-xl">
                        <div className="w-[5px] h-[70px] mr-2 rounded-md bg-cyan-600"></div>
                        <h1>Jami:</h1>
                        <h1>{Math.floor(debtors.reduce((total, debtor) => total + debtor.balance, 0)).toLocaleString()} UZS</h1>
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
                        placeholder="Ism yoki telefon orqali qidirish" />

                    {/* Amount from */}
                    <input
                        value={filters.amountFrom}
                        onChange={handleFilterChange}
                        className="w-36 p-2 text-xs outline-cyan-600 border rounded bg-[#f8f8f8]"
                        type="number"
                        name="amountFrom"
                        id="amountFrom"
                        placeholder="Qarz miqdoridan"
                    />

                    {/* Amount to */}
                    <input
                        value={filters.amountTo}
                        onChange={handleFilterChange}
                        className="w-36 p-2 text-xs outline-cyan-600 border rounded bg-[#f8f8f8]"
                        type="number"
                        name="amountTo"
                        id="amountTo"
                        placeholder="Qarz miqdorigacha"
                    />

                    <button
                        onClick={() => setFilters({
                            searchBy: "",
                            amountFrom: "",
                            amountTo: "",
                        })}
                        className="border rounded p-2 text-sm text-gray-700 bg-[#f8f8f8] hover:bg-gray-100 hover:text-gray-500 transition-all"
                    >
                        Filterni tiklash
                    </button>
                </div>

                {/* Barcha qarzdorlar */}
                <div className="flex justify-between pb-4 font-semibold text-sm px-4 mt-6">
                    <h4 className="min-w-[200px] text-base">O'quvchi ismi</h4>
                    <h4 className="min-w-[150px] text-base">Telefon</h4>
                    <h4 className="min-w-[100px] text-base">Qarz</h4>
                    <h4 className="min-w-[150px] text-base">Guruh</h4>
                </div>
            </div>

            <div className="max-h-[800px] overflow-y-auto pt-2 pb-6 pl-[40px] pr-4 mr-[24px] flex flex-col gap-4">
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
                        filteredDebtors.length > 0 ? <>
                            {
                                filteredDebtors.map(debtor => (
                                    <div
                                        key={debtor._id}
                                        className="flex items-center justify-between px-4 py-2.5 rounded-md shadow-md hover:shadow-smooth transition-all bg-white"
                                    >
                                        <h4 className="min-w-[200px] text-base">
                                            <NavLink
                                                to={`/admin/student-info/${debtor._id}`}
                                                className="hover:text-cyan-500"
                                            >
                                                {debtor.first_name + " "}
                                                {debtor.last_name}
                                            </NavLink>
                                        </h4>
                                        <h4
                                            onClick={() => handleCopy(debtor.phoneNumber)}
                                            className="min-w-[150px] flex items-center gap-1 cursor-pointer text-base text-cyan-500">
                                            {debtor.phoneNumber}
                                            <img
                                                src={copied === debtor.phoneNumber ? tick : copy}
                                                alt="copy svg"
                                                className="cursor-pointer" />
                                        </h4>
                                        <h4 className="min-w-[100px] text-base text-red-500">
                                            {Math.floor(debtor.balance).toLocaleString()}
                                            <span className="text-xs"> UZS</span>
                                        </h4>
                                        <div className="min-w-[150px] text-sm">
                                            <h4 className=" flex flex-wrap items-center gap-1">
                                                <span className="bg-gray-200 px-1 rounded">{debtor.group?.name}</span>
                                                <span>{debtor.group?.course?.title}</span> <br />
                                            </h4>
                                            <h4 className="flex items-center gap-2">
                                                <span>{debtor.group?.teacher?.first_name}</span>
                                                <span>{debtor.group?.teacher?.last_name}</span>
                                            </h4>
                                        </div>
                                    </div>
                                ))
                            }
                        </> : <h1 className="text-base mt-6 text-center">Qarzdorlar mavjud emas!</h1>
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
        </div>
    )
};