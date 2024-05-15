import { useEffect, useState } from "react"
import { IoMdMore } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../config/authService";
import {
    allNoticeSuccess,
    getNoticeSuccess,
    // newNoticeSuccess,
    noticeFailure,
    noticeStart
} from "../../redux/slices/noticeSlice";
import { Toast, ToastLeft } from "../../config/sweetToast";
import NoticeModal from "./NoticeModal";
import Swal from "sweetalert2";
import { DateTime } from "../../components/DateTime";

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
                    Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                } else {
                    const { _id, __v, ...others } = newNotice;
                    const { data } = await AuthService.updateNotice(newNotice._id, others);
                    dispatch(getNoticeSuccess(data));
                    getAllNoticesFunc();
                    clearModal();
                    Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                }
            } catch (error) {
                dispatch(noticeFailure(error.response?.data.error));
                ToastLeft.fire({
                    icon: "error",
                    title: error.response?.data.error || error.message
                });
            }
        }
        else {
            ToastLeft.fire({
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
            className="notices container"
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
            <div className="mx-auto py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {
                        isLoading ?
                            <>
                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4"></h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4"></h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4"></h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4"></h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4"></h2>
                                    <p className="h-4 rounded bg-gray-300 mb-2"></p>
                                    <p className="w-[60%] h-4 rounded bg-gray-300 mb-6"></p>
                                    <div className="flex justify-between items-center">
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                        <p className="w-[25%] h-4 rounded bg-gray-300"></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <h2 className="w-[30%] h-7 rounded bg-gray-300 mb-4"></h2>
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
                                                notice.author?._id === auth?._id ? (
                                                    <>
                                                        {/* more button */}
                                                        <div onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleModal("more", notice._id)
                                                        }} className="relative cursor-pointer text-cyan-600 text-xl">
                                                            <IoMdMore />
                                                            {/* more btn modal */}
                                                            <div className={`${modals.more === notice._id ? 'flex' : 'hidden'} none w-fit more flex-col absolute 2xsm:right-8 top-2 p-1 shadow-smooth rounded-lg text-[13px] bg-white`}>
                                                                <button
                                                                    onClick={() => openModal(notice._id)}
                                                                    className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-green-500"
                                                                >
                                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                                                    </svg>
                                                                    Tahrirlash
                                                                </button>


                                                                <button
                                                                    onClick={() => deleteNotice(notice._id)}
                                                                    className="flex items-center gap-3 px-6 py-2 z-[5] hover:bg-gray-100 text-red-500"
                                                                >
                                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                                                    </svg>
                                                                    O'chirish
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : null
                                            }
                                        </div>
                                        <p className="text-gray-600 mb-4">{notice.content}</p>
                                        <div className="flex justify-between items-center text-gray-500">
                                            <p className="text-sm">{notice.from}</p>
                                            <p className="text-sm">
                                                {notice.createdAt < notice.updatedAt ?
                                                    <DateTime date={notice.updatedAt} /> :
                                                    <DateTime date={notice.createdAt} />}
                                            </p>
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