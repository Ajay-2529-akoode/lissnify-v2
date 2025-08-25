// "use client"

import React from 'react';
import { Heart, Shield, Users, MessageCircle, DollarSign, Sparkles } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Heart,
      title: "Real Listeners, Real Experiences",
      description: "You connect with people who've truly been through similar struggles and understand your journey.",
      color: "text-rose-500"
    },
    {
      icon: Shield,
      title: "Safe & Confidential",
      description: "Your conversations stay private, always. We protect your trust with the highest security standards.",
      color: "text-emerald-500"
    },
    {
      icon: Users,
      title: "Personalized Matches",
      description: "Our smart algorithm pairs you with the right listener for your specific needs—breakup, career, anxiety, and more.",
      color: "text-blue-500"
    },
    {
      icon: MessageCircle,
      title: "Judgment-Free Zone",
      description: "Share freely without fear of being judged. This is your safe space to be completely authentic.",
      color: "text-purple-500"
    },
    {
      icon: DollarSign,
      title: "Affordable & Accessible",
      description: "Quality support for everyone, anytime. We believe healing shouldn't be a luxury.",
      color: "text-amber-500"
    },
    {
      icon: Sparkles,
      title: "Healing Community",
      description: "More than just conversations—it's a warm space where you truly feel understood and less alone.",
      color: "text-indigo-500"
    }
  ];

  return (
    <section className="py-10 px-4 bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] min-h-screen">
      <div className="max-w-6xl mx-auto">
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-white/50 overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                {/* Icon */}
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-inner mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-gray-100">
                  <IconComponent className={`w-10 h-10 ${reason.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-slate-800 mb-5 group-hover:text-slate-900 transition-colors leading-tight">
                    {reason.title}
                  </h3>
                  <p className="text-black leading-relaxed text-lg font-light group-hover:text-slate-700 transition-colors">
                    {reason.description}
                  </p>

                  {/* Enhanced accent element */}
                  <div className="flex items-center mt-8 gap-2">
                    <div className={`w-16 h-1.5 ${reason.color.replace('text-', 'bg-')} rounded-full opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-500`}></div>
                    <div className={`w-2 h-2 ${reason.color.replace('text-', 'bg-')} rounded-full opacity-40 group-hover:opacity-80 transition-all duration-300`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-24">
          <div className="relative inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm px-10 py-6 rounded-full shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Heart className="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-slate-700 font-semibold text-lg relative">
              Ready to start your healing journey?
            </span>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default WhyChooseUs;