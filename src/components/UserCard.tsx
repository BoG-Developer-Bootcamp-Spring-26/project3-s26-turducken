import { useContext } from "react"
import DeleteButton from "./DeleteButton"
import { UserContext } from "@/context/UserContext"

interface UserCardProps {
    fullName: string
    email: string
    admin: boolean
    cardUserId: string
}

export default function UserCard({
    fullName, email, admin, cardUserId
} : UserCardProps) {
    const context = useContext(UserContext);
    if (!context) {
        return <div>Error: UserContext not found.</div>;
    }
    const { userId } = context;
    
    return (
        <div className="w-full mx-auto bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="flex flex-row justify-between">
            <div className="p-5 flex items-center gap-3 min-w-0">
                <div className="size-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{fullName[0].toUpperCase()}</span>
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {fullName}
                    </h2>
                    <div className="flex gap-1">
                        {admin && 
                            <p className="text-sm text-gray-400 mt-.5 font-semibold whitespace-nowrap">
                                {"Admin •"}
                            </p>
                        }
                        <p className="text-sm text-gray-400 mt-.5 truncate">
                            {email}
                        </p>
                    </div>
                </div>
            </div>
                { userId != cardUserId && <DeleteButton id={cardUserId} type="user" />}
            </div>
        </div>
    )
}