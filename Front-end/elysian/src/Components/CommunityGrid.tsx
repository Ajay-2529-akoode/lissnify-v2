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
}

const communityItems: CommunityItem[] = [
  {
    id: "connect",
    title: "Connect",
    description: "with 20,000+ peers who can support and listen to you",
    Icon: Users,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: "share",
    title: "Share",
    description: "your story and talk about your struggles, freely & openly.",
    Icon: MessageCircle,
    iconBg: "bg-red-100", 
    iconColor: "text-red-600",
  },
  {
    id: "build",
    title: "Build",
    description: "a safe space where people can grow together",
    Icon: Shield,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: "cope",
    title: "Cope",
    description: "with life's challenges and share your advice with others.",
    Icon: Settings,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
];

export default function CommunitySection() {
  return (
    <section className="relative bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] py-10 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-orange-100/40 to-red-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-50/30 to-pink-50/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {/* <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full text-orange-700 text-sm font-medium mb-6 shadow-sm">
            ✨ Join Our Supportive Community
          </div> */} 
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-6 leading-tight">
            What is Elysian Community?
          </h2>
          <p className="text-black text-2xl max-w-3xl mx-auto leading-relaxed font-semibold">
            We're a judgement-free, virtual support group for different mental health concerns where members support each other on their mental health journeys.
          </p>
        </div>

        {/* Community Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {communityItems.map((item, index) => {
            const { Icon } = item;
            return (
              <div
                key={item.id}
                className="flex items-start gap-6 group cursor-pointer"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards',
                  opacity: 0,
                  transform: 'translateY(30px)'
                }}
              >
                {/* Icon Container with enhanced styling */}
                <div className="relative">
                  <div className={`
                    flex-shrink-0 w-20 h-20 rounded-2xl ${item.iconBg} 
                    flex items-center justify-center shadow-lg
                    group-hover:scale-110 group-hover:shadow-xl 
                    group-hover:rotate-3 transition-all duration-500
                    border border-white/50
                  `}>
                    <Icon className={`w-10 h-10 ${item.iconColor}`} strokeWidth={1.8} />
                  </div>
                  {/* Subtle glow effect */}
                  <div className={`absolute inset-0 w-20 h-20 rounded-2xl ${item.iconBg} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}></div>
                </div>

                {/* Content with enhanced styling */}
                <div className="flex-1 pt-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center mt-20">
          {/* <div className="inline-flex flex-wrap justify-center items-center gap-8 px-8 py-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3 group">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium group-hover:text-green-600 transition-colors">Active Discussions</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Safe Spaces</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span className="text-gray-700 font-medium group-hover:text-purple-600 transition-colors">24/7 Support</span>
            </div>
          </div> */}
          
          {/* Additional CTA button */}
          <div className="mt-8">
            <Link href="/community" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF8C5A] to-[#FF6B35] hover:from-orange-400 hover:to-red-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <span>Join Community Today</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}