import { UserContext } from "@/context/UserContext";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { heebo, oswald } from "..";
import TitleBar from "@/components/TitleBar";
import SearchBar from "@/components/SearchBar";
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
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lastId, setLastId] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  if (!context) {
    return <div>Error: UserContext not found.</div>;
  }
  const { userId } = context;

  const fetchData = async (isLoadMore = false) => {
    try {
      let url = '/api/admin/trainings?limit=5';
      if (isLoadMore && lastId) {
        url += `&lastId=${lastId}`;
      }
      const response = await fetch(url);
      const result = await response.json();
      const newLogs = result.data;
      const moreAvailable = result.hasMore;

      console.log("logs: ", newLogs)
      if (newLogs.length > 0) {
        const newLastId = newLogs[newLogs.length - 1]._id;
        setLastId(newLastId);
        setLogs(prev => isLoadMore ? [...prev, ...newLogs] : newLogs);
      }

      setHasNextPage(moreAvailable);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // filters if training log title or description is in search bar query
  const filteredLogs = logs.filter((log) => (log.title.toLowerCase().includes(query.toLowerCase())
  || log.description.toLowerCase().includes(query.toLowerCase())));

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
            <DashboardHeader setShowForm={setShowForm} title="All training logs" isOpen={isOpen} setIsOpen={setIsOpen}/>
            <p className="text-xl text-gray-500 p-8">Loading...</p>
          </div>
        </div>
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
      <SearchBar query={query} setQuery={setQuery} placeholder="Search all training logs..." />
      <div className="flex flex-row flex-1 overflow-hidden">
        <SideBar isOpen={isOpen} setIsOpen={setIsOpen}/>
        <main className="flex-1 flex flex-col bg-gray-50/10">
            <DashboardHeader setShowForm={setShowForm} title="All training logs" isOpen={isOpen} setIsOpen={setIsOpen}/>
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
                  {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
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
                      <p className="text-xl text-gray-500">No logs found</p>
                  )}
              {hasNextPage && !showForm && (
                <div className="flex justify-center mt-8 pb-12">
                  <button
                      onClick={() => {
                          setIsFetchingMore(true);
                          fetchData(true);
                      }}
                      disabled={isFetchingMore}
                      className="text-black px-6 rounded hover:text-gray-600 disabled:text-gray-600"
                  >
                      {isFetchingMore ? "Loading..." : "Load More Training Logs"}
                  </button>
                </div>
              )}
              </div>}
        </main>
      </div>
    </div>
  )
}