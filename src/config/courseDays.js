export default function calculateCourseDays(start, end, day, holidays = []) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = [];

    let currentDate = new Date(startDate);
    if (day === "odd") {
        while (currentDate <= endDate) {
            if (
                (currentDate.getDay() === 1 || currentDate.getDay() === 3 || currentDate.getDay() === 5) &&
                !holidays.includes(currentDate.toISOString().slice(0, 10))
            ) {
                days.push(currentDate.toISOString().slice(0, 10));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    else if (day === "even") {
        while (currentDate <= endDate) {
            if (
                (currentDate.getDay() === 2 || currentDate.getDay() === 4 || currentDate.getDay() === 6) &&
                !holidays.includes(currentDate.toISOString().slice(0, 10))
            ) {
                days.push(currentDate.toISOString().slice(0, 10));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    else if (day === "weekend") {
        while (currentDate <= endDate) {
            if (
                (currentDate.getDay() === 0) &&
                !holidays.includes(currentDate.toISOString().slice(0, 10))
            ) {
                days.push(currentDate.toISOString().slice(0, 10));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    else if (day === "everyday") {
        while (currentDate <= endDate) {
            if (!holidays.includes(currentDate.toISOString().slice(0, 10))) {
                days.push(currentDate.toISOString().slice(0, 10));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    return days;
};