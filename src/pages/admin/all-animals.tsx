import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import { useState, useContext, useEffect } from "react";
import TitleBar from "@/components/TitleBar";
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
    const [isOpen, setIsOpen] = useState(false);

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

    useEffect(() => {
        fetchData();
    }, [userId, router]);

    if (!userId) return null;

    if (loading) {
        return (
          <div className={`${oswald.variable} ${heebo.variable} relative min-h-screen flex flex-col bg-white font-heebo overflow-hidden`}>
            <TitleBar />
            <div className="flex flex-row flex-1 overflow-hidden">
              <SideBar isOpen={isOpen} setIsOpen={setIsOpen}/>
              <div className="flex-1 flex flex-col">
                <DashboardHeader setShowForm={setShowForm} title="All animals" isOpen={isOpen} setIsOpen={setIsOpen}/>
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
        <TitleBar />
        <div className="flex flex-row flex-1 overflow-hidden">
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <main className="flex-1 flex flex-col">
                <DashboardHeader setShowForm={setShowForm} title="All animals" isOpen={isOpen} setIsOpen={setIsOpen}/>
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
                    <div className="p-8 mx-auto w-full max-w-7xl overflow-y-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
                            {animals.length > 0 ? (
                                animals.map((animal) => (
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