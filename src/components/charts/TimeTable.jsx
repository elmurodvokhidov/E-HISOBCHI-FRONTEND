import { useState } from "react";
import { dailyTime } from "../../config/dailyTime";
import TimeTableCells from "./TimeTableCells";

export default function TimeTable({ rooms, groups, teacher }) {
    const [filter, setFilter] = useState("odd");
    // Kundagi barcha yarim soatlik vaqtlar ro'yhati
    const timeArray = dailyTime();

    // Guruhlarni filterlash
    const filteredGroups = groups.filter(group => {
        if (teacher) return group.teacher._id === teacher;
        else return group;
    }).filter(group => {
        if (filter === "others") return group.day !== "odd" && group.day !== "even";
        else if (group.day === filter) return group;
    });

    return (
        <div className="overflow-x-auto p-4">
            <div className="flex justify-between pb-4">
                <div className="flex items-center gap-4 pc:text-lg">
                    <button
                        onClick={() => setFilter("odd")}
                        className={`${filter === 'odd' && 'underscore'}`}>
                        Toq kunlari
                    </button>
                    <button
                        onClick={() => setFilter("even")}
                        className={`${filter === 'even' && 'underscore'}`}>
                        Juft kunlari
                    </button>
                    <button
                        onClick={() => setFilter("others")}
                        className={`${filter === 'others' && 'underscore'}`}>
                        Boshqa
                    </button>
                </div>
                <h1 className="text-xl pc:text-2xl">Jadval</h1>
                <div></div>
            </div>
            <table className="border-collapse">
                <thead>
                    <tr className="border border-gray-300">
                        <td className="border-r border-r-gray-300"></td>
                        {timeArray.map((time, index) => (
                            <td key={index} className="border-r border-r-gray-300 text-sm pc:text-base text-center p-2 last:border-r-0">{time}</td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rooms.map(room => (
                        <tr key={room._id} className="border border-gray-300">
                            <td className="min-w-24 text-base pc:text-lg text-center">{room.name}</td>
                            <TimeTableCells
                                room={room}
                                groups={filteredGroups}
                                timeArray={timeArray}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};