"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Lock, Eye, Users, FileText, Phone, Mail } from "lucide-react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      {/* Header with background image */}
      <div className="relative h-96 bg-gradient-to-r from-[#FFB88C]/20 via-[#FFF8B5]/20 to-[#FFD1A9]/20 mt-20">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23D2691E%22 fill-opacity=%220.05%22%3E%3Cpath d=%22m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        

        {/* Breadcrumbs */}
        <div className="relative z-10 px-6 pt-20">
          <div className="flex items-center gap-2 text-[#8B4513]/70">
            <Link href="/" className="hover:text-[#8B4513] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#8B4513]">Privacy Policy</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="relative z-10 px-6 mt-8 text-center">
          <h1 className="text-5xl font-bold text-[#8B4513] mb-4">Privacy Policy</h1>
          <p className="text-xl text-[#8B4513]/80 max-w-3xl mx-auto">
            Your privacy and mental well-being are our top priorities. Learn how we protect and handle your personal information.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-[#FFB88C]/20">
          {/* Introduction */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#8B4513]" />
              </div>
              <h2 className="text-3xl font-bold text-[#8B4513]">Privacy Policy</h2>
            </div>
            <p className="text-lg text-[#8B4513]/80 leading-relaxed mb-4">
              <strong>Last Updated:</strong> 19 September 2025
            </p>
            <p className="text-lg text-[#8B4513]/80 leading-relaxed">
              The Government of India, through the Ministry of Health and Family Welfare, is committed to ensuring the privacy of its citizens. 
              This policy outlines our practices concerning the collection, use, and disclosure of your personal information in accordance with the 
              <strong> Digital Personal Data Protection Act, 2023</strong>.
            </p>
          </div>

          {/* Privacy Policy Content */}
          <div className="space-y-12">
            {/* Section 1 */}
            <div>
              <h3 className="text-2xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-full flex items-center justify-center text-white font-bold text-sm">1</span>
                Information Collection and Use
              </h3>
              <div className="bg-gradient-to-r from-[#FFB88C]/10 to-[#F9E79F]/10 rounded-2xl p-8">
                <p className="text-lg text-[#8B4513]/80 mb-4">
                  We collect personal data that is necessary for the delivery of government services and schemes. This may include:
                </p>
                <ul className="space-y-4 text-[#8B4513]/80">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#8B4513] rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-lg"><strong>Personal Identifiable Information (PII):</strong> Name, address, contact number, email address, Aadhaar number, etc.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#8B4513] rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-lg"><strong>Usage Data:</strong> Information on how you access and use the service, including IP address, browser type, and pages visited.</span>
                  </li>
                </ul>
                <p className="text-lg text-[#8B4513]/80 mt-4">
                  This information is collected for the sole purpose of verifying identity, processing requests, and providing public services.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-2xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-full flex items-center justify-center text-white font-bold text-sm">2</span>
                Data Storage and Security
              </h3>
              <div className="bg-gradient-to-r from-[#FFF8B5]/10 to-[#FFD1A9]/10 rounded-2xl p-8">
                <p className="text-lg text-[#8B4513]/80 mb-4">
                  Your personal data is stored on secure servers managed by the National Informatics Centre (NIC) located within the geographical boundaries of India. 
                  We employ state-of-the-art security measures, including encryption and access controls, to prevent unauthorized access, use, or disclosure of your information, 
                  as per the guidelines issued by CERT-In.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-2xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-full flex items-center justify-center text-white font-bold text-sm">3</span>
                Data Sharing and Disclosure
              </h3>
              <div className="bg-gradient-to-r from-[#FFB88C]/10 to-[#F9E79F]/10 rounded-2xl p-8">
                <p className="text-lg text-[#8B4513]/80">
                  Your personal information will <strong>not</strong> be shared with any private organization for commercial purposes. 
                  Data may be shared only with other Indian government departments or law enforcement agencies as required for the provision of integrated services or as mandated by law.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="text-2xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-full flex items-center justify-center text-white font-bold text-sm">4</span>
                Your Rights and Grievance Redressal
              </h3>
              <div className="bg-gradient-to-r from-[#FFF8B5]/10 to-[#FFD1A9]/10 rounded-2xl p-8">
                <p className="text-lg text-[#8B4513]/80">
                  As a user, you have the right to access, correct, and request the erasure of your personal data. 
                  If you have any concerns about the processing of your data, you may contact our designated Data Protection Officer at dpo@lissnify.gov.in.
                </p>
              </div>
            </div>

          </div>

          {/* Contact Section */}
          <div className="mt-16 p-8 bg-gradient-to-br from-[#FFB88C]/20 to-[#F9E79F]/20 rounded-3xl border-2 border-[#FFB88C]/30">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#8B4513] mb-4">Data Protection Officer</h3>
              <p className="text-lg text-[#8B4513]/80 mb-8">
                For privacy concerns and data protection queries, contact our designated Data Protection Officer.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-[#8B4513]">dpo@lissnify.gov.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-[#8B4513]">1800-XXX-XXXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Healing Journey?</h2>
          <p className="text-xl text-white/90 mb-8">Join our compassionate community and find the support you deserve.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-white text-[#8B4513] font-bold rounded-2xl hover:bg-[#FFB88C] transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Get Started Today
            </Link>
            <Link 
              href="/community" 
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-[#8B4513] transition-all duration-300 hover:scale-105"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
