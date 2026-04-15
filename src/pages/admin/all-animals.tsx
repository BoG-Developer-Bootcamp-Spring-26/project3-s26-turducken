import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import { useState, useContext, useEffect } from "react";
import TitleBar from "@/components/TitleBar";
import SearchBar from "@/components/SearchBar";
import DashboardHeader from "@/components/DashboardHeader";
import { heebo, oswald } from "..";
import AnimalForm from "@/components/AnimalForm";
import AnimalCard from "@/components/AnimalCard";
import SideBar from "@/components/SideBar";

export default function Animals() {
    const router = useRouter();
    const context = useContext(UserContext);
    const [showForm, setShowForm] = useState(false);
    const [animals, setAnimals] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    if (!context) {
        return <div>Error: UserContext not found.</div>;
    }
    const { userId } = context;

    const fetchData = async() => {
        try {
            const response = await fetch('/api/admin/animals');
            const allAnimals = await response.json()
            console.log("animals: ", allAnimals)
            setAnimals(allAnimals);
        } catch (error) {
                console.error("Failed to Fetch Animals: ", error);
        } finally {
            setLoading(false)
        }
    };

    // filters if animal name or breed is in search bar query
    const filteredAnimals = animals.filter((animal) => (animal.name.toLowerCase().includes(query.toLowerCase())
    || animal.breed.toLowerCase().includes(query.toLowerCase())));

    useEffect(() => {
        fetchData()
    }, [userId, router]);

    if (!userId) return null;

    if (loading) {
        return (
          <div className={`${oswald.variable} ${heebo.variable} relative min-h-screen flex flex-col bg-white font-heebo overflow-hidden`}>
            <TitleBar />
            <div className="flex flex-row flex-1 overflow-hidden">
              <SideBar />
              <div className="flex-1 flex flex-col">
                <DashboardHeader setShowForm={setShowForm} title="All animals"/>
                <p className="text-xl text-gray-500 p-8">Loading...</p>
              </div>
            </div>
          </div>
        );
      }
    
      const handleSave = async (data: any) => {
      try {
        const response = await fetch("/api/animal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            breed: data.breed,
            owner: userId,
            hoursTrained: Number(data.hoursTrained),
            profilePicture: data.profilePicture
          }),
        });
        if (response.ok) {
          await fetchData();
          setShowForm(false);
        } else {
          const errorData = await response.json();
          alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Error saving animal:", error);
      }
  };

 return (
      <div className={`${oswald.variable} ${heebo.variable} relative h-screen flex flex-col bg-white font-heebo`}>
        <SearchBar query={query} setQuery={setQuery} placeholder="Search all animals..." />
        <div className="flex flex-row flex-1 overflow-hidden">
            <SideBar />
            <main className="flex-1 flex flex-col">
                <DashboardHeader setShowForm={setShowForm} title="All animals"/>
                { showForm ? (
                    <div className="p-8">
                       <AnimalForm
                          onSave={handleSave}
                          onCancel={() => {
                            setShowForm(false)
                          }}
                       />
                    </div>
                  ) : (
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
                    </div>
                  )}
            </main>
        </div>
      </div>
    )
}