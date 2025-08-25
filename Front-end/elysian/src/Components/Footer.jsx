"use client";
import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Heart, Phone, Mail, MapPin, Shield, Users, MessageCircle, Star, Sun, Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-[#8B4513] relative overflow-hidden">
      
      {/* Decorative background elements with warm tones */}
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#FFB88C] via-[#FFF8B5] to-[#FFD1A9]"></div>
      <div className="absolute top-12 left-16 w-40 h-40 bg-gradient-to-br from-[#FFB88C]/20 to-[#F9E79F]/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-16 right-20 w-48 h-48 bg-gradient-to-br from-[#FFF8B5]/25 to-[#FFD1A9]/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute top-1/3 left-1/2 w-32 h-32 bg-gradient-to-br from-[#F9E79F]/20 to-[#FFB88C]/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23D2691E%22 fill-opacity=%220.03%22%3E%3Cpath d=%22m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid gap-12 md:grid-cols-4">
          
          {/* Enhanced Logo + Tagline with warm colors */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-4 mb-8">
              {/* <div className="relative"> */}
                {/* <div className="w-14 h-14 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/50">
                  <Heart className="w-8 h-8 text-[#8B4513] animate-pulse" />
                </div> */}
                {/* <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#FFF8B5] to-[#F9E79F] rounded-full border-3 border-white flex items-center justify-center">
                  <Sun className="w-3 h-3 text-[#8B4513]" />
                </div> */}
              {/* </div> */}
              <h2 className="text-4xl font-bold">
                <span className="text-transparent bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#CD853F] bg-clip-text">
                  Elysian
                </span>
              </h2>
            </div>
            <p className="text-[#8B4513]/80 leading-relaxed mb-8 font-medium text-lg">
              Your sanctuary for emotional well-being and mental health support. 
              Building a compassionate community where healing thrives naturally.
            </p>
            
            {/* Trust indicators with warm styling */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/60 rounded-2xl border-2 border-[#FFB88C]/30 backdrop-blur-sm shadow-lg">
                <Shield className="w-5 h-5 text-[#8B4513]" />
                <span className="text-sm font-bold text-[#8B4513]">Secure & Safe</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/60 rounded-2xl border-2 border-[#F9E79F]/30 backdrop-blur-sm shadow-lg">
                <Leaf className="w-5 h-5 text-[#8B4513]" />
                <span className="text-sm font-bold text-[#8B4513]">Nurturing</span>
              </div>
              {/* <div className="flex items-center gap-3 px-4 py-3 bg-white/60 rounded-2xl border-2 border-[#F9E79F]/30 backdrop-blur-sm shadow-lg">
                <Leaf className="w-5 h-5 text-[#8B4513]" />
                <span className="text-sm font-bold text-[#8B4513]">Nurturing</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/60 rounded-2xl border-2 border-[#F9E79F]/30 backdrop-blur-sm shadow-lg">
                <Leaf className="w-5 h-5 text-[#8B4513]" />
                <span className="text-sm font-bold text-[#8B4513]">Nurturing</span>
              </div> */}
            </div>
          </div>

          {/* Enhanced Quick Links with warm hover effects */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              {/* <div className="w-10 h-10 bg-gradient-to-br from-[#FFB88C]/30 to-[#FFF8B5]/30 rounded-xl flex items-center justify-center border border-[#FFB88C]/40">
                <Star className="w-5 h-5 text-[#8B4513]" />
              </div> */}
              <h3 className="text-2xl font-bold text-[#8B4513]">Quick Links</h3>
            </div>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Community", href: "/community" },
                // { name: "Resources", href: "/resources" },
                { name: "Blog", href: "/blog" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="group flex items-center gap-3 text-[#8B4513]/70 hover:text-[#8B4513] transition-all duration-300 hover:translate-x-2 py-2"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-[#FFB88C] to-[#F9E79F] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125"></div>
                    <span className="font-semibold text-lg group-hover:font-bold">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Support with crisis hotline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              {/* <div className="w-10 h-10 bg-gradient-to-br from-[#FFF8B5]/30 to-[#FFD1A9]/30 rounded-xl flex items-center justify-center border border-[#FFF8B5]/40">
                <MessageCircle className="w-5 h-5 text-[#8B4513]" />
              </div> */}
              <h3 className="text-2xl font-bold text-[#8B4513]">Support</h3>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                { name: "Help Center", href: "/help" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Crisis Support", href: "/crisis" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="group flex items-center gap-3 text-[#8B4513]/70 hover:text-[#8B4513] transition-all duration-300 hover:translate-x-2 py-2"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-[#FFF8B5] to-[#FFD1A9] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125"></div>
                    <span className="font-semibold text-lg group-hover:font-bold">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Emergency contact with warm, reassuring styling */}
            {/* <div className="p-6 bg-gradient-to-br from-[#FFB88C]/20 to-[#F9E79F]/20 rounded-2xl border-2 border-[#FFB88C]/30 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FFB88C] to-[#F9E79F] rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#8B4513] animate-pulse" />
                </div>
                <span className="text-sm font-bold text-[#8B4513]">Crisis Hotline</span>
              </div>
              <p className="text-[#8B4513] font-bold text-xl">1-800-HELP-NOW</p>
              <p className="text-[#8B4513]/60 text-sm font-medium">Available 24/7 • You're never alone</p>
            </div> */}
          </div>

          {/* Enhanced Contact & Social with warm palette */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              {/* <div className="w-10 h-10 bg-gradient-to-br from-[#F9E79F]/30 to-[#FFB88C]/30 rounded-xl flex items-center justify-center border border-[#F9E79F]/40">
                <Heart className="w-5 h-5 text-[#8B4513]" />
              </div> */}
              <h3 className="text-2xl font-bold text-[#8B4513]">Stay Connected</h3>
            </div>
            
            {/* Contact info */}
            <div className="space-y-5 mb-8">
              <div className="flex items-center gap-4 text-[#8B4513]/80">
                <div className="w-8 h-8 bg-[#FFB88C]/30 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#8B4513]" />
                </div>
                <span className="font-semibold text-lg">support@elysian.com</span>
              </div>
              <div className="flex items-center gap-4 text-[#8B4513]/80">
                <div className="w-8 h-8 bg-[#F9E79F]/30 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#8B4513]" />
                </div>
                <span className="font-semibold text-lg">Worldwide Support</span>
              </div>
            </div>
            
            {/* Enhanced Social Media with warm styling */}
            <div className="mb-8">
              <p className="text-[#8B4513]/70 text-sm mb-5 font-semibold">Follow our healing journey</p>
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, name: "Facebook" },
                  { Icon: Instagram, name: "Instagram" },
                  { Icon: Twitter, name: "Twitter" },
                  { Icon: Linkedin, name: "LinkedIn" }
                ].map(({ Icon, name }, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`group w-14 h-14 bg-white/70 rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-[#FFB88C] hover:to-[#F9E79F] transition-all duration-300 hover:scale-110 hover:shadow-xl backdrop-blur-sm border-2 border-[#FFB88C]/20 hover:border-[#8B4513]/30`}
                    aria-label={name}
                  >
                    <Icon className="w-6 h-6 text-[#8B4513] group-hover:text-black transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Newsletter signup with warm, inviting design */}
            {/* <div className="p-6 bg-gradient-to-br from-[#FFF8B5]/30 to-[#FFD1A9]/30 rounded-2xl border-2 border-[#FFF8B5]/40 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-5 h-5 text-[#8B4513]" />
                <p className="text-base font-bold text-[#8B4513]">Weekly Wellness Tips</p>
              </div>
              <div className="flex gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 bg-white/80 border-2 border-[#FFB88C]/30 rounded-xl text-[#8B4513] placeholder-[#8B4513]/50 text-sm focus:outline-none focus:border-[#8B4513]/50 transition-all duration-300 backdrop-blur-sm"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-[#FFB88C] to-[#F9E79F] rounded-xl text-[#8B4513] text-sm font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-white/30">
                  Join
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Enhanced Bottom Bar with warm, grounding feel */}
        <div className="mt-20 pt-10 border-t-2 border-[#FFB88C]/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-[#8B4513]/70 text-sm">
              <span className="font-bold text-lg">© {new Date().getFullYear()} Elysian. All rights reserved.</span>
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#FFB88C] animate-pulse" />
                <span className="font-semibold">Made with care for mental wellness</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/70 rounded-2xl border-2 border-[#F9E79F]/40 backdrop-blur-sm shadow-lg">
                <div className="w-3 h-3 bg-gradient-to-r from-[#FFB88C] to-[#F9E79F] rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-[#8B4513]">All systems nurturing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}