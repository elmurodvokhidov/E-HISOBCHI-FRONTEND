import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { LiaEditSolid } from "react-icons/lia"
import { RiDeleteBin7Line } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../config/authService";
import { allRoomSuccess, roomFailure, roomStart } from "../../redux/slices/roomSlice";
import Swal from "sweetalert2";
import { Toast, ToastLeft } from "../../assets/sweetToast";
import Skeleton from "../../components/loaders/Skeleton";

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

    const updateBtnFunc = (id) => {
        setNewRoom(rooms.filter(room => room._id === id)[0]);
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
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                }
                else {
                    const { _id, __v, createdAt, updatedAt, ...newRoomCred } = newRoom;
                    const { data } = await AuthService.updateRoom(newRoom._id, newRoomCred);
                    clearModal();
                    getAllRoomsFunc();
                    await Toast.fire({
                        icon: "success",
                        title: data.message
                    });
                }
            } catch (error) {
                dispatch(roomFailure(error.response?.data.message));
                await ToastLeft.fire({
                    icon: "error",
                    title: error.response?.data.message || error.message
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
                    Toast.fire({
                        icon: "success",
                        title: res?.data.message
                    });
                }).catch((error) => {
                    dispatch(roomFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                });
            }
        });
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 pb-10 px-10">
            <div className="flex justify-between pb-4 relative">
                <div className="flex items-end gap-4 text-[14px]">
                    <h1 className="capitalize text-3xl">Xonalar</h1>
                </div>
                <button
                    onClick={() => {
                        handleModal("modal", true);
                        handleModal("createModal", true);
                    }}
                    className="global_add_btn">
                    Yangisini qo'shish
                </button>
            </div>

            {
                isLoading ?
                    <div className="md:w-3/5 lg:w-2/5">
                        <Skeleton parentWidth={100} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                    </div> :
                    <div className="w-full md:w-3/5 lg:w-2/5 shadow-dim pt-8 pb-12 px-8">
                        <table className="roomsTable w-full text-left">
                            <thead>
                                <tr className="border-y">
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
                                                <td>{room._id}</td>
                                                <td>{room.name}</td>
                                                <td className="flex gap-2">
                                                    <button onClick={() => updateBtnFunc(room._id)} className="text-[16px]"><LiaEditSolid /></button>
                                                    <button onClick={() => handleDeleteFunc(room._id)} className="text-[16px] text-red-500"><RiDeleteBin7Line /></button>
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
                        <div className="w-[100%] flex flex-col">
                            <label htmlFor="name" className="text-[14px]">Ism</label>
                            <input
                                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                                value={newRoom.name}
                                type="text"
                                name="name"
                                id="name"
                                className="border-2 border-gray-300 rounded px-2 py-1" />
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