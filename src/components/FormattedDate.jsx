export const FormattedDate = ({ date }) => {
    return (
        <time dateTime={date}>
            {date?.slice(0, 10).split("-").reverse().join(".")}
        </time>
    )
};