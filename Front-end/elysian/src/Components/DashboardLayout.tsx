"use client"

import { ReactNode } from "react";
import Navbar from "@/Components/Navbar";
import DashboardSidebar from "@/Components/DashboardSidebar";
import ProtectedRoute from "@/Components/ProtectedRoute";

interface DashboardLayoutProps {
  userType: 'seeker' | 'listener';
  children: ReactNode;
}

export default function DashboardLayout({ userType, children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C]">
        <Navbar />
        
        <div className="flex pt-20">
          {/* Left Sidebar */}
          <DashboardSidebar userType={userType} />
          
          {/* Main Content Area */}
          <div className="md:ml-64 flex-1 p-4 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
