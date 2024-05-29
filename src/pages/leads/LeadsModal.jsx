import { IoCloseOutline } from "react-icons/io5";

export default function LeadsModal({
    clearModal,
    modals,
    newLead,
    setNewLead,
    isLoading,
    handleCreateAndUpdate,
}) {
    const sections = ["leads", "expectation", "set"];

    const getLeadsCred = (e) => {
        setNewLead({
            ...newLead,
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
                className="lg:w-[27%] small:w-[60%] h-screen fixed top-0 right-0 transition-all duration-300 bg-white"
                style={{ right: modals.modal ? "0" : "-200%" }}>
                <div className="flex justify-between text-xl pc:text-2xl p-5 border-b-2">
                    <h1>{newLead._id ? "Hisobni yangilash" : "Lid ma'lumotlari"}</h1>
                    <button
                        type="button"
                        onClick={() => clearModal()}
                        className="hover:text-red-500 transition-all duration-300">
                        <IoCloseOutline />
                    </button>
                </div>
                <div className="flex flex-col gap-2 px-5 py-7">
                    <div className="flex justify-between">
                        {/* First Name */}
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="first_name" className="text-sm pc:text-lg">
                                <span>Ism</span>
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                                onChange={getLeadsCred}
                                value={newLead.first_name}
                                type="text"
                                name="first_name"
                                id="first_name"
                                className="outline-cyan-600 border-2 border-gray-300 rounded px-2 py-1 pc:text-lg" />
                        </div>

                        {/* Last Name */}
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="last_name" className="text-sm pc:text-lg">
                                <span>Familya</span>
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                                onChange={getLeadsCred}
                                value={newLead.last_name}
                                type="text"
                                name="last_name"
                                id="last_name"
                                className="outline-cyan-600 border-2 border-gray-300 rounded px-2 py-1 pc:text-lg" />
                        </div>
                    </div>

                    {/* Column */}
                    <div className="flex flex-col">
                        <label htmlFor="column" className="text-sm pc:text-lg">
                            <span>Bo'limni tanglang</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <select
                            onChange={getLeadsCred}
                            value={newLead.column}
                            name="column"
                            id="column"
                            className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-cyan-600">
                            <option value="" className="italic">None</option>
                            {
                                sections.map((column, index) => (
                                    <option value={column} key={index}>{column}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col">
                        <label htmlFor="dob" className="text-sm pc:text-lg">Tug'ilgan sana</label>
                        <input
                            onChange={getLeadsCred}
                            value={newLead.dob}
                            type="date"
                            name="dob"
                            id="dob"
                            className="outline-cyan-600 border-2 border-gray-300 rounded px-2 py-1 pc:text-lg" />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col">
                        <label htmlFor="phone" className="text-sm pc:text-lg">
                            <span>Telefon</span>
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <label htmlFor="phone" className="text-base pc:text-lg border-2 border-r-0 rounded-l border-gray-300 px-2 py-1">+998</label>
                            <input
                                onChange={getLeadsCred}
                                value={newLead.phone}
                                type="number"
                                name="phone"
                                id="phone"
                                className="w-full border-2 border-gray-300 rounded rounded-l-none px-2 py-1 pc:text-lg outline-cyan-600"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        disabled={isLoading}
                        onClick={handleCreateAndUpdate}
                        className="w-fit px-6 py-1 mt-8 bg-cyan-600 rounded-2xl pc:text-lg text-white">
                        {isLoading ? "Loading..." : newLead._id ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>
            </form>
        </div>
    )
};