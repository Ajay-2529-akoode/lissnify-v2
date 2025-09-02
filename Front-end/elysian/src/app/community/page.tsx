
"use client"

import Navbar from "@/Components/Navbar";
import { 
  Users, 
  Heart, 
  Shield, 
  BookOpen, 
  MessageCircle, 
  Users2, 
  Calendar, 
  FileText,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function CommunityPage() {
  // Why Join Community data
  const benefits = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Share your experiences in a protected environment where privacy and respect are paramount."
    },
    {
      icon: Heart,
      title: "Empathetic Support",
      description: "Connect with people who truly understand your journey and offer genuine compassion."
    },
    {
      icon: Users,
      title: "Peer Connection",
      description: "Build meaningful relationships with others who share similar experiences and challenges."
    },
    {
      icon: BookOpen,
      title: "Growth Together",
      description: "Learn from others' experiences and contribute to collective healing and personal development."
    }
  ];

  // Community Features data
  const features = [
    {
      icon: MessageCircle,
      title: "Discussion Rooms",
      description: "Safe forums for open conversations about mental health topics and personal experiences."
    },
    {
      icon: Users2,
      title: "Peer Support Groups",
      description: "Join specialized groups based on your needs and connect with like-minded individuals."
    },
    {
      icon: Calendar,
      title: "Events & Workshops",
      description: "Participate in virtual and in-person events focused on mental wellness and personal growth."
    },
    {
      icon: FileText,
      title: "Mental Health Resources",
      description: "Access curated articles, tools, and resources to support your mental health journey."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-emerald-100/30 to-cyan-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles className="w-5 h-5 text-[#8B4513]" />
              <span className="text-[#8B4513] font-semibold">Join Our Growing Community</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
              Welcome to the{" "}
              <span className="text-transparent bg-gradient-to-r from-[#8B4513] to-[#CD853F] bg-clip-text">
                Elysian Community
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-black/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              A safe and supportive space where you can share, heal, and grow with others who understand your journey.
            </p>
            
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-bold text-xl rounded-2xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl">
              Join the Community
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Join Community Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Why Join the Community?
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Discover the benefits of being part of a supportive network that truly understands mental health challenges.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 h-full transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-[#8B4513]" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-4 text-center">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-700 text-center leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Features Section */}
      <section className="py-20 px-6 bg-white/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Community Features
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Explore the tools and spaces designed to support your mental health journey and foster meaningful connections.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 h-full transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-[#8B4513]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-black mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Get Involved CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-3xl p-12 shadow-2xl border border-white/50 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <Heart className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-semibold">Ready to Connect?</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Start Your Journey Today
              </h2>
              
              <p className="text-xl text-black/80 max-w-2xl mx-auto mb-8 leading-relaxed">
                Join thousands of others who have found support, understanding, and growth in the Elysian community. 
                Your journey to better mental health starts with a single step.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#8B4513] font-bold text-xl rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/30">
                  Sign Up Now
                  <ArrowRight className="w-6 h-6" />
                </button>
                <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-bold text-xl rounded-2xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


=======
"use client"

import Navbar from "@/Components/Navbar";
import { 
  Users, 
  Heart, 
  Shield, 
  BookOpen, 
  MessageCircle, 
  Users2, 
  Calendar, 
  FileText,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function CommunityPage() {
  // Why Join Community data
  const benefits = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Share your experiences in a protected environment where privacy and respect are paramount."
    },
    {
      icon: Heart,
      title: "Empathetic Support",
      description: "Connect with people who truly understand your journey and offer genuine compassion."
    },
    {
      icon: Users,
      title: "Peer Connection",
      description: "Build meaningful relationships with others who share similar experiences and challenges."
    },
    {
      icon: BookOpen,
      title: "Growth Together",
      description: "Learn from others' experiences and contribute to collective healing and personal development."
    }
  ];

  // Community Features data
  const features = [
    {
      icon: MessageCircle,
      title: "Discussion Rooms",
      description: "Safe forums for open conversations about mental health topics and personal experiences."
    },
    {
      icon: Users2,
      title: "Peer Support Groups",
      description: "Join specialized groups based on your needs and connect with like-minded individuals."
    },
    {
      icon: Calendar,
      title: "Events & Workshops",
      description: "Participate in virtual and in-person events focused on mental wellness and personal growth."
    },
    {
      icon: FileText,
      title: "Mental Health Resources",
      description: "Access curated articles, tools, and resources to support your mental health journey."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-emerald-100/30 to-cyan-100/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Sparkles className="w-5 h-5 text-[#8B4513]" />
              <span className="text-[#8B4513] font-semibold">Join Our Growing Community</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
              Welcome to the{" "}
              <span className="text-transparent bg-gradient-to-r from-[#8B4513] to-[#CD853F] bg-clip-text">
                Elysian Community
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-black/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              A safe and supportive space where you can share, heal, and grow with others who understand your journey.
            </p>
            
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-bold text-xl rounded-2xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl">
              Join the Community
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Join Community Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Why Join the Community?
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Discover the benefits of being part of a supportive network that truly understands mental health challenges.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 h-full transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-[#8B4513]" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-4 text-center">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-700 text-center leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Features Section */}
      <section className="py-20 px-6 bg-white/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Community Features
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto">
              Explore the tools and spaces designed to support your mental health journey and foster meaningful connections.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 h-full transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-[#8B4513]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-black mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Get Involved CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-3xl p-12 shadow-2xl border border-white/50 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <Heart className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-semibold">Ready to Connect?</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Start Your Journey Today
              </h2>
              
              <p className="text-xl text-black/80 max-w-2xl mx-auto mb-8 leading-relaxed">
                Join thousands of others who have found support, understanding, and growth in the Elysian community. 
                Your journey to better mental health starts with a single step.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#8B4513] font-bold text-xl rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/30">
                  Sign Up Now
                  <ArrowRight className="w-6 h-6" />
                </button>
                <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-bold text-xl rounded-2xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



