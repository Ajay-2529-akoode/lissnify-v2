"use client";

import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
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
  ArcElement,
} from "chart.js";
import { User, Users, TrendingUp, TriangleDashed, Activity, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/SideBar";
import { useEffect, useState } from "react";

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
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        router.push("/admin/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json",
            },
            signal,
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/admin/login");
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setError(err.message);
          console.error("Fetch error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl text-blue-200">Loading dashboard data...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center bg-red-500/20 border border-red-500/30 rounded-2xl p-8 max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-red-300 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-200 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-xl text-gray-300">No dashboard data available</p>
          </div>
        </main>
      </div>
    );
  }

  const userGrowthData = {
    labels: data.daily_user_growth?.map((item) => item.date) || [],
    datasets: [
      {
        label: "User Growth",
        data: data.daily_user_growth?.map((item) => item.count) || [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const dailyUsersData = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [
      {
        label: "Daily Users",
        data: [50, 70, 60, 80, 120, 150, 100],
        backgroundColor: [
          "rgba(34, 197, 94, 0.9)",     // Green-500
          "rgba(16, 185, 129, 0.9)",    // Emerald-600
          "rgba(5, 150, 105, 0.9)",     // Emerald-700
          "rgba(59, 130, 246, 0.9)",    // Blue-500
          "rgba(37, 99, 235, 0.9)",     // Blue-600
          "rgba(29, 78, 216, 0.9)",     // Blue-700
          "rgba(34, 197, 94, 0.7)",     // Green-500 (lighter)
        ],
        hoverBackgroundColor: [
          "rgba(34, 197, 94, 1)",       // Full opacity on hover
          "rgba(16, 185, 129, 1)",
          "rgba(5, 150, 105, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(37, 99, 235, 1)",
          "rgba(29, 78, 216, 1)",
          "rgba(34, 197, 94, 0.9)",
        ],
        hoverOffset: 8,
        borderWidth: 0,
        borderColor: "transparent",
        hoverBorderWidth: 0,
        hoverBorderColor: "transparent",
      },
    ],
  };

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      align: 'center',
       labels: {
         color: '#cbd5e1',
        font: {
          size: 12,
          weight: '500',
          family: 'Inter, sans-serif'
        },
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 8,
        boxHeight: 8,
        generateLabels: function(chart) {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const dataset = data.datasets[0];
              const value = dataset.data[i];
              const total = dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.backgroundColor[i],
                lineWidth: 0,
                pointStyle: 'circle',
                hidden: false,
                index: i
              };
            });
          }
          return [];
        }
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(34, 197, 94, 0.8)',
      borderWidth: 2,
      cornerRadius: 16,
      displayColors: true,
      titleFont: {
        size: 16,
        weight: 'bold'
      },
      bodyFont: {
        size: 14,
        weight: '500'
      },
      padding: 20,
      callbacks: {
        title: function(context) {
          return `📊 ${context[0].label}`;
        },
        label: function(context) {
          const value = context.parsed;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `👥 ${value} users (${percentage}%)`;
        },
        afterLabel: function(context) {
          const value = context.parsed;
          if (value >= 120) return '🚀 Peak activity day!';
          if (value >= 80) return '📈 High activity';
          if (value >= 50) return '📊 Moderate activity';
          return '📉 Low activity';
        }
      }
    }
  },
  elements: {
    arc: {
      borderWidth: 0,
      borderColor: 'transparent'
    }
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1500,
    easing: 'easeOutBounce'
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
};

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "#e5e7eb",
        bodyColor: "#e5e7eb",
        borderColor: "#374151",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#374151" },
      },
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "#374151" },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Admin</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Users className="text-blue-400" size={24} />
              </div>
              <TrendingUp className="text-green-400 opacity-60" size={20} />
            </div>
            <p className="text-gray-400 text-sm mb-1">Total Users (Seekers + Listeners)</p>
              <p className="text-2xl font-bold">
              {data?.user_breakdown?.seekers + data?.user_breakdown?.listeners || 0}
              </p>
            <p className="text-green-400 text-xs mt-2">+12% from last month</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <User className="text-green-400" size={24} />
              </div>
              <Activity className="text-blue-400 opacity-60" size={20} />
            </div>
            <p className="text-gray-400 text-sm mb-1">Active Users(Including Admin)</p>
              <p className="text-2xl font-bold">
                {data?.stat_cards?.active_users || 0}
              </p>
            <p className="text-blue-400 text-xs mt-2">+8% from last week</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <TrendingUp className="text-purple-400" size={24} />
              </div>
              <Zap className="text-yellow-400 opacity-60" size={20} />
            </div>
            <p className="text-gray-400 text-sm mb-1">Active Connections</p>
              <p className="text-2xl font-bold">
                {data?.stat_cards?.active_connections || 0}
              </p>
            <p className="text-yellow-400 text-xs mt-2">+15% from yesterday</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                <TriangleDashed className="text-orange-400" size={24} />
            </div>
              <Clock className="text-gray-400 opacity-60" size={20} />
          </div>
            <p className="text-gray-400 text-sm mb-1">Chat Rooms</p>
              <p className="text-2xl font-bold">
              {data?.stat_cards?.total_chat_rooms || 0}
            </p>
            <p className="text-gray-400 text-xs mt-2">Real-time data</p>
          </div>
        </div>

        {/* Charts Grid */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* User Growth Chart */}
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold">User Growth Trend</h2>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        Daily Growth
      </div>
    </div>
    <div className="h-64">
      {/* Assuming userGrowthData and lineChartOptions are defined */}
      <Line data={userGrowthData} options={lineChartOptions} />
    </div>
  </div>

  {/* Weekly User Activity Chart - Enhanced */}
  <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Weekly User Activity
        </h2>
        <p className="text-gray-300 text-sm mt-1">Daily user distribution across the week</p>
      </div>
      <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full px-4 py-2 border border-green-400/30">
        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-400 animate-pulse"></div>
        <span className="text-sm font-medium text-white">Live Data</span>
      </div>
    </div>
    <div className="h-80">
      <Pie data={dailyUsersData} options={chartOptions} />
    </div>
  </div>
</div>

        {/* System Health */}
        {/* <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">System Health</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-green-400">All Systems Operational</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Server Uptime</span>
                <span className="text-green-400">99.9%</span>
              </div>
              <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full w-[99.9%] transition-all duration-1000"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Database Performance</span>
                <span className="text-green-400">Excellent</span>
              </div>
              <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full w-[95%] transition-all duration-1000"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">API Response Time</span>
                <span className="text-green-400">45ms</span>
          </div>
              <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full w-[92%] transition-all duration-1000"></div>
          </div>
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
}

