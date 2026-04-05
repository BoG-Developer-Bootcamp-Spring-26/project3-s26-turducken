import { UserContext } from "@/context/UserContext";
import { useRouter } from 'next/router';
import { useContext, useEffect } from "react";
import { heebo } from "..";

export default function Animals() {
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
        {/*Animals and Create New Header */}
        <div className={`${heebo.variable} border-b border-[#615E5E66] flex justify-between gap-1 w-full`}>
            <p className="text-xl text-[#7C7171] font-medium font-heebo mx-5 my-2">Animals</p>
            <button className="text-[#7C7171] text-md font-heebo flex items-center gap-2 mx-5 cursor-pointer">
                <img 
                    src="/images/createNewLogo.png"
                    alt="Create New Logo"
                    className="size-5"
                />
                Create new
            </button>
        </div>
        {/*Container for Animal Card Components */}
        <div className="grid grid-cols-3 gap-4">
        </div>
    </div>
  )
}