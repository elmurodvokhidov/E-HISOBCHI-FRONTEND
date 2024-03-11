import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { Toast, ToastLeft } from "../../config/sweetToast";
import {
    getStudentSuccess,
    studentFailure,
    studentStart
} from "../../redux/slices/studentSlice";
import logo from "../../img/uitc_logo.png";
import AuthService from "../../config/authService";
import ProfileCardSkeleton from "../../components/loaders/ProfileCardSkeleton";
import StudentEditModal from "../../components/modals/StudentEditModal";

function StudentInfo() {
    const { student } = useSelector(state => state.student);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [passModal, setPassModal] = useState(false);
    const [updatedStudent, setUpdatedStudent] = useState({
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
        course: "",
        group: "",
    });
    const [newPass, setNewPass] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const openModal = () => {
        setModal(true);
        setUpdatedStudent(student);
    };

    useEffect(() => {
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

        getStudent();
    }, [id]);

    const updateHandler = async (e) => {
        e.preventDefault();
        if (passModal) {
            if (newPass.newPassword !== "" && newPass.confirmPassword !== "") {
                if (newPass.newPassword.length >= 8) {
                    try {
                        dispatch(studentStart());
                        const { data } = await AuthService.updateStudentPass({ ...newPass, email: student?.email });
                        dispatch(getStudentSuccess(data));
                        setModal(false);
                        setPassModal(false);
                        setNewPass({ newPassword: "", confirmPassword: "" });
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
                        title: "Password must be longer than 8 characters!"
                    });
                }
            }
            else {
                await ToastLeft.fire({
                    icon: "error",
                    title: "Please fill in the all blanks!"
                });
            }
        }
        else {
            if (
                updatedStudent.first_name !== "" &&
                updatedStudent.last_name !== "" &&
                updatedStudent.father_name !== "" &&
                updatedStudent.mother_name !== "" &&
                updatedStudent.email !== "" &&
                updatedStudent.dob !== "" &&
                updatedStudent.contactNumber !== "" &&
                updatedStudent.fatherContactNumber !== "" &&
                updatedStudent.motherContactNumber !== "" &&
                updatedStudent.course !== "" &&
                updatedStudent.group !== "" &&
                updatedStudent.gender !== ""
            ) {
                try {
                    dispatch(studentStart());
                    const { _id, __v, password, passwordUpdated, createdAt, updatedAt, ...newStudentCred } = updatedStudent;
                    const { data } = await AuthService.updateStudent(updatedStudent._id, newStudentCred);
                    dispatch(getStudentSuccess(data));
                    setModal(false);
                    setPassModal(false);
                    setNewPass({ newPassword: "", confirmPassword: "" });
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } catch (error) {
                    dispatch(studentFailure(error.response?.data.error));
                    await ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.error || error.message
                    });
                }
            }
            else {
                await ToastLeft.fire({
                    icon: "error",
                    title: "Please fill in the all blanks!"
                });
            }
        }
        getAllStudents();
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
                                <h4 className="flex gap-4"><span className="text-gray-400">Course:</span> {student.course}</h4>
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
                        <button disabled={student ? false : true} onClick={() => openModal()} className="border-2 rounded ml-16 px-6 py-1 border-cyan-600 hover:bg-cyan-600 hover:text-white transition-all duration-300">{student ? "Tahrirlash" : "Loading..."}</button>
                    </div>
                </div>
            </div>

            {/* profile edit modal */}
            <StudentEditModal
                modal={modal}
                setModal={setModal}
                updatedStudent={updatedStudent}
                setUpdatedStudent={setUpdatedStudent}
                updateHandler={updateHandler}
                newPass={newPass}
                setNewPass={setNewPass}
                passModal={passModal}
                setPassModal={setPassModal}
            />
        </div>
    )
}

export default StudentInfo