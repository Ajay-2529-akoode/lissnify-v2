// This file should be placed at app/admin/users/page.tsx
// It's designed to match the theme of your dashboard.
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/admin/SideBar';
import UserTable from '@/components/admin/UserTable';
import { useRouter } from "next/navigation"; 
import AddUserModal from '@/components/AddUserModal';
import { Plus, Search, Filter, Users as UsersIcon } from 'lucide-react';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToVerify, setUserToVerify] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-400 mt-1">Manage all users, listeners, and seekers</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    filterType === 'all'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('listener')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    filterType === 'listener'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Listeners
                </button>
                <button
                  onClick={() => setFilterType('seeker')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    filterType === 'seeker'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Seekers
                </button>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New User
              </button>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <UserTable searchTerm={searchTerm} filterType={filterType} />
        </div>
      </main>

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onUserAdded={(user) => {
          // Handle user added callback if needed
          console.log('User added:', user);
        }}
      />
    </div>
  );
}
