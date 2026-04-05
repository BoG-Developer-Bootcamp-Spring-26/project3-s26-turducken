import { UserContext } from "@/context/UserContext";
import { useRouter } from 'next/router';
import { useContext, useEffect } from "react";

export default function TrainingLogs() {
  const router = useRouter();
  const context = useContext(UserContext);
  if (!context) {
    return <div>Error: UserContext not found. Ensure this page is wrapped in the Provider.</div>;
  }
  const { userId } = context;

  useEffect(() => {
    if (!userId) {
      router.push("/");
    }
  }, [userId, router]);

  if (!userId) {
    return null; 
  }

  return (
    <div>
        <h1>Training Logs page for: {userId}</h1>
        <button onClick={() => router.push("/dashboard/animals")} className="cursor-pointer border-2">to Animal Logs</button>
    </div>
  )
}