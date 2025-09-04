"use client"

import React, { useState, useEffect } from 'react';
import { Heart, Shield, Users, MessageCircle, DollarSign, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const WhyChooseUs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  const reasons = [
    {
      icon: Heart,
      title: "Real Listeners, Real Experiences",
      description: "You connect with people who've truly been through similar struggles and understand your journey.",
      color: "text-amber-500",
      gradient: "from-amber-500/20 via-yellow-500/15 to-orange-500/10",
      bgGradient: "from-amber-50 via-yellow-50 to-orange-50"
    },
    {
      icon: Shield,
      title: "Safe & Confidential",
      description: "Your conversations stay private, always. We protect your trust with the highest security standards.",
      color: "text-amber-500",
      gradient: "from-amber-500/20 via-yellow-500/15 to-orange-500/10",
      bgGradient: "from-amber-50 via-yellow-50 to-orange-50"
    },
    {
      icon: Users,
      title: "Personalized Matches",
      description: "Our smart algorithm pairs you with the right listener for your specific needs—breakup, career, anxiety, and more.",
      color: "text-amber-500",
      gradient: "from-amber-500/20 via-yellow-500/15 to-orange-500/10",
      bgGradient: "from-amber-50 via-yellow-50 to-orange-50"
    },
    {
      icon: MessageCircle,
      title: "Judgment-Free Zone",
      description: "Share freely without fear of being judged. This is your safe space to be completely authentic.",
      color: "text-amber-500",
      gradient: "from-amber-500/20 via-yellow-500/15 to-orange-500/10",
      bgGradient: "from-amber-50 via-yellow-50 to-orange-50"
    },
    {
      icon: DollarSign,
      title: "Affordable & Accessible",
      description: "Quality support for everyone, anytime. We believe healing shouldn't be a luxury.",
      color: "text-amber-500",
      gradient: "from-amber-500/20 via-yellow-500/15 to-orange-500/10",
      bgGradient: "from-amber-50 via-yellow-50 to-orange-50"
    },
    {
      icon: Sparkles,
      title: "Healing Community",
      description: "More than just conversations—it's a warm space where you truly feel understood and less alone.",
      color: "text-amber-500",
      gradient: "from-amber-500/20 via-yellow-500/15 to-orange-500/10",
      bgGradient: "from-amber-50 via-yellow-50 to-orange-50"
    }
  ];

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3);
      } else if (window.innerWidth >= 768) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + cardsPerView >= reasons.length ? 0 : prev + cardsPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, reasons.length - cardsPerView) : Math.max(0, prev - cardsPerView)
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const maxIndex = Math.max(0, reasons.length - cardsPerView);

  return (
    <section className="py-20 px-4 bg-yellow-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
            Why Choose Elysian?
          </h2>
          <p className="text-2xl md:text-2xl text-black max-w-3xl mx-auto leading-relaxed font-semibold">
            We're not just another platform. We're a community built on empathy, trust, and genuine human connection. 
            Here's what makes us different.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-gray-200/50"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors duration-200" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-gray-200/50"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors duration-200" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)`
              }}
            >
              {reasons.map((reason, index) => {
                const IconComponent = reason.icon;
                return (
                  <div
                    key={index}
                    className={`flex-shrink-0 px-4 ${
                      cardsPerView === 1 ? 'w-full' : 
                      cardsPerView === 2 ? 'w-1/2' : 'w-1/3'
                    }`}
                  >
                    <div className="group relative cursor-pointer h-full">
                      {/* Enhanced glow effect */}
                      <div className={`absolute -inset-1 bg-gradient-to-r ${reason.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-lg`}></div>
                      
                      {/* Main card with fixed height */}
                      <div className="relative bg-white/98 backdrop-blur-xl rounded-3xl p-8 lg:p-10  transition-all duration-700 transform hover:-translate-y-1  border border-white/70 overflow-hidden h-96 flex flex-col">
                        
                        {/* Dynamic background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${reason.bgGradient} opacity-0 group-hover:opacity-40 transition-opacity duration-700`}></div>
                        
                        {/* Animated mesh background */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                          <div className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-20`}></div>
                          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-8 -translate-y-8 group-hover:animate-pulse"></div>
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform -translate-x-4 translate-y-4"></div>
                          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full blur-xl transform -translate-x-12 -translate-y-12"></div>
                        </div>

                        {/* Floating sparkle effects */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                          <div className={`absolute top-8 right-10 w-1.5 h-1.5 ${reason.color.replace('text-', 'bg-')} rounded-full animate-ping`}></div>
                          <div className={`absolute top-16 right-6 w-1 h-1 ${reason.color.replace('text-', 'bg-')} rounded-full animate-pulse`} style={{animationDelay: '0.3s'}}></div>
                          <div className={`absolute top-12 right-16 w-0.5 h-0.5 ${reason.color.replace('text-', 'bg-')} rounded-full animate-ping`} style={{animationDelay: '0.8s'}}></div>
                          <div className={`absolute top-20 right-12 w-0.5 h-0.5 ${reason.color.replace('text-', 'bg-')} rounded-full animate-pulse`} style={{animationDelay: '1.2s'}}></div>
                        </div>
                        
                        {/* Icon container with premium styling */}
                        <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-white via-gray-50/90 to-white shadow-xl mb-6 group-hover:scale-115 group-hover:rotate-6 transition-all duration-700 border border-gray-100/90 group-hover:border-white group-hover:shadow-2xl">
                          {/* Multi-layered icon glow */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${reason.gradient} rounded-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 blur-xl`}></div>
                          <div className={`absolute inset-2 bg-gradient-to-r ${reason.gradient} rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-lg`}></div>
                          <IconComponent className={`relative w-12 h-12 ${reason.color} group-hover:scale-100 group-hover:drop-shadow-xl transition-all duration-500 group-hover:animate-pulse`} />
                        </div>

                        {/* Content with flex-grow to fill space */}
                        <div className="relative z-10 flex-grow flex flex-col">
                          <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-4 group-hover:text-slate-900 transition-colors duration-300 leading-tight">
                            {reason.title}
                          </h3>
                          <p className="text-slate-700 leading-relaxed text-base lg:text-lg font-normal group-hover:text-slate-800 transition-colors duration-300 flex-grow">
                            {reason.description}
                          </p>

                          {/* Enhanced accent elements at bottom */}
                          <div className="flex items-center mt-6 gap-4">
                            <div className={`h-2 ${reason.color.replace('text-', 'bg-')} rounded-full transition-all duration-700 w-16 group-hover:w-28 group-hover:shadow-lg group-hover:shadow-${reason.color.split('-')[1]}-500/25`}></div>
                            <div className={`w-3 h-3 ${reason.color.replace('text-', 'bg-')} rounded-full transition-all duration-500 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-${reason.color.split('-')[1]}-500/50`}></div>
                            <div className={`w-2 h-2 ${reason.color.replace('text-', 'bg-')} rounded-full opacity-70 transition-all duration-700 group-hover:opacity-100 group-hover:scale-125`}></div>
                            <div className={`w-1 h-1 ${reason.color.replace('text-', 'bg-')} rounded-full opacity-50 transition-all duration-500 group-hover:opacity-80 group-hover:scale-150`}></div>
                          </div>
                        </div>

                        {/* Premium border highlight */}
                        <div className={`absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r ${reason.gradient} opacity-0 group-hover:opacity-30 transition-all duration-700 pointer-events-none`} style={{mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'xor'}}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-12 gap-3">
            {Array.from({ length: Math.ceil(reasons.length / cardsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index * cardsPerView)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / cardsPerView) === index
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg scale-125'
                    : 'bg-white/60 hover:bg-white/80 shadow-md hover:scale-110'
                } border border-white/50`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA with enhanced styling */}
        {/* <div className="text-center mt-20"> */}
          {/* <div className="relative inline-flex items-center gap-4 bg-white/95 backdrop-blur-xl px-12 py-8 rounded-full shadow-xl border border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-500 group cursor-pointer"> */}
            {/* Multi-layered glow effect */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-orange-500/15 to-amber-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400/10 via-orange-400/10 to-amber-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <Heart className="w-7 h-7 text-rose-500 group-hover:scale-125 group-hover:text-rose-600 transition-all duration-400 relative z-10" />
            <span className="text-slate-700 font-bold text-xl relative z-10 group-hover:text-slate-900 transition-colors duration-300">
              Ready to start your healing journey?
            </span>
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-pulse relative z-10 group-hover:scale-125 transition-transform duration-300"></div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default WhyChooseUs;