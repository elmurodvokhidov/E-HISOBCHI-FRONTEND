import { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import service from "../config/service";
import {
    allTeacherSuccess,
    teacherFailure,
    teacherStart
} from "../redux/slices/teacherSlice";
import { Toast } from "../config/sweetToast";
import Skeleton from "../components/loaders/Skeleton";

export default function Salary() {
    const { teachers, isLoading } = useSelector(state => state.teacher);
    const dispatch = useDispatch();
    const [salarySettings, setSalarySettings] = useState({
        id: "",
        salaryPer: "",
        globalPer: "",
    });
    const [loading, setLoading] = useState("");

    // Inputdan ma'lumot olish funksiyasi
    const getInputValue = (e) => {
        setSalarySettings({
            ...salarySettings,
            [e.target.name]: e.target.value
        });
    };

    // Inputni tozalash funksiyasi
    const clearInput = () => {
        setSalarySettings({
            id: "",
            salaryPer: "",
            globalPer: "",
        });
    };

    // Barcha o'qituvchilarni olish
    const getAllTeachersFunction = async () => {
        try {
            dispatch(teacherStart());
            const { data } = await service.getAllTeachers();
            dispatch(allTeacherSuccess(data));
        } catch (error) {
            dispatch(teacherFailure(error.message));
        }
    };

    useEffect(() => {
        getAllTeachersFunction();
    }, []);

    // O'qituvchi ish haqi foizini hisoblash funksiyasi
    const setTeachersSalaryPerFunction = async (e) => {
        e.preventDefault();
        try {
            // Barcha o'qituvchiga bir vaqtda ish haqi foizini belgilash
            if (salarySettings.globalPer !== "" || salarySettings.salaryPer !== "") {
                if (salarySettings.id === "") {
                    setLoading("1");
                    const { data } = await service.setAllTeacherSalaryPer({ salaryPer: salarySettings.globalPer });
                    getAllTeachersFunction();
                    clearInput();
                    Toast.fire({ icon: "success", title: data.message });
                }
                // Tanlangan o'qituvchiga ish haqi foizini belgilash
                else {
                    setLoading("2");
                    const { data } = await service.setTeacherSalaryPer(salarySettings.id, salarySettings.salaryPer);
                    getAllTeachersFunction();
                    clearInput();
                    Toast.fire({ icon: "success", title: data.message });
                }
            }
            else {
                Toast.fire({ icon: "error", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading("");
        }
    };

    return (
        <div className="container">
            <div className="flex flex-col gap-6 p-6 shadow-md bg-white">
                <div className="flex items-center gap-2 text-2xl pc:text-3xl mb-1">
                    <IoSettingsOutline className="" />
                    <h1>Ish haqi kalkulyatorini sozlash</h1>
                </div>

                <div className="flex items-center gap-6 text-xl pc:text-2xl shadow-md">
                    <div className="w-[5px] h-[80px] rounded-md bg-main-1"></div>
                    <h1 className="size-14 flex items-center justify-center text-4xl pc:text-5xl text-white border-[3px] border-black bg-main-1">1</h1>
                    <h1>Barcha o'qituvchilar uchun standart xarajatlarni belgilash parametrlarini ko'rsating</h1>
                </div>

                {/* Barcha o'qituvchilar uchun */}
                <form className="w-11/12">
                    <label htmlFor="forAllTeacher" className="text-base pc:text-lg">Xarajat qiymati</label>
                    <div className="flex items-center gap-8">
                        <div className="w-full flex items-center">
                            <input
                                onChange={getInputValue}
                                value={salarySettings.globalPer}
                                type="number"
                                name="globalPer"
                                id="forAllTeacher"
                                className="w-full border pc:text-lg border-gray-200 outline-main-1 p-2 rounded-l-md"
                            />
                            <button
                                disabled
                                className="min-w-48 py-2 pc:text-lg rounded-r-3xl bg-gray-200"
                            >
                                talaba to'lovidan %
                            </button>
                        </div>
                        <button
                            onClick={setTeachersSalaryPerFunction}
                            className="border-2 border-main-1 rounded-3xl pc:text-lg text-main-1 py-2 px-4"
                        >
                            {loading === "1" ? "Loading..." : "Saqlash"}
                        </button>
                    </div>
                </form>

                <div className="flex items-center gap-6 text-xl pc:text-2xl shadow-md">
                    <div className="w-[5px] h-[80px] rounded-md bg-main-1"></div>
                    <h1 className="size-14 flex items-center justify-center text-4xl pc:text-5xl text-white border-[3px] border-black bg-main-1">2</h1>
                    <h1>Ba'zi o'qituvchilar uchun individual hisoblashni belgilashingiz mumkin</h1>
                </div>

                {/* Individual o'qituvchilar uchun */}
                <form className="w-11/12 flex items-center gap-8">
                    <div className="w-1/4 flex flex-col">
                        <label htmlFor="teacher pc:text-lg">O'qituvchini tanlang</label>
                        <select onChange={getInputValue} value={salarySettings.id} name="id" id="teacher" className="border border-gray-200 outline-main-1 py-2 px-4 rounded-md">
                            <option value="" className="italic pc:text-lg">None</option>
                            {
                                teachers.map(teacher => (
                                    <option value={teacher._id} key={teacher._id} className="pc:text-lg">
                                        {teacher.first_name + " " + teacher.last_name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="w-3/4">
                        <label htmlFor="forOneTeacher" className="text-base pc:text-lg">Xarajat qiymati</label>
                        <div className="flex items-center gap-8">
                            <div className="w-full flex items-center">
                                <input
                                    onChange={getInputValue}
                                    value={salarySettings.salaryPer}
                                    type="number"
                                    name="salaryPer"
                                    id="forOneTeacher"
                                    className="w-full border pc:text-lg border-gray-200 outline-main-1 p-2 rounded-l-md"
                                />
                                <button
                                    disabled
                                    className="min-w-48 py-2 pc:text-lg rounded-r-3xl bg-gray-200"
                                >
                                    talaba to'lovidan %
                                </button>
                            </div>
                            <button
                                onClick={setTeachersSalaryPerFunction}
                                className="border-2 border-main-1 rounded-3xl pc:text-lg text-main-1 py-2 px-4"
                            >
                                {loading === "2" ? "Loading..." : "Saqlash"}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Barcha o'qituvchilar */}
                <div className="my-4">
                    <div className="flex items-center text-sm pc:text-base pb-2 pl-2 border-b">
                        <p className="min-w-[500px] font-semibold">O'qituvchi</p>
                        <p className="min-w-[150px] font-semibold">Hisoblash usuli</p>
                    </div>

                    <div className="max-h-[250px] overflow-y-auto">
                        {
                            isLoading ? <>
                                <Skeleton
                                    parentWidth={100}
                                    firstChildWidth={85}
                                    secondChildWidth={50}
                                    thirdChildWidth={65}
                                />
                            </> : <>
                                {
                                    teachers.filter(teacher => teacher.salaryPer > 0).map(teacher => (
                                        <div key={teacher._id} className="flex items-center text-base pc:text-lg py-2 pl-2 border-b">
                                            <p className="min-w-[500px]">
                                                {teacher?.first_name + " " + teacher?.last_name}
                                            </p>
                                            <p className="min-w-[150px] ml-6">
                                                {teacher?.salaryPer}%
                                            </p>
                                        </div>
                                    ))
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};