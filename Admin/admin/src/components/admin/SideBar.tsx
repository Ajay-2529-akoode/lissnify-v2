import Link from 'next/link';
import { ListIcon } from "lucide-react";

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const Sidebar = () => (
  <aside className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Elysian Admin</h2>
          <nav className="space-y-4">
            <Link href="/admin" className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition">
              <DashboardIcon />
              Dashboard
            </Link>
            <Link href="/admin/users" className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition">
              <UsersIcon />
              Users
            </Link>
            <Link href="/admin/category" className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition">
              <ListIcon />
              Category Manager
            </Link>
            <Link href="/admin/connections" className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition">
              <SettingsIcon />
              Connections
            </Link>
            <Link href="/admin/logout" className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition">
              <LogoutIcon />
              Log out
            </Link>
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
);

export default Sidebar;