import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import { useState, useContext, useEffect } from "react";
import TitleBar from "@/components/TitleBar";
import SearchBar from "@/components/SearchBar";
import DashboardHeader from "@/components/DashboardHeader";
import { heebo, oswald } from "..";
import UserCard from "@/components/UserCard";
import SideBar from "@/components/SideBar";

export default function Users() {
    const router = useRouter();
    const context = useContext(UserContext);
    const [users, setUsers] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
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
            let url = '/api/admin/users?limit=15';
            if (isLoadMore && lastId) {
              url += `&lastId=${lastId}`;
            }
            const response = await fetch(url);
            const result = await response.json()
            const newUsers = result.data;
            const moreAvailable = result.hasMore;

            console.log("users: ", newUsers)
            if (newUsers.length > 0) {
              const newLastId = newUsers[newUsers.length - 1]._id;
              setLastId(newLastId);
  
              setUsers(prev => isLoadMore ? [...prev, ...newUsers] : newUsers);
            }

            setHasNextPage(moreAvailable)
        } catch (error) {
                console.error("Failed to Fetch Users: ", error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    // filters if user name or email is in search bar query
  const filteredUsers = users.filter((user) => (user.fullName.toLowerCase().includes(query.toLowerCase())
  || user.email.toLowerCase().includes(query.toLowerCase())));

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
                <DashboardHeader setShowForm={setShowForm} title="All users" isOpen={isOpen} setIsOpen={setIsOpen}/>
                <p className="text-xl text-gray-500 p-8">Loading...</p>
              </div>
            </div>
          </div>
        );
      }

 return (
      <div className={`${oswald.variable} ${heebo.variable} relative h-screen flex flex-col bg-white font-heebo`}>
        <SearchBar query={query} setQuery={setQuery} placeholder="Search all users..." />
        <div className="flex flex-row flex-1 overflow-hidden">
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <main className="flex-1 flex flex-col">
              <DashboardHeader setShowForm={setShowForm} title="All users" isOpen={isOpen} setIsOpen={setIsOpen}/>
              <div className="p-8 mx-auto w-full overflow-y-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
                  {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <UserCard
                        key={user._id}
                        fullName = {user.fullName}
                        email = {user.email}
                        admin = {user.admin}
                        cardUserId = {user._id}
                        />
                      ))
                    ) : (
                      <p className="text-xl text-gray-500">No users found</p>
                    )}
                </div>
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
                          {isFetchingMore ? "Loading..." : "Load More Users"}
                      </button>
                  </div>
                )}
                </div>
            </main>
        </div>
      </div>
    )
}