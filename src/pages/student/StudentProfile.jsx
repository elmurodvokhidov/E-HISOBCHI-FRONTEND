import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../config/authService";
import { allGroupSuccess, groupFailure, groupStart } from "../../redux/slices/groupSlice";
import { getStudentSuccess, studentFailure, studentStart } from "../../redux/slices/studentSlice";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import logo from "../../img/uitc_logo.png";
import StudentModal from "./StudentModal";
import { LiaEditSolid } from "react-icons/lia";
import Skeleton from "../../components/loaders/Skeleton";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function StudentProfile({ student, isLoading, }) {
    const { groups } = useSelector(state => state.group);
    const dispatch = useDispatch();
    const [newStudent, setNewStudent] = useState({
        first_name: "",
        last_name: "",
        father_name: "",
        mother_name: "",
        email: "",
        dob: "",
        contactNumber: "",
        fatherContactNumber: "",
        motherContactNumber: "",
        gender: "",
        group: "",
    });
    const [newPass, setNewPass] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [modals, setModals] = useState({
        modal: false,
        createModal: false,
        passModal: false,
        parentsModal: false,
        imageModal: false,
        more: null,
        extra: false,
    });

    const getAllGroupsFunc = async () => {
        try {
            dispatch(groupStart());
            const { data } = await AuthService.getAllGroups();
            dispatch(allGroupSuccess(data));
        } catch (error) {
            dispatch(groupFailure(error.message));
        }
    };

    useEffect(() => {
        getAllGroupsFunc();
    }, []);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const openModal = () => {
        setNewStudent(student);
        handleModal("modal", true);
        handleModal("editModal", false);
    };

    const clearModal = () => {
        setNewStudent({
            first_name: "",
            last_name: "",
            father_name: "",
            mother_name: "",
            email: "",
            dob: "",
            contactNumber: "",
            fatherContactNumber: "",
            motherContactNumber: "",
            gender: "",
            group: "",
        });
        setNewPass({ newPassword: "", confirmPassword: "" });
        setModals({
            modal: false,
            createModal: false,
            passModal: false,
            parentsModal: false,
            imageModal: false,
            more: null,
        })
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        // o'quvchi parolini o'zgartirish
        if (modals.passModal && newStudent._id) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(studentStart());
                    const { data } = await AuthService.updateStudentPass({ ...newPass, _id: newStudent._id });
                    dispatch(getStudentSuccess(data));
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(studentFailure(error.response.data.message));
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
                newStudent.first_name !== "" &&
                newStudent.last_name !== "" &&
                newStudent.email !== "" &&
                newStudent.group !== ""
            ) {
                dispatch(studentStart());
                try {
                    // o'quvchi ma'lumotlarini o'zgartirish
                    const { _id, __v, password, createdAt, updatedAt, ...newStudentCred } = newStudent;
                    const { data } = await AuthService.updateStudent(newStudent._id, newStudentCred);
                    dispatch(getStudentSuccess(data));
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.message));
                    await ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
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
            <div className="flex gap-8">
                <div className="w-fit border-2 py-8 px-6 rounded shadow-dim">
                    <div className="flex relative justify-start gap-10">
                        {!student ?
                            <div className="w-[410px]">
                                <Skeleton parentWidth={100} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                            </div> : <>
                                <div className="flex flex-col gap-4 text-sm">
                                    <div className="flex items-center gap-4">
                                        <figure className={`w-20 h-20 border-4 border-white rounded-[50%] overflow-hidden bg-slate-100 ${!student ? "bg-gray-300 animate-pulse" : null}`}>
                                            {student ? <img className="w-full h-full object-cover" src={logo} alt="logo" /> : null}
                                        </figure>
                                        <h1 className="capitalize text-xl">{student.first_name} {student.last_name}</h1>
                                    </div>

                                    <div className="flex justify-between gap-20">
                                        <span className="text-gray-500">Telefon:</span>
                                        <span className="text-blue-300">+{student.contactNumber}</span>
                                    </div>

                                    <div className="flex justify-between gap-20">
                                        <span className="text-gray-500">Tug'ilgan kun:</span>
                                        <span>{student.dob}</span>
                                    </div>

                                    <div className="flex justify-between gap-20">
                                        <span className="text-gray-500">Email manzil:</span>
                                        <span>{student.email}</span>
                                    </div>

                                    <p className="w-fit px-2 rounded bg-gray-200">{student.gender}</p>

                                    {/* Batafsil */}
                                    <button
                                        onClick={() => handleModal("extra", !modals.extra)}
                                        type="button"
                                        className="flex items-center justify-end gap-1 text-sm outline-none">
                                        {
                                            modals.extra
                                                ?
                                                <FaAngleUp />
                                                :
                                                <FaAngleDown />
                                        }
                                        Batafsil
                                    </button>
                                    {
                                        modals.extra ? <>
                                            <div className="flex flex-col gap-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Otasining ismi:</span>
                                                    <span>{student.father_name}</span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Telefon:</span>
                                                    <span className="text-blue-300">{student.fatherContactNumber}</span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Onasining ismi:</span>
                                                    <span>{student.mother_name}</span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Telefon:</span>
                                                    <span className="text-blue-300">{student.motherContactNumber}</span>
                                                </div>
                                            </div>
                                        </> : null
                                    }
                                </div>

                                <div className="w-fit h-fit absolute top-0 right-0">
                                    <button
                                        disabled={student ? false : true}
                                        onClick={() => openModal()}
                                        className="w-8 h-8 flex items-center justify-center text-xl border rounded-full text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300">
                                        <LiaEditSolid />
                                    </button>
                                </div>
                            </>
                        }
                    </div>
                </div>

                <div className="w-2/3">
                    <h1 className="text-gray-500 text-sm border-b-2 pb-2">Guruhlar</h1>

                    <div className="grid grid-cols-2 gap-8 mt-6">
                        {
                            student?.group ?
                                <NavLink to={`/admin/group-info/${student.group._id}`}>
                                    <div className="courseCard w-50% p-4 cursor-pointer bg-white shadow-smooth">
                                        <h1 className="w-fit text-xs rounded px-2 py-1 bg-gray-200">{student.group.name}</h1>
                                        <div className="flex items-start justify-between gap-8">
                                            <h2 className="text-sm transition-all duration-300">{student.group.teacher.first_name} {student.group.teacher.last_name}</h2>
                                            <div className="text-xs text-gray-500">
                                                <h1 className="flex items-center gap-1">{student.group.start_date}<span className="inline-block align-middle w-4 border border-gray-300"></span></h1>
                                                <h1>{student.group.end_date}</h1>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                <h1>{student.group.day}</h1>
                                                <h1>{student.group.start_time}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                                : <h1>Ma'lumot topilmadi!</h1>
                        }
                    </div>
                </div>
            </div>

            {/* create new student and update student modal */}
            <StudentModal
                modals={modals}
                handleModal={handleModal}
                newStudent={newStudent}
                setNewStudent={setNewStudent}
                newPass={newPass}
                setNewPass={setNewPass}
                handleCreateAndUpdate={updateHandler}
                isLoading={isLoading}
                clearModal={clearModal}
                groups={groups}
            />
        </div>
    )
}

export default StudentProfile