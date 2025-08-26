'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Users, 
  Briefcase, 
  Brain, 
  Frown, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles,
  Star,
  Leaf,
  Sun,
  Smile,
  HandHeart,
  Shield
} from 'lucide-react';

const MentalHealthCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const router = useRouter();

  const categories = [
    {
      id: "breakup",
      title: "Breakup",
      subtitle: "1 out of every 4 people",
      description: "has faced a breakup",
      supportText: "It's okay to face a breakup",
      encouragement: "You're not alone!",
      icon: Heart,
      gradient: "from-[#E91E63] via-[#F06292] to-[#FF5722]",
      glowColor: "shadow-[#E91E63]/30",
      borderColor: "border-[#E91E63]/30",
      hoverBorderColor: "hover:border-[#E91E63]",
      bgAccent: "bg-[#E91E63]/10"
    },
    {
      id: "relationship",
      title: "Relationship Issues",
      subtitle: "1 out of every 3 people",
      description: "is facing relationship challenges",
      supportText: "It's okay to have relationship issues",
      encouragement: "You're not alone!",
      icon: Users,
      gradient: "from-[#9C27B0] via-[#BA68C8] to-[#673AB7]",
      glowColor: "shadow-[#9C27B0]/30",
      borderColor: "border-[#9C27B0]/30",
      hoverBorderColor: "hover:border-[#9C27B0]",
      bgAccent: "bg-[#9C27B0]/10"
    },
    {
      id: "loneliness",
      title: "Loneliness",
      subtitle: "1 out of every 2 people",
      description: "has faced loneliness",
      supportText: "It's okay to feel lonely",
      encouragement: "You're not alone!",
      icon: Frown,
      gradient: "from-[#4CAF50] via-[#66BB6A] to-[#81C784]",
      glowColor: "shadow-[#4CAF50]/30",
      borderColor: "border-[#4CAF50]/30",
      hoverBorderColor: "hover:border-[#4CAF50]",
      bgAccent: "bg-[#4CAF50]/10"
    },
    {
      id: "career",
      title: "Career Stress",
      subtitle: "1 out of every 3 people",
      description: "is struggling with career stress",
      supportText: "It's okay to feel overwhelmed about career",
      encouragement: "You're not alone!",
      icon: Briefcase,
      gradient: "from-[#FF9800] via-[#FFB74D] to-[#F57C00]",
      glowColor: "shadow-[#FF9800]/30",
      borderColor: "border-[#FF9800]/30",
      hoverBorderColor: "hover:border-[#FF9800]",
      bgAccent: "bg-[#FF9800]/10"
    },
    {
      id: "anxiety",
      title: "Anxiety",
      subtitle: "1 out of every 5 people",
      description: "experiences anxiety",
      supportText: "It's okay to feel anxious",
      encouragement: "You're not alone!",
      icon: Brain,
      gradient: "from-[#3F51B5] via-[#5C6BC0] to-[#7986CB]",
      glowColor: "shadow-[#3F51B5]/30",
      borderColor: "border-[#3F51B5]/30",
      hoverBorderColor: "hover:border-[#3F51B5]",
      bgAccent: "bg-[#3F51B5]/10"
    },
    {
      id: "depression",
      title: "Depression",
      subtitle: "1 out of every 6 people",
      description: "battles with depression",
      supportText: "It's okay to feel depressed",
      encouragement: "You're not alone!",
      icon: Frown,
      gradient: "from-[#607D8B] via-[#78909C] to-[#90A4AE]",
      glowColor: "shadow-[#607D8B]/30",
      borderColor: "border-[#607D8B]/30",
      hoverBorderColor: "hover:border-[#607D8B]",
      bgAccent: "bg-[#607D8B]/10"
    },
    {
      id: "suicidal",
      title: "Suicidal Thoughts",
      subtitle: "1 out of every 10 people",
      description: "has experienced suicidal thoughts",
      supportText: "It's okay to have these thoughts - reach out",
      encouragement: "You're not alone!",
      icon: AlertTriangle,
      gradient: "from-[#F44336] via-[#EF5350] to-[#E53935]",
      glowColor: "shadow-[#F44336]/30",
      borderColor: "border-[#F44336]/30",
      hoverBorderColor: "hover:border-[#F44336]",
      bgAccent: "bg-[#F44336]/10"
    },
    {
      id: "trauma",
      title: "Trauma",
      subtitle: "1 out of every 4 people",
      description: "has experienced trauma",
      supportText: "It's okay to seek help for trauma",
      encouragement: "You're not alone!",
      icon: Heart,
      gradient: "from-[#FF8F00] via-[#FFB300] to-[#FFA000]",
      glowColor: "shadow-[#FF8F00]/30",
      borderColor: "border-[#FF8F00]/30",
      hoverBorderColor: "hover:border-[#FF8F00]",
      bgAccent: "bg-[#FF8F00]/10"
    }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    router.push(`/support/${category.id}`);
  };

  return (
    <section className="bg-gradient-to-br from-[#FFF8F0] via-[#FFE4CC] to-[#F0E6FF] min-h-screen py-20 relative overflow-hidden">
      
      {/* Floating background elements matching hero style */}
      <div className="absolute top-16 left-8 opacity-70 animate-pulse">
        <Star className="w-8 h-8 text-[#E91E63] drop-shadow-sm" />
      </div>
      <div className="absolute top-32 right-16 opacity-60 animate-bounce">
        <Sparkles className="w-12 h-12 text-[#4CAF50] drop-shadow-sm" />
      </div>
      <div className="absolute bottom-40 left-16 opacity-65 animate-pulse">
        <Heart className="w-10 h-10 text-[#E91E63] drop-shadow-sm" />
      </div>
      <div className="absolute top-1/3 right-8 opacity-55 animate-bounce">
        <Leaf className="w-6 h-6 text-[#4CAF50] drop-shadow-sm" />
      </div>
      <div className="absolute top-2/3 left-1/4 opacity-60 animate-pulse">
        <Sun className="w-14 h-14 text-[#FF9800] drop-shadow-sm" />
      </div>
      <div className="absolute bottom-20 right-1/4 opacity-65 animate-bounce">
        <Smile className="w-8 h-8 text-[#9C27B0] drop-shadow-sm" />
      </div>

      {/* Soft organic background shapes */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-[#FFE4CC]/20 to-[#F8BBD9]/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-32 w-56 h-56 bg-gradient-to-br from-[#F0E6FF]/20 to-[#C8E6C9]/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-8 w-32 h-32 bg-gradient-to-br from-[#FFF3E0]/15 to-[#FFE4CC]/10 rounded-full blur-2xl animate-pulse"></div>

      <div className="container mx-auto px-6 max-w-8xl">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-8 px-8 py-4 rounded-full bg-white/95 backdrop-blur-sm border-2 border-[#FFE4CC] shadow-lg">
            <Heart className="w-5 h-5 text-[#E91E63] animate-pulse" />
            <span className="text-[#2E2E2E] font-semibold text-sm tracking-wider">MENTAL HEALTH SUPPORT</span>
            <Users className="w-5 h-5 text-[#4CAF50] animate-pulse" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-[#2E2E2E] leading-tight mb-8 drop-shadow-sm">
            You Are 
            <span className="block text-transparent bg-gradient-to-r from-[#E91E63] via-[#9C27B0] to-[#4CAF50] bg-clip-text font-extrabold">
              Not Alone
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-[#2E2E2E] max-w-4xl mx-auto leading-relaxed font-medium">
            Whatever you're going through, there are others who understand. Find your community and get the support you deserve.
          </p>
        </div>

        {/* Enhanced Cards Grid - Larger Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            const isHovered = hoveredCard === category.id;
            const isSelected = selectedCategory === category.id;
            
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  group cursor-pointer transform transition-all duration-500 ease-out
                  hover:scale-110 hover:-translate-y-6 
                  ${isSelected ? 'scale-110 -translate-y-6' : ''}
                  ${isHovered ? 'z-20' : 'z-10'}
                `}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 150}ms both`
                }}
              >
                <div className={`
                  relative h-[500px] w-full bg-white/95 backdrop-blur-sm rounded-3xl p-10 
                  border-3 ${category.borderColor} ${category.hoverBorderColor}
                  shadow-2xl ${isHovered ? category.glowColor + ' shadow-2xl' : 'shadow-xl'}
                  transition-all duration-500 overflow-hidden
                  ${isSelected ? `ring-4 ring-[#2E2E2E]/20 ${category.glowColor}` : ''}
                `}>
                  
                  {/* Background pattern */}
                  <div className={`absolute inset-0 ${category.bgAccent} rounded-3xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
                  
                  {/* Glowing orb effect */}
                  <div className={`
                    absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${category.gradient} 
                    rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700
                  `}></div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    
                    {/* Top section with icon and stats */}
                    <div className="flex items-start justify-between mb-8">
                      <div className={`
                        relative p-5 rounded-2xl bg-gradient-to-br ${category.gradient}
                        shadow-xl transform transition-all duration-500
                        ${isHovered ? 'scale-125 rotate-6 shadow-2xl' : 'scale-100 rotate-0'}
                      `}>
                        <IconComponent className="w-10 h-10 text-white relative z-10 drop-shadow-sm" />
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-base font-bold text-[#2E2E2E] mb-2 leading-tight">{category.subtitle}</div>
                        <div className="text-sm text-[#555] leading-tight">{category.description}</div>
                      </div>
                    </div>
                    
                    {/* Title section */}
                    <div className="flex-grow flex flex-col justify-center mb-8">
                      <h3 className={`
                        text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-6 leading-tight
                        transition-all duration-300
                        ${isHovered ? 'text-transparent bg-gradient-to-r bg-clip-text ' + category.gradient : ''}
                      `}>
                        {category.title}
                      </h3>
                      
                      <p className="text-[#555] leading-relaxed text-lg mb-6 font-medium">
                        {category.supportText}
                      </p>
                    </div>
                    
                    {/* Bottom section */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xl font-bold text-[#2E2E2E]">
                          {category.encouragement}
                        </span>
                        
                        <div className={`
                          transform transition-all duration-300
                          ${isHovered ? 'translate-x-0 opacity-100 scale-125' : 'translate-x-4 opacity-0'}
                        `}>
                          <ArrowRight className="w-8 h-8 text-[#2E2E2E]" />
                        </div>
                      </div>
                      
                      {/* Enhanced progress bar */}
                      <div className="h-2 bg-[#2E2E2E]/10 rounded-full overflow-hidden shadow-inner">
                        <div className={`
                          h-full rounded-full bg-gradient-to-r ${category.gradient}
                          transition-all duration-1000 ease-out transform
                          ${isHovered ? 'w-full scale-y-150 shadow-lg' : 'w-0'}
                        `}></div>
                      </div>
                      
                      {/* Pulse indicator */}
                      <div className={`
                        absolute bottom-6 right-6 w-4 h-4 rounded-full
                        bg-gradient-to-r ${category.gradient} 
                        transition-all duration-500
                        ${isHovered ? 'opacity-100 animate-ping scale-150' : 'opacity-0'}
                      `}></div>
                    </div>
                  </div>
                  
                  {/* Shimmer effect on hover */}
                  <div className={`
                    absolute inset-0 -translate-x-full group-hover:translate-x-full
                    bg-gradient-to-r from-transparent via-white/30 to-transparent
                    transition-transform duration-1000 ease-in-out
                    skew-x-12
                  `}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="text-center">
          <p className="text-xl md:text-2xl text-[#2E2E2E] mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            Click on any category above to connect with others who understand your journey and find the support you deserve.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              { text: "Anonymous & Safe", gradient: "from-[#4CAF50] to-[#66BB6A]", icon: Shield, bg: "bg-[#4CAF50]/10", border: "border-[#4CAF50]/30" },
              { text: "24/7 Support", gradient: "from-[#FF9800] to-[#FFB74D]", icon: Sun, bg: "bg-[#FF9800]/10", border: "border-[#FF9800]/30" },
              { text: "Peer Community", gradient: "from-[#E91E63] to-[#F06292]", icon: Users, bg: "bg-[#E91E63]/10", border: "border-[#E91E63]/30" },
              { text: "Professional Guidance", gradient: "from-[#9C27B0] to-[#BA68C8]", icon: Brain, bg: "bg-[#9C27B0]/10", border: "border-[#9C27B0]/30" }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`
                  group flex items-center gap-4 px-8 py-5 rounded-full
                  ${item.bg} backdrop-blur-sm border-2 ${item.border}
                  hover:bg-white/95 hover:scale-110 hover:shadow-2xl
                  hover:border-[#2E2E2E]/30 transition-all duration-300 cursor-pointer
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-3 rounded-full bg-gradient-to-r ${item.gradient} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[#2E2E2E] font-bold text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced colorful glow at bottom */}
        <div className="mt-20 w-full h-4 bg-gradient-to-r from-[#E91E63]/40 via-[#FF9800]/50 to-[#4CAF50]/40 rounded-full blur-sm shadow-xl"></div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default MentalHealthCategories;