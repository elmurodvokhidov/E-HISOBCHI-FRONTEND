import { useState } from "react";
import {
    getTeacherSuccess,
    teacherFailure,
    teacherStart
} from "../../redux/slices/teacherSlice";
import AuthService from "../../config/authService";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import TeacherModal from "./TeacherModal";
import logo from "../../img/uitc_logo.png";
import { useDispatch } from "react-redux";
import { LiaEditSolid } from "react-icons/lia";
import { NavLink } from "react-router-dom";
import Skeleton from "../../components/loaders/Skeleton";
import { GoDotFill } from "react-icons/go";

export default function TeacherProfile({ teacher, isLoading }) {
    const dispatch = useDispatch();
    const [newTeacher, setNewTeacher] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        contactNumber: "",
        gender: "",
    });
    const [newPass, setNewPass] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [modals, setModals] = useState({
        modal: false,
        createModal: false,
        passModal: false,
        imageModal: false,
        more: null,
    });

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewTeacher({
            first_name: "",
            last_name: "",
            email: "",
            dob: "",
            contactNumber: "",
            gender: "",
        });
        setNewPass({ newPassword: "", confirmPassword: "" });
        setModals({
            modal: false,
            createModal: false,
            passModal: false,
            imageModal: false,
            more: null,
        })
    };

    const openModal = () => {
        setNewTeacher(teacher);
        handleModal("modal", true);
        handleModal("editModal", false);
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        // o'qituvchi parolini o'zgartirish
        if (modals.passModal && newTeacher._id) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(teacherStart());
                    const { data } = await AuthService.updateTeacherPass({ ...newPass, _id: newTeacher._id });
                    dispatch(getTeacherSuccess(data));
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(teacherFailure(error.response.data.message));
                    await ToastLeft.fire({
                        icon: "error",
                        title: error.response.data.message || error.message
                    });
                }
            }
            else {
                await ToastLeft.fire({
                    icon: "error",
                    title: "Parol 8 ta belgidan kam bo'lmasligi kerak!"
                });
            }
        }
        else {
            if (
                newTeacher.first_name !== "" &&
                newTeacher.last_name !== "" &&
                newTeacher.email !== "" &&
                newTeacher.contactNumber !== "" &&
                newTeacher.dob !== "" &&
                newTeacher.gender !== ""
            ) {
                try {
                    // o'qituvchi ma'lumotlarini o'zgartirish
                    dispatch(teacherStart());
                    const { _id, __v, groups, password, createdAt, updatedAt, ...newTeacherCred } = newTeacher;
                    const { data } = await AuthService.updateTeacher(newTeacher._id, newTeacherCred);
                    dispatch(getTeacherSuccess(data));
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(teacherFailure(error.response?.data.error));
                    await ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.error || error.message
                    });
                }
            }
            else {
                await ToastLeft.fire({
                    icon: "error",
                    title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
                });
            }
        }
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 px-10">
            <div className="flex justify-between border-b-2 pb-16 relative">
                <h1 className="capitalize text-2xl">Hisob qaydnomalari</h1>
                <p className="absolute bottom-[-1px] border-b-2 uppercase text-xs pb-2 border-cyan-600 text-cyan-600">o'qituvchi</p>
            </div>

            <div className="flex gap-8 my-16">
                <div className="w-[440px] border-2 py-8 px-6 rounded shadow-dim">
                    <div className="flex relative justify-start gap-10">
                        {!teacher ?
                            <div className="w-[410px]">
                                <Skeleton parentWidth={100} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                            </div> : <>
                                <div className="w-full flex flex-col gap-4 text-sm">
                                    <div className="flex items-center gap-4">
                                        <figure className={`w-20 h-20 border-4 border-white rounded-[50%] overflow-hidden bg-slate-100 ${!teacher ? "bg-gray-300 animate-pulse" : null}`}>
                                            {teacher ? <img className="w-full h-full object-cover" src={logo} alt="logo" /> : null}
                                        </figure>
                                        <h1 className="capitalize text-xl">{teacher.first_name} {teacher.last_name}</h1>
                                    </div>

                                    <div className="flex justify-between gap-20">
                                        <span className="text-gray-500">Telefon:</span>
                                        <span className="text-blue-300">+{teacher.contactNumber}</span>
                                    </div>

                                    <div className="flex justify-between gap-20">
                                        <span className="text-gray-500">Tug'ilgan kun:</span>
                                        <span>{teacher.dob}</span>
                                    </div>

                                    <div className="flex justify-between gap-20">
                                        <span className="text-gray-500">Email manzil:</span>
                                        <span>{teacher.email}</span>
                                    </div>

                                    <p className="w-fit px-2 rounded bg-gray-200">{teacher.gender}</p>
                                </div>

                                <div className="w-fit h-fit absolute top-0 right-0">
                                    <button
                                        disabled={teacher ? false : true}
                                        onClick={() => openModal()}
                                        className="w-8 h-8 flex items-center justify-center text-xl border rounded-full text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300">
                                        <LiaEditSolid />
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </div>

                {/* Guruh haqida ma'lumot */}
                <div>
                    <h1 className="text-xl">Guruhlar</h1>
                    <div className="flex flex-col gap-4 mt-2">
                        {
                            teacher?.groups.length > 0 ?
                                teacher.groups.map((group, index) => (
                                    <NavLink to={`/admin/group-info/${group._id}`} key={index}>
                                        <div className="courseCard flex gap-28 w-50% p-5 cursor-pointer bg-white shadow-smooth">
                                            <div className="flex flex-col text-xs">
                                                <h1 className="w-fit text-[10px] rounded px-2 py-1 bg-gray-200">{group.name}</h1>
                                                {/* Here is the open issue... */}
                                                {/* <h1>{group.course.title}</h1> */}
                                                <h1>Frontend</h1>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <div className="flex flex-col">
                                                    <div className="text-xs text-gray-500">
                                                        <h1 className="flex items-center gap-1">
                                                            {group.start_date}
                                                            <span className="inline-block align-middle w-4 border border-gray-300"></span>
                                                        </h1>
                                                        <h1>{group.end_date}</h1>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <h1>{group.day}</h1>
                                                        <span><GoDotFill fontSize={8} /></span>
                                                        <h1>{group.start_time}</h1>
                                                    </div>
                                                </div>
                                                <h1 className="w-4 text-center text-xs text-white rounded bg-cyan-600">{group.students.length}</h1>
                                            </div>
                                        </div>
                                    </NavLink>
                                )) : <h1>Ma'lumot topilmadi!</h1>
                        }
                    </div>
                </div>

                {/* Guruhdagi barcha o'quvchilar ro'yxati */}
                <div></div>
            </div>

            {/* update teacher modal */}
            <TeacherModal
                modals={modals}
                handleModal={handleModal}
                newTeacher={newTeacher}
                setNewTeacher={setNewTeacher}
                newPass={newPass}
                setNewPass={setNewPass}
                handleCreateAndUpdate={updateHandler}
                isLoading={isLoading}
                clearModal={clearModal}
            />
        </div>
    )
};