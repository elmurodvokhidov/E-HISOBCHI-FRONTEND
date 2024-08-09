export default function DropIndicator({ beforeId, column }) {
    return (
        <div
            data-before={beforeId || "-1"}
            data-column={column}
            className="my-0.5 h-0.5 w-full bg-main-1 opacity-0"
        />
    )
};