"use client"

import Link from "next/link";
import { Users, MessageCircle, Shield, Settings } from "lucide-react";

interface CommunityItem {
  id: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  gradient: string;
}

const communityItems: CommunityItem[] = [
  {
    id: "connect",
    title: "Connect",
    description: "with 20,000+ peers who can support and listen to you",
    Icon: Users,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    gradient: "from-orange-50 to-orange-100/50",
  },
  {
    id: "share",
    title: "Share",
    description: "your story and talk about your struggles, freely & openly.",
    Icon: MessageCircle,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    gradient: "from-orange-50 to-orange-100/50",
  },
  {
    id: "build",
    title: "Build",
    description: "Building bonds that empower growth and healing.",
    Icon: Shield,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    gradient: "from-orange-50 to-orange-100/50",
  },
  {
    id: "cope",
    title: "Cope",
    description: "with life's challenges and share your advice with others.",
    Icon: Settings,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    gradient: "from-orange-50 to-orange-100/50",
  },
];

export default function CommunitySection() {
  return (
    <section className="relative bg-gradient-to-br from-yellow-50 via-orange-25 to-red-25 py-20 overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Multiple layered gradients for depth */}
        <div className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-orange-200/30 via-red-200/20 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-200/25 via-purple-200/20 to-indigo-200/25 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(255,184,140,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,248,181,0.1)_0%,_transparent_50%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          {/* <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-orange-700 text-sm font-semibold mb-8 shadow-lg border border-orange-200/50">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Join Our Supportive Community
          </div> */}
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-black to-black bg-clip-text text-transparent mb-8 leading-tight">
            What is Lissnify Community?
          </h2>
          
          <div className="relative">
            <p className="text-gray-700 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-medium">
              We're a <span className="text-orange-600 font-semibold">judgement-free</span>, virtual support group for different mental health concerns where members 
              <span className="text-orange-600 font-semibold"> support each other</span> on their mental health journeys.
            </p>
            {/* <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div> */}
          </div>
        </div>

        {/* Enhanced Community Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {communityItems.map((item) => {
            const { Icon } = item;
            return (
              <div
                key={item.id}
                className="group relative"
              >
                {/* Card background with gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${item.gradient} 
                  rounded-3xl opacity-60 group-hover:opacity-80 
                  transition-opacity duration-300 blur-sm
                `}></div>
                
                {/* Main card */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start gap-6">
                    {/* Enhanced Icon Container */}
                    <div className="relative">
                      <div className={`
                        flex-shrink-0 w-16 h-16 rounded-2xl ${item.iconBg} 
                        flex items-center justify-center shadow-lg
                        group-hover:shadow-xl transition-all duration-300
                        border-2 border-white/80
                        relative overflow-hidden
                      `}>
                        <Icon className={`w-8 h-8 ${item.iconColor} relative z-10`} strokeWidth={2} />
                        
                        {/* Subtle shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                      </div>
                      
                      {/* Floating accent */}
                      <div className={`absolute -top-1 -right-1 w-4 h-4 ${item.iconBg} rounded-full border-2 border-white shadow-sm`}></div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="flex-1 pt-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg md:text-xl group-hover:text-gray-700 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle corner accent */}
                  <div className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-br ${item.gradient} rounded-full opacity-60`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          {/* Stats or features row */}
          {/* <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-10">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-green-200/50">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Active Discussions</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-blue-200/50">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Safe Spaces</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-purple-200/50">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">24/7 Support</span>
            </div>
          </div> */}
          
          {/* Enhanced CTA button */}
          <Link href="/community" className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-[#FFB88C] via-[#FFCC70] to-[#FFF8B5] hover:from-[#FFF8B5] hover:to-[#FFB88C] text-black font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/50 relative overflow-hidden">
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <span className="relative z-10">Join Community Today</span>
            <svg className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          {/* Trust indicators */}
          {/* <p className="text-gray-500 text-sm mt-6 max-w-md mx-auto">
            Join thousands of members in our supportive community. 
            <span className="text-orange-600 font-semibold">100% free</span> and always will be.
          </p> */}
        </div>
      </div>
    </section>
  );
}