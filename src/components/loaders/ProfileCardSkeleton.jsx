export default function ProfileCardSkeleton() {
    return (
        <div className="flex flex-col gap-1 animate-pulse">
            <h1 className="w-40 h-10 rounded bg-gray-300">&nbsp;</h1>
            <h1 className="w-32 h-4 rounded bg-gray-300">&nbsp;</h1>
            <div className="flex gap-6 mt-4">
                <h4 className="w-32 h-8 rounded bg-gray-300">&nbsp;</h4>
                <h4 className="w-32 h-8 rounded bg-gray-300">&nbsp;</h4>
            </div>
        </div>
    )
};