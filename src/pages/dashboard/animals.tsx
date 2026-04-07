import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import { useState, useContext, useEffect } from "react";
import TitleBar from "@/components/TitleBar";
import DashboardHeader from "@/components/DashboardHeader";
import { heebo, oswald } from "..";
import AnimalForm from "@/components/AnimalForm";
import AnimalCard from "@/components/AnimalCard";

export default function Animals() {
    const router = useRouter();
    const context = useContext(UserContext);
    const [showForm, setShowForm] = useState(false);
    const [animals, setAnimals] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<any>(null);

    if (!context) {
        return <div>Error: UserContext not found.</div>;
    }
    const { userId } = context;

    const fetchData = async() => {
        try {
            const response = await fetch('/api/admin/animals');
            const allAnimals = await response.json()
            const userAnimals = allAnimals.filter((animal: any) => animal.owner === userId).sort((a: any, b: any) => b.hoursTrained - a.hoursTrained);
            console.log("animals: ", userAnimals)
            setAnimals(userAnimals);
        } catch (error) {
                console.error("Failed to Fetch Animals: ", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (!userId) {
            router.push("/")
            return;
        }
        fetchData()
    }, [userId, router]);

    if (!userId) return null;

    if (loading) {
        return (
          <div className={`${oswald.variable} ${heebo.variable} relative min-h-screen flex flex-col bg-white font-heebo overflow-hidden`}>
            <TitleBar />
            <DashboardHeader showForm={showForm} setShowForm={setShowForm} title="Animals"/>
            <p className="text-xl text-gray-500">Loading</p>
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
      <div className={`${oswald.variable} ${heebo.variable} relative min-h-screen flex flex-col bg-white font-heebo`}>
        <TitleBar />
        <button onClick={() => router.push("/dashboard/training-logs")}>Back To Training Logs</button>
        <DashboardHeader showForm={showForm} setShowForm={setShowForm} title="Animals"/>
        { showForm ? (
            <div>
               <AnimalForm
                  initialData={initialData}
                  onSave={handleSave}
                  onCancel={() => {
                    setShowForm(false)
                  }}
               />
            </div>
          ) :
            <main className="min-w-screen mx-auto">
                <div className="grid grid-cols-3 gap-4">
                    {animals.length > 0 ? (
                                animals.map((animal) => (
                                  <AnimalCard
                                    key={animal._id}
                                    breed={animal.breed}
                                    name={animal.name}
                                    userName={animal.userName}
                                    hoursTrained={animal.hoursTrained}
                                    profilePicture={animal.profilePicture}
                                    setInitialData={setInitialData}
                                    setShowForm={setShowForm}
                                    />
                                ))
                              ) : (
                                <p className="text-xl text-gray-500">No animals found</p>
                              )}
                </div>
            </main>
        }
      </div>
    )
}