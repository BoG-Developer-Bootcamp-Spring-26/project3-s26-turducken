import Image from "next/image";
import searchLogo from "../../public/images/searchLogo.png";

interface SearchBarProps {
    query: string;
    setQuery: (query : string) => void;
    placeholder?: string;
}

export default function SearchBar({
    query,
    setQuery,
    placeholder = "Search..."
} : SearchBarProps) {
  return (
    <div className="relative z-50 bg-white flex flex-row w-full shadow-sm items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-1">
            <img 
            src="/images/appLogo.png"
            alt="App Logo"
            className="h-10 w-16 mt-5 mb-5 ml-5"
            />
            <p className="text-4xl font-medium font-oswald tracking-tight text-black">Progress</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center ml-50 border-2 border-gray-300 rounded-xl px-4 pt-2 pb-1 h-12 w-130">
            <Image src={searchLogo} alt="Magnifying Glass" style={{ width: '4.5%', height: 'auto' }} className="mb-1 mr-2" />
            <input
                type="text"
                value={query}
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                className="border-none focus:outline-none text-[#565252] text-lg w-125"
            />
        </div>
    </div>
  );
}