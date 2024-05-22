export const FormattedTime = ({ date }) => {
    const newDate = new Date(date);
    const hour = newDate.getHours();
    const minute = newDate.getMinutes();

    return (
        <span>{hour < 10 ? "0" + hour : hour}:{minute < 10 ? "0" + minute : minute}</span>
    )
};