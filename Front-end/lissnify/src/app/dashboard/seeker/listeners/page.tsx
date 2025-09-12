"use client"

import { useEffect, useState } from "react";
import DashboardLayout from "@/Components/DashboardLayout";
import CategoryCard from "@/Components/CategoryCard";
import { getCategories } from "@/utils/api";
import { transformCategoryForCard } from "@/utils/categoryTransform";
import { Heart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  supportText: string;
  slug: string;
}

export default function ListenersLandingPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          setError(response.error || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <DashboardLayout userType="seeker">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#CD853F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
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
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Categories</h3>
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Find a Listener by Category
            </h1>
            <p className="text-xl text-gray-600">
              Choose a category that matches your needs to find the right listener
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="transform hover:scale-105 transition-all duration-300">
              <CategoryCard
                category={transformCategoryForCard(category)}
                href={`/dashboard/seeker/listeners/${category.slug}`}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}


