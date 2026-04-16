import Image from "next/image";

interface SearchBarProps {
    query: string;
    setQuery: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    query,
    setQuery,
    placeholder = "Search..."
}: SearchBarProps) {
    return (
        <div className="relative z-50 bg-white flex flex-col md:flex-row w-full shadow-sm items-center md:justify-between p-4 gap-4">
            
            {/* Logo and Title */}
            <div className="flex self-start md:self-center gap-2 shrink-0">
                <img 
                    src="/images/appLogo.png"
                    alt="App Logo"
                    className="h-10 w-auto"
                />
                <p className="text-3xl md:text-4xl font-medium font-oswald tracking-tight text-black">
                    Progress
                </p>
            </div>

            {/* Search Bar*/}
            <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 h-12 w-full max-w-lg lg:absolute lg:left-1/2 lg:ml-8 lg:-translate-x-1/2">
                <Image 
                    src='/images/searchLogo.png'
                    alt="Magnifying Glass" 
                    width={22}
                    height={22}
                    className="mr-2 shrink-0" 
                />
                <input
                    type="text"
                    value={query}
                    placeholder={placeholder}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-none focus:outline-none text-[#565252] text-lg w-full bg-transparent"
                />
            </div>
        </div>
    );
}