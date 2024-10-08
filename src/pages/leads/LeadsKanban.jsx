import { useEffect, useState } from "react";
import Column from "./Column";
import LeadsModal from "./LeadsModal";
import { Toast, ToastLeft } from "../../config/sweetToast";
import Swal from "sweetalert2";
import service from "../../config/service";
import { useDispatch, useSelector } from "react-redux";
import { allLeadSuccess, leadFailure, leadStart } from "../../redux/slices/leadSlice";

export default function LeadsKanban() {
    const { leads, isLoading } = useSelector(state => state.lead);
    const dispatch = useDispatch();
    const [newLead, setNewLead] = useState({
        first_name: "",
        last_name: "",
        column: "",
        phone: "",
        dob: "",
    });
    const [modals, setModals] = useState({ modal: false });

    const getAllLeadFunction = async () => {
        try {
            dispatch(leadStart());
            const { data } = await service.getAllLead();
            dispatch(allLeadSuccess(data));
        } catch (error) {
            dispatch(leadFailure(error.message));
            console.log(error);
        }
    };

    useEffect(() => {
        getAllLeadFunction();
    }, []);

    // Modalni o'zgaritirsh funksiyasi
    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    // Modal va lid ma'lumotlarini tozalash funksiyasi
    const clearModal = () => {
        setNewLead({
            first_name: "",
            last_name: "",
            dob: "",
            phone: "",
            column: "",
        });
        setModals({ modal: false });
    };

    // Tahrirlash tugmasi bosilganda ishga tushadigan funksiya
    const openUpdateModal = (lead) => {
        setNewLead(lead);
        handleModal("modal", true);
    };

    // Yangi lid qo'shish va lidni tahrirlash funksiyasi
    const handleCreateAndUpdate = async (e) => {
        e.preventDefault();
        if (
            newLead.first_name !== "" &&
            newLead.last_name !== "" &&
            newLead.phone !== "" &&
            newLead.column !== ""
        ) {
            try {
                if (!newLead._id) {
                    const { data } = await service.addNewLead(newLead);
                    getAllLeadFunction();
                    clearModal();
                    Toast.fire({
                        icon: "success",
                        title: data?.message
                    });
                }
                else {
                    const { _id, __v, createdAt, updatedAt, ...newLeadCred } = newLead;
                    const { data } = await service.updateLead(newLead._id, newLeadCred);
                    getAllLeadFunction();
                    clearModal();
                    Toast.fire({
                        icon: "success",
                        title: data?.message
                    });
                }
            } catch (error) {
                dispatch(leadFailure(error.response?.data.message));
                ToastLeft.fire({
                    icon: "error",
                    title: error.response?.data.message || error.message
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

    // Lid ma'lumotlarini o'chirish funksiyasi
    const handleDelete = async (id) => {
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
                dispatch(leadStart());
                service.deleteLead(id).then((res) => {
                    getAllLeadFunction();
                    Toast.fire({
                        icon: "success",
                        title: res?.data.message
                    });
                }).catch((error) => {
                    dispatch(leadFailure(error.response?.data.message));
                    ToastLeft.fire({
                        icon: "error",
                        title: error.response?.data.message || error.message
                    });
                });
            }
        });
    };

    return (
        <div className="w-full h-full pt-5">
            <div className="flex h-full w-full justify-start overflow-x-auto gap-3 pt-2">
                <Column
                    title="LEADS"
                    column="leads"
                    headingColor="text-yellow-200"
                    leads={leads}
                    openUpdateModal={openUpdateModal}
                    handleDelete={handleDelete}
                />
                <Column
                    title="EXPECTATION"
                    column="expectation"
                    headingColor="text-blue-200"
                    leads={leads}
                    openUpdateModal={openUpdateModal}
                    handleDelete={handleDelete}
                />
                <Column
                    title="SET"
                    column="set"
                    headingColor="text-emerald-200"
                    leads={leads}
                    openUpdateModal={openUpdateModal}
                    handleDelete={handleDelete}
                />
                <div>
                    <button
                        onClick={() => handleModal("modal", true)}
                        className="global_add_btn small:w-full small:mt-4 small:h-8 sm:w-fit sm:mt-0 sm:py-0"
                    >
                        Yangisini qo'shish
                    </button>
                </div>
            </div>

            {/* add new and update modal */}
            <LeadsModal
                clearModal={clearModal}
                modals={modals}
                newLead={newLead}
                setNewLead={setNewLead}
                isLoading={isLoading}
                handleCreateAndUpdate={handleCreateAndUpdate}
            />
        </div>
    )
};