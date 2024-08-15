import { IoCloseOutline } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

function StudentModal({
    modals,
    handleModal,
    newStudent,
    setNewStudent,
    newPass,
    setNewPass,
    handleCreateAndUpdate,
    isLoading,
    clearModal,
    groups,
}) {
    const getStudentCred = (e) => {
        setNewStudent({
            ...newStudent,
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
                    <h1>O'quvchi ma'lumotlari</h1>
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
                                disabled={newStudent._id ? modals.passModal : false}
                                onChange={getStudentCred}
                                value={newStudent.first_name}
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
                                disabled={newStudent._id ? modals.passModal : false}
                                onChange={getStudentCred}
                                value={newStudent.last_name}
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
                            disabled={newStudent._id ? modals.passModal : false}
                            onChange={getStudentCred}
                            value={newStudent.dob}
                            type="date"
                            name="dob"
                            id="dob"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col">
                        <label htmlFor="phoneNumber" className="text-sm pc:text-lg">
                            <span>Telefon</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <label htmlFor="phoneNumber" className="text-base border-2 border-r-0 rounded-l border-gray-300 px-2 py-1">+998</label>
                            <input
                                disabled={newStudent._id ? modals.passModal : false}
                                onChange={getStudentCred}
                                value={newStudent.phoneNumber}
                                type="number"
                                name="phoneNumber"
                                id="phoneNumber"
                                className="w-full border-2 border-gray-300 rounded rounded-l-none px-2 py-1 pc:text-lg outline-main-1"
                            />
                        </div>
                    </div>

                    {/* Groups */}
                    <div className="w-full flex flex-col">
                        <label htmlFor="group" className="text-sm pc:text-lg">Guruh</label>
                        <select
                            disabled={newStudent._id ? modals.passModal : false}
                            onChange={getStudentCred}
                            value={newStudent.group}
                            name="group"
                            id="group"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1">
                            <option value="" className="italic">None</option>
                            {
                                groups.map(group => (
                                    <option value={group._id} key={group._id}>{group.name}</option>
                                ))
                            }
                        </select>
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
                        modals.passModal &&
                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="newPassword" className="text-sm pc:text-lg">
                                    <span>Yangi parol</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <input
                                    onChange={getNewPass}
                                    value={newStudent.newPassword}
                                    type="text"
                                    name="newPassword"
                                    id="newPassword"
                                    className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="confirmPassword" className="text-sm pc:text-lg">
                                    <span>Parolni tasdiqlang</span>
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <input
                                    onChange={getNewPass}
                                    value={newStudent.confirmPassword}
                                    type="text"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                            </div>
                        </div>
                    }

                    {/* Parents */}
                    <button
                        onClick={() => handleModal("parentsModal", !modals.parentsModal)}
                        type="button"
                        className="flex items-center justify-end gap-1 outline-none">
                        {
                            modals.parentsModal
                                ?
                                <FaAngleUp className="text-sm pc:text-lg" />
                                :
                                <FaAngleDown className="text-sm pc:text-lg" />
                        }
                        Ota-ona ma'lumotlari
                    </button>
                    {
                        modals.parentsModal ? <>
                            <div className="grid grid-cols-2 justify-between gap-4">
                                {/* Father's Name */}
                                <div className="w-full flex flex-col">
                                    <label htmlFor="father_name" className="text-sm pc:text-lg">Otasining ismi</label>
                                    <input
                                        disabled={newStudent._id ? modals.passModal : false}
                                        onChange={getStudentCred}
                                        value={newStudent.father_name}
                                        type="text"
                                        name="father_name"
                                        id="father_name"
                                        className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                                </div>
                                {/* Father's Phone Number */}
                                <div className="w-full flex flex-col">
                                    <label htmlFor="fatherPhoneNumber" className="text-sm pc:text-lg">Telefon raqami</label>
                                    <input
                                        disabled={newStudent._id ? modals.passModal : false}
                                        onChange={getStudentCred}
                                        value={newStudent.fatherPhoneNumber}
                                        type="text"
                                        name="fatherPhoneNumber"
                                        id="fatherPhoneNumber"
                                        className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1"
                                        placeholder="991234567" />
                                </div>
                                {/* Mother's Name */}
                                <div className="w-full flex flex-col">
                                    <label htmlFor="mother_name" className="text-sm pc:text-lg">Onasining ismi</label>
                                    <input
                                        onChange={getStudentCred}
                                        value={newStudent.mother_name}
                                        type="text"
                                        name="mother_name"
                                        id="mother_name"
                                        className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                                </div>
                                {/* Mother's Phone Number */}
                                <div className="w-full flex flex-col">
                                    <label htmlFor="motherPhoneNumber" className="text-sm pc:text-lg">Telefon raqami</label>
                                    <input
                                        onChange={getStudentCred}
                                        value={newStudent.motherPhoneNumber}
                                        type="text"
                                        name="motherPhoneNumber"
                                        id="motherPhoneNumber"
                                        className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1"
                                        placeholder="991234567" />
                                </div>
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
                        O'quvchi rasmi
                    </button>
                    {
                        modals.imageModal ? <>
                            <div className="flex flex-col">
                                <label htmlFor="avatar" className="text-sm pc:text-lg">Rasm</label>
                                <input
                                    disabled={newStudent._id ? modals.passModal : false}
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                            </div>
                        </> : null
                    }

                    {/* Button */}
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-fit px-6 py-1 mt-8 pc:text-lg bg-main-1 rounded-2xl text-white">
                        {isLoading ? "Loading..." : newStudent._id ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default StudentModal