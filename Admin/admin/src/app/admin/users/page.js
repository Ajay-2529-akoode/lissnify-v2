// This file should be placed at app/admin/users/page.tsx
// It assumes you have a reusable Sidebar component.
'use client'; // This page is interactive, so we mark it as a client component.

import { useState, useMemo } from 'react';

// --- Helper Components & Icons ---
// In a real app, these would be in separate files.
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;

const Sidebar = () => (
  <aside className="w-64 flex-shrink-0 bg-gray-900 text-white p-4 hidden md:block">
    <div className="text-2xl font-bold mb-8 text-indigo-400">Elysian Admin</div>
    <nav>
      <ul>
        <li className="mb-2"><a href="/admin" className="flex items-center gap-3 p-2 text-gray-300 hover:bg-gray-700 rounded-md"><HomeIcon /> Dashboard</a></li>
        <li className="mb-2"><a href="/admin/users" className="flex items-center gap-3 p-2 bg-indigo-600 rounded-md text-white font-semibold"><UsersIcon /> Users</a></li>
        <li className="mb-2"><a href="#" className="flex items-center gap-3 p-2 text-gray-300 hover:bg-gray-700 rounded-md"><CategoryIcon /> Categories</a></li>
        <li className="mb-2"><a href="#" className="flex items-center gap-3 p-2 text-gray-300 hover:bg-gray-700 rounded-md"><LinkIcon /> Connections</a></li>
      </ul>
    </nav>
  </aside>
);

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
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // 'All', 'Seeker', or 'Listener'

  // useMemo will re-calculate the filtered list only when the dependencies change.
  // This is more efficient than filtering on every render.
  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        // Filter by user type
        if (filter === 'All') return true;
        return user.user_type === filter;
      })
      .filter(user => {
        // Filter by search term (username or email)
        const search = searchTerm.toLowerCase();
        return user.username.toLowerCase().includes(search) || user.email.toLowerCase().includes(search);
      });
  }, [users, searchTerm, filter]);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">User Management</h1>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                + Add User
            </button>
        </header>

        {/* Search and Filter Controls */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4">
            <input
                type="text"
                placeholder="Search by username or email..."
                className="flex-grow p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center gap-2">
                <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-md text-sm font-semibold ${filter === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>All</button>
                <button onClick={() => setFilter('Seeker')} className={`px-4 py-2 rounded-md text-sm font-semibold ${filter === 'Seeker' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Seekers</button>
                <button onClick={() => setFilter('Listener')} className={`px-4 py-2 rounded-md text-sm font-semibold ${filter === 'Listener' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Listeners</button>
            </div>
        </div>
        
        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead>
                        <tr className="border-b border-gray-600 text-sm text-gray-400 bg-gray-800">
                            <th className="p-3 font-medium">Username</th>
                            <th className="p-3 font-medium">Email</th>
                            <th className="p-3 font-medium">Type</th>
                            <th className="p-3 font-medium">Status</th>
                            <th className="p-3 font-medium">Joined</th>
                            <th className="p-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50 text-sm">
                                <td className="p-3 font-semibold">{user.username}</td>
                                <td className="p-3 text-gray-300">{user.email}</td>
                                <td className="p-3 text-gray-300">{user.user_type}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.is_active ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-300">{user.joined}</td>
                                <td className="p-3 flex gap-2">
                                    <button className="text-gray-300 hover:text-white">View</button>
                                    <button className="text-indigo-400 hover:text-indigo-300">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}
