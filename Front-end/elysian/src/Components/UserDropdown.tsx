"use client"

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getDashboardUrl } from '@/utils/api';

const UserDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleProfileClick = () => {
    if (user?.user_type) {
      const profileUrl = getDashboardUrl(user.user_type) + '/profile';
      router.push(profileUrl);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      {/* User Info with Profile Click */}
      <div 
        onClick={handleProfileClick}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-lg text-black">
          Hello, {user.username}
        </span>
      </div>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  );
};

export default UserDropdown;
