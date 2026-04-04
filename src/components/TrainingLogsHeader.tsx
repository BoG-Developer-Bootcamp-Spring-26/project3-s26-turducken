import Image from "next/image"

export default function TitleBar() {
  return (
        <div className="flex justify-between items-center pb-2 pt-10 pr-15 pl-10 mb-8 border-b border-gray-400">
          <h1 className="text-3xl font-semibold text-gray-500">Training logs</h1>
          <button className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-all">
            <Image src="/images/createNewLogo.png" alt="Create New" width={24} height={24}/>
            <span className="text-2xl font-medium">Create new</span>
          </button>
        </div>
  )
}