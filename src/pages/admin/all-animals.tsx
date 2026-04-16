import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import { useState, useContext, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import DashboardHeader from "@/components/DashboardHeader";
import { heebo, oswald } from "..";
import AnimalCard from "@/components/AnimalCard";
import SideBar from "@/components/SideBar";

export default function Animals() {
    const router = useRouter();
    const context = useContext(UserContext);
    const [showForm, setShowForm] = useState(false);
    const [animals, setAnimals] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [lastId, setLastId] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    if (!context) {
        return <div>Error: UserContext not found.</div>;
    }
    const { userId } = context;

    const fetchData = async(isLoadMore = false) => {
        try {
          let url = '/api/admin/animals?limit=9';
          if (isLoadMore && lastId) {
            url += `&lastId=${lastId}`;
          }
          const response = await fetch(url);
          const result = await response.json();
          const newAnimals = result.data;
          const moreAvailable = result.hasMore;

          console.log("animals: ", newAnimals)
          if (newAnimals.length > 0) {
            const newLastId = newAnimals[newAnimals.length - 1]._id;
            setLastId(newLastId);
            setAnimals(prev => isLoadMore ? [...prev, ...newAnimals] : newAnimals);
          }

          setHasNextPage(moreAvailable);
        } catch (error) {
                console.error("Failed to Fetch Animals: ", error);
        } finally {
            setLoading(false)
            setIsFetchingMore(false);
        }
    };

    // filters if animal name or breed is in search bar query
    const filteredAnimals = animals.filter((animal) => (animal.name.toLowerCase().includes(query.toLowerCase())
    || animal.breed.toLowerCase().includes(query.toLowerCase())));

    useEffect(() => {
        fetchData();
    }, [userId, router]);

    if (!userId) return null;

    if (loading) {
        return (
          <div className={`${oswald.variable} ${heebo.variable} relative h-screen flex flex-col bg-white font-heebo`}>
            <SearchBar query={query} setQuery={setQuery} placeholder="Search all animals..." />
            <div className="flex flex-row flex-1 overflow-hidden">
                <SideBar isOpen={isOpen} setIsOpen={setIsOpen}/>
                <main className="flex-1 flex flex-col">
                  <DashboardHeader setShowForm={setShowForm} title="All animals" isOpen={isOpen} setIsOpen={setIsOpen}/>
                  <p className="text-xl text-gray-500 p-8">Loading...</p>
                </main>
              </div>
          </div>
        );
      }
    
 return (
      <div className={`${oswald.variable} ${heebo.variable} relative h-screen flex flex-col bg-white font-heebo`}>
        <SearchBar query={query} setQuery={setQuery} placeholder="Search all animals..." />
        <div className="flex flex-row flex-1 overflow-hidden">
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <main className="flex-1 flex flex-col">
                <DashboardHeader setShowForm={setShowForm} title="All animals" isOpen={isOpen} setIsOpen={setIsOpen}/>
                  <div className="p-8 mx-auto w-full overflow-y-auto">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
                          {filteredAnimals.length > 0 ? (
                              filteredAnimals.map((animal) => (
                                <AnimalCard
                                  key={animal._id}
                                  breed={animal.breed}
                                  name={animal.name}
                                  userName={animal.userName}
                                  hoursTrained={animal.hoursTrained}
                                  profilePicture={animal.profilePicture}
                                  animalId={animal._id}
                                />
                              ))
                            ) : (
                              <p className="text-xl text-gray-500">No animals found</p>
                            )}
                      </div>
                      {hasNextPage && (
                        <div className="flex justify-center mt-8 pb-12">
                            <button
                                onClick={() => {
                                    setIsFetchingMore(true);
                                    fetchData(true);
                                }}
                                disabled={isFetchingMore}
                                className="text-black px-6 rounded hover:text-gray-600 disabled:text-gray-600"
                            >
                                {isFetchingMore ? "Loading..." : "Load More Animals"}
                            </button>
                        </div>
                      )}
                  </div>
            </main>
        </div>
      </div>
    )
}