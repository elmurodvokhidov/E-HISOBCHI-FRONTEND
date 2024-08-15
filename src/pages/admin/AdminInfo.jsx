import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { adminFailure, adminStart, getAdminSuccess } from "../../redux/slices/adminSlice";
import service from "../../config/service";
import Skeleton from "../../components/loaders/Skeleton";
import { FormattedDate } from "../../components/FormattedDate";
import { IoRemoveOutline } from "react-icons/io5";
import AdminModal from "./AdminModal";
import { Toast, ToastLeft } from "../../config/sweetToast";
import { Pencil } from "../../assets/icons/Icons";

function AdminInfo() {
    const { admin, isLoading } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [updatedAdmin, setUpdatedAdmin] = useState({ first_name: "", last_name: "", dob: "", avatar: "", phoneNumber: "", });
    const [newPass, setNewPass] = useState({ newPassword: "", confirmPassword: "" });
    const [modals, setModals] = useState({ modal: false, createModal: false, passModal: false, imageModal: false, });

    useEffect(() => {
        const getOneAdmin = async () => {
            dispatch(adminStart());
            try {
                const { data } = await service.getAdmin(id);
                dispatch(getAdminSuccess(data));
            } catch (error) {
                dispatch(adminFailure(error.response?.data.message));
                Toast.fire({ icon: "warning", title: error.response?.data.message || error.message, });
            }
        };

        getOneAdmin();
    }, [id]);

    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    const clearModal = () => {
        setUpdatedAdmin({ first_name: "", last_name: "", dob: "", avatar: "", phoneNumber: "", });
        setNewPass({ newPassword: "", confirmPassword: "" });
        setModals({ modal: false, createModal: false, passModal: false, imageModal: false, })
    };

    const openModal = (admin) => {
        setUpdatedAdmin(admin);
        handleModal("modal", true);
        handleModal("createModal", false);
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        if (modals.passModal) {
            if (newPass.newPassword.length >= 8) {
                try {
                    dispatch(adminStart());
                    const { data } = await service.updateAdminPass({ ...newPass, phoneNumber: auth?.phoneNumber });
                    dispatch(getAdminSuccess(data));
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                } catch (error) {
                    dispatch(authFailure(error.response?.data.message));
                    Toast.fire({ icon: "warning", title: error.response?.data.message || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "warning", title: "Parol 8 ta belgidan kam bo'lmasligi kerak!" });
            }
        }
        else {
            if (updatedAdmin.first_name !== "" && updatedAdmin.last_name !== "" && updatedAdmin.dob !== "" && updatedAdmin.phoneNumber !== "") {
                try {
                    dispatch(adminStart());
                    const { _id, __v, password, createdAt, updatedAt, ...newAdminCred } = updatedAdmin;
                    const { data } = await service.updateAdminProfile(updatedAdmin._id, newAdminCred);
                    dispatch(getAdminSuccess(data));
                    clearModal();
                    Toast.fire({ icon: "success", title: data.message });
                } catch (error) {
                    dispatch(authFailure(error.response.data.error));
                    Toast.fire({ icon: "warning", title: error.response.data.error || error.message });
                }
            }
            else {
                ToastLeft.fire({ icon: "warning", title: "Iltimos, barcha bo'sh joylarni to'ldiring!" });
            }
        }
    };

    return (
        <div className="w-full h-screen overflow-auto pt-24 px-10">
            <div className="flex justify-between border-b-2 pb-16 relative">
                <h1 className="capitalize text-2xl pc:text-3xl">Hisob qaydnomalari</h1>
                <p className="absolute bottom-[-1px] border-b-2 uppercase text-xs pc:text-lg pb-2 border-main-1 text-main-1">{admin?.role}</p>
            </div>

            {!admin ?
                <div className="w-[450px] mt-12">
                    <Skeleton parentWidth={100} firstChildWidth={85} secondChildWidth={50} thirdChildWidth={65} />
                </div> : <>
                    <div className="w-[450px] border-2 py-8 px-6 mt-12 rounded shadow-dim">
                        <div className="flex relative justify-start">
                            <div className="w-full flex flex-col gap-4 text-sm pc:text-lg">
                                <div className="flex items-center gap-4">
                                    <figure className={`size-20 pc:size-24 border-4 border-white rounded-[50%] overflow-hidden bg-slate-100 ${!admin ? "bg-gray-300 animate-pulse" : null}`}>
                                        <img className="w-full h-full object-cover" src={admin.avatar} alt="admin avatar" />
                                    </figure>
                                    <h1 className="capitalize text-xl pc:text-2xl">{
                                        admin.first_name + " " + admin.last_name}
                                    </h1>
                                </div>

                                <div className="flex justify-between gap-20">
                                    <span className="text-gray-500">Telefon:</span>
                                    <span className="text-blue-300">+(998) {admin.phoneNumber}</span>
                                </div>

                                <div className="flex justify-between gap-20">
                                    <span className="text-gray-500">Tug'ilgan kun:</span>
                                    {
                                        admin.dob ?
                                            <FormattedDate date={admin.dob} /> :
                                            <IoRemoveOutline />
                                    }
                                </div>
                            </div>

                            <div className="w-fit h-fit absolute top-0 right-0">
                                <button
                                    disabled={admin ? false : true}
                                    onClick={() => openModal(admin)}
                                    className="size-8 pc:size-9 flex items-center justify-center text-lg pc:text-xl border rounded-full ml-16 pc:ml-20 text-main-1 border-main-1 hover:bg-main-1 hover:text-white transition-all duration-300">
                                    <Pencil />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            }


            {/* profile edit modal */}
            <AdminModal
                clearModal={clearModal}
                modals={modals}
                newAdmin={updatedAdmin}
                setNewAdmin={setUpdatedAdmin}
                newPass={newPass}
                setNewPass={setNewPass}
                isLoading={isLoading}
                handleCreateAndUpdate={updateHandler}
                handleModal={handleModal}
            />
        </div>
    )
}

export default AdminInfo