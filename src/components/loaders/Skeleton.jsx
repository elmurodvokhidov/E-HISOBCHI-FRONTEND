export default function Skeleton({
    parentWidth,
    firstChildWidth,
    secondChildWidth,
    thirdChildWidth,
}) {
    return (
        <div className={`w-[${parentWidth}%] flex flex-col justify-center gap-1 p-8 shadow-smooth animate-pulse bg-white`}>
            <div className={`w-[${firstChildWidth}%] h-4 rounded bg-gray-300`}>&nbsp;</div>
            <div className={`w-[${secondChildWidth}%] h-4 rounded bg-gray-300`}>&nbsp;</div>
            <div className={`w-[${thirdChildWidth}%] h-4 rounded bg-gray-300`}>&nbsp;</div>
        </div>
    )
}