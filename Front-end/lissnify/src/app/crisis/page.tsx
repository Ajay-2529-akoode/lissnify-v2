"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Phone, MessageCircle, Heart, AlertTriangle, Clock, Shield, Users, BookOpen } from "lucide-react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function CrisisSupport() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      {/* Header with background */}
      <div className="relative h-96 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 mt-20">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23DC2626%22 fill-opacity=%220.05%22%3E%3Cpath d=%22m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        

        {/* Breadcrumbs */}
        <div className="relative z-10 px-6 pt-20">
          <div className="flex items-center gap-2 text-[#8B4513]/70">
            <Link href="/" className="hover:text-[#8B4513] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#8B4513]">Crisis Support</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="relative z-10 px-6 mt-8 text-center">
          <h1 className="text-5xl font-bold text-[#8B4513] mb-4">Crisis Support</h1>
          <p className="text-xl text-[#8B4513]/80 max-w-3xl mx-auto">
            If you're experiencing a mental health crisis, immediate help is available. You are not alone.
          </p>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
            <h2 className="text-3xl font-bold text-white">IMMEDIATE CRISIS SUPPORT</h2>
          </div>
          <p className="text-white/90 text-xl mb-8">
            Your safety and well-being are of utmost importance. If you or someone you know is in immediate distress or danger, please reach out to the appropriate national helpline.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <a 
              href="tel:112" 
              className="flex items-center justify-center gap-4 px-8 py-6 bg-white text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all duration-300 hover:scale-105 shadow-xl text-xl"
            >
              <Phone className="w-8 h-8" />
              <div>
                <div className="text-2xl font-black">112</div>
                <div className="text-sm">National Emergency Response</div>
              </div>
            </a>
            <a 
              href="tel:1800-599-0019" 
              className="flex items-center justify-center gap-4 px-8 py-6 bg-white text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all duration-300 hover:scale-105 shadow-xl text-xl"
            >
              <MessageCircle className="w-8 h-8" />
              <div>
                <div className="text-2xl font-black">1800-599-0019</div>
                <div className="text-sm">KIRAN Mental Health Helpline</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Crisis Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#8B4513] text-center mb-12">24/7 Crisis Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* National Emergency Response */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 shadow-xl border-2 border-red-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-red-800 mb-4">National Emergency Response</h3>
                <p className="text-red-700 mb-6">For all emergencies including Police, Fire, and Ambulance</p>
                <a 
                  href="tel:112" 
                  className="inline-block px-8 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors text-xl"
                >
                  Call 112
                </a>
                <p className="text-sm text-red-600 mt-4">Available 24/7</p>
              </div>
            </div>

            {/* KIRAN Mental Health Helpline */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 shadow-xl border-2 border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-4">KIRAN Mental Health Helpline</h3>
                <p className="text-blue-700 mb-6">For support regarding anxiety, stress, depression, and other mental health concerns</p>
                <a 
                  href="tel:1800-599-0019" 
                  className="inline-block px-8 py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors text-xl"
                >
                  Call 1800-599-0019
                </a>
                <p className="text-sm text-blue-600 mt-4">Free and confidential</p>
              </div>
            </div>

            {/* Police Emergency */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 shadow-xl border-2 border-orange-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-orange-800 mb-4">Police Emergency</h3>
                <p className="text-orange-700 mb-6">For immediate police assistance</p>
                <a 
                  href="tel:100" 
                  className="inline-block px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-colors text-xl"
                >
                  Call 100
                </a>
                <p className="text-sm text-orange-600 mt-4">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Signs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#8B4513] text-center mb-12">Warning Signs to Watch For</h2>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 shadow-xl border-2 border-yellow-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  Immediate Warning Signs
                </h3>
                <ul className="space-y-3 text-[#8B4513]/80">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Talking about wanting to die or kill oneself</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Looking for ways to kill oneself</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Talking about feeling hopeless or having no reason to live</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Talking about being a burden to others</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-500" />
                  Other Warning Signs
                </h3>
                <ul className="space-y-3 text-[#8B4513]/80">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Increased alcohol or drug use</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Acting anxious, agitated, or reckless</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Sleeping too little or too much</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span>Withdrawing or feeling isolated</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How to Help */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#8B4513] text-center mb-12">How to Help Someone in Crisis</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#FFB88C]/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">Listen with Empathy</h3>
                <p className="text-[#8B4513]/80">
                  Listen without judgment. Let them know you care and that their feelings are valid.
                </p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#FFB88C]/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">Take It Seriously</h3>
                <p className="text-[#8B4513]/80">
                  Never dismiss or minimize their feelings. Take all threats seriously.
                </p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#FFB88C]/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">Get Professional Help</h3>
                <p className="text-[#8B4513]/80">
                  Encourage them to seek professional help and offer to help them find resources.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-br from-[#FFB88C]/20 to-[#F9E79F]/20 rounded-3xl p-12 border-2 border-[#FFB88C]/30">
          <h2 className="text-3xl font-bold text-[#8B4513] text-center mb-8">Additional Emergency Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#8B4513] mb-6">Emergency Services</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#8B4513]" />
                  <div>
                    <span className="font-semibold text-[#8B4513]">Police:</span>
                    <span className="text-[#8B4513]/80 ml-2">100</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#8B4513]" />
                  <div>
                    <span className="font-semibold text-[#8B4513]">Fire Services:</span>
                    <span className="text-[#8B4513]/80 ml-2">101</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#8B4513]" />
                  <div>
                    <span className="font-semibold text-[#8B4513]">Ambulance:</span>
                    <span className="text-[#8B4513]/80 ml-2">102 or 108</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#8B4513]" />
                  <div>
                    <span className="font-semibold text-[#8B4513]">Women Helpline:</span>
                    <span className="text-[#8B4513]/80 ml-2">181 or 1091</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#8B4513]" />
                  <div>
                    <span className="font-semibold text-[#8B4513]">Child Helpline:</span>
                    <span className="text-[#8B4513]/80 ml-2">1098</span>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#8B4513] mb-6">Specialized Support</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#8B4513]" />
                  <div>
                    <span className="font-semibold text-[#8B4513]">National Cyber Crime Reporting:</span>
                    <span className="text-[#8B4513]/80 ml-2">1930</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#8B4513]" />
                  <div>
                    <span className="font-semibold text-[#8B4513]">Mental Health Support (KIRAN):</span>
                    <span className="text-[#8B4513]/80 ml-2">1800-599-0019</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#8B4513]" />
                  <div>
                    <span className="font-semibold text-[#8B4513]">National Emergency Response:</span>
                    <span className="text-[#8B4513]/80 ml-2">112</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
            <h3 className="text-2xl font-bold text-white">Important Notice</h3>
          </div>
          <p className="text-white/90 text-lg mb-4">
            Lissnify provides peer support and is not a substitute for professional mental health treatment or crisis intervention.
          </p>
          <p className="text-white/90 text-lg">
            If you or someone you know is in immediate danger, please call 911 or go to your nearest emergency room.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
