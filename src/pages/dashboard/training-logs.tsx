import { UserContext } from "@/context/UserContext";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { heebo, oswald } from "..";
import TitleBar from "@/components/TitleBar";
import TrainingCard from "@/components/TrainingCard";
import DashboardHeader from "@/components/DashboardHeader";
import TrainingForm from "@/components/TrainingLogsForm";
import SideBar from "@/components/SideBar";

export default function TrainingLogs() {
  const router = useRouter();
  const context = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  const [logs, setLogs] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  const [editingLog, setEditingLog] = useState(false);

  if (!context) {
    return <div>Error: UserContext not found.</div>;
  }
  const { userId } = context;

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/trainings");
      const allLogs = await response.json();
      const userLogs = allLogs.filter((log: any) => log.user === userId).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setLogs(userLogs);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      router.push("/");
      return;
    }
    fetchData();
  }, [userId, router]);

  if (!userId) return null;
  
  if (loading) {
    return (
      <div className={`${oswald.variable} ${heebo.variable} relative min-h-screen flex flex-col bg-white font-heebo overflow-hidden`}>
        <TitleBar />
        <DashboardHeader showForm={showForm} setShowForm={setShowForm} title="Training logs"/>
        <p className="text-xl text-gray-500 px-2">Loading</p>
      </div>
    );
  }

  const handleSave = async (data: any) => {
      try {
        const response = await fetch("/api/training", {
          method: editingLog ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            user: userId,
            date: new Date(`${data.month} ${data.day}, ${data.year}`),
            hours: Number(data.hours),
          }),
        });
        if (response.ok) {
          await fetchData();
          setShowForm(false);
          setEditingLog(false);
        } else {
          const errorData = await response.json();
          alert(`Failed to save: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Error saving log:", error);
      }
  };

  return (
    <div className={`${oswald.variable} ${heebo.variable} relative h-screen flex flex-col bg-white font-heebo`}>
      <TitleBar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <SideBar />
        <main className="flex-1 flex flex-col bg-gray-50/10">
            <DashboardHeader showForm={showForm} setShowForm={setShowForm} title="Training logs"/>
            { showForm ? (
                <div className="flex-1 overflow-y-auto">
                    <TrainingForm
                        initialData={initialData}
                        onSave={handleSave}
                        onCancel={() => {
                        setShowForm(false)
                        setEditingLog(false)
                        }}
                        editingLog={ editingLog }
                    />
                </div>
                ) :
            <div className="w-full mx-auto p-8 flex flex-col gap-4 overflow-y-auto">
                {logs.length > 0 ? (
                    logs.map((log) => (
                    <TrainingCard
                    key={log._id}
                    trainingLogId={log._id}
                    userName={log.userName}
                    animal={log.animal}
                    animalBreed={log.animalBreed}
                    animalName={log.animalName}
                    date={new Date(log.date)}
                    title={log.title}
                    description={log.description}
                    hours={log.hours}
                    setShowForm={setShowForm}
                    setInitialData={setInitialData}
                    setEditingLog={setEditingLog}
                    />
                    ))
                ) : (
                    <p className="text-xl text-gray-500 px-2">No logs found</p>
                )}
            </div>}
        </main>
      </div>
    </div>
  )
}