import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../config/authService";
import { allRoomSuccess, roomFailure, roomStart } from "../../redux/slices/roomSlice";
import Swal from "sweetalert2";
import { Toast, ToastLeft } from "../../config/sweetToast";
import Skeleton from "../../components/loaders/Skeleton";
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";

function Rooms() {
    const { rooms, isLoading } = useSelector(state => state.room);
    const dispatch = useDispatch();
    const [newRoom, setNewRoom] = useState({
        name: ""
    });
    const [modals, setModals] = useState({
        modal: false,
        createModal: false,
    });
    const [copied, setCopied] = useState("");

    const getAllRoomsFunc = async () => {
        try {
            dispatch(roomStart());
            const { data } = await AuthService.getAllRooms();
            dispatch(allRoomSuccess(data));
        } catch (error) {
            dispatch(roomFailure(error.message));
        }
    };

    useEffect(() => {
        getAllRoomsFunc();
    }, []);

    // Matnni nusxalash funksiyasi
    const handleCopy = (text) => {
        setCopied(text);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            setCopied("");
        }, 3000);
    };

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setNewRoom({
            name: ""
        });
        setModals({
            modal: false,
            createModal: false,
        });
    };

    const updateBtnFunc = (room) => {
        setNewRoom(room);
        handleModal("modal", true);
        handleModal("createModal", false);
    };

    const handleCreateAndUpdate = async (e) => {
        e.preventDefault();
        if (newRoom.name !== "") {
            try {
                dispatch(roomStart());
                if (!newRoom._id) {
                    const { data } = await AuthService.addNewRoom(newRoom);
                    clearModal();
                    getAllRoomsFunc();
                    Toast.fire({ icon: "success", title: data.message });
                }
                else {
                    const { _id, __v, createdAt, updatedAt, ...newRoomCred } = newRoom;
                    const { data } = await AuthService.updateRoom(newRoom._id, newRoomCred);
                    clearModal();
                    getAllRoomsFunc();
                    Toast.fire({ icon: "success", title: data.message });
                }
            } catch (error) {
                dispatch(roomFailure(error.response?.data.message));
                ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
            }
        }
        else {
            ToastLeft.fire({ icon: "error", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
        }
    };

    const handleDeleteFunc = async (id) => {
        Swal.fire({
            title: "Ishonchingiz komilmi?",
            text: "Buni qaytara olmaysiz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Yo'q",
            confirmButtonText: "Ha, albatta!"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(roomStart());
                AuthService.deleteRoom(id).then((res) => {
                    getAllRoomsFunc();
                    Toast.fire({ icon: "success", title: res?.data.message });
                }).catch((error) => {
                    dispatch(roomFailure(error.response?.data.message));
                    ToastLeft.fire({ icon: "error", title: error.response?.data.message || error.message });
                });
            }
        });
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 pc:pt-28 pb-10 sm:px-10 small:px-4">
            <div className="flex sm:flex-row small:flex-col sm:gap-0 small:gap-4 justify-between pb-4 relative">
                <div className="flex items-end gap-4 text-sm pc:text-base">
                    <h1 className="capitalize text-3xl pc:text-3xl">Xonalar</h1>
                </div>
                <button
                    onClick={() => {
                        handleModal("modal", true);
                        handleModal("createModal", true);
                    }}
                    className="global_add_btn small:py-2 sm:py-0">
                    Yangisini qo'shish
                </button>
            </div>

            {
                isLoading ?
                    <div className="md:w-5/6 lg:w-2/5">
                        <Skeleton parentWidth={100} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                    </div> :
                    <div className="w-full md:w-5/6 lg:w-3/6 small:overflow-x-auto shadow-dim pt-8 pb-12 px-8">
                        <table className="roomsTable w-full text-left">
                            <thead>
                                <tr className="border-y pc:text-lg">
                                    <th>id</th>
                                    <th>Ism</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    rooms.length > 0 ?
                                        rooms.map((room, index) => (
                                            <tr key={index} className="border-y">
                                                <td
                                                    onClick={() => handleCopy(room._id)}
                                                    className="flex items-center gap-1 cursor-pointer pc:text-lg">
                                                    {room._id}
                                                    <img
                                                        src={copied === room._id ? tick : copy}
                                                        alt="copy svg"
                                                        className="cursor-pointer" />
                                                </td>
                                                <td className="pc:text-lg">{room.name}</td>
                                                <td className="flex gap-2">
                                                    <button
                                                        onClick={() => updateBtnFunc(room)}
                                                        className="text-base pc:text-lg"
                                                    >
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                                        </svg>
                                                    </button>


                                                    <button
                                                        onClick={() => handleDeleteFunc(room._id)}
                                                        className="text-base pc:text-lg text-red-500"
                                                    >
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"></path>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : <tr><td colSpan={10}>Ma'lumot topilmadi!</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
            }

            {/* room modal */}
            <div
                onClick={() => clearModal()}
                className="w-full h-screen fixed top-0 left-0 z-20"
                style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modals.modal ? "1" : "0", zIndex: modals.modal ? "20" : "-1" }}>
                <form
                    onClick={(e) => e.stopPropagation()}
                    className="w-[25%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white"
                    style={{ right: modals.modal ? "0" : "-200%" }}>
                    <div
                        className="flex justify-between text-xl p-5 border-b-2">
                        <h1>Yangi xona qo'shish</h1>
                        <button
                            type="button"
                            onClick={() => clearModal()}
                            className="hover:text-red-500 transition-all duration-300">
                            <IoCloseOutline />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 px-5 py-7">
                        {/* Room name */}
                        <div className="w-full flex flex-col">
                            <label htmlFor="name" className="text-sm pc:text-lg">Ism</label>
                            <input
                                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                value={newRoom.name}
                                type="text"
                                name="name"
                                id="name"
                                className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-cyan-600" />
                        </div>

                        {/* Button */}
                        <button
                            disabled={isLoading ? true : false}
                            onClick={handleCreateAndUpdate}
                            className="w-fit px-6 py-1 mt-8 bg-cyan-600 rounded-2xl text-white">
                            {isLoading ? "Loading..." : newRoom._id ? "Saqlash" : "Qo'shish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Rooms