import { useEffect, useState } from "react"
import { IoMdMore } from "react-icons/io";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../config/authService";
import { allNoticeSuccess, noticeFailure, noticeStart } from "../../redux/slices/noticeSlice";

function Notice() {
    const { notices, isLoading } = useSelector(state => state.notice);
    const dispatch = useDispatch();
    const [more, setMore] = useState(false);

    const getNotices = async () => {
        try {
            dispatch(noticeStart());
            const { data } = await AuthService.getAllNotices();
            dispatch(allNoticeSuccess(data));
        } catch (error) {
            dispatch(noticeFailure(error.message));
        }
    };

    useEffect(() => {
        getNotices();
    }, []);

    return (
        <div className="notices w-full h-screen overflow-auto pt-24 px-10" onClick={() => setMore(false)}>
            <h1 className="text-2xl">Recently created notices</h1>
            <div className="container mx-auto py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {
                        notices ?
                            notices.map((notice, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between">
                                        <h2 className="text-xl font-semibold mb-2">{notice.topic}</h2>
                                        {/* more button */}
                                        <div onClick={(e) => {
                                            e.stopPropagation()
                                            setMore(notice._id)
                                        }} className="relative cursor-pointer text-cyan-600 text-xl">
                                            <IoMdMore />
                                            {/* more btn modal */}
                                            <div className={`${more === notice._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
                                                <button className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"><LiaEditSolid /> Edit</button>
                                                <button className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"><RiDeleteBin7Line /> Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{notice.content}</p>
                                    <div className="flex justify-between items-center text-gray-500">
                                        <p className="text-sm">{notice.from}</p>
                                        <p className="text-sm">Feb 22, 2024</p>
                                    </div>
                                </div>
                            )) :
                            <>
                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4">&nbsp;</h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4">&nbsp;</h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4">&nbsp;</h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4">&nbsp;</h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4">&nbsp;</h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4">&nbsp;</h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>
                            </>
                    }
                </div>
            </div>

        </div>
    )
}

export default Notice