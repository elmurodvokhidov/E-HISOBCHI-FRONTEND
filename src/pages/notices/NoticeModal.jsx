import { IoCloseOutline } from "react-icons/io5";

function NoticeEditModal({
    isLoading,
    modals,
    clearModal,
    handleCreateAndUpdate,
    newNotice,
    setNewNotice,
}) {
    const getNewNoticeCred = (e) => {
        setNewNotice({
            ...newNotice,
            [e.target.name]: e.target.value
        });
    };
    return (
        <div onClick={clearModal}
            className="w-full h-screen fixed top-0 left-0 z-20"
            style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modals.modal ? "1" : "0", zIndex: modals.modal ? "20" : "-1" }}>
            <form onClick={(e) => e.stopPropagation()}
                className="w-[27%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white"
                style={{ right: modals.modal ? "0" : "-200%" }}>

                {/* Title and Close button */}
                <div className="flex items-center justify-between text-lg p-5 border-b-2">
                    <h1>{newNotice._id ? "Eslatmani yangilash" : "Yangi eslatma ma'lumotlari"}</h1>
                    <button
                        type="button"
                        onClick={clearModal}
                        className="hover:text-red-500 transition-all duration-300">
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Form's Body */}
                <div className="flex flex-col gap-2 px-5 py-7">

                    {/* Topic */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="topic"
                            className="text-sm">Topic</label>
                        <input
                            onChange={getNewNoticeCred}
                            value={newNotice.topic}
                            type="text"
                            name="topic"
                            id="topic"
                            className="border-2 border-gray-300 rounded px-2 py-1" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="content"
                            className="text-sm">Content</label>
                        <textarea
                            onChange={getNewNoticeCred}
                            value={newNotice.content}
                            className="border-2 border-gray-300 rounded px-2 py-1"
                            name="content"
                            id="content"
                            cols="30"
                            rows="5"></textarea>
                    </div>

                    <div className="flex justify-between">
                        {/* From */}
                        <div className="w-[47%] flex flex-col">
                            <label
                                htmlFor="from"
                                className="text-sm">From:</label>
                            <input
                                onChange={getNewNoticeCred}
                                value={newNotice.from}
                                type="text"
                                name="from"
                                id="from"
                                className="border-2 border-gray-300 rounded px-2 py-1" />
                        </div>

                        {/* To */}
                        <div className="w-[47%] flex flex-col">
                            <label
                                htmlFor="to"
                                className="text-sm">To</label>
                            <input
                                onChange={getNewNoticeCred}
                                value={newNotice.to}
                                type="text"
                                name="to"
                                id="to"
                                className="border-2 border-gray-300 rounded px-2 py-1" />
                        </div>
                    </div>
                    
                    <button
                        disabled={isLoading ? true : false}
                        onClick={handleCreateAndUpdate}
                        className="w-fit px-6 py-1 mt-8 bg-cyan-600 rounded-2xl text-white">
                        {isLoading ? "Loading..." : newNotice._id ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default NoticeEditModal