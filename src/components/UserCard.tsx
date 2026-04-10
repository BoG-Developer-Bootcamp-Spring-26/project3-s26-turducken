interface UserCardProps {
    fullName: string
    email: string
    admin: boolean
}

export default function UserCard({
    fullName, email, admin
} : UserCardProps) {
    return (
        <div className="w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 flex items-center gap-3">
                <div className="size-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{fullName[0].toUpperCase()}</span>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {fullName}
                    </h2>
                    <div className="flex gap-1">
                        {admin && 
                            <p className="text-sm text-gray-400 mt-.5 font-semibold">
                                {"Admin •"}
                            </p>
                        }
                        <p className="text-sm text-gray-400 mt-.5">
                            {email}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}