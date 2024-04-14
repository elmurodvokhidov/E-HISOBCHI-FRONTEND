import { IoCloseOutline } from "react-icons/io5";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import api from "../../config/api";

export default function AdminModal({
    clearModal,
    modals,
    newAdmin,
    setNewAdmin,
    newPass,
    setNewPass,
    isLoading,
    handleCreateAndUpdate,
    handleModal,
}) {
    const getAuthCred = (e) => {
        setNewAdmin({
            ...newAdmin,
            [e.target.name]: e.target.value
        });
    };

    const getNewPass = (e) => {
        setNewPass({
            ...newPass,
            [e.target.name]: e.target.value
        });
    };

    // const getImage = async (e) => {
    //     const formData = new FormData();
    //     formData.append('image', e.target.files[0]);
    //     const { data } = await api.post("/uploads", formData);
    //     setNewAdmin({ ...newAdmin, avatar: data.img_url });
    // };

    return (
        <div
            onClick={() => clearModal()}
            className="w-full h-screen fixed top-0 left-0 z-20"
            style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modals.modal ? "1" : "0", zIndex: modals.modal ? "20" : "-1" }}>
            <form
                onClick={(e) => e.stopPropagation()}
                className="w-[27%] h-screen fixed top-0 right-0 transition-all duration-300 bg-white"
                style={{ right: modals.modal ? "0" : "-200%" }}>
                <div className="flex justify-between text-xl p-5 border-b-2">
                    <h1>{newAdmin._id ? "Hisobni yangilash" : "Admin ma'lumotlari"}</h1>
                    <button
                        type="button"
                        onClick={() => clearModal()}
                        className="hover:text-red-500 transition-all duration-300">
                        <IoCloseOutline />
                    </button>
                </div>
                <div className="flex flex-col gap-2 px-5 py-7">
                    {/* First Name */}
                    <div className="flex flex-col">
                        <label htmlFor="first_name" className="text-sm">Ism</label>
                        <input
                            disabled={newAdmin._id ? modals.passModal : false}
                            onChange={getAuthCred}
                            value={newAdmin.first_name}
                            type="text"
                            name="first_name"
                            id="first_name"
                            className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600" />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col">
                        <label htmlFor="last_name" className="text-sm">Familya</label>
                        <input
                            disabled={newAdmin._id ? modals.passModal : false}
                            onChange={getAuthCred}
                            value={newAdmin.last_name}
                            type="text"
                            name="last_name"
                            id="last_name"
                            className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600" />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm">Email</label>
                        <input
                            disabled={newAdmin._id ? modals.passModal : false}
                            onChange={getAuthCred}
                            value={newAdmin.email}
                            type="email"
                            name="email"
                            id="email"
                            className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600" />
                    </div>

                    <div className="flex justify-between">
                        {/* Date of Birth */}
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="dob" className="text-sm">Tug'ilgan sana</label>
                            <input
                                disabled={newAdmin._id ? modals.passModal : false}
                                onChange={getAuthCred}
                                value={newAdmin.dob}
                                type="date"
                                name="dob"
                                id="dob"
                                className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600" />
                        </div>

                        {/* Contact Number */}
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="contactNumber" className="text-sm">Telefon</label>
                            <input
                                disabled={newAdmin._id ? modals.passModal : false}
                                onChange={getAuthCred}
                                value={newAdmin.contactNumber}
                                type="number"
                                name="contactNumber"
                                id="contactNumber"
                                className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600"
                                placeholder="998991234567" />
                        </div>
                    </div>

                    {/* Password */}
                    {
                        !modals.createModal ? <>
                            <button
                                onClick={() => handleModal("passModal", !modals.passModal)}
                                type="button"
                                className="flex items-center justify-end gap-1">
                                {modals.passModal ? <FaAngleUp className="text-sm" /> : <FaAngleDown className="text-sm" />}
                                Yangi parol qo'shish
                            </button>
                        </> : null
                    }
                    {
                        modals.passModal ?
                            <>
                                <div className="flex flex-col">
                                    <label htmlFor="newPassword" className="text-sm">Yangi parol</label>
                                    <input
                                        onChange={(e) => getNewPass(e)}
                                        type="text"
                                        name="newPassword"
                                        id="newPassword"
                                        className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600" />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="confirmPassword" className="text-sm">Parolni tasdiqlang</label>
                                    <input
                                        onChange={(e) => getNewPass(e)}
                                        type="text"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600" />
                                </div>
                            </>
                            : null
                    }

                    {/* Image */}
                    <button
                        onClick={() => handleModal("imageModal", !modals.imageModal)}
                        type="button"
                        className="flex items-center justify-end gap-1 outline-none">
                        {
                            modals.imageModal
                                ?
                                <FaAngleUp className="text-sm" />
                                :
                                <FaAngleDown className="text-sm" />
                        }
                        Rasm qo'shish
                    </button>
                    {
                        modals.imageModal ? <>
                            <div className="flex flex-col">
                                <label htmlFor="avatar" className="text-sm">Rasm</label>
                                <input
                                    disabled={newAdmin._id ? modals.passModal : false}
                                    // onChange={getImage}
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    className="border-2 border-gray-300 rounded px-2 py-1 outline-cyan-600" />
                            </div>
                        </> : null
                    }

                    {/* Button */}
                    <button
                        disabled={isLoading ? true : modals.imageModal ? newAdmin.avatar === "" ? true : false : false}
                        onClick={handleCreateAndUpdate}
                        className="w-fit px-6 py-1 mt-8 bg-cyan-600 rounded-2xl text-white">
                        {isLoading ? "Loading..." : newAdmin._id ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>
            </form>
        </div>
    )
}