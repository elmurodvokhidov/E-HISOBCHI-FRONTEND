import { IoCloseOutline } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

function TeacherModal({
    modals,
    handleModal,
    newTeacher,
    setNewTeacher,
    newPass,
    setNewPass,
    handleCreateAndUpdate,
    isLoading,
    clearModal,
}) {

    const getTeacherCred = (e) => {
        setNewTeacher({
            ...newTeacher,
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
        <div
            onClick={() => clearModal()}
            className="w-full h-screen fixed top-0 left-0 z-20"
            style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modals.modal ? "1" : "0", zIndex: modals.modal ? "20" : "-1" }}>
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleCreateAndUpdate}
                className="lg:w-[27%] small:w-[60%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white"
                style={{ right: modals.modal ? "0" : "-200%" }}>

                {/* Title and Close button */}
                <div className="flex justify-between text-xl p-5 border-b-2">
                    <h1>O'qituvchi ma'lumotlari</h1>
                    <button
                        type="button"
                        onClick={() => clearModal()}
                        className="text-gray-500 hover:text-black transition-all duration-300">
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Form's Body */}
                <div className="flex flex-col gap-4 px-5 py-7">
                    <div className="flex justify-between gap-4">
                        {/* First Name */}
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="first_name" className="text-sm pc:text-lg">
                                <span>Ism</span>
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                                disabled={newTeacher._id ? modals.passModal : false}
                                onChange={getTeacherCred}
                                value={newTeacher.first_name}
                                type="text"
                                name="first_name"
                                id="first_name"
                                className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                        </div>

                        {/* Last Name */}
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="last_name" className="text-sm pc:text-lg">
                                <span>Familya</span>
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                                disabled={newTeacher._id ? modals.passModal : false}
                                onChange={getTeacherCred}
                                value={newTeacher.last_name}
                                type="text"
                                name="last_name"
                                id="last_name"
                                className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col">
                        <label htmlFor="dob" className="text-sm pc:text-lg">Tug'ilgan sana</label>
                        <input
                            disabled={newTeacher._id ? modals.passModal : false}
                            onChange={getTeacherCred}
                            value={newTeacher.dob}
                            type="date"
                            name="dob"
                            id="dob"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col">
                        <label htmlFor="phoneNumber" className="text-sm pc:text-lg">
                            <span>Telefon</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <label htmlFor="phoneNumber" className="text-base border-2 border-r-0 rounded-l border-gray-300 px-2 py-1">+998</label>
                            <input
                                disabled={newTeacher._id ? modals.passModal : false}
                                onChange={getTeacherCred}
                                value={newTeacher.phoneNumber}
                                type="number"
                                name="phoneNumber"
                                id="phoneNumber"
                                className="w-full border-2 border-gray-300 rounded rounded-l-none px-2 py-1 pc:text-lg outline-main-1"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    {
                        !modals.createModal ? <>
                            <button
                                onClick={() => {
                                    handleModal("passModal", !modals.passModal);
                                }}
                                type="button"
                                className="flex items-center justify-end gap-1 outline-none">
                                {
                                    modals.passModal
                                        ?
                                        <FaAngleUp className="text-sm pc:text-lg" />
                                        :
                                        <FaAngleDown className="text-sm pc:text-lg" />
                                }
                                Yangi parol qo'shing
                            </button>
                        </> : null
                    }
                    {
                        modals.passModal ? <>
                            <div className="flex flex-col">
                                <label htmlFor="newPassword" className="text-sm pc:text-lg">
                                    <span>Yangi parol</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <input
                                    onChange={getNewPass}
                                    value={newTeacher.newPassword}
                                    type="text"
                                    name="newPassword"
                                    id="newPassword"
                                    className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="confirmPassword" className="text-sm pc:text-lg">
                                    <span>Parolni tasdiqlang</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <input
                                    onChange={getNewPass}
                                    value={newTeacher.confirmPassword}
                                    type="text"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                            </div>
                        </> : null
                    }

                    {/* Image */}
                    <button
                        onClick={() => handleModal("imageModal", !modals.imageModal)}
                        type="button"
                        className="flex items-center justify-end gap-1 outline-none">
                        {
                            modals.imageModal
                                ?
                                <FaAngleUp className="text-sm pc:text-lg" />
                                :
                                <FaAngleDown className="text-sm pc:text-lg" />
                        }
                        O'qituvchi rasmi
                    </button>
                    {
                        modals.imageModal ? <>
                            <div className="flex flex-col">
                                <label htmlFor="avatar" className="text-sm pc:text-lg">Rasm</label>
                                <input
                                    disabled={newTeacher._id ? modals.passModal : false}
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                            </div>
                        </> : null
                    }

                    {/* Button */}
                    <button
                        disabled={isLoading ? true : false}
                        type="submit"
                        className="w-fit px-6 py-1 mt-8 pc:text-lg bg-main-1 rounded-2xl text-white">
                        {isLoading ? "Loading..." : newTeacher._id ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TeacherModal