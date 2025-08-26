'use client'

import { Bar, Line, Pie,Doughnut } from "react-chartjs-2";
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
  ArcElement
} from "chart.js";
import { User, Users, TrendingUp ,TriangleDashed } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/SideBar';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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
       backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)',
      'rgba(255, 86, 179, 1)',
      'rgba(86, 255, 142, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(255, 126, 126, 1)'
    ],
    hoverOffset: 4,
    borderWidth: 1,
  
      },
    ],
  };
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "right", // move legend to right
      labels: {
        color: "#fff", // white text for dark mode
        font: {
          size: 14,
          weight: "bold",
        },
        padding: 20,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let value = context.raw;
          let total = context.dataset.data.reduce((a, b) => a + b, 0);
          let percentage = ((value / total) * 100).toFixed(1) + "%";
          return `${context.label}: ${value} (${percentage})`;
        },
      },
    },
    datalabels: {
      color: "#fff",
      font: {
        weight: "bold",
        size: 12,
      },
      formatter: (value, ctx) => {
        let total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        let percentage = ((value / total) * 100).toFixed(1) + "%";
        return percentage; // show percentage inside chart
      },
    },
  },
};
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

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
              <p className="text-gray-400">Active Connections</p>
              <p className="text-2xl font-bold">87</p>
            </div>
          </div>
           <div className="bg-gray-800 rounded-2xl shadow p-6 flex items-center gap-4">
            <TriangleDashed className="text-purple-400" size={32} />
            <div>
              <p className="text-gray-400">Total Chat Rooms</p>
              <p className="text-2xl font-bold">15</p>
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
            {/* <Doughnut data={dailyUsersData} options={{ responsive: true, plugins: { legend: { display: false } }}}  /> */}
             <Pie data={dailyUsersData} options={options} />
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
