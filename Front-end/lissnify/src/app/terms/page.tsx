"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Shield, Users, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function TermsOfService() {
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
            <span className="text-[#8B4513]">Terms of Service</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="relative z-10 px-6 mt-8 text-center">
          <h1 className="text-5xl font-bold text-[#8B4513] mb-4">Terms of Service</h1>
          <p className="text-xl text-[#8B4513]/80 max-w-3xl mx-auto">
            Please read these terms carefully before using our mental health support platform.
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
                <FileText className="w-6 h-6 text-[#8B4513]" />
              </div>
              <h2 className="text-3xl font-bold text-[#8B4513]">Terms of Service</h2>
            </div>
            <p className="text-lg text-[#8B4513]/80 leading-relaxed">
              By accessing and using this service, you agree to comply with and be bound by the following terms and conditions.
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-12">
            {/* Section 1 */}
            <div>
              <h3 className="text-2xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-full flex items-center justify-center text-white font-bold text-sm">1</span>
                User Conduct
              </h3>
              <div className="bg-gradient-to-r from-[#FFB88C]/10 to-[#F9E79F]/10 rounded-2xl p-8">
                <p className="text-lg text-[#8B4513]/80">
                  You agree to use this service only for lawful purposes. You are prohibited from posting or transmitting any material that is defamatory, 
                  obscene, fraudulent, or violates any provision of the <strong>Information Technology Act, 2000</strong>, and its subsequent amendments. 
                  Impersonating any person or entity is strictly forbidden.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-2xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-full flex items-center justify-center text-white font-bold text-sm">2</span>
                Service Availability
              </h3>
              <div className="bg-gradient-to-r from-[#FFF8B5]/10 to-[#FFD1A9]/10 rounded-2xl p-8">
                <p className="text-lg text-[#8B4513]/80">
                  We strive to ensure the service is available 24/7. However, the Government of India will not be liable if the service is unavailable 
                  at any time due to maintenance, technical issues, or circumstances beyond our control.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-2xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-full flex items-center justify-center text-white font-bold text-sm">3</span>
                Intellectual Property
              </h3>
              <div className="bg-gradient-to-r from-[#FFB88C]/10 to-[#F9E79F]/10 rounded-2xl p-8">
                <p className="text-lg text-[#8B4513]/80">
                  All content, logos, emblems, and information on this platform are the intellectual property of the Government of India 
                  and are protected by applicable copyright and trademark laws. Unauthorized use of this material is a punishable offense.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="text-2xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-full flex items-center justify-center text-white font-bold text-sm">4</span>
                Limitation of Liability
              </h3>
              <div className="bg-gradient-to-r from-[#FFF8B5]/10 to-[#FFD1A9]/10 rounded-2xl p-8">
                <p className="text-lg text-[#8B4513]/80">
                  This service is provided on an "as is" basis. While we make every effort to ensure the accuracy of the information provided, 
                  the Government of India is not liable for any loss or damage arising from the use of this service.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h3 className="text-2xl font-bold text-[#8B4513] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-full flex items-center justify-center text-white font-bold text-sm">5</span>
                Governing Law and Jurisdiction
              </h3>
              <div className="bg-gradient-to-r from-[#FFB88C]/10 to-[#F9E79F]/10 rounded-2xl p-8">
                <p className="text-lg text-[#8B4513]/80">
                  These terms shall be governed by and construed in accordance with the laws of the Republic of India. 
                  Any dispute arising under these terms shall be subject to the exclusive jurisdiction of the courts in New Delhi.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 p-8 bg-gradient-to-br from-[#FFB88C]/20 to-[#F9E79F]/20 rounded-3xl border-2 border-[#FFB88C]/30">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#8B4513] mb-4">Questions About These Terms?</h3>
              <p className="text-lg text-[#8B4513]/80 mb-8">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-[#8B4513]">legal@lissnify.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8B4513] rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-[#8B4513]">support@lissnify.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl text-white/90 mb-8">Start your journey towards better mental health and emotional well-being.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-white text-[#8B4513] font-bold rounded-2xl hover:bg-[#FFB88C] transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Get Started Today
            </Link>
            <Link 
              href="/help" 
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-[#8B4513] transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
