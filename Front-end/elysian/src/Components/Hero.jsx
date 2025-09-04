// components/Hero.tsx
"use client"
import Link from "next/link";
import { Heart, Sparkles, HeartHandshake, Ear } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] pt-10 pb-20 text-black overflow-hidden min-h-screen">
      {/* Background Illustration with Reflection Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main Background Image */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2  h-full flex items-center justify-center opacity-15">
          <img 
            src="/EmotionalSupport.png" 
            alt="People connecting and supporting each other"
            className="w-full h-auto max-h-[80%] object-contain"
          />
        </div>
        
        {/* Left Reflection Effect */}
        {/* <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -scale-x-100 w-1/3 h-full flex items-center justify-end opacity-50">
          <img 
            src="/EmotionalSupport.png" 
            alt=""
            className="w-full h-auto max-h-[60%] object-contain blur-sm"
          />
        </div> */}
        
        {/* Right Glow Effect */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-full flex items-center justify-center opacity-15">
          <div className="w-full h-full bg-gradient-to-l from-white/30 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Custom CSS for glass effect + underline animation */}
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 20px;
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: rgba(0, 0, 0, 0.1) 0px 0.25rem 0.75rem;
          padding: 2rem;
        }

        .underline-animate {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }

        .underline-animate::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 0%;
          height: 2px;
          background-color: black;
          transition: width 0.3s ease-in-out;
        }

        .underline-animate:hover::after {
          width: 100%;
        }

        .text-shadow-soft {
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Main Content - Centered */}
      <div className="relative z-10 h-full">
        <div className="flex items-center justify-center px-4 py-8">
          <div className="text-center space-y-8 max-w-5xl w-full">
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-shadow-soft">
              <span className="text-white drop-shadow-lg">Find Support. </span>
              <span className="text-black">Share Balance</span>
            </h1>

            {/* Subheadline */}
            <p className="text-2xl text-gray-800 leading-relaxed max-w-3xl mx-auto text-shadow-soft font-medium">
              Lissnify is your safe space to heal, share, and grow. 
              <span className="font-bold"> Seekers</span> find empathy, and 
              <span className="font-bold"> Listeners</span> offer their light — 
              together we create hope and resilience.
            </p>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Seeker Card */}
              <Link href="/signup?role=seeker" className="group">
                <div className="glass-card transition-all duration-300 cursor-pointer border-t-4 border-[#FF8C5A] hover:transform hover:scale-105 hover:shadow-2xl h-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <HeartHandshake className="w-12 h-12 text-[#FF8C5A] drop-shadow-lg" />
                  </div>
                  <h3 className="text-3xl font-bold text-black text-center mb-4">Support Seeker</h3>
                  <p className="mt-3 text-black text-lg opacity-90 text-center flex-grow leading-relaxed">
                    Connect with people who understand your journey. Find empathy, clarity, and comfort.
                  </p>
                  <div className="text-center mt-6">
                    <span className="inline-block text-black font-medium underline-animate text-xl">
                      I Need Support →
                    </span>
                  </div>
                </div>
              </Link>

              {/* Listener Card */}
              <Link href="/signup?role=listener" className="group">
                <div className="glass-card transition-all duration-300 cursor-pointer border-t-4 border-[#FF8C5A] hover:transform hover:scale-105 hover:shadow-2xl h-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <Ear className="w-12 h-12 text-[#FF8C5A] drop-shadow-lg" />
                  </div>
                  <h3 className="text-3xl font-bold text-black text-center mb-4">Listener with Empathy</h3>
                  <p className="mt-3 text-black text-lg opacity-90 text-center flex-grow leading-relaxed">
                    Guide others through their struggles with the wisdom of your own experiences.
                  </p>
                  <div className="text-center mt-6">
                    <span className="inline-block text-black font-medium underline-animate text-xl">
                      I Want to Listen →
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 flex-wrap justify-center text-xl ">
              <Link href="/signup?role=seeker">
                <button className="px-6 py-3 rounded-full bg-[#FF8C5A] text-white font-semibold hover:bg-[#e67848] transition transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Join as a Seeker
                </button>
              </Link>
              <Link href="/signup?role=listener">
                <button className="px-6 py-3 rounded-full bg-white border-2 border-[#FF8C5A] text-[#FF8C5A] font-semibold hover:bg-[#FFE0D5] transition transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Join as a Listener
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Image - Only visible on small screens */}
        <div className="lg:hidden mt-12 flex justify-center relative z-10 px-4">
          <img 
            src="/EmotionalSupport.png" 
            alt="People connecting and supporting each other"
            className="w-full max-w-md h-auto object-contain opacity-80"
          />
        </div>
      </div>
    </section>
  );
}