"use client"
import React, { useState, useEffect } from 'react';
import { 
  User, 
  List, 
  Heart, 
  Users, 
  MessageCircle, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Shield,
  Lightbulb
} from 'lucide-react';

const HealingJourneyCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const steps = [
    {
      number: "01",
      title: "Sign Up & Join Safely",
      description: "Create your account with just a few clicks. Your privacy and safety are our top priority from the very first step.",
      benefit: "Quick, private signup gets you started in under 2 minutes.",
      icon: User,
      iconBg: "from-[#FFB88C] to-[#FFF8B5]",
      cardBg: "from-orange-100/60 to-amber-100/60",
      benefitBg: "from-[#FFB88C] to-[#FFF8B5]"
    },
    {
      number: "02",
      title: "Choose Your Challenge",
      description: "Select what you're going through from thoughtfully curated categories. Whether it's heartbreak, career stress, or family issues - we understand.",
      benefit: "Clear categories make it easy to find the right support.",
      icon: List,
      iconBg: "from-[#FFB88C] to-[#FFF8B5]",
      cardBg: "from-orange-100/60 to-amber-100/60",
      benefitBg: "from-[#FFB88C] to-[#FFF8B5]"
    },
    {
      number: "03",
      title: "Share Your Heart",
      description: "Express your feelings freely in a safe, judgment-free space. Tell your story at your own pace - every word matters.",
      benefit: "Safe space to be vulnerable without fear of judgment.",
      icon: Heart,
      iconBg: "from-[#FFB88C] to-[#FFF8B5]",
      cardBg: "from-orange-100/60 to-amber-100/60",
      benefitBg: "from-[#FFB88C] to-[#FFF8B5]"
    },
    {
      number: "04",
      title: "Meet Your Perfect Match",
      description: "Our thoughtful matching connects you with someone who has walked a similar path and found their way through the darkness.",
      benefit: "Matched with someone who truly understands your journey.",
      icon: Users,
      iconBg: "from-[#FFB88C] to-[#FFF8B5]",
      cardBg: "from-orange-100/60 to-amber-100/60",
      benefitBg: "from-[#FFB88C] to-[#FFF8B5]"
    },
    {
      number: "05",
      title: "Connect & Feel Heard",
      description: "Start meaningful conversations through secure chat or voice calls. Your listener provides empathy, not judgment.",
      benefit: "100% private conversations with complete confidentiality.",
      icon: MessageCircle,
      iconBg: "from-[#FFB88C] to-[#FFF8B5]",
      cardBg: "from-orange-100/60 to-amber-100/60",
      benefitBg: "from-[#FFB88C] to-[#FFF8B5]"
    },
    {
      number: "06",
      title: "Heal & Feel Supported",
      description: "Experience the relief of being truly understood. Feel lighter, supported, and ready to take the next step in your healing journey.",
      benefit: "You're not alone - feel supported every step of the way.",
      icon: Sparkles,
      iconBg: "from-[#FFB88C] to-[#FFF8B5]",
      cardBg: "from-orange-100/60 to-amber-100/60",
      benefitBg: "from-[#FFB88C] to-[#FFF8B5]"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(steps.length / getCardsPerView()));
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // Desktop: 3 cards
      if (window.innerWidth >= 768) return 2;  // Tablet: 2 cards
      return 1; // Mobile: 1 card
    }
    return 3; // Default for SSR
  };

  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCardsPerView = () => {
      setCardsPerView(getCardsPerView());
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const maxSlides = Math.ceil(steps.length / cardsPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
    setIsAutoPlaying(false);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
    setIsAutoPlaying(false);
  };

  const StepCard = ({ step, index, isVisible }) => {
    const Icon = step.icon;
    
    return (
      <div 
        className={`
          transition-all duration-700 ease-out transform 
          ${isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-8 opacity-0 scale-95'
          }
        `}
        style={{
          transitionDelay: `${(index % cardsPerView) * 100}ms`
        }}
      >
        <div className={`
          bg-gradient-to-br ${step.cardBg} backdrop-blur-sm rounded-2xl p-8 
          shadow-lg hover:shadow-2xl transition-all duration-500 
          border border-white/60 h-full flex flex-col 
          group hover:scale-105 hover:-translate-y-2
          relative overflow-hidden
        `}>
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header Section */}
            <div className="flex items-center mb-6">
              <div className={`
                w-16 h-16 rounded-full bg-gradient-to-br ${step.iconBg} 
                flex items-center justify-center mr-4 shadow-lg
                transition-all duration-500 group-hover:rotate-12 group-hover:scale-110
                border-2 border-white/70
              `}>
                <Icon className="w-8 h-8 text-white drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-orange-500 mb-1">
                  {step.number}
                </span>
              </div>
            </div>

            {/* Title and Description */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-2xl font-bold text-black mb-4 leading-tight group-hover:text-orange-600 transition-colors duration-300">
                {step.title}
              </h3>
              
              <p className="text-black text-lg leading-relaxed mb-6 flex-1">
                {step.description}
              </p>
              
              {/* Key Benefit Box */}
              <div className={`
                p-4 rounded-xl bg-gradient-to-r ${step.benefitBg} 
                border border-white/50 mt-auto
                transition-all duration-300 group-hover:shadow-md
              `}>
                <div className="flex items-center mb-2">
                  <Lightbulb className="w-4 h-4 text-orange-600 mr-2" />
                  <span className="text-orange-700 font-bold text-lg">Key Benefit</span>
                </div>
                <p className="text-black font-medium text-base leading-relaxed">
                  {step.benefit}
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-10 px-6 relative overflow-hidden bg-yellow-50">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-orange-200/20 to-yellow-200/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-rose-200/20 to-pink-200/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-amber-200/15 to-orange-200/15 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            {/* <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-orange-200/50">
              <Sparkles className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-orange-700 font-bold text-sm">Your Healing Journey</span>
            </div> */}
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
            Six Steps to Support
          </h2>
          
          <p className="text-2xl md:text-2xl text-black max-w-4xl mx-auto leading-relaxed font-medium">
            A gentle, guided path from struggle to support. Every milestone designed with care and your wellbeing in mind.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative flex items-center">
          {/* Navigation Arrows - Outside of cards */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 border border-orange-200/50"
          >
            <ChevronLeft className="w-6 h-6 text-orange-600 group-hover:text-orange-700 transition-colors" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 border border-orange-200/50"
          >
            <ChevronRight className="w-6 h-6 text-orange-600 group-hover:text-orange-700 transition-colors" />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden rounded-2xl w-full">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              {Array.from({ length: maxSlides }).map((_, slideIndex) => (
                <div 
                  key={slideIndex} 
                  className={`
                    w-full flex-shrink-0 grid gap-6
                    ${cardsPerView === 3 ? 'grid-cols-3' : cardsPerView === 2 ? 'grid-cols-2' : 'grid-cols-1'}
                  `}
                >
                  {steps.slice(slideIndex * cardsPerView, (slideIndex + 1) * cardsPerView).map((step, cardIndex) => (
                    <StepCard 
                      key={slideIndex * cardsPerView + cardIndex}
                      step={step} 
                      index={cardIndex}
                      isVisible={true}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center items-center gap-3 mt-12">
          {Array.from({ length: maxSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                transition-all duration-300 rounded-full
                ${index === currentSlide 
                  ? 'w-8 h-3 bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg' 
                  : 'w-3 h-3 bg-orange-200 hover:bg-orange-300 hover:scale-110'
                }
              `}
            >
              {index === currentSlide && (
                <div className="w-full h-full bg-gradient-to-r from-orange-600 to-amber-600 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealingJourneyCarousel;