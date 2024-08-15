import { motion } from "framer-motion";
import DropIndicator from "./DropIndicator";
import { Bin, Pencil } from "../../assets/icons/Icons";

const Card = ({
    lead,
    handleDragStart,
    openUpdateModal,
    handleDelete,
}) => {
    return (
        <>
            <DropIndicator
                beforeId={lead._id}
                column={lead.column}
            />
            <motion.div
                layout
                layoutId={lead._id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, lead)}
                className="flex items-center justify-between cursor-grab rounded-lg border border-gray-100 p-3 shadow-md active:cursor-grabbing"
            >
                <div className="flex flex-col items-start gap-1 text-sm pc:text-lg">
                    <h1>{lead.first_name} {lead.last_name}</h1>
                    <p className="text-xs pc:text-base text-blue-500">{lead.phone}</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm pc:text-lg">
                    <button
                        onClick={() => openUpdateModal(lead)}
                        className="hover:text-green-500"
                    >
                        <Pencil />
                    </button>
                    <button
                        onClick={() => handleDelete(lead._id)}
                        className="hover:text-red-500"
                    >
                        <Bin />
                    </button>
                </div>
            </motion.div>
        </>
    )
}

export default Card