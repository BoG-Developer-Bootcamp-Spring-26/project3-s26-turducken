import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";

const NAV_ITEMS = [
    {
        label: "Training Logs",
        href: "/dashboard/training-logs",
        icon: {
            inactive: <Image src='/images/inactiveTrainingLogs.png' height={32} width={32} alt="Training Log Icon" style={{ width: '15%', height: 'auto' }} />,
            active: <Image src='/images/activeTrainingLogo.png' height={32} width={32} alt = "Training Log Icon" style={{ width: '15%', height: 'auto' }} />
        }
    },
    {
        label: "Animals",
        href: "/dashboard/animals",
        icon: {
            inactive: <Image src='/images/inactiveAnimalLogo.png' height={32} width={32} alt="Animal Icon" style={{ width: '15%', height: 'auto' }} />,
            active: <Image src='/images/activeAnimalsLogo.png' height={32} width={32} alt = "Animal Icon" style={{ width: '15%', height: 'auto' }} />
        }
    }
]

const ADMIN_ITEMS = [
    {
        label: "All training",
        href: "/admin/all-training-logs",
        icon: {
            inactive: <Image src='/images/inactiveAllTrainingLogo.png' height={32} width={28} alt="All Training Logs Icon" style={{ width: '15%', height: 'auto' }} />,
            active: <Image src='/images/activeAllTrainingLogo.png' height={36} width={32} alt="All Training Logs Icon" style={{ width: '15%', height: 'auto' }} />
        }
    },
    {
        label: "All animals",
        href: "/admin/all-animals",
        icon: {
            inactive: <Image src='/images/inactiveAllAnimalsLogo.png' width={37} height={30} alt="All Animals Icon" style={{ width: '15%', height: 'auto' }} />,
            active: <Image src='/images/activeAllAnimalsLogo.png' alt="All Animals Icon" width={37} height={29} style={{ width: '15%', height: 'auto' }} />
        }
    },
    {
        label: "All users",
        href: "/admin/all-users",
        icon: {
            inactive: <Image src='/images/inactiveAllUsersLogo.png' height={37} width={32} alt="All Users Icon" style={{ width: '15%', height: 'auto' }} />,
            active: <Image src='/images/activeAllUsersLogo.png' height={37} width={32} alt="All Users Icon" style={{ width: '15%', height: 'auto' }} />
        }
    }
]
interface SideBarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function SideBar({ isOpen, setIsOpen }: SideBarProps) {
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
            fetchData();
            setIsOpen(false);
        }, [userId, router]);

    const initials = fullName ? fullName[0].toUpperCase() : "";

    function handleLogout() {
        context?.setUserId(null);
        router.push("/");
    }

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-300 pt-35 md:pt-22 lg:pt-4 px-4 flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 lg:static lg:flex
            `}>
                {/* Main Navigation */}
                <nav className="flex flex-col">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden text-xl hover:cursor-pointer self-end"
                    >✕</button>
                    {NAV_ITEMS.map((item) => {
                            const active = (pathname === item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center w-50 gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? "bg-[#D21312]" : ""}`}
                                >
                                    {active ? item.icon.active : item.icon.inactive}
                                    <span className={active ? "text-white font-semibold text-lg" : "text-[#565252] font-normal text-lg"}> 
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
                        <p className="px-3 font-semibold text-lg text-[#565252] mt-3 mb-1">Admin access</p>
                        {ADMIN_ITEMS.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center w-50 gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? "bg-[#D21312]" : ""}`}
                                    >
                                        {active ? item.icon.active : item.icon.inactive}
                                        <span className={active ? "text-white font-semibold text-lg" : "text-[#565252] font-normal text-lg"}>
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
                                <div className="w-9 h-9 rounded-full bg-[#D21312] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                    {initials}
                                </div>
                            </div>
                            {/* User Info */}
                            <div className="flex flex-col">
                                <p className="text-[#565252] font-bold text-med">
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
                            <Image src='/images/logoutLogo.png' height={32} width={32}  alt="Logout Button" style={{ transform: "scale(0.7)" }}/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}