import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { companyFailure, companyStart, companySuccess } from "../../redux/slices/companySlice";
import service from "../../config/service";
import Skeleton from "../../components/loaders/Skeleton";
import { Toast } from "../../config/sweetToast";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";

function GeneralSettings() {
    const { auth } = useSelector(state => state.auth);
    const { company, isLoading } = useSelector(state => state.company);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [companyCred, setCompanyCred] = useState({ name: "", phoneNumber: "", image: "", });

    // Kompaniya ma'lumotlarini inputda olish funksiyasi
    const getCompanyCred = (e) => {
        setCompanyCred({
            ...companyCred,
            [e.target.name]: e.target.value
        });
    };

    // Mavjud kompaniyani olish funksiyasi
    const getCompanyFunction = async () => {
        try {
            dispatch(companyStart());
            const { data } = await service.getCompany();
            setCompanyCred({
                name: data.data.name,
                phoneNumber: data.data.phoneNumber,
            });
            dispatch(companySuccess(data));
        } catch (error) {
            dispatch(companyFailure(error.response?.data.message));
        }
    };

    useEffect(() => {
        getCompanyFunction();

        if (auth?.role !== "ceo") navigate("/");
    }, []);

    // Rasm yuklash
    const getImage = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        const { data } = await api.post("/uploads", formData);
        setCompanyCred({ ...companyCred, image: data.img_url });
    };

    // Kompaniy ma'lumotlarini o'zgartirish funksiyasi
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            dispatch(companyStart());
            const { data } = await service.updateCompany(companyCred, company._id);
            dispatch(companySuccess(data));
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
        <div className="w-full h-screen overflow-auto pt-24 pc:pt-28 pb-10 px-10">
            <h1 className="text-3xl pc:text-4xl mb-8">Umumiy sozlamalar</h1>
            <div className="w-fit flex items-center small:flex-col lg:flex-row gap-20 border rounded-md shadow-md px-10 py-8 bg-white">
                {company?.image && <img crossOrigin="anonymous" src={company.image} className="size-[400px]" alt="company logo" />}

                <form className="w-[450px] flex flex-col gap-4">
                    {/* Company logo */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="image">Rasm</label>
                        <input
                            onChange={getImage}
                            type="file"
                            name="image"
                            id="image"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                    </div>

                    {/* Company Name */}
                    <div className="flex flex-col gap-1">
                        <label
                            className="flex gap-1 pc:text-lg"
                            htmlFor="name">
                            <span>Kompaniya nomi</span>
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            disabled={isLoading}
                            onChange={getCompanyCred}
                            value={companyCred.name}
                            type="text"
                            name="name"
                            id="name"
                            className="w-full border-2 border-gray-300 rounded pc:text-lg px-2 py-1 outline-main-1"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-1">
                        <label
                            className="flex gap-1 pc:text-lg"
                            htmlFor="phoneNumber">
                            <span>Kompaniya telefon raqami</span>
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <label htmlFor="phoneNumber" className="text-base pc:text-lg border-2 border-r-0 rounded-l border-gray-300 px-2 py-1">+998</label>
                            <input
                                disabled={isLoading}
                                onChange={getCompanyCred}
                                value={companyCred.phoneNumber}
                                type="number"
                                name="phoneNumber"
                                id="phoneNumber"
                                className="w-full border-2 border-gray-300 rounded rounded-l-none px-2 py-1 pc:text-lg outline-main-1"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="flex justify-end">
                        <button
                            disabled={!isLoading && companyCred.name !== "" && companyCred.phoneNumber !== "" ? false : true}
                            onClick={handleUpdate}
                            className="w-fit px-6 py-1 mt-8 bg-main-1 rounded-2xl pc:text-lg text-white disabled:bg-gray-400">
                            {isLoading ? "Loading..." : "Saqlash"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GeneralSettings