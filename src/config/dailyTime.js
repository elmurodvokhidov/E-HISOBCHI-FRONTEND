export const dailyTime = () => {
    const times = [];
    let startHour = 9;
    let startMinute = 0;
    let endHour = 20;

    while (startHour < endHour || (startHour === endHour && startMinute === 0)) {
        const hourStr = startHour.toString().padStart(2, '0');
        const minuteStr = startMinute.toString().padStart(2, '0');
        times.push(`${hourStr}:${minuteStr}`);

        if (startMinute === 0) {
            startMinute = 30;
        } else {
            startMinute = 0;
            startHour += 1;
        }
    }
    return times;
};