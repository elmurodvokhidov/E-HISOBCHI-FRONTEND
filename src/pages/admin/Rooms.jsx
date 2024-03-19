import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { LiaEditSolid } from "react-icons/lia"
import { RiDeleteBin7Line } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../config/authService";
import { Toast, ToastLeft } from "../../config/sweetToast";
import { allRoomSuccess, roomFailure, roomStart } from "../../redux/slices/roomSlice";
import Swal from "sweetalert2";

function Rooms() {
    const { rooms, isLoading } = useSelector(state => state.room);
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [newRoom, setNewRoom] = useState({
        name: ""
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

    const clearModal = () => {
        setNewRoom({
            name: ""
        });
    };

    const updateBtnFunc = (id) => {
        setNewRoom(rooms.filter(room => room._id === id)[0]);
        setModal(true);
    };

    const handleCreateAndUpdate = async (e) => {
        e.preventDefault();
        if (newRoom.name !== "") {
            try {
                dispatch(roomStart());
                if (!newRoom._id) {
                    const { data } = await AuthService.addNewRoom(newRoom);
                    clearModal();
                    setModal(false);
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
                    setModal(false);
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
                <button onClick={() => setModal(true)} className="border-2 border-cyan-600 rounded px-5 hover:bg-cyan-600 hover:text-white transition-all duration-300">Yangisini qo'shish</button>
            </div>

            {
                isLoading ? <>
                    <div className="w-full md:w-3/5 lg:w-2/5 flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white">
                        <div className="w-[85%] h-4 rounded bg-gray-300">&nbsp;</div>
                        <div className="w-[50%] h-4 rounded bg-gray-300">&nbsp;</div>
                        <div className="w-[65%] h-4 rounded bg-gray-300">&nbsp;</div>
                    </div>
                </> :
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
            <div onClick={() => setModal(false)} className="w-full h-screen fixed top-0 left-0 z-20" style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modal ? "1" : "0", zIndex: modal ? "20" : "-1" }}>
                <form onClick={(e) => e.stopPropagation()} className="w-[25%] h-screen overflow-auto fixed top-0 right-0 transition-all duration-300 bg-white" style={{ right: modal ? "0" : "-200%" }}>
                    <div className="flex justify-between text-xl p-5 border-b-2"><h1>Yangi xona qo'shish</h1> <button type="button" onClick={() => setModal(false)} className="hover:text-red-500 transition-all duration-300"><IoCloseOutline /></button></div>
                    <div className="flex flex-col gap-2 px-5 py-7">

                        <div className="w-[100%] flex flex-col">
                            <label htmlFor="name" className="text-[14px]">Ism</label>
                            <input onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} value={newRoom.name} type="text" name="name" id="name" className="border-2 border-gray-500 rounded px-2 py-1" />
                        </div>

                        <button disabled={isLoading ? true : false} onClick={handleCreateAndUpdate} className="w-fit px-6 py-1 mt-8 border-2 border-cyan-600 rounded-lg hover:text-white hover:bg-cyan-600 transition-all duration-300">{isLoading ? "Loading..." : newRoom._id ? "Saqlash" : "Qo'shish"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Rooms