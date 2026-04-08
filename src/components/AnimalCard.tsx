interface AnimalCardProps {
    breed: string;
    name: string;
    hoursTrained: number;
    profilePicture: string;
    userName: string;
    setInitialData: (data: any) => void;
    setShowForm: (show: boolean) => void;
}

export default function AnimalCard({
    breed, name, hoursTrained, profilePicture, userName, setInitialData, setShowForm
} : AnimalCardProps) {
    return (
        <div className="w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <img 
                src={profilePicture}
                className="w-full h-64 object-cover"
                alt={breed}
            />
            <div className="p-4 flex items-center gap-3">
                <div className="size-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{userName[0].toUpperCase()}</span>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-base font-bold text-gray-900 leading-tight">
                        {name} - {breed}
                    </h2>
                    <p className="text-sm text-gray-400 mt-.5">
                        {userName} &bull; Trained: {hoursTrained} hours
                    </p>
                </div>

            </div>
        </div>
    )
}