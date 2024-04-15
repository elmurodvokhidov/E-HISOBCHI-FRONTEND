import { useState } from "react";
import Card from "./Card";
import DropIndicator from "./DropIndicator";
import dotMenu from "../../assets/icons/dot-menu.svg";
import { allLeadSuccess } from "../../redux/slices/leadSlice";
import { useDispatch } from "react-redux";
import AuthService from "../../config/authService";

export default function Column({
    title,
    column,
    leads,
    openUpdateModal,
    handleDelete,
}) {
    const dispatch = useDispatch();
    const [active, setActive] = useState(false);
    const filteredLeads = leads.filter((lead) => lead.column === column);

    const handleDragStart = (e, lead) => {
        e.dataTransfer.setData("cardId", lead._id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        highlightIndicator(e);
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
        clearHighlights();
    };

    // Handle Drag End Function
    const handleDragEnd = async (e) => {
        const cardId = e.dataTransfer.getData("cardId");

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        const before = element.dataset.before || "-1";

        if (before !== cardId) {
            let copy = [...leads];

            let cardToTransfer = copy.find((l) => l._id === cardId);
            if (!cardToTransfer) return;
            cardToTransfer = { ...cardToTransfer, column };

            copy = copy.filter((l) => l._id !== cardId);

            const moveToBack = before === "-1";

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el._id === before);
                if (insertAtIndex === undefined) return;

                copy.splice(insertAtIndex, 0, cardToTransfer);
            }

            dispatch(allLeadSuccess({ data: copy }));
            try {
                await AuthService.updateLeadColumn(cardId, { newColumn: column });
            } catch (error) {
                dispatch(leadFailure(error.message));
                console.log(error);
            }
        }
    };

    const highlightIndicator = (e) => {
        const indicators = getIndicators();
        const el = getNearestIndicator(e, indicators);
        el.element.style.opacity = "1";
    };

    const clearHighlights = (els) => {
        const indicators = els || getIndicators();

        indicators.forEach((i) => {
            i.style.opacity = "0";
        });
    };

    const getNearestIndicator = (e, indicators) => {
        const DISTANCE_OFFSET = 50;

        const el = indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();

                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );

        return el;
    };

    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
    };

    return (
        <div className="w-[360px] shrink-0 overflow-y-scroll overflow-x-hidden pr-2">
            <div className="mb-3 flex items-center justify-between sticky top-0 bg-[#f8f8f8]">
                <h3 className="flex items-center font-bold">{title} (<span className="rounded text-lg">{filteredLeads.length}</span>)</h3>
                <button><img src={dotMenu} alt="dot menu" /></button>
            </div>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDragEnd}
                className="h-full w-full"
            >
                {
                    filteredLeads.map((lead) => (
                        <Card
                            key={lead._id}
                            lead={lead}
                            handleDragStart={handleDragStart}
                            openUpdateModal={openUpdateModal}
                            handleDelete={handleDelete}
                        />
                    ))
                }
                <DropIndicator beforeId="-1" column={column} />
            </div>
        </div>
    )
};