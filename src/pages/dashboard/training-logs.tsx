import { UserContext } from "@/context/UserContext";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { heebo, oswald } from "..";
import TitleBar from "@/components/TitleBar";
import Image from 'next/image';
import TrainingCard from "@/components/TrainingCard";
import TrainingLogsHeader from "@/components/TrainingLogsHeader";

export default function TrainingLogs() {
  const router = useRouter();
  const context = useContext(UserContext);
  const [logs, setLogs] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  if (!context) {
    return <div>Error: UserContext not found. Ensure this page is wrapped in the Provider.</div>;
  }
  const { userId } = context;

  useEffect(() => {
    if (!userId) {
      router.push("/");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/trainings");
        const allLogs = await response.json();
        const userLogs = allLogs.filter((log: any) => log.user === userId);
        setLogs(userLogs);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, router]);

  if (!userId) return null;
  
  if (loading) {
    return (
      <div className={`${oswald.variable} ${heebo.variable} relative min-h-screen flex flex-col bg-white font-heebo overflow-hidden`}>
        <TitleBar />
        <TrainingLogsHeader />
        <p className="text-xl text-gray-500">No logs found</p>
      </div>
    );
  }

  return (
    <div className={`${oswald.variable} ${heebo.variable} relative min-h-screen flex flex-col bg-white font-heebo overflow-hidden`}>
      <TitleBar />
      <TrainingLogsHeader />
      <main className="min-w-screen mx-auto">
        <div className="flex flex-col gap-4 pl-20 pr-20">
          {logs.length > 0 ? (
            logs.map((log) => (
              <TrainingCard
              key={log._id}
              userName={log.userName}
              animalBreed={log.animalBreed}
              animalName={log.animalName}
              date={new Date(log.date)}
              title={log.title}
              description={log.description}
              hours={log.hours}
            />
            ))
          ) : (
            <p className="text-xl text-gray-500">No logs found</p>
          )}
        </div>
      </main>
    </div>
  )
}