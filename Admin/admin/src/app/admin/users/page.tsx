// This file should be placed at app/admin/users/page.tsx
// It's designed to match the theme of your dashboard.
'use client'; // This page is interactive, so we mark it as a client component.

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/admin/SideBar';
import UserTable from '@/components/admin/UserTable'; // We'll create this component next.
// --- Helper Components & Icons ---
// In a real app, these would be in separate files.


// --- Mock Data ---
// In a real application, this array would be fetched from your Django API.
const mockUsers = [
  { id: 1, username: 'seeker_one', email: 'seeker@example.com', user_type: 'Seeker', is_active: true, joined: '2025-08-20' },
  { id: 2, username: 'listener_alpha', email: 'listener@example.com', user_type: 'Listener', is_active: true, joined: '2025-08-19' },
  { id: 3, username: 'inactive_user', email: 'inactive@example.com', user_type: 'Seeker', is_active: false, joined: '2025-08-18' },
  { id: 4, username: 'another_listener', email: 'listener2@example.com', user_type: 'Listener', is_active: true, joined: '2025-08-17' },
  { id: 5, username: 'seeker_two', email: 'seeker2@example.com', user_type: 'Seeker', is_active: true, joined: '2025-08-16' },
  { id: 6, username: 'test_user_3', email: 'test3@example.com', user_type: 'Listener', is_active: false, joined: '2025-08-15' },
];

// --- Main Page Component ---

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-[#111827] text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">User Management</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                + Add New User
            </button>
        </header>
   <UserTable/>
      </main>
    </div>
  );
}
