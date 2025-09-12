"use client"

import { useState, useEffect } from "react";
import CategoryCard from "@/Components/CategoryCard";
import { getCategories, ApiCategory } from "@/utils/api";
import { getApiUrl } from "@/config/api";
import type { Category } from "@/Components/CategoryCard";

export default function CategoryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map API category to Category interface
  const mapApiCategoryToCategory = (apiCategory: ApiCategory): Category => {
    // Default colors for all categories
    const defaultColors = {
      bg: "bg-[#FFF7E9]",
      borderTop: "bg-[#FFD39B]",
      icon: "text-[#FF9800]",
      accent: "text-[#FF9800]"
    };

    return {
      id: apiCategory.slug || apiCategory.id.toString(), // Use slug as primary identifier, fallback to id
      title: apiCategory.name || 'Untitled Category',
      subtitle: apiCategory.description || 'No description available',
      supportText: apiCategory.supportText || 'We are here to support you',
      iconSrc: apiCategory.icon ? getApiUrl(`/${apiCategory.icon}`) : undefined,
      colors: defaultColors
    };
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCategories();
        
        if (response.success && response.data) {
          const mappedCategories = response.data.map(mapApiCategoryToCategory);
          setCategories(mappedCategories);
        } else {
          setError(response.error || 'Failed to fetch categories');
        }
      } catch (err) {
        setError('Network error occurred while fetching categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = Math.max(0, categories.length - itemsPerView);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [itemsPerView, isAutoPlaying]);

  const maxIndex = Math.max(0, categories.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? maxIndex : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800]"></div>
            <p className="mt-4 text-xl text-black font-semibold">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-black mb-2">Unable to load categories</h2>
            <p className="text-lg text-black/70 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-[#FF9800] text-white rounded-lg hover:bg-[#E68900] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center">
            <div className="text-gray-500 text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-bold text-black mb-2">No categories available</h2>
            <p className="text-lg text-black/70">Check back later for available support categories.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-emerald-100/30 to-cyan-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
            Explore Support Categories 
          </h2>
          <p className="text-2xl text-black max-w-2xl mx-auto leading-relaxed font-semibold">
            Connect with compassionate listeners who understand your unique needs and experiences
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/50 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300 group -translate-x-6"
            disabled={currentIndex === 0 && !isAutoPlaying}
          >
            <svg 
              className="w-6 h-6 text-slate-600 group-hover:text-slate-800 transform group-hover:-translate-x-0.5 transition-all" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/50 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300 group translate-x-6"
            disabled={currentIndex === maxIndex && !isAutoPlaying}
          >
            <svg 
              className="w-6 h-6 text-slate-600 group-hover:text-slate-800 transform group-hover:translate-x-0.5 transition-all" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="group transform transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur pointer-events-none"></div>
                      
                      <CategoryCard 
                        category={cat} 
                        href={`/listeners/${cat.id}`}
                        className="relative bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden h-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center mt-8 gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-white shadow-lg scale-110'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          {/* <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-black/70">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
            </div>
          </div> */}
        </div>

        {/* Progress bar for auto-play */}
        {/* {isAutoPlaying && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="w-full bg-white/30 rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100 ease-linear"
                style={{
                  animation: 'progress 4s linear infinite'
                }}
              ></div>
            </div>
          </div>
        )} */}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </section>
  );
}