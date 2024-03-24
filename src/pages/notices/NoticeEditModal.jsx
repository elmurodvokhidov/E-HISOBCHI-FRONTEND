import { IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

function NoticeEditModal({
    updateHandler,
    modal,
    setModal,
    updatedNotice,
    setUpdatedNotice
}) {
    const { isLoading } = useSelector(state => state.notice);

    const getNoticeCred = (e) => {
        setUpdatedNotice({
            ...updatedNotice,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div onClick={() => {
            setModal(false)
        }} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
            <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                <div className="flex justify-between text-xl p-5 border-b-2"><h1>Eslatmani yangilash</h1> <button type="button" onClick={() => {
                    setModal(false)
                }} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                <div className="flex flex-col gap-2 px-5 py-7">
                    <div className="flex flex-col">
                        <label htmlFor="topic" className="text-[14px]">Topic</label>
                        <input onChange={(e) => getNoticeCred(e)} value={updatedNotice.topic} type="text" name="topic" id="topic" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="content" className="text-[14px]">Content</label>
                        <input onChange={(e) => getNoticeCred(e)} value={updatedNotice.content} type="text" name="content" id="content" className="border-2 border-gray-500 rounded px-2 py-1" />
                    </div>
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <label htmlFor="from" className="text-[14px]">From:</label>
                            <input onChange={(e) => getNoticeCred(e)} value={updatedNotice.from} type="text" name="from" id="from" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="w-[47%] flex flex-col">
                            <label htmlFor="to" className="text-[14px]">To</label>
                            <input onChange={(e) => getNoticeCred(e)} value={updatedNotice.to} type="text" name="to" id="to" className="border-2 border-gray-500 rounded px-2 py-1" placeholder="dd/mm/yyyy" />
                        </div>
                    </div>
                    <button disabled={isLoading ? true : false} onClick={(e) => updateHandler(e)} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : "Saqlash"}</button>
                </div>
            </form>
        </div>
    )
}

export default NoticeEditModal