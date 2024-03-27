import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { Toast, ToastLeft } from "../../assets/sweetToast";
import {
    getStudentSuccess,
    studentFailure,
    studentStart
} from "../../redux/slices/studentSlice";
import logo from "../../img/uitc_logo.png";
import AuthService from "../../config/authService";
import ProfileCardSkeleton from "../../components/loaders/ProfileCardSkeleton";
import StudentModal from "./StudentModal";
import {
    allGroupSuccess,
    groupFailure,
    groupStart
} from "../../redux/slices/groupSlice";

function StudentInfo() {
    const { student, isLoading } = useSelector(state => state.student);
    const { groups } = useSelector(state => state.group);
    const dispatch = useDispatch();
    const { id } = useParams();
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

    const getStudent = async () => {
        try {
            dispatch(studentStart());
            const { data } = await AuthService.getStudent(id);
            dispatch(getStudentSuccess(data));
        } catch (error) {
            dispatch(studentFailure(error.response?.data.message));
            await Toast.fire({
                icon: "error",
                title: error.response?.data.message || error.message,
            });
        }
    };

    useEffect(() => {
        getStudent();
        getAllGroupsFunc();
    }, [id]);

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
                    const { _id, __v, password, passwordUpdated, createdAt, updatedAt, ...newStudentCred } = newStudent;
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
            <div className="flex justify-between border-b-2 pb-16 relative">
                <h1 className="capitalize text-3xl">Hisob qaydnomalari</h1>
                <p className="absolute bottom-[-1px] border-b-2 uppercase text-[14px] pb-2 border-cyan-600 text-cyan-600">student</p>
            </div>

            <div className="w-fit border-2 py-8 px-6 my-20 rounded shadow-dim">
                <div className="flex justify-start gap-10">
                    <figure className={`w-[100px] h-[100px] rounded-[50%] overflow-hidden bg-slate-100 mt-5 ${!student ? "bg-gray-300 animate-pulse" : null}`}>
                        {student ? <img className="w-full h-full object-cover" src={logo} alt="logo" /> : null}
                    </figure>

                    {!student ?
                        <ProfileCardSkeleton />
                        :
                        <div className="flex flex-col gap-1">
                            <h1 className="capitalize text-4xl">{student.first_name} {student.last_name}</h1>
                            <h3 className="text-[14px] mt-1">{student.email}</h3>
                            <div className="flex gap-14 text-[14px] mt-2">
                                <h4 className="flex gap-2"><span className="text-gray-400">Date of Bithday:</span> <span>{student.dob}</span></h4>
                                <h4 className="flex gap-2"><span className="text-gray-400">Phone:</span> <span>+{student.contactNumber}</span></h4>
                            </div>
                            <div className="flex gap-14 text-[14px]">
                                <h4 className="flex gap-4"><span className="text-gray-400">Group:</span> {student.group}</h4>
                                <h4 className="flex gap-4"><span className="text-gray-400">Gender:</span> <span className="capitalize">{student.gender}</span></h4>
                            </div>

                            <div className="flex gap-14 text-[14px]">
                                <h4 className="flex gap-4"><span className="text-gray-400">Father:</span> {student.father_name}</h4>
                                <h4 className="flex gap-4"><span className="text-gray-400">Father Contact:</span> {student.fatherContactNumber}</h4>
                            </div>

                            <div className="flex gap-14 text-[14px]">
                                <h4 className="flex gap-4"><span className="text-gray-400">Mother:</span> {student.mother_name}</h4>
                                <h4 className="flex gap-4"><span className="text-gray-400">Mother Contact:</span> {student.motherContactNumber}</h4>
                            </div>
                        </div>
                    }

                    <div>
                        <button
                            disabled={student ? false : true}
                            onClick={() => openModal()}
                            className="border-2 rounded ml-16 px-6 py-1 border-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300">{student ? "Tahrirlash" : "Loading..."}</button>
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

export default StudentInfo