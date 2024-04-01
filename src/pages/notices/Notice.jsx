import { useEffect, useState } from "react"
import { IoMdMore } from "react-icons/io";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../config/authService";
import {
    allNoticeSuccess,
    getNoticeSuccess,
    // newNoticeSuccess,
    noticeFailure,
    noticeStart
} from "../../redux/slices/noticeSlice";
import { IoCloseOutline } from "react-icons/io5";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import NoticeModal from "./NoticeModal";
import Swal from "sweetalert2";

function Notice() {
    const { notices, isLoading } = useSelector(state => state.notice);
    const { auth } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [newNotice, setNewNotice] = useState({
        topic: "",
        content: "",
        from: "",
        to: "",
    });
    const [modals, setModals] = useState({
        modal: false,
        createModal: false,
        more: null,
    });

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewNotice({
            topic: "",
            content: "",
            from: "",
            to: "",
        });
        setModals({
            modal: false,
            createModal: false,
            more: null,
        })
    };

    const getAllNoticesFunc = async () => {
        try {
            dispatch(noticeStart());
            const { data } = await AuthService.getAllNotices();
            dispatch(allNoticeSuccess(data));
        } catch (error) {
            dispatch(noticeFailure(error.message));
        }
    };

    useEffect(() => {
        getAllNoticesFunc();
    }, []);

    const openModal = (id) => {
        setNewNotice(notices.filter(notice => notice._id === id)[0]);
        handleModal("modal", true);
        handleModal("createModal", false);
    };

    const handleCreateAndUpdate = async (e) => {
        e.preventDefault();
        if (
            newNotice.topic !== "" &&
            newNotice.content !== "" &&
            newNotice.from !== "" &&
            newNotice.to !== ""
        ) {
            try {
                dispatch(noticeStart());
                if (!newNotice._id) {
                    const { data } = await AuthService.addNewNotice({ ...newNotice, userId: auth?._id });
                    getAllNoticesFunc();
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } else {
                    const { _id, __v, ...others } = newNotice;
                    const { data } = await AuthService.updateNotice(newNotice._id, others);
                    dispatch(getNoticeSuccess(data));
                    getAllNoticesFunc();
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                }
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
                title: "Iltimos, barcha bo'sh joylarni to'ldiring!"
            });
        }
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
                    getAllNoticesFunc();
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
        <div
            className="notices w-full h-screen overflow-auto pt-24 px-10"
            onClick={() => handleModal("more", false)}>
            <div className="flex justify-between relative">
                <h1 className="text-2xl">Yaqinda yaratilgan eslatmalar</h1>
                <button
                    onClick={() => {
                        handleModal("modal", true);
                        handleModal("createModal", true);
                    }}
                    className="global_add_btn">
                    Eslatma yaratish
                </button>
            </div>
            <div className="container mx-auto py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {
                        isLoading ?
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
                            </> :
                            notices.length > 0 ?
                                notices.map((notice, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex justify-between">
                                            <h2 className="text-xl font-semibold mb-2">{notice.topic}</h2>
                                            {
                                                notice.author?._id === auth._id ? (
                                                    <>
                                                        {/* more button */}
                                                        <div onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleModal("more", notice._id)
                                                        }} className="relative cursor-pointer text-cyan-600 text-xl">
                                                            <IoMdMore />
                                                            {/* more btn modal */}
                                                            <div className={`${modals.more === notice._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
                                                                <button onClick={() => openModal(notice._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"><LiaEditSolid />Tahrirlash</button>
                                                                <button onClick={() => deleteNotice(notice._id)} className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"><RiDeleteBin7Line />O'chirish</button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : null
                                            }
                                        </div>
                                        <p className="text-gray-600 mb-4">{notice.content}</p>
                                        <div className="flex justify-between items-center text-gray-500">
                                            <p className="text-sm">{notice.from}</p>
                                            <p className="text-sm">{notice.createdAt < notice.updatedAt ? notice.updatedAt.slice(0, 10).split("-").reverse().join(".") : notice.createdAt.slice(0, 10).split("-").reverse().join(".")}</p>
                                        </div>
                                    </div>
                                )) : <h1>Ma'lumot topilmadi</h1>
                    }
                </div>
            </div>

            {/* create and update notice modal */}
            <NoticeModal
                isLoading={isLoading}
                modals={modals}
                clearModal={clearModal}
                handleCreateAndUpdate={handleCreateAndUpdate}
                newNotice={newNotice}
                setNewNotice={setNewNotice}
            />
        </div>
    )
}

export default Notice