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
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import User from "../../server/mongodb/models/User";

interface SideBarProps {
    fullName: string,
    admin: boolean
}

const NAV_ITEMS = [
    {
        label: "Training Logs",
        href: "/dashboard/training-logs",       //FIXME: update href if needed
        icon: {
            inactive: <Image src={inactTrainingLog} alt="Training Log Icon" />,
            active: <Image src={actTrainingLog} alt = "Training Log Icon" />
        }
    },
    {
        label: "Animals",
        href: "/dashboard/animals",             //FIXME: update href if needed
        icon: {
            inactive: <Image src={inactAnimal} alt="Animal Icon" />,
            active: <Image src={actAnimal} alt = "Animal Icon" />
        }
    }
]

const ADMIN_ITEMS = [
    {
        label: "All Training",
        href: "/admin/all-training-logs",       //FIXME: same
        icon: {
            inactive: <Image src={inactAllTraining} alt="All Training Logs Icon" />,
            active: <Image src={actAllTraining} alt="All Training Logs Icon" />
        }
    },
    {
        label: "All Animals",
        href: "/admin/all-animals",             //FIXME: same
        icon: {
            inactive: <Image src={inactAllAnimals} alt="All Animals Icon" />,
            active: <Image src={actAllAnimals} alt="All Animals Icon" />
        }
    },
    {
        label: "All Users",
        href: "/admin/all-users",               //FIXME: same
        icon: {
            inactive: <Image src={inactAllUsers} alt="All Users Icon" />,
            active: <Image src={actAllUsers} alt="All Users Icon" />
        }
    }
]

export default function SideBar({
    fullName,
    admin
}: SideBarProps) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div>
            <nav>
                {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={"flex"}
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

            {admin && (
                // add horiz bar and title
                <nav>
                    {ADMIN_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={"flex"}
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
        </div>
    )
}