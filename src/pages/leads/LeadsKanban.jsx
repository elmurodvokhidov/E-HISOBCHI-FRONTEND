import { useState } from "react";
import Column from "./Column";
import LeadsModal from "./LeadsModal";
import { Toast, ToastLeft } from "../../config/sweetToast";
import Swal from "sweetalert2";

export default function LeadsKanban() {
    // Data
    const [cards, setCards] = useState([
        // LEADS
        {
            id: "1",
            first_name: "Sherali",
            last_name: "Usmonov",
            column: "leads",
            phone: "330040804"
        },
        {
            id: "2",
            first_name: "Isroil",
            last_name: "Ergashev",
            column: "leads",
            phone: "330040804"
        },
        {
            id: "3",
            first_name: "Ma'mur",
            last_name: "Yo'ldoshov",
            column: "leads",
            phone: "330040804"
        },

        // EXPECTATION
        {
            id: "4",
            first_name: "Rustam",
            last_name: "Mahkamov",
            column: "expectation",
            phone: "330040804"
        },
        {
            id: "5",
            first_name: "Anvar",
            last_name: "Olimov",
            column: "expectation",
            phone: "330040804"
        },

        // SET
        {
            id: "6",
            first_name: "Nozim",
            last_name: "Xatamov",
            column: "set",
            phone: "330040804"
        },
    ]);
    const [newLead, setNewLead] = useState({
        first_name: "",
        last_name: "",
        column: "",
        phone: "",
        email: "",
        dob: "",
    });
    const [modals, setModals] = useState({ modal: false });
    const [isLoading, setIsLoading] = useState(false);

    // Modalni o'zgaritirsh funksiyasi
    const handleModal = (modalName, value) => {
        setModals(prevState => ({ ...prevState, [modalName]: value }));
    };

    // Modal va lid ma'lumotlarini tozalash funksiyasi
    const clearModal = () => {
        setNewLead({
            first_name: "",
            last_name: "",
            email: "",
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
            newLead.email !== "" &&
            // newLead.dob !== "" &&
            newLead.phone !== "" &&
            newLead.column !== ""
        ) {
            try {
                if (!newLead.id) {
                    setCards([...cards, { ...newLead, id: cards.length + 1 + "" }]);
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: "Yangi lid qo'shildi"
                    });
                }
                else {
                    clearModal();
                    await Toast.fire({
                        icon: "success",
                        title: "Lid ma'lumotlari yangilandi"
                    });
                }
            } catch (error) {
                await ToastLeft.fire({
                    icon: "error",
                    title: "Noma'lum xatolik"
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
                console.log(id);
                Toast.fire({
                    icon: "success",
                    title: "Lid o'chirildi"
                });
                // dispatch(studentStart());
                // AuthService.deleteStudent(id).then((res) => {
                //     getAllStudentsFunction();
                //     Toast.fire({
                //         icon: "success",
                //         title: res?.data.message
                //     });
                // }).catch((error) => {
                //     dispatch(studentFailure(error.response?.data.message));
                //     ToastLeft.fire({
                //         icon: "error",
                //         title: error.response?.data.message || error.message
                //     });
                // });
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
                    cards={cards}
                    setCards={setCards}
                    openUpdateModal={openUpdateModal}
                    handleDelete={handleDelete}
                />
                <Column
                    title="EXPECTATION"
                    column="expectation"
                    headingColor="text-blue-200"
                    cards={cards}
                    setCards={setCards}
                    openUpdateModal={openUpdateModal}
                    handleDelete={handleDelete}
                />
                <Column
                    title="SET"
                    column="set"
                    headingColor="text-emerald-200"
                    cards={cards}
                    setCards={setCards}
                    openUpdateModal={openUpdateModal}
                    handleDelete={handleDelete}
                />
                <div>
                    <button
                        onClick={() => handleModal("modal", true)}
                        className="global_add_btn 2xsm:w-full 2xsm:mt-4 2xsm:h-8 sm:w-fit sm:mt-0 sm:py-0"
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