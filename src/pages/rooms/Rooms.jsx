import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import service from "../../config/service";
import { allRoomSuccess, roomFailure, roomStart } from "../../redux/slices/roomSlice";
import Swal from "sweetalert2";
import { Toast, ToastLeft } from "../../config/sweetToast";
import Skeleton from "../../components/loaders/Skeleton";
import tick from "../../assets/icons/tick.svg";
import copy from "../../assets/icons/copy.svg";
import { Bin, Pencil } from "../../assets/icons/Icons";

function Rooms() {
    const { rooms, isLoading } = useSelector(state => state.room);
    const dispatch = useDispatch();
    const [newRoom, setNewRoom] = useState({ name: "" });
    const [modals, setModals] = useState({
        modal: false,
        createModal: false,
    });
    const [copied, setCopied] = useState("");

    const getAllRoomsFunc = async () => {
        try {
            dispatch(roomStart());
            const { data } = await service.getAllRooms();
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
                    const { data } = await service.addNewRoom(newRoom);
                    clearModal();
                    getAllRoomsFunc();
                    Toast.fire({ icon: "success", title: data.message });
                }
                else {
                    const { _id, __v, createdAt, updatedAt, ...newRoomCred } = newRoom;
                    const { data } = await service.updateRoom(newRoom._id, newRoomCred);
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
                service.deleteRoom(id).then((res) => {
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
                                <tr className="border-y">
                                    <th className="px-1 py-3 text-xs pc:text-base">id</th>
                                    <th className="px-1 py-3 text-xs pc:text-base">Ism</th>
                                    <th className="px-1 py-3 text-xs pc:text-base">Amallar</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    rooms.length > 0 ?
                                        rooms.map((room, index) => (
                                            <tr key={index} className="border-y">
                                                <td
                                                    onClick={() => handleCopy(room._id)}
                                                    className="flex items-center gap-1 cursor-pointer text-sm pc:text-lg px-1 py-3">
                                                    {room._id}
                                                    <img
                                                        src={copied === room._id ? tick : copy}
                                                        alt="copy svg"
                                                        className="cursor-pointer" />
                                                </td>
                                                <td className="text-sm pc:text-lg px-1 py-3">{room.name}</td>
                                                <td className="flex gap-2 px-1 py-3">
                                                    <button
                                                        onClick={() => updateBtnFunc(room)}
                                                        className="text-sm pc:text-lg"
                                                    >
                                                        <Pencil />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteFunc(room._id)}
                                                        className="text-sm pc:text-lg text-red-500"
                                                    >
                                                        <Bin />
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
                    onSubmit={handleCreateAndUpdate}
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
                                className="border-2 border-gray-300 rounded px-2 py-1 pc:text-lg outline-main-1" />
                        </div>

                        {/* Button */}
                        <button
                            disabled={isLoading ? true : false}
                            type="submit"
                            className="w-fit px-6 py-1 mt-8 bg-main-1 rounded-2xl text-white">
                            {isLoading ? "Loading..." : newRoom._id ? "Saqlash" : "Qo'shish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Rooms