import { useEffect, useState } from "react"
import { IoMdMore } from "react-icons/io";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../config/authService";
import { allNoticeSuccess, getNoticeSuccess, newNoticeSuccess, noticeFailure, noticeStart } from "../../redux/slices/noticeSlice";
import { IoCloseOutline } from "react-icons/io5";
import { Toast, ToastLeft } from "../../config/sweetToast";
import NoticeEditModal from "../../components/NoticeEditModal";
import Swal from "sweetalert2";

function Notice() {
    const { notices, isLoading } = useSelector(state => state.notice);
    const dispatch = useDispatch();
    const [more, setMore] = useState(false);
    const [modal, setModal] = useState(false);
    const [newNotice, setNewNotice] = useState({
        topic: "",
        content: "",
        from: "",
        to: "",
    });
    const [notice, setNotice] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [updatedNotice, setUpdatedNotice] = useState({
        topic: "",
        content: "",
        from: "",
        to: "",
    });

    const getNewNoticeCred = (e) => {
        setNewNotice({
            ...newNotice,
            [e.target.name]: e.target.value
        });
    }

    const clearModal = () => {
        setNewNotice({
            topic: "",
            content: "",
            from: "",
            to: "",
        });
    };

    const addNewNotice = async (e) => {
        e.preventDefault();
        if (
            newNotice.topic !== "" &&
            newNotice.content !== "" &&
            newNotice.from !== "" &&
            newNotice.to !== ""
        ) {
            try {
                dispatch(noticeStart());
                const { data } = await AuthService.addNewNotice(newNotice);
                dispatch(newNoticeSuccess(data));
                clearModal();
                setModal(false);
                await Toast.fire({
                    icon: "success",
                    title: data.message
                });
            } catch (error) {
                dispatch(noticeFailure(error.response?.data.message));
                await ToastLeft.fire({
                    icon: "error",
                    title: error.response?.data.message || error.message
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

    const openModal = (id) => {
        setNotice(notices.filter(notice => notice._id === id)[0]);
        setEditModal(true);
        setUpdatedNotice(notices.filter(notice => notice._id === id)[0]);
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        if (
            updatedNotice.topic !== "" &&
            updatedNotice.content !== "" &&
            updatedNotice.from !== "" &&
            updatedNotice.to !== ""
        ) {
            try {
                dispatch(noticeStart());
                const { _id, __v, ...newNoticeCred } = updatedNotice;
                const { data } = await AuthService.updateNotice(updatedNotice._id, newNoticeCred);
                dispatch(getNoticeSuccess(data));
                setEditModal(false);
                await Toast.fire({
                    icon: "success",
                    title: data.message
                });
            } catch (error) {
                dispatch(noticeFailure(error.response?.data.error));
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
        getNotices();
    };

    const deleteNotice = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(noticeStart());
                AuthService.deleteNotice(id).then(() => {
                    getNotices();
                    Toast.fire({
                        icon: "success",
                        title: "Xabar muvaffaqiyatli o'chirildi!"
                    });
                }).catch((error) => {
                    dispatch(noticeFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                });
            }
        });
    };

    return (
        <div className="notices w-full h-screen overflow-auto pt-24 px-10" onClick={() => setMore(false)}>
            <div className="flex justify-between relative">
                <h1 className="text-2xl">Recently created notices</h1>
                <button onClick={() => setModal(true)} className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">Create notice</button>
            </div>
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
                                                <button onClick={() => openModal(notice._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"><LiaEditSolid /> Edit</button>
                                                <button onClick={() => deleteNotice(notice._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"><RiDeleteBin7Line /> Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{notice.content}</p>
                                    <div className="flex justify-between items-center text-gray-500">
                                        <p className="text-sm">{notice.from}</p>
                                        <p className="text-sm">{notice.createdAt < notice.updatedAt ? notice.updatedAt.slice(0, 10).split("-").reverse().join(".") : notice.createdAt.slice(0, 10).split("-").reverse().join(".")}</p>
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

            {/* create notice modal */}
            <div onClick={() => setModal(false)} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
                <form onClick={(e) => e.stopPropagation()} className="w-[30%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                    <div className="flex justify-between text-xl p-5 border-b-2"><h1>New notice credentials</h1> <button type="button" onClick={() => setModal(false)} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                    <div className="flex flex-col gap-2 px-5 py-7">
                        <div className="flex flex-col">
                            <label htmlFor="topic" className="text-[14px]">Topic</label>
                            <input onChange={getNewNoticeCred} value={newNotice.topic} type="text" name="topic" id="topic" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="content" className="text-[14px]">Content</label>
                            <textarea onChange={getNewNoticeCred} value={newNotice.content} className="border-2 border-gray-500 rounded px-2 py-1" name="content" id="content" cols="30" rows="10"></textarea>
                        </div>
                        <div className="flex justify-between">
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="from" className="text-[14px]">From:</label>
                                <input onChange={getNewNoticeCred} value={newNotice.from} type="text" name="from" id="from" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                            <div className="w-[47%] flex flex-col">
                                <label htmlFor="to" className="text-[14px]">To</label>
                                <input onChange={getNewNoticeCred} value={newNotice.to} type="text" name="to" id="to" className="border-2 border-gray-500 rounded px-2 py-1" />
                            </div>
                        </div>
                        <button disabled={isLoading ? true : false} onClick={addNewNotice} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : "Add"}</button>
                    </div>
                </form>
            </div>

            {/* notice edit modal */}
            <NoticeEditModal
                modal={editModal}
                setModal={setEditModal}
                updatedNotice={updatedNotice}
                setUpdatedNotice={setUpdatedNotice}
                updateHandler={updateHandler}
            />
        </div>
    )
}

export default Notice