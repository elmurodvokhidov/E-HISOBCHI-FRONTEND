import { IoCloseOutline } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useSelector } from "react-redux";

function TeacherEditModal({
    updateHandler,
    newPass,
    setNewPass,
    passModal,
    setPassModal,
    modal,
    setModal,
    updatedTeacher,
    setUpdatedTeacher
}) {
    const { isLoading } = useSelector(state => state.teacher);

    const getTeacherCred = (e) => {
        setUpdatedTeacher({
            ...updatedTeacher,
            [e.target.name]: e.target.value
        });
    };

    const getNewPass = (e) => {
        setNewPass({
            ...newPass,
            [e.target.name]: e.target.value
        });
    };


    return (
        <div onClick={() => {
            setModal(false)
            setPassModal(false)
        }} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
            <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                <div className="flex justify-between text-xl p-5 border-b-2"><h1>Update account</h1> <button type="button" onClick={() => {
                    setModal(false)
                    setPassModal(false)
                }} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                <div className="flex flex-col gap-2 px-5 py-7">
                    <div className="flex flex-col">
                        <label htmlFor="first_name" className="text-[14px]">First Name</label>
                        <input disabled={passModal ? true : false} onChange={(e) => getTeacherCred(e)} value={updatedTeacher.first_name} type="text" name="first_name" id="first_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="last_name" className="text-[14px]">Last Name</label>
                        <input disabled={passModal ? true : false} onChange={(e) => getTeacherCred(e)} value={updatedTeacher.last_name} type="text" name="last_name" id="last_name" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-[14px]">Email</label>
                        <input disabled={passModal ? true : false} onChange={(e) => getTeacherCred(e)} value={updatedTeacher.email} type="email" name="email" id="email" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex justify-between">
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="dob" className="text-[14px]">Date of birthday</label>
                            <input disabled={passModal ? true : false} onChange={(e) => getTeacherCred(e)} value={updatedTeacher.dob} type="text" name="dob" id="dob" className="border-2 border-gray-500 rounded px-2 py-1" placeholder="dd/mm/yyyy" />
                        </div>
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="contactNumber" className="text-[14px]">Contact Number</label>
                            <input disabled={passModal ? true : false} onChange={(e) => getTeacherCred(e)} value={updatedTeacher.contactNumber} type="number" name="contactNumber" id="contactNumber" className="border-2 border-gray-500 rounded px-2 py-1" placeholder='without "+"' />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="avatar" className="text-[14px]">Photo</label>
                        <input disabled={passModal ? true : false} type="file" name="avatar" id="avatar" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex justify-between">
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="specialist_in" className="text-[14px]">Specialist in</label>
                            <input disabled={passModal ? true : false} onChange={(e) => getTeacherCred(e)} value={updatedTeacher.specialist_in} type="text" name="specialist_in" id="specialist_in" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="gender" className="text-[14px]">Gender</label>
                            <input disabled={passModal ? true : false} onChange={(e) => getTeacherCred(e)} value={updatedTeacher.gender} type="text" name="gender" id="gender" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                    </div>
                    <button onClick={() => setPassModal(!passModal)} type="button" className="flex items-center justify-end gap-1">{passModal ? <FaAngleUp className="text-[14px]" /> : <FaAngleDown className="text-[14px]" />}Add new password</button>
                    {
                        passModal ?
                            <>
                                <div className="flex flex-col">
                                    <label htmlFor="newPassword" className="text-[14px]">New Password</label>
                                    <input onChange={(e) => getNewPass(e)} type="text" name="newPassword" id="newPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="confirmPassword" className="text-[14px]">Confirm Password</label>
                                    <input onChange={(e) => getNewPass(e)} type="text" name="confirmPassword" id="confirmPassword" className="border-2 border-gray-500 rounded px-2 py-1" />
                                </div>
                            </>
                            : null
                    }
                    <button disabled={isLoading ? true : false} onClick={(e) => updateHandler(e)} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : passModal ? "Update Password" : "Save"}</button>
                </div>
            </form>
        </div>
    )
}

export default TeacherEditModal