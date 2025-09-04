import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ListTodo, 
  Network, 
  LogOut, 
  Activity,
  Settings,
  Shield
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLogout = async () => {
    const accessToken = localStorage.getItem('adminToken');
    const refreshToken = localStorage.getItem('adminRefresh');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL1}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refresh: refreshToken || '' })
      });

      if (!response.ok) {
        console.error("Logout failed on server (continuing to clear local session).");
      }

      // Always clear local session to ensure logout client-side
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefresh');
      router.push('/admin/login');
      console.log("Logout complete");
    } catch (error) {
      console.error("An error occurred during logout:", error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefresh');
      router.push('/admin/login');
    }
  };

  const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/category", icon: ListTodo, label: "Categories" },
    { href: "/admin/connections", icon: Network, label: "Connections" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 p-6 flex flex-col justify-between border-r border-gray-700/50">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Elysian</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon 
                  size={20} 
                  className={`transition-colors ${
                    isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
                  }`} 
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-6">
        {/* Server Status */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Server Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Uptime</span>
              <span className="text-green-400">99.9%</span>
            </div>
            <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full w-[99.9%] transition-all duration-1000"></div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 border border-transparent transition-all duration-200 group"
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-red-400 transition-colors" />
          <span className="font-medium">Log out</span>
        </button>

        {/* Version Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
