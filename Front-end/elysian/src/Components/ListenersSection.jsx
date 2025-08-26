"use client"

import React, { useState } from 'react';

const ListenersSection = () => {
  // Dummy data for listeners
  const listenersData = [
    {
      id: 1,
      name: "Sarah Johnson",
      category: "Breakup",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      description: "I've healed from a tough breakup and want to help others rediscover their strength and self-worth."
    },
    {
      id: 2,
      name: "Michael Chen",
      category: "Career",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "Career transitions can be overwhelming. I'm here to guide you through professional challenges."
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      category: "Depression",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      description: "Having navigated through depression, I understand the journey and can offer compassionate support."
    },
    {
      id: 4,
      name: "David Kim",
      category: "Anxiety",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "Anxiety doesn't have to control your life. Let's work together on coping strategies that work."
    },
    {
      id: 5,
      name: "Lisa Thompson",
      category: "Relationships",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      description: "Building healthy relationships starts with understanding yourself. I'm here to help you navigate."
    },
    {
      id: 6,
      name: "James Wilson",
      category: "Stress",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      description: "Stress management is a skill that can be learned. Let me help you find your balance."
    },
    {
      id: 7,
      name: "Sophia Patel",
      category: "Breakup",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      description: "Every ending is a new beginning. I'll help you process your emotions and move forward."
    },
    {
      id: 8,
      name: "Ryan Martinez",
      category: "Career",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      description: "Career burnout is real. Let's explore strategies to reignite your passion and purpose."
    },
    {
      id: 9,
      name: "Amanda Foster",
      category: "Anxiety",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      description: "Anxiety can feel overwhelming, but you're not alone. I'm here to listen and support you."
    }
  ];

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(listenersData.map(listener => listener.category)))];
  
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter listeners based on active category
  const filteredListeners = activeCategory === "All" 
    ? listenersData 
    : listenersData.filter(listener => listener.category === activeCategory);

  // Category color mapping
  const categoryColors = {
    "Breakup": "bg-pink-100 text-pink-700 border-pink-200",
    "Career": "bg-green-100 text-green-700 border-green-200",
    "Depression": "bg-purple-100 text-purple-700 border-purple-200",
    "Anxiety": "bg-blue-100 text-blue-700 border-blue-200",
    "Relationships": "bg-rose-100 text-rose-700 border-rose-200",
    "Stress": "bg-orange-100 text-orange-700 border-orange-200"
  };

  return (
    <section className="min-h-screen bg-white  py-20 px-4 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-amber-200 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {/* <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-orange-200 to-yellow-200 text-orange-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-300">
              Professional Support
            </span>
          </div> */}
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-6 leading-tight">
            Our Listeners
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
            Connect with experienced listeners who understand your journey and are here to provide compassionate, professional support tailored to your needs.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-4 rounded-full font-semibold transition-all duration-500 transform ${
                activeCategory === category
                  ? 'bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] text-black shadow-xl scale-110 border-2 border-orange-400'
                  : 'bg-white/80 backdrop-blur-sm text-black border-2 border-orange-200/50 hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100 hover:border-orange-300 hover:shadow-lg hover:scale-105 hover:text-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Listeners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredListeners.map((listener, index) => (
            <div
              key={listener.id}
              className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-orange-200/30 hover:border-orange-300/50 relative overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Card gradient overlay */}
              <div className="absolute inset-0 bg-[#FFF8B5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <img
                      src={listener.image}
                      alt={listener.name}
                      className="w-24 h-24 rounded-full object-cover border-4 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] shadow-xl group-hover:shadow-2xl transition-all duration-500"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] p-1">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={listener.image}
                          alt={listener.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-black text-center mb-4 group-hover:text-gray-900 transition-colors duration-300">
                  {listener.name}
                </h3>

                {/* Category Badge */}
                <div className="flex justify-center mb-6">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${categoryColors[listener.category] || 'bg-gray-100 text-gray-700 border-gray-200'} group-hover:shadow-md group-hover:scale-105`}>
                    {listener.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-black text-center leading-relaxed mb-8 group-hover:text-gray-700 transition-colors duration-300">
                  {listener.description}
                </p>

                {/* Connect Button */}
                <div className="flex justify-center">
                  <button className="bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] text-black px-8 py-3 rounded-full font-semibold hover:from-orange-400 hover:to-yellow-400 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-110 border-2 border-orange-400/20 hover:border-orange-500/30">
                    Connect Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredListeners.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-orange-200/50">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-gray-600 text-xl font-medium">No listeners found for this category</p>
              <p className="text-gray-500 mt-2">Try selecting a different category above</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListenersSection;