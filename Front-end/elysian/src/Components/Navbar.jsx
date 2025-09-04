
"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X, Home, Users, MessageCircle, Shield, Sun, Leaf, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  // Get dashboard URL based on user type
  const getDashboardUrl = () => {
    if (!user) return "/";
    return user.user_type === "seeker" ? "/dashboard/seeker" : "/dashboard/listener";
  };

  // Base navigation items (always shown)
  const baseNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Community", href: "/community", icon: Users },
  ];

  // Dashboard item (only shown when logged in)
  const dashboardItem = { name: "Dashboard", href: getDashboardUrl(), icon: LayoutDashboard };

  // Combine navigation items based on authentication status
  const navItems = isAuthenticated ? [...baseNavItems, dashboardItem] : baseNavItems;

  return (
    <nav className="bg-white backdrop-blur-md border-b-3 border-[#FFB88C]/30 px-6 py-2 sticky top-0 z-50 shadow-xl relative overflow-hidden">
      
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8B5]/5 to-[#FFB88C]/5 opacity-50"></div>

      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-[#FFF8B5]/20 to-[#F9E79F]/10 rounded-full blur-2xl"></div>
      <div className="absolute top-0 right-1/3 w-24 h-24 bg-gradient-to-br from-[#FFB88C]/15 to-[#FFD1A9]/10 rounded-full blur-xl"></div>
      
      <div className="container mx-auto flex justify-between items-center relative z-10">
        
        {/* Enhanced Logo with warm styling */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-black tracking-tight leading-none">
              Ely<span className="text-transparent bg-gradient-to-r from-black to-black bg-clip-text">sian</span>
            </span>
            <span className="text-xs text-black font-medium">Mental Wellness</span>
          </div>
        </div>

        {/* Enhanced Desktop Menu with warm styling */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="group relative px-5 py-3 rounded-2xl text-black font-bold transition-all duration-300 hover:bg-white/70"
              >
                <div className="flex items-center gap-3">
                  <span className="transition-colors duration-300 text-lg">{item.name}</span>
                </div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#FFB88C] to-[#F9E79F] group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
              </Link>
            );
          })}
          
          {/* Authentication Section */}
          <div className="ml-8 pl-4 border-l-3 border-[#FFB88C]/40 flex items-center gap-3 relative">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  // Show user dropdown when logged in
                  <UserDropdown />
                ) : (
                  // Show login/signup buttons when not logged in
                  <>
                    <Link href="/login">
                      <button className="group relative px-6 py-2 rounded-2xl text-black font-bold bg-white/70 hover:bg-white/90 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl overflow-hidden border-2 border-[#FFB88C]/30">
                        <span className="relative flex items-center gap-2">
                          Login
                        </span>
                      </button>
                    </Link>
                    <Link href="/signup">
                      <button className="group relative px-6 py-2 rounded-2xl text-white font-bold bg-gradient-to-r from-[#CD853F] to-[#D2691E] hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl overflow-hidden border-2 border-white/30">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative flex items-center gap-2">
                          Sign Up
                        </span>
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Hamburger with warm styling */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative w-14 h-14 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#FFB88C]/30 group shadow-lg border-2 border-[#FFB88C]/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8B5]/10 to-[#FFB88C]/5 rounded-2xl"></div>
          {isOpen ? (
            <X className="w-7 h-7 text-[#8B4513] group-hover:text-[#A0522D] transition-colors duration-300 relative z-10" />
          ) : (
            <Menu className="w-7 h-7 text-[#8B4513] group-hover:text-[#A0522D] transition-colors duration-300 relative z-10" />
          )}
        </button>
      </div>

      {/* Enhanced Mobile Menu with warm, nurturing design */}
      {isOpen && (
        <div className="md:hidden mt-6 bg-white/95 backdrop-blur-md rounded-3xl border-3 border-[#FFB88C]/30 shadow-2xl p-6 mx-4 animate-fadeIn relative overflow-hidden">
          
          {/* Mobile menu background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFF8B5]/20 to-[#F9E79F]/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-[#FFB88C]/15 to-[#FFD1A9]/10 rounded-full blur-2xl"></div>
          
          <div className="space-y-3 relative z-10">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group flex items-center gap-4 px-5 py-4 rounded-2xl text-[#8B4513] font-bold hover:bg-gradient-to-r hover:from-[#FFF8B5]/20 hover:to-[#FFB88C]/15 transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-[#FFB88C]/20"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5]/30 to-[#F9E79F]/20 rounded-2xl flex items-center justify-center group-hover:from-[#FFB88C]/30 group-hover:to-[#F9E79F]/30 transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <IconComponent className="w-6 h-6 text-[#8B4513] group-hover:text-[#A0522D] transition-colors duration-300" />
                  </div>
                  <span className="group-hover:text-[#A0522D] transition-colors duration-300 text-xl">{item.name}</span>
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-[#FFB88C] to-[#F9E79F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile Authentication Section */}
          <div className="mt-8 pt-6 border-t-2 border-[#FFB88C]/30 relative z-10 space-y-3">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  // Show user info in mobile menu when logged in
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-bold text-black mb-2">
                      Hello, {user?.username}
                    </p>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="group w-full relative px-8 py-4 rounded-2xl text-red-600 font-bold bg-white/70 hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden border-2 border-red-200 hover:border-red-300"
                    >
                      <span className="relative flex items-center justify-center gap-3 text-xl">
                        <LogOut className="w-6 h-6" />
                        Sign Out
                      </span>
                    </button>
                  </div>
                ) : (
                  // Show login/signup buttons when not logged in
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <button className="group w-full relative px-8 py-4 rounded-2xl text-black font-bold bg-white/70 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden border-2 border-[#FFB88C]/30">
                        <span className="relative flex items-center justify-center gap-3 text-xl">
                          Login
                        </span>
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <button className="group w-full relative px-8 py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-[#CD853F] to-[#D2691E] hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 shadow-2xl hover:shadow-3xl overflow-hidden hover:scale-105 border-2 border-white/30">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative flex items-center justify-center gap-3 text-xl">
                          Sign Up
                        </span>
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Enhanced custom styles with warm animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(139, 69, 19, 0.25);
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </nav>
  );
=======
"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X, Home, Users, MessageCircle, Shield, Sun, Leaf, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserDropdown from "./UserDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Community", href: "/community", icon: Users },
    // { name: "Support", href: "/support", icon: MessageCircle },
    // { name: "Privacy", href: "/privacy", icon: Shield },
  ];

  return (
    <nav className="bg-white backdrop-blur-md border-b-3 border-[#FFB88C]/30 px-6 py-2 sticky top-0 z-50 shadow-xl relative overflow-hidden">
      
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23D2691E\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z\'/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-[#FFF8B5]/20 to-[#F9E79F]/10 rounded-full blur-2xl"></div>
      <div className="absolute top-0 right-1/3 w-24 h-24 bg-gradient-to-br from-[#FFB88C]/15 to-[#FFD1A9]/10 rounded-full blur-xl"></div>
      
      <div className="container mx-auto flex justify-between items-center relative z-10">
        
        {/* Enhanced Logo with warm styling */}
        <div className="flex items-center gap-4">
          {/* <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFB88C] to-[#F9E79F] rounded-2xl flex items-center justify-center shadow-2xl border-3 border-white/50 group-hover:scale-110 transition-all duration-300">
              <Heart className="w-7 h-7 text-[#8B4513] animate-pulse group-hover:animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#FFF8B5] to-[#F9E79F] rounded-full border-3 border-white flex items-center justify-center animate-pulse">
              <Sun className="w-3 h-3 text-[#8B4513]" />
            </div>
          </div> */}
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-black tracking-tight leading-none">
              Ely<span className="text-transparent bg-gradient-to-r from-black to-black bg-clip-text">sian</span>
            </span>
            <span className="text-xs text-black font-medium">Mental Wellness</span>
          </div>
        </div>

        {/* Enhanced Desktop Menu with warm styling */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className="group relative px-5 py-3 rounded-2xl text-black font-bold transition-all duration-300 hover:bg-white/70 "
              >
                <div className="flex items-center gap-3">
                  {/* <div className="w-8 h-8 bg-gradient-to-br from-[#FFF8B5]/30 to-[#F9E79F]/20 rounded-xl flex items-center justify-center group-hover:from-[#FFB88C]/30 group-hover:to-[#F9E79F]/30 transition-all duration-300">
                    <IconComponent className="w-5 h-5 group-hover:text-[#8B4513] transition-colors duration-300 group-hover:scale-110" />
                  </div> */}
                  <span className=" transition-colors duration-300 text-lg">{item.name}</span>
                </div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#FFB88C] to-[#F9E79F] group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
              </a>
            );
          })}
          
          {/* Authentication Section */}
          <div className="ml-8 pl-4 border-l-3 border-[#FFB88C]/40 flex items-center gap-3 relative">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  // Show user dropdown when logged in
                  <UserDropdown />
                ) : (
                  // Show login/signup buttons when not logged in
                  <>
                    <Link href="/login">
                      <button className="group relative px-6 py-2 rounded-2xl text-black font-bold bg-white/70 hover:bg-white/90 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl overflow-hidden border-2 border-[#FFB88C]/30">
                        <span className="relative flex items-center gap-2">
                          Login
                        </span>
                      </button>
                    </Link>
                    <Link href="/signup">
                      <button className="group relative px-6 py-2 rounded-2xl text-white font-bold bg-gradient-to-r from-[#CD853F] to-[#D2691E] hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl overflow-hidden border-2 border-white/30">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative flex items-center gap-2">
                          Sign Up
                        </span>
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Hamburger with warm styling */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative w-14 h-14 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#FFB88C]/30 group shadow-lg border-2 border-[#FFB88C]/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8B5]/10 to-[#FFB88C]/5 rounded-2xl"></div>
          {isOpen ? (
            <X className="w-7 h-7 text-[#8B4513] group-hover:text-[#A0522D] transition-colors duration-300 relative z-10" />
          ) : (
            <Menu className="w-7 h-7 text-[#8B4513] group-hover:text-[#A0522D] transition-colors duration-300 relative z-10" />
          )}
        </button>
      </div>

      {/* Enhanced Mobile Menu with warm, nurturing design */}
      {isOpen && (
        <div className="md:hidden mt-6 bg-white/95 backdrop-blur-md rounded-3xl border-3 border-[#FFB88C]/30 shadow-2xl p-6 mx-4 animate-fadeIn relative overflow-hidden">
          
          {/* Mobile menu background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFF8B5]/20 to-[#F9E79F]/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-[#FFB88C]/15 to-[#FFD1A9]/10 rounded-full blur-2xl"></div>
          
          <div className="space-y-3 relative z-10">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="group flex items-center gap-4 px-5 py-4 rounded-2xl text-[#8B4513] font-bold hover:bg-gradient-to-r hover:from-[#FFF8B5]/20 hover:to-[#FFB88C]/15 transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-[#FFB88C]/20"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5]/30 to-[#F9E79F]/20 rounded-2xl flex items-center justify-center group-hover:from-[#FFB88C]/30 group-hover:to-[#F9E79F]/30 transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <IconComponent className="w-6 h-6 text-[#8B4513] group-hover:text-[#A0522D] transition-colors duration-300" />
                  </div>
                  <span className="group-hover:text-[#A0522D] transition-colors duration-300 text-xl">{item.name}</span>
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-[#FFB88C] to-[#F9E79F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              );
            })}
          </div>
          
          {/* Mobile Authentication Section */}
          <div className="mt-8 pt-6 border-t-2 border-[#FFB88C]/30 relative z-10 space-y-3">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  // Show user info in mobile menu when logged in
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-bold text-black mb-2">
                      Hello, {user?.username}
                    </p>
                                         <button
                       onClick={() => {
                         logout();
                         setIsOpen(false);
                       }}
                       className="group w-full relative px-8 py-4 rounded-2xl text-red-600 font-bold bg-white/70 hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden border-2 border-red-200 hover:border-red-300"
                     >
                       <span className="relative flex items-center justify-center gap-3 text-xl">
                         <LogOut className="w-6 h-6" />
                         Sign Out
                       </span>
                     </button>
                  </div>
                ) : (
                  // Show login/signup buttons when not logged in
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <button className="group w-full relative px-8 py-4 rounded-2xl text-black font-bold bg-white/70 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden border-2 border-[#FFB88C]/30">
                        <span className="relative flex items-center justify-center gap-3 text-xl">
                          Login
                        </span>
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <button className="group w-full relative px-8 py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-[#CD853F] to-[#D2691E] hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 shadow-2xl hover:shadow-3xl overflow-hidden hover:scale-105 border-2 border-white/30">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative flex items-center justify-center gap-3 text-xl">
                          Sign Up
                        </span>
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Enhanced custom styles with warm animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(139, 69, 19, 0.25);
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </nav>
  );

}