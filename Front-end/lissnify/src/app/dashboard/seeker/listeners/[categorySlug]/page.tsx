"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/Components/DashboardLayout";
import EnhancedListenerCard from "@/Components/EnhancedListenerCard";
import { listenerCategoryWise, getCategories, connectedListeners } from "@/utils/api";
import { 
  Users, 
  Heart, 
  ArrowLeft
} from "lucide-react";

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

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  supportText: string;
  slug: string;
}

export default function CategoryListenersPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.categorySlug as string;
  
  const [listeners, setListeners] = useState<ListenerApi[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectedListenersList, setConnectedListenersList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch category details
        const categoriesResponse = await getCategories();
        if (categoriesResponse.success && categoriesResponse.data) {
          const foundCategory = categoriesResponse.data.find(cat => cat.slug === categorySlug);
          if (foundCategory) {
            setCategory(foundCategory);
          }
        }

        // Fetch listeners for this category using slug
        const listenersResponse = await listenerCategoryWise(categorySlug);
        if (listenersResponse.success && listenersResponse.data) {
          setListeners(listenersResponse.data);
        } else {
          setError(listenersResponse.error || "Failed to fetch listeners");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      } finally {
        setLoading(false);
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

    if (categorySlug) {
      fetchData();
      fetchConnectedListeners();
    }
  }, [categorySlug]);


  if (loading) {
    return (
      <DashboardLayout userType="seeker">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#CD853F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading listeners...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="seeker">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Listeners</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#CD853F] text-white rounded-lg hover:bg-[#D2691E] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="seeker">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111]">
              Listeners for {category?.name || 'Category'}
            </h1>
            <p className="text-[#333] mt-2">Compassionate peers ready to listen.</p>
          </div>
        </div>

        {/* Listeners Grid */}
        {listeners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listeners.map((listener) => (
              <EnhancedListenerCard 
                key={listener.l_id} 
                listener={listener} 
                connectedListeners={connectedListenersList} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-[#8B4513]" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">No Listeners Available</h3>
            <p className="text-gray-600 mb-6">
              There are currently no listeners available in this category. Please check back later.
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
