import Image from "next/image";
import inactTrainingLog from "../../public/images/inactiveTrainingLogs.png";
import inactAnimal from "../../public/images/inactiveAnimalLogo.png";
import inactAllTraining from "../../public/images/inactiveAllTrainingLogo.png";
import inactAllAnimals from "../../public/images/inactiveAllAnimalsLogo.png";
import inactAllUsers from "../../public/images/inactiveAllUsersLogo.png";
import actTrainingLog from "../../public/images/activeTrainingLogs.png";
import actAnimal from "../../public/images/activeAnimalLogo.png";
import actAllTraining from "../../public/images/activeAllTrainingLogo.png";
import actAllAnimals from "../../public/images/activeAllAnimalsLogo.png";
import actAllUsers from "../../public/images/activeAllUsersLogo.png";

interface SideBarProps {
    fullName: string,
    isAdmin: boolean
}

const NAV_ITEMS = [
    {
        label: "Training Logs",
        href: "/context/dashboard/training-logs",       //FIXME: update href if needed
        icon: {
            inactive: <Image src={inactTrainingLog} alt="Training Log Icon" />,
            active: <Image src={actTrainingLog} alt = "Training Log Icon" />
        }
    },
    {
        label: "Animals",
        href: "/context/dashboard/animals",             //FIXME: update href if needed
        icon: {
            inactive: <Image src={inactAnimal} alt="Animal Icon" />,
            active: <Image src={actAnimal} alt = "Animal Icon" />
        }
    }
]

const ADMIN_ITEMS = [
    {
        label: "All Training",
        href: "/context/dashboard/all-training-logs",   //FIXME: same
        icon: {
            inactive: <Image src={inactAllTraining} alt="All Training Logs Icon" />,
            active: <Image src={actAllTraining} alt="All Training Logs Icon" />
        }
    },
    {
        label: "All Animals",
        href: "/context/dashboard/all-animals",         //FIXME: same
        icon: {
            inactive: <Image src={inactAllAnimals} alt="All Animals Icon" />,
            active: <Image src={actAllAnimals} alt="All Animals Icon" />
        }
    },
    {
        label: "All Users",
        href: "/context/dashboard/all-users",           //FIXME: same
        icon: {
            inactive: <Image src={inactAllUsers} alt="All Users Icon" />,
            active: <Image src={actAllUsers} alt="All Users Icon" />
        }
    }
]

export default function SideBar({
    fullName,
    isAdmin
}: SideBarProps) {
    return (
        <div>

        </div>
    )
}