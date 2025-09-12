"use client";
import { notFound } from "next/navigation";
import { useEffect, useState, use } from "react";
import Navbar from "@/Components/Navbar";
import EnhancedListenerCard from "@/Components/EnhancedListenerCard";
import { categories } from "../data";
import { listenerCategoryWise, connectedListeners } from "@/utils/api";



type ListenerApi = {
  l_id: string;
  username?: string;
  name?: string;
  image?: string;
  category?: string;
  description?: string | null;
  rating?: number | null;
  preferences?: string[];
  languages?: string[];
};

export default function ListenerCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const [data, setData] = useState<ListenerApi[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [connectedListenersList, setConnectedListenersList] = useState([]);
  
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    // 1. Define an async function inside the effect
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 2. Await the API response
        const response = await listenerCategoryWise(resolvedParams.category);
        // 3. Check for a successful response and update the state
        if (response.success && response.data) {
          setData(response.data);
        } else {
          // Handle API errors (e.g., show a message)
          console.error("Failed to fetch data:", response.error);
          setData([]); // Clear data on failure
        }
      } catch (error) {
        // Handle network or unexpected errors
        console.error("An error occurred during fetch:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch connected listeners if user is a seeker
    const fetchConnectedListeners = async () => {
      try {
        const user_type = JSON.parse(localStorage.getItem('elysian_user') || '{}');
        if (user_type?.user_type === 'seeker') {
          const connectedData = await connectedListeners();
          if (connectedData.success && connectedData.data) {
            setConnectedListenersList(connectedData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching connected listeners:", error);
      }
    };

    fetchData(); // Call the async function
    fetchConnectedListeners();

  }, [resolvedParams.category]);
  
  // console.log("Category Page Params:", resolvedParams.category);
  const category = categories.find((c) => c.id === resolvedParams.category);
  if (!category) return notFound();

  const filteredFromApi = data;
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5]">
          <section className="container mx-auto px-6 py-16 max-w-7xl">
            <p className="text-[#222]">Loading listeners...</p>
          </section>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5]">
        <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#111]">Listeners for {category.title}</h1>
          <p className="text-[#333] mt-2">Compassionate peers ready to listen.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFromApi.length === 0 ? (
            <p className="text-[#222]">No listeners yet for this category. Check back soon.</p>
          ) : (
            filteredFromApi.map((l) => (
              <EnhancedListenerCard key={l.l_id} listener={l} connectedListeners={connectedListenersList} />
            ))
          )}
        </div>
      </section>
      </main>
    </div>
  );
}


