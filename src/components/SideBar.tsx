import Image from "next/image";
import Link from "next/link";
import inactTrainingLog from "../../public/images/inactiveTrainingLogs.png";
import inactAnimal from "../../public/images/inactiveAnimalLogo.png";
import inactAllTraining from "../../public/images/inactiveAllTrainingLogo.png";
import inactAllAnimals from "../../public/images/inactiveAllAnimalsLogo.png";
import inactAllUsers from "../../public/images/inactiveAllUsersLogo.png";
import actTrainingLog from "../../public/images/activeTrainingLogo.png";
import actAnimal from "../../public/images/activeAnimalsLogo.png";
import actAllTraining from "../../public/images/activeAllTrainingLogo.png";
import actAllAnimals from "../../public/images/activeAllAnimalsLogo.png";
import actAllUsers from "../../public/images/activeAllUsersLogo.png";
import logoutButton from "../../public/images/logoutLogo.png"
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";

const NAV_ITEMS = [
    {
        label: "Training Logs",
        href: "/dashboard/training-logs",
        icon: {
            inactive: <Image src={inactTrainingLog} alt="Training Log Icon" style={{ width: '15%', height: 'auto' }} />,
            active: <Image src={actTrainingLog} alt = "Training Log Icon" style={{ width: '15%', height: 'auto' }} />
        }
    },
    {
        label: "Animals",
        href: "/dashboard/animals",
        icon: {
            inactive: <Image src={inactAnimal} alt="Animal Icon" style={{ width: '15%', height: 'auto' }} />,
            active: <Image src={actAnimal} alt = "Animal Icon" style={{ width: '15%', height: 'auto' }} />
        }
    }
]

const ADMIN_ITEMS = [
    {
        label: "All Training",
        href: "/admin/all-training-logs",
        icon: {
            inactive: <Image src={inactAllTraining} alt="All Training Logs Icon" style={{ width: '15%', height: 'auto' }} />,
            active: <Image src={actAllTraining} alt="All Training Logs Icon" style={{ width: '15%', height: 'auto' }} />
        }
    },
    {
        label: "All Animals",
        href: "/admin/all-animals",
        icon: {
            inactive: <Image src={inactAllAnimals} alt="All Animals Icon" style={{ width: '15%', height: 'auto' }} />,
            active: <Image src={actAllAnimals} alt="All Animals Icon" style={{ width: '15%', height: 'auto' }} />
        }
    },
    {
        label: "All Users",
        href: "/admin/all-users",
        icon: {
            inactive: <Image src={inactAllUsers} alt="All Users Icon" style={{ width: '15%', height: 'auto' }} />,
            active: <Image src={actAllUsers} alt="All Users Icon" style={{ width: '15%', height: 'auto' }} />
        }
    }
]

export default function SideBar() {
    const router = useRouter();
    const pathname = usePathname();
    const context = useContext(UserContext);
    const [fullName, setFullName] = useState("");
    const [admin, setAdmin] = useState(false);

    if (!context) {
        return <div>Error: UserContext not found.</div>;
      }
      const { userId } = context;
    
      const fetchData = async () => {
        try {
            const response = await fetch(`/api/user?userId=${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
                });
            if (response.ok) {
                const data = await response.json()
                setFullName(data.userData.fullName);
                setAdmin(data.userData.admin);
            } else {
                const errorData = await response.json();
                alert(`Failed to get user: ${errorData.message || 'Unknown error'}`);
            }
            } catch (error) {
            console.error("Failed to get user information:", error);
            }
        };
    
        useEffect(() => {
            if (!userId) {
            router.push("/");
            return;
            }
            fetchData();
        }, [userId, router]);

    const initials = fullName ? fullName[0].toUpperCase() : "";

    function handleLogout() {
        context?.setUserId(null);
        router.push("/");
    }

    return (
        <div className="flex flex-col bg-white w-65 border-r border-gray-300 pt-4 pl-4 pr-8">
            {/* Main Navigation */}
            <nav className="flex flex-col">
                {NAV_ITEMS.map((item) => {
                        const active = (pathname === item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? "bg-[#D21312]" : ""}`}
                            >
                                {active ? item.icon.active : item.icon.inactive}
                                <span className={active ? "text-white font-medium" : "text-[#565252] font-normal"}> 
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })
                }
            </nav>

            {/* Admin Navigation */}
            {admin && (
                <nav className="flex flex-col py-2">
                    <hr className="border-t-2 border-gray-300"/>
                    <p className="px-3 font-medium text-[#565252] mt-3 mb-1">Admin Access</p>
                    {ADMIN_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? "bg-[#D21312]" : ""}`}
                                >
                                    {active ? item.icon.active : item.icon.inactive}
                                    <span className={active ? "text-white font-medium" : "text-[#565252] font-normal"}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })
                    }
                </nav>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* User Footer */}
            <div>
                <hr className="border-t-2 border-gray-300"/>
                <div className="flex items-center justify-between px-1 mb-3 mt-3">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div>
                            <div className="w-9 h-9 rounded-full bg-[#D21312] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {initials}
                            </div>
                        </div>
                        {/* User Info */}
                        <div className="flex flex-col">
                            <p className="text-[#565252] font-bold text-sm">
                                {fullName}
                            </p>
                            <p className="text-[#565252] text-sm">
                                {admin ? "Admin" : "User"}
                            </p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="hover:opacity-80 cursor-pointer"
                        title="Log Out"
                    >
                        <Image src={logoutButton} alt="Logout Button" style={{ transform: "scale(0.7)" }}/>
                    </button>
                </div>
            </div>
        </div>
    )
}