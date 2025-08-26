// This file should be placed at app/admin/connections/page.tsx
// It's designed to match the theme of your dashboard.
'use client'; // This page is interactive, so we mark it as a client component.

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/admin/SideBar';
// --- Helper Components & Icons ---
// In a real app, these would be in separate files.



// --- Mock Data ---
// In a real application, this array would be fetched from your Django API.
const mockConnections = [
  { id: 1, seeker: 'seeker_one', listener: 'listener_alpha', status: 'Accepted', created_at: '2025-08-25' },
  { id: 2, seeker: 'seeker_one', listener: 'another_listener', status: 'Pending', created_at: '2025-08-24' },
  { id: 3, seeker: 'seeker_two', listener: 'listener_alpha', status: 'Rejected', created_at: '2025-08-23' },
  { id: 4, seeker: 'inactive_user', listener: 'listener_alpha', status: 'Accepted', created_at: '2025-08-22' },
  { id: 5, seeker: 'seeker_two', listener: 'another_listener', status: 'Pending', created_at: '2025-08-21' },
];

// --- Main Page Component ---

export default function ConnectionsPage() {
  const [connections, setConnections] = useState(mockConnections);
  const [filter, setFilter] = useState('All'); // 'All', 'Accepted', 'Pending', 'Rejected'

  const filteredConnections = useMemo(() => {
    if (filter === 'All') return connections;
    return connections.filter(connection => connection.status === filter);
  }, [connections, filter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-green-500/20 text-green-300';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-300';
      case 'Rejected': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#111827] text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Connection Management</h1>
        </header>

        {/* Filter Controls */}
        <div className="bg-[#1e2632] p-4 rounded-lg mb-6 flex items-center gap-2">
            <span className="text-sm font-semibold mr-2">Filter by status:</span>
            <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-md text-sm font-semibold transition ${filter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>All</button>
            <button onClick={() => setFilter('Accepted')} className={`px-4 py-2 rounded-md text-sm font-semibold transition ${filter === 'Accepted' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Accepted</button>
            <button onClick={() => setFilter('Pending')} className={`px-4 py-2 rounded-md text-sm font-semibold transition ${filter === 'Pending' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Pending</button>
            <button onClick={() => setFilter('Rejected')} className={`px-4 py-2 rounded-md text-sm font-semibold transition ${filter === 'Rejected' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Rejected</button>
        </div>
        
        {/* Connections Table */}
        <div className="bg-[#1e2632] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead>
                        <tr className="border-b border-gray-700 text-sm text-gray-400 bg-[#1e2632]">
                            <th className="p-3 font-semibold">Seeker</th>
                            <th className="p-3 font-semibold">Listener</th>
                            <th className="p-3 font-semibold">Status</th>
                            <th className="p-3 font-semibold">Date</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredConnections.map(conn => (
                            <tr key={conn.id} className="border-b border-gray-700 hover:bg-gray-700/30 text-sm">
                                <td className="p-3 font-medium">{conn.seeker}</td>
                                <td className="p-3 font-medium">{conn.listener}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(conn.status)}`}>
                                        {conn.status}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-400">{conn.created_at}</td>
                                <td className="p-3">
                                    <button className="text-gray-300 hover:text-white font-medium">View Details</button>
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
