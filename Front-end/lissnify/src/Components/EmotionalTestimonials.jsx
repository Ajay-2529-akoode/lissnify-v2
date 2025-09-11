"use client";
import React, { useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const intervalRef = useRef(null);

  const testimonials = [
    {
      quote: "I never thought I'd find people who truly understood my anxiety until I joined this community. For the first time in years, I don't feel alone in my struggles.",
      name: "Sarah M.",
      role: "Community Member",
      avatar: "S",
      color: "bg-rose-500"
    },
    {
      quote: "The gentle guidance and non-judgmental support I received here helped me through my darkest days. I'm now mentoring others and giving back to this beautiful community.",
      name: "Michael R.",
      role: "Peer Mentor", 
      avatar: "M",
      color: "bg-blue-500"
    },
    {
      quote: "This platform didn't just help me manage my depression – it taught me that healing is possible and that I deserve happiness. The community became my second family.",
      name: "Elena K.",
      role: "Wellness Advocate",
      avatar: "E", 
      color: "bg-purple-500"
    },
    {
      quote: "I was skeptical about online support, but the warmth and authenticity here changed everything. I've learned to be kinder to myself and found my voice again.",
      name: "David L.",
      role: "Recovery Journey",
      avatar: "D",
      color: "bg-green-500"
    },
    {
      quote: "After years of therapy, this community gave me something different – hope, connection, and the courage to believe in my own strength. I'm forever grateful.",
      name: "Priya S.",
      role: "Survivor & Thriver",
      avatar: "P",
      color: "bg-orange-500"
    },
    {
      quote: "The 24/7 support and understanding ears helped me through my crisis moments. Today, I'm not just surviving – I'm truly living and loving life again.",
      name: "James W.",
      role: "Community Champion",
      avatar: "J",
      color: "bg-indigo-500"
    }
  ];

  const CARDS_PER_VIEW = 3;
  const maxIndex = Math.max(0, testimonials.length - CARDS_PER_VIEW);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(nextSlide, 4500);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, maxIndex]);

  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  const getVisibleTestimonials = () => {
    return testimonials.slice(currentIndex, currentIndex + CARDS_PER_VIEW);
  };

  return (
    <section className="relative bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Healing Journeys
          </h2>
          <p className="text-2xl md:text-2xl text-black max-w-3xl mx-auto leading-relaxed font-semibold">
            Real stories from real people who found hope, healing, and connection in our supportive community.
          </p>
        </div>

        {/* Main Carousel Container */}
        <div className="relative max-w-full mx-auto">
          {/* Navigation Arrows - Positioned Outside */}
          {/* Left Arrow */}
          <button 
            onClick={prevSlide}
            className="absolute -left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 z-10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={nextSlide}
            className="absolute -right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 z-10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={currentIndex === maxIndex}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Cards Container */}
          <div 
            className="mx-16"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex gap-6">
              {getVisibleTestimonials().map((testimonial, index) => (
                <div key={currentIndex + index} className="flex-1 group">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-white/20 aspect-square flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
                    {/* Star Rating */}
                    <div className="flex gap-1 justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-4 h-4 text-amber-400 fill-current drop-shadow-sm" 
                        />
                      ))}
                    </div>

                    {/* Quote Text */}
                    <div className="flex-1 flex items-center justify-center">
                      <blockquote className="text-black text-xl leading-relaxed text-center">
                        <p className="font-semibold">"{testimonial.quote}"</p>
                      </blockquote>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100 mt-4">
                      <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white font-semibold text-lg">{testimonial.avatar}</span>
                      </div>
                      <div className="text-center">
                        <h4 className="text-black font-semibold text-lg mb-0.5">{testimonial.name}</h4>
                        <p className="text-black text-sm font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-orange-400 w-10 shadow-sm' 
                  : 'bg-gray-300 hover:bg-gray-400 w-2.5'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Status */}
        {/* <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="font-medium">{isPlaying ? 'Auto-playing' : 'Paused'} • Hover to pause</span>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default TestimonialCarousel;