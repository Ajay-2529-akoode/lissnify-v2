"use client"

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Calendar,
  Users2,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Star,

} from "lucide-react";

interface DashboardSidebarProps {
  userType: 'seeker' | 'listener';
}

export default function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const seekerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/seeker' },
    { id: 'chats', label: 'Chats', icon: MessageSquare, path: '/dashboard/seeker/chats' },
    { id: 'community', label: 'Community', icon: Users2, path: '/community' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/seeker/profile' },
    { id: 'feedback', label: 'Feedback', icon: Star, path: '/dashboard/seeker/feedback' }
  ];

  const listenerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/listener' },
    { id: 'chats', label: 'Chats', icon: MessageSquare, path: '/dashboard/listener/chats' },
    { id: 'community', label: 'Community', icon: Users2, path: '/community' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/listener/profile' },
  ];

  const navItems = userType === 'seeker' ? seekerNavItems : listenerNavItems;

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileOpen(false); // Close mobile menu after navigation
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-24 left-4 z-50 p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-white/50"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-20 h-full bg-white/90 backdrop-blur-md shadow-xl border-r border-white/50 z-10 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-6">
          {/* Brand Section */}
          <div className="flex items-center justify-between mb-8">
            {!isCollapsed && (
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
                <img 
                  src="/logo.png" 
                  alt="Lissnify Logo" 
                  className="h-15 w-auto"
                />
              
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <Menu className="w-5 h-5 text-gray-600" /> : <X className="w-5 h-5 text-gray-600" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-4">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive(item.path)
                      ? 'bg-gradient-to-r from-[#FFB88C] to-[#FFF8B5] text-black shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                  aria-label={item.label}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className={`absolute bottom-6 ${isCollapsed ? 'left-6 right-6' : 'left-6 right-6'}`}>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
