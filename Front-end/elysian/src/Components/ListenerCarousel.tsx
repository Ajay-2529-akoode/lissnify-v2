"use client"
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Phone, Users, ExternalLink } from "lucide-react";

const listeners = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    rating: 4.8,
    description: "Overcame anxiety and depression after losing my job. I understand the weight of uncertainty and can help you navigate through difficult times with empathy and understanding.",
    tags: ["Anxiety", "Career", "Depression"],
    languages: ["English", "Hindi", "Mandarin"]
  },
  {
    id: 2,
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    rating: 4.9,
    description: "Navigated through a difficult breakup and rebuilt my self-worth. Here to listen without judgment and help you rediscover your inner strength and resilience.",
    tags: ["Breakup", "Self-worth", "Healing"],
    languages: ["English", "Spanish", "French"]
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    rating: 4.7,
    description: "Survived trauma and found my voice again. I believe in the power of being heard and understood, and I'm here to provide a safe space for your healing journey.",
    tags: ["Trauma", "Recovery", "Support"],
    languages: ["English", "Spanish", "Portuguese"]
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    rating: 4.9,
    description: "Overcame social anxiety and built meaningful connections. Here to help you find your confidence and develop the social skills that will enrich your relationships.",
    tags: ["Social Anxiety", "Confidence", "Relationships"],
    languages: ["English", "Korean", "Japanese"]
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    rating: 4.7,
    description: "Survived trauma and found my voice again. I believe in the power of being heard and understood, and I'm here to provide a safe space for your healing journey.",
    tags: ["Trauma", "Recovery", "Support"],
    languages: ["English", "Spanish", "Portuguese"]
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    rating: 4.9,
    description: "Overcame social anxiety and built meaningful connections. Here to help you find your confidence and develop the social skills that will enrich your relationships.",
    tags: ["Social Anxiety", "Confidence", "Relationships"],
    languages: ["English", "Korean", "Japanese"]
  },
];

export default function FeaturedListeners() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(listeners.length / 2));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(listeners.length / 2)) % Math.ceil(listeners.length / 2));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <section className="w-full bg-yellow-50 py-20">
      {/* Content container aligned with navbar */}
      <div className="max-w-8xl mx-auto px-6 lg:px-16 xl:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">Featured Listeners</h2>
          <p className="text-2xl text-black max-w-2xl mx-auto font-medium">Real people. Lived experiences. Gentle support.</p>
        </div>

        {/* Main carousel container with navigation */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons - Outside the cards */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning || currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-14 h-14 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ChevronLeft className="w-7 h-7 text-[#FF8C5A] group-hover:text-[#e67848] transition-colors" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isTransitioning || currentIndex >= Math.ceil(listeners.length / 2) - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-14 h-14 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ChevronRight className="w-7 h-7 text-[#FF8C5A] group-hover:text-[#e67848] transition-colors" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className={`flex transition-transform duration-500 ease-out ${
                isTransitioning ? 'opacity-95' : 'opacity-100'
              }`}
              style={{
                transform: `translateX(-${currentIndex * 100}%)`
              }}
            >
              {Array.from({ length: Math.ceil(listeners.length / 2) }).map((_, slideIndex) => (
                <div key={slideIndex} className="flex gap-8 w-full flex-shrink-0 px-2">
                  {listeners.slice(slideIndex * 2, slideIndex * 2 + 2).map((listener, index) => (
                    <div 
                      key={listener.id} 
                      className="flex-1 bg-white rounded-2xl  hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
                    >
                      {/* Card Content */}
                      <div className="p-8">
                        {/* Profile Header */}
                        <div className="flex items-start gap-5 mb-6">
                          <div className="w-20 h-20 rounded-full overflow-hidden shadow-md flex-shrink-0 ring-4 ring-[#FFE0D5] group-hover:ring-[#FF8C5A] transition-all duration-300">
                            <img 
                              src={listener.avatar} 
                              alt={listener.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            {/* Name and View Profile on same line */}
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-3xl font-bold text-gray-800 group-hover:text-[#FF8C5A] transition-colors">
                                {listener.name}
                              </h3>
                              <button className="flex items-center gap-1 text-xl text-gray-500 hover:text-[#FF8C5A] transition-colors duration-300 font-medium">
                                <span>View Profile</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-5 h-5 ${
                                      i < Math.floor(listener.rating) 
                                        ? 'text-yellow-500 fill-current' 
                                        : i === Math.floor(listener.rating) && listener.rating % 1 !== 0
                                        ? 'text-yellow-500 fill-current opacity-50'
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="text-xl font-semibold text-black">{listener.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-black text-xl leading-relaxed mb-6 line-clamp-3">
                          {listener.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {listener.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="px-4 py-2 bg-gradient-to-r from-[#FFE0D5] to-[#FFF0E8] text-[#FF8C5A] text-lg font-semibold rounded-full border border-[#FFE0D5] hover:border-[#FF8C5A] transition-colors cursor-default"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons - Side by Side */}
                        <div className="flex gap-4 mb-6">
                          <button className="flex-1 py-3 px-4 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white text-lg font-semibold rounded-xl hover:from-[#e67848] hover:to-[#d06640] transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                            <Phone className="w-4 h-4" />
                            Connect via Call
                          </button>
                          <button className="flex-1 py-3 px-4 bg-white border-2 border-[#FF8C5A] text-[#FF8C5A] text-lg font-semibold rounded-xl hover:bg-[#FFE0D5] hover:border-[#e67848] transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]">
                            <Users className="w-4 h-4" />
                            Meet in Person
                          </button>
                        </div>

                        {/* Languages Section - Redesigned */}
                        <div className="border-t border-gray-100 pt-6  ">
                          <div className="flex items-center justify-between gap-4">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">Languages Spoken</h4>
                          {/* Single Connect button on the right */}
                            <button className="px-4 py-2 bg-white border-2 border-[#FF8C5A] text-[#FF8C5A] text-xl font-bold rounded-lg hover:bg-[#FFE0D5] hover:border-[#e67848] transition-all duration-300 whitespace-nowrap">
                              Connect
                            </button>
                            </div>
                          <div className="flex items-center justify-between gap-4">
                            {/* Languages pills on the left */}
                            <div className="flex flex-wrap gap-2">
                              {listener.languages.map((language) => (
                                <span 
                                  key={language} 
                                  className="px-3 py-1.5 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white text-sm font-medium rounded-full shadow-sm"
                                >
                                  {language}
                                </span>
                              ))}
                            </div>
                            
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: Math.ceil(listeners.length / 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 300);
                }
              }}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? 'w-8 h-4 bg-[#FF8C5A] shadow-md' 
                  : 'w-4 h-4 bg-white/70 hover:bg-white shadow-sm hover:scale-110'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}