"use client";
import React from "react";
import { Heart, Users, MessageCircle, Shield, Clock, Smile } from "lucide-react";

const features = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Emotional Support",
    description: "Connect with a compassionate community that understands your journey.",
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50/80",
    iconBg: "bg-yellow-100",
    delay: "0ms"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Peer Groups",
    description: "Join safe, moderated groups based on shared experiences and goals.",
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50/80",
    iconBg: "bg-yellow-100",
    delay: "150ms"
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Private Conversations",
    description: "Have one-on-one chats for more personal and meaningful interactions.",
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50/80",
    iconBg: "bg-yellow-100",
    delay: "300ms"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Safe & Secure",
    description: "Your data and privacy are our highest priority, always protected.",
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50/80",
    iconBg: "bg-yellow-100",
    delay: "450ms"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "24/7 Availability",
    description: "Access help and connect anytime, from anywhere in the world.",
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50/80",
    iconBg: "bg-yellow-100",
    delay: "600ms"
  },
  {
    icon: <Smile className="w-8 h-8" />,
    title: "Positive Space",
    description: "A welcoming, uplifting environment to nurture your mental health.",
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50/80",
    iconBg: "bg-yellow-100",
    delay: "750ms"
  },
];

export default function Features() {
  return (
    <section className="relative bg-yellow-50 pt-20 pb-30 px-6 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-200/15 to-orange-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-32 right-1/4 w-4 h-4 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-40 left-1/4 w-3 h-3 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
      <div className="absolute bottom-32 right-1/3 w-5 h-5 bg-white/25 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-20">
          {/* <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-[#FF8C5A] font-semibold text-sm border border-white/30">
              ✨ Why Choose Us
            </span>
          </div> */}
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-8 leading-tight">
            Features that Care for You
            

          </h2>
          
          
          <p className="max-w-4xl mx-auto text-2xl text-gray-800 leading-relaxed font-medium">
            Our platform is designed to support your mental and emotional well-being 
            through safe, friendly, and easy-to-use tools that prioritize your comfort and growth.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group ${feature.bgColor} backdrop-blur-md rounded-3xl p-8 transition-all duration-500 hover:-translate-y-4 hover:scale-105 cursor-pointer border border-white/40 hover:border-white/60 relative overflow-hidden animate-fadeInUp`}
              style={{
                animationDelay: feature.delay,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)'
              }}
            >
              {/* Hover glow effect */}
              {/* <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div> */}
              
              {/* Top accent line */}
              {/* <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-t-3xl`}></div> */}
              
              {/* Icon container */}
              <div className="relative mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.iconBg} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden`}>
                  {/* Gradient background for icon */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  {/* Icon with solid color */}
                  <div className={`relative z-10 ${
                    feature.gradient.includes('red') ? 'text-red-500' : 
                    feature.gradient.includes('blue') ? 'text-blue-500' :
                    feature.gradient.includes('green') ? 'text-green-500' :
                    feature.gradient.includes('purple') ? 'text-purple-500' :
                    feature.gradient.includes('yellow') ? 'text-orange-500' :
                    'text-cyan-500'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                </div>
                
                {/* Floating sparkle */}
                {/* <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div> */}
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed text-lg group-hover:text-gray-600 transition-colors duration-300">
                  {feature.description}
                </p>
                
                {/* Hover arrow */}
                <div className="mt-6 flex items-center text-transparent bg-gradient-to-r from-[#FF8C5A] to-[#FF6B35] bg-clip-text opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  {/* <span className="font-semibold">Learn more</span> */}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              
              {/* Bottom decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        {/* <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <span className="text-gray-700 font-semibold text-lg">Ready to start your journey?</span>
            <div className="flex items-center gap-2 text-[#FF8C5A] font-bold group-hover:gap-3 transition-all duration-300">
              <span>Get Started</span>
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF8C5A] to-[#FF6B35] rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeInUp {
            animation: none;
            opacity: 1;
          }
          .animate-bounce, .animate-pulse, .animate-ping {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}