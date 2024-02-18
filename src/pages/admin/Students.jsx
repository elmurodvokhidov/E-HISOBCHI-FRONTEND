import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Toast, ToastLeft } from "../../config/sweetToast";
import { allStudentSuccess, newStudentSuccess, studentFailure, studentStart } from "../../redux/slices/studentSlice";
import AuthService from "../../config/authService";

function Students() {
    const { students, isLoading } = useSelector(state => state.student);
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [more, setMore] = useState(null);
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
        course: "",
        group: "",
        newPassword: "",
        confirmPassword: "",
    });

    const getAllStudents = async () => {
        try {
            dispatch(studentStart());
            const { data } = await AuthService.getAllStudents();
            dispatch(allStudentSuccess(data));
        } catch (error) {
            dispatch(studentFailure(error.message));
        }
    };

    useEffect(() => {
        getAllStudents();
    }, []);

    const getStudentCred = (e) => {
        setNewStudent({
            ...newStudent,
            [e.target.name]: e.target.value
        });
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
            course: "",
            group: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const addNewStudent = async (e) => {
        e.preventDefault();
        if (
            newStudent.first_name !== "" &&
            newStudent.last_name !== "" &&
            newStudent.father_name !== "" &&
            newStudent.mother_name !== "" &&
            newStudent.email !== "" &&
            newStudent.dob !== "" &&
            newStudent.contactNumber !== "" &&
            newStudent.fatherContactNumber !== "" &&
            newStudent.motherContactNumber !== "" &&
            newStudent.course !== "" &&
            newStudent.group !== "" &&
            newStudent.gender !== ""
        ) {
            if (newStudent.newPassword.length >= 8) {
                try {
                    dispatch(studentStart());
                    const { data } = await AuthService.addNewStudent(newStudent);
                    dispatch(newStudentSuccess(data));
                    clearModal();
                    setModal(false);
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
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 px-10" onClick={() => setMore(null)}>
            <div className="flex justify-between relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">Students</h1>
                    <p>Total <span className="inline-block w-4 h-[1px] mx-1 align-middle bg-black"></span> <span>{students?.length}</span></p>
                </div>
                <button onClick={() => setModal(true)} className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">Add new student</button>
            </div>

            {/* add new modal */}
            <div onClick={() => setModal(false)} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
                <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                    <div className="flex justify-between text-xl p-5 border-b-2"><h1>New student credentials</h1> <button type="button" onClick={() => setModal(false)} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                    <div className="flex flex-col gap-2 px-5 py-7">
                        <div className="flex flex-col">
                            <label htmlFor="first_name" className="text-[14px]">First Name</label>
                            <input onChange={(e) => getStudentCred(e)} value={newStudent.first_name} type="text" name="first_name" id="first_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="last_name" className="text-[14px]">Last Name</label>
                            <input onChange={(e) => getStudentCred(e)} value={newStudent.last_name} type="text" name="last_name" id="last_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-[14px]">Email</label>
                            <input onChange={(e) => getStudentCred(e)} value={newStudent.email} type="email" name="email" id="email" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="dob" className="text-[14px]">Date of birthday</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.dob} type="text" name="dob" id="dob" className="border-2 border-gray-500 rounded px-2 py-1" placeholder="dd/mm/yyyy" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="contactNumber" className="text-[14px]">Contact Number</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.contactNumber} type="number" name="contactNumber" id="contactNumber" className="border-2 border-gray-500 rounded px-2 py-1" placeholder='without "+"' />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="avatar" className="text-[14px]">Photo</label>
                            <input type="file" name="avatar" id="avatar" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[30%] flex flex-col">
                                <label htmlFor="course" className="text-[14px]">Course</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.course} type="text" name="course" id="course" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[30%] flex flex-col">
                                <label htmlFor="group" className="text-[14px]">Group</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.group} type="text" name="group" id="group" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[30%] flex flex-col">
                                <label htmlFor="gender" className="text-[14px]">Gender</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.gender} type="text" name="gender" id="gender" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 justify-between gap-4">
                            <div className="w-[100%] flex flex-col">
                                <label htmlFor="father_name" className="text-[14px]">Father Name</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.father_name} type="text" name="father_name" id="father_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[100%] flex flex-col">
                                <label htmlFor="fatherContactNumber" className="text-[14px]">Father Number</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.fatherContactNumber} type="text" name="fatherContactNumber" id="fatherContactNumber" className="border-2 border-gray-500 rounded px-2 py-1" placeholder='without "+"' />
                            </div>
                            <div className="w-[100%] flex flex-col">
                                <label htmlFor="mother_name" className="text-[14px]">Mother Name</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.mother_name} type="text" name="mother_name" id="mother_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[100%] flex flex-col">
                                <label htmlFor="motherContactNumber" className="text-[14px]">Mother Number</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.motherContactNumber} type="text" name="motherContactNumber" id="motherContactNumber" className="border-2 border-gray-500 rounded px-2 py-1" placeholder='without "+"' />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="newPassword" className="text-[14px]">New Password</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.newPassword} type="text" name="newPassword" id="newPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="confirmPassword" className="text-[14px]">Confirm Password</label>
                                <input onChange={(e) => getStudentCred(e)} value={newStudent.confirmPassword} type="text" name="confirmPassword" id="confirmPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                        </div>
                        <button disabled={isLoading ? true : false} onClick={(e) => addNewStudent(e)} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : "Add"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Students