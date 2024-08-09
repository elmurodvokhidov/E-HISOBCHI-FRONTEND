import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import {
    companyFailure,
    companyStart,
    companySuccess
} from "../../redux/slices/companySlice";
import service from "../../config/service";
import { Toast } from "../../config/sweetToast";
import { useNavigate } from "react-router-dom";

export default function Company() {
    const { isLoading } = useSelector(state => state.company);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [companyCred, setCompanyCred] = useState({
        name: "",
        phoneNumber: "",
    });

    // Mavjud kompaniyani olish funksiyasi
    const getCompanyFunction = async () => {
        try {
            dispatch(companyStart());
            const { data } = await service.getCompany();
            if (data.success) navigate('/admin/dashboard');
            dispatch(companySuccess(data));
        } catch (error) {
            dispatch(companyFailure(error.response?.data.message));
        }
    };

    // Agar kompaniya mavjud bo'lsa u holda dasturga yo'nlatirish
    useEffect(() => {
        getCompanyFunction();
    }, []);

    // Kompaniya ma'lumotlarini inputda olish funksiyasi
    const getCompanyCred = (e) => {
        setCompanyCred({
            ...companyCred,
            [e.target.name]: e.target.value
        });
    };

    // Inputni tozalash funksiyasi
    const clearInput = () => {
        setCompanyCred({
            name: "",
            phoneNumber: "",
        });
    };

    // Yangi kompaniya yaratish funksiyasi
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            dispatch(companyStart());
            const { data } = await service.createNewCompany(companyCred);
            dispatch(companySuccess(data));
            navigate('/admin/dashboard')
            clearInput();
            Toast.fire({
                icon: "success",
                title: data.message
            });
        } catch (error) {
            dispatch(companyFailure(error.response?.data.message));
            Toast.fire({
                icon: "error",
                title: error.response?.data.message || error.message
            });
        }
    };

    return (
        <div className="w-full h-screen flex items-start justify-center pt-10 bg-main-2">
            <div className="w-[450px] flex flex-col gap-6 border rounded-md shadow-smooth px-10 py-8 bg-white">
                <h1 className="text-3xl">Kompaniya ma'lumotlari</h1>

                <form className="flex flex-col gap-4">
                    {/* Company Name */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="flex gap-1"
                            htmlFor="name">
                            <span>Kompaniya nomi</span>
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            disabled={isLoading}
                            onChange={getCompanyCred}
                            type="text"
                            name="name"
                            id="name"
                            className="w-full border-2 border-gray-300 rounded px-2 py-1 outline-main-1"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="flex gap-1"
                            htmlFor="phoneNumber">
                            <span>Kompaniya telefon raqami</span>
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <label htmlFor="phoneNumber" className="text-base border-2 border-r-0 rounded-l border-gray-300 px-2 py-1">+998</label>
                            <input
                                disabled={isLoading}
                                onChange={getCompanyCred}
                                type="number"
                                name="phoneNumber"
                                id="phoneNumber"
                                className="w-full border-2 border-gray-300 rounded rounded-l-none px-2 py-1 pc:text-lg outline-main-1"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        disabled={!isLoading && companyCred.name !== "" && companyCred.phoneNumber !== "" ? false : true}
                        onClick={handleCreate}
                        className="w-fit px-6 py-1 mt-8 bg-main-1 rounded-2xl text-white disabled:bg-gray-400">
                        {isLoading ? "Loading..." : "Kompaniya yaratish"}
                    </button>
                </form>
            </div>
        </div>
    )
};