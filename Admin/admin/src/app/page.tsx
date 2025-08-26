'use client'

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { User, Users, TrendingUp } from "lucide-react";
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const userGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "User Growth",
        data: [500, 650, 700, 900, 1200, 1300],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  const dailyUsersData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Daily Users",
        data: [50, 70, 60, 80, 120, 150, 100],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Elysian Admin</h2>
          <nav className="space-y-4">
            <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition">Dashboard</button>
            <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition" onClick={() => {navigator.navigate('/admin/users')}}>Users</button>
            <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition">Analytics</button>
            <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition">Settings</button>
            <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition">Log out</button>
          </nav>
        </div>
        <div className="mt-6">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#1f2937"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.76)}`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold">76%</span>
            </div>
            <p className="mt-2 text-sm">Server Uptime</p>
          </div>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-600"></div>
            <span>Admin</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 rounded-2xl shadow p-6 flex items-center gap-4">
            <Users className="text-blue-400" size={32} />
            <div>
              <p className="text-gray-400">Total Users (Listeners + Seekers)</p>
              <p className="text-2xl font-bold">1,245</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow p-6 flex items-center gap-4">
            <User className="text-green-400" size={32} />
            <div>
              <p className="text-gray-400">Active Users</p>
              <p className="text-2xl font-bold">321</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow p-6 flex items-center gap-4">
            <TrendingUp className="text-purple-400" size={32} />
            <div>
              <p className="text-gray-400">Growth Rate</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-lg mb-4">User Growth</h2>
            <Line data={userGrowthData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>

          <div className="bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-lg mb-4">Daily Users</h2>
            <Bar data={dailyUsersData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>

          <div className="bg-gray-800 rounded-2xl shadow p-6 col-span-1 md:col-span-2">
            <h2 className="text-lg mb-4">System Health</h2>
            <div className="bg-gray-700 h-4 rounded-full">
              <div className="bg-green-500 h-4 rounded-full w-[90%]"></div>
            </div>
            <p className="mt-2">Uptime</p>
          </div>
        </div>
      </main>
    </div>
  );
}
