import Image from "next/image"

interface DashboardHeaderProps {
  showForm?: boolean;
  setShowForm: (show: boolean) => void;
  title: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function DashboardHeader({ showForm, setShowForm, title, isOpen, setIsOpen }: DashboardHeaderProps) {
  const handleCreateNew = () => {
    setShowForm(true);
  }
  return (
        <div className="flex justify-between items-center pb-2 pt-8 pl-3 pr-3 md:pr-15 md:pl-10 border-b border-gray-300">
            <div className="flex flex-row gap-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden bg-white rounded-md border border-gray-300 shadow-sm px-2 mb-1 text-xl font-bold hover:cursor-pointer"
            >☰</button>
          <h1 className="md:text-3xl text-2xl font-semibold text-gray-500">{title}</h1>
          </div>
          { showForm === false &&
            <button onClick={handleCreateNew} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 color-gray-500 transition-all hover:cursor-pointer">
              <Image
                src="/images/createNewLogo.png"
                alt="Create New"
                width={24}
                height={24}
              />
              <span className="md:text-xl text-lg font-medium">Create new</span>
            </button>
          }
        </div>
  )
}