"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, MessageCircle, Phone, Mail, HelpCircle, BookOpen, Users, Shield, Heart, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqData = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Register' or 'Sign Up' button. You will be required to provide basic information and verify your identity using your Aadhaar or registered mobile number via OTP, in compliance with government verification standards."
    },
    {
      question: "I forgot my password. What should I do?",
      answer: "Click on the 'Forgot Password' link on the login page. You will be prompted to enter your registered email address or mobile number. Follow the instructions sent to you to securely reset your password."
    },
    {
      question: "Is my data safe on this platform?",
      answer: "Yes. We are committed to protecting your data in accordance with the Digital Personal Data Protection Act, 2023, and other relevant Indian laws. All data is encrypted and stored on secure servers located within India."
    },
    {
      question: "What are the service hours?",
      answer: "Our toll-free helpline is available from 8 AM to 8 PM, Monday to Saturday. Online services are available 24/7, though response times may vary during off-hours."
    },
    {
      question: "How can I contact support?",
      answer: "You can reach us via email at support@lissnify.gov.in, call our toll-free helpline at 1800-XXX-XXXX, or use our online chat support during business hours."
    },
    {
      question: "How do I file a grievance?",
      answer: "For specific complaints, please refer to our Grievance Redressal mechanism in the Terms of Service. You can also contact our designated Grievance Officer through the contact information provided."
    }
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      icon: <BookOpen className="w-8 h-8" />,
      description: "Learn how to set up your account and navigate the platform",
      topics: ["Account Setup", "Profile Creation", "First Steps", "Platform Tour"]
    },
    {
      title: "Finding Support",
      icon: <Users className="w-8 h-8" />,
      description: "Discover how to connect with listeners and find the right support",
      topics: ["Listener Matching", "Support Categories", "Communication Tips", "Building Connections"]
    },
    {
      title: "Safety & Privacy",
      icon: <Shield className="w-8 h-8" />,
      description: "Understand our safety measures and privacy protections",
      topics: ["Data Protection", "Reporting Issues", "Safety Guidelines", "Privacy Settings"]
    },
    {
      title: "Account Management",
      icon: <HelpCircle className="w-8 h-8" />,
      description: "Manage your account settings and preferences",
      topics: ["Profile Settings", "Notification Preferences", "Account Security", "Data Management"]
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      {/* Header with background */}
      <div className="relative h-96 bg-gradient-to-r from-[#FFB88C]/20 via-[#FFF8B5]/20 to-[#FFD1A9]/20 mt-20">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23D2691E%22 fill-opacity=%220.05%22%3E%3Cpath d=%22m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        

        {/* Breadcrumbs */}
        <div className="relative z-10 px-6 pt-20">
          <div className="flex items-center gap-2 text-[#8B4513]/70">
            <Link href="/" className="hover:text-[#8B4513] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#8B4513]">Help Center</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="relative z-10 px-6 mt-8 text-center">
          <h1 className="text-5xl font-bold text-[#8B4513] mb-4">Help Center</h1>
          <p className="text-xl text-[#8B4513]/80 max-w-3xl mx-auto">
            Find answers to your questions and get the support you need to make the most of your Lissnify experience.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 -mt-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#FFB88C]/20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#8B4513]/50" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#FFB88C]/30 rounded-2xl text-lg focus:outline-none focus:border-[#8B4513] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#8B4513] text-center mb-12">How can we help you?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#FFB88C]/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#8B4513] mb-4">{category.title}</h3>
                  <p className="text-[#8B4513]/70 mb-6">{category.description}</p>
                  <ul className="space-y-2">
                    {category.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="text-sm text-[#8B4513]/60 hover:text-[#8B4513] transition-colors cursor-pointer">
                        • {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#8B4513] text-center mb-12">Frequently Asked Questions</h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#FFB88C]/20">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="border-b border-[#FFB88C]/20 last:border-b-0">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FFB88C]/5 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-[#8B4513] pr-4">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-6 h-6 text-[#8B4513] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-[#8B4513] flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-[#8B4513]/80 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-[#FFB88C]/20 to-[#F9E79F]/20 rounded-3xl p-12 border-2 border-[#FFB88C]/30">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#8B4513] mb-6">Contact Us</h2>
          <p className="text-lg text-[#8B4513]/80 mb-8 max-w-2xl mx-auto">
            If you cannot find the answer to your question, please contact our support team.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#8B4513] rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#8B4513] mb-2">Online Chat</h3>
              <p className="text-[#8B4513]/70 text-center mb-4">Available during business hours</p>
              <button className="px-6 py-3 bg-[#8B4513] text-white rounded-2xl hover:bg-[#A0522D] transition-colors">
                Start Chat
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#8B4513] rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#8B4513] mb-2">Email Support</h3>
              <p className="text-[#8B4513]/70 text-center mb-4">support@lissnify.gov.in</p>
              <a 
                href="mailto:support@lissnify.gov.in"
                className="px-6 py-3 bg-[#8B4513] text-white rounded-2xl hover:bg-[#A0522D] transition-colors inline-block"
              >
                Send Email
              </a>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#8B4513] rounded-full flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#8B4513] mb-2">Toll-Free Helpline</h3>
              <p className="text-[#8B4513]/70 text-center mb-4">1800-XXX-XXXX<br/>(8 AM to 8 PM, Mon-Sat)</p>
              <a 
                href="tel:1800-XXX-XXXX"
                className="px-6 py-3 bg-[#8B4513] text-white rounded-2xl hover:bg-[#A0522D] transition-colors inline-block"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Emergency Notice */}
     
      <Footer />
    </div>
  );
}
