import { GoHorizontalRule } from "react-icons/go";

export default function TimeTableCells({ room, groups, timeArray }) {
    // Sanani tegishli oy nomi bilan formatlash funksiyasi
    const formatDate = (date) => {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        return `${day} ${month}`;
    };

    return timeArray.map((time, index) => {
        const group = groups.find(group => {
            const startTime = new Date(`1970-01-01T${group.start_time}:00`);
            const endTime = new Date(`1970-01-01T${group.end_time}:00`);
            const slotTime = new Date(`1970-01-01T${time}:00`);
            const nextSlotTime = new Date(slotTime.getTime() + 30 * 60 * 1000);

            return group.room.name === room.name && slotTime < endTime && nextSlotTime > startTime;
        });

        if (group) {
            const startTime = new Date(`1970-01-01T${group.start_time}:00`);
            const endTime = new Date(`1970-01-01T${group.end_time}:00`);
            const slotTime = new Date(`1970-01-01T${time}:00`);
            const isStart = slotTime <= startTime && startTime < new Date(slotTime.getTime() + 30 * 60 * 1000);

            if (isStart) {
                const colSpan = Math.ceil((endTime - startTime) / (30 * 60 * 1000));
                return (
                    <td
                        key={index}
                        colSpan={colSpan}
                        style={{ background: group.course.color }}
                        className="border px-4 py-2 rounded-md"
                    >
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="flex flex-wrap gap-8 items-center">
                                <div className="flex flex-col text-sm">
                                    <span className="w-fit rounded-sm px-2 bg-gray-200">{group.name}</span>
                                    <span>{group.course.title}</span>
                                </div>
                                <span >{group.teacher.first_name + " " + group.teacher.last_name}</span>
                            </div>
                            <div className="flex flex-col-reverse items-end">
                                <div className="flex items-center text-xs">
                                    <span>{formatDate(group.start_date)}</span>
                                    <span>-</span>
                                    <span>{formatDate(group.end_date)}</span>
                                </div>
                                <span className="w-fit rounded text-xs px-1 bg-gray-200">{group.students.length} tal.</span>
                            </div>
                        </div>
                    </td>
                );
            } else {
                return null;
            }
        }

        return <td key={index} className="border px-4 py-2"></td>;
    });
};