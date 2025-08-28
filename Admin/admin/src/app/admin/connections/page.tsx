// This file should be placed at app/admin/connections/page.tsx
// It's designed to match the theme of your dashboard and uses live API data.
'use client'; // This page is interactive, so we mark it as a client component.

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/SideBar';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface User {
  username: string;
  email?: string;
}

interface Connection {
  id: number;
  seeker: User;
  listener: User;
  status: 'Accepted' | 'Pending' | 'Rejected';
  created_at: string;
}

export default function ConnectionsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Accepted' | 'Pending' | 'Rejected'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        router.push("/admin/login");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) router.push("/admin/login");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setConnections(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredConnections = useMemo(() => {
    return connections
      .filter(connection => {
        if (filter === 'All') return true;
        return connection.status === filter;
      })
      .filter(connection => {
        const search = searchTerm.toLowerCase();
        return (
          connection.seeker?.username.toLowerCase().includes(search) ||
          connection.listener?.username.toLowerCase().includes(search)
        );
      });
  }, [connections, filter, searchTerm]);

  const getStatusBadge = (status: Connection['status']) => {
    const statusConfig = {
      'Accepted': {
        icon: CheckCircle,
        colors: 'bg-green-500/20 text-green-300 border-green-500/30',
        label: 'Accepted'
      },
      'Pending': {
        icon: AlertCircle,
        colors: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        label: 'Pending'
      },
      'Rejected': {
        icon: XCircle,
        colors: 'bg-red-500/20 text-red-300 border-red-500/30',
        label: 'Rejected'
      }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${config.colors}`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getFilterButtonClass = (filterValue: Connection['status'] | 'All') => {
    const baseClass = "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200";
    return filter === filterValue 
      ? `${baseClass} bg-blue-600 text-white shadow-lg` 
      : `${baseClass} bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/20`;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Connection Management</h1>
        </header>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6 flex flex-col md:flex-row gap-4">
            <input
                type="text"
                placeholder="Search by seeker or listener..."
                className="flex-grow px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setFilter('All')} className={getFilterButtonClass('All')}>All</button>
                <button onClick={() => setFilter('Accepted')} className={getFilterButtonClass('Accepted')}>Accepted</button>
                <button onClick={() => setFilter('Pending')} className={getFilterButtonClass('Pending')}>Pending</button>
                <button onClick={() => setFilter('Rejected')} className={getFilterButtonClass('Rejected')}>Rejected</button>
            </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="p-6 text-center">Loading connections...</div>
                ) : error ? (
                    <div className="p-6 text-center text-red-400">Error: {error}</div>
                ) : (
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="border-b border-white/20 text-sm text-gray-300 bg-white/5">
                                <th className="p-3 font-semibold">Seeker</th>
                                <th className="p-3 font-semibold">Listener</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold">Date</th>
                                <th className="p-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredConnections.map(conn => (
                                <tr key={conn.id} className="border-b border-white/10 hover:bg-white/5 text-sm">
                                    <td className="p-3 font-medium text-gray-100">{conn.seeker?.username || 'N/A'}</td>
                                    <td className="p-3 font-medium text-gray-100">{conn.listener?.username || 'N/A'}</td>
                                    <td className="p-3">
                                        {getStatusBadge(conn.status)}
                                    </td>
                                    <td className="p-3 text-gray-300">{new Date(conn.created_at).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <button className="text-gray-300 hover:text-white font-medium">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
