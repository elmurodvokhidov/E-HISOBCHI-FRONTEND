import { useState } from "react";
import Card from "./Card";
import DropIndicator from "./DropIndicator";
import dotMenu from "../../assets/icons/dot-menu.svg";

export default function Column({
    title,
    column,
    cards,
    setCards,
    openUpdateModal,
    handleDelete,
}) {
    const [active, setActive] = useState(false);
    const filteredCards = cards.filter((card) => card.column === column);

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("cardId", card.id);
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
    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData("cardId");

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        const before = element.dataset.before || "-1";

        if (before !== cardId) {
            let copy = [...cards];

            let cardToTransfer = copy.find((c) => c.id === cardId);
            if (!cardToTransfer) return;
            cardToTransfer = { ...cardToTransfer, column };

            copy = copy.filter((c) => c.id !== cardId);

            const moveToBack = before === "-1";

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before);
                if (insertAtIndex === undefined) return;

                copy.splice(insertAtIndex, 0, cardToTransfer);
            }

            setCards(copy);
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
                <h3 className="flex items-center font-bold">{title} (<span className="rounded text-lg">{filteredCards.length}</span>)</h3>
                <button><img src={dotMenu} alt="dot menu" /></button>
            </div>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDragEnd}
                className="h-full w-full"
            >
                {
                    filteredCards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
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