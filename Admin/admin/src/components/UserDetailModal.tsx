'use client';

import { useEffect, useState } from 'react';
import { X, User as UserIcon, Mail, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export interface AdminUser {
  u_id: number;
  username: string;
  email: string;
  user_type?: string | null;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  otp_verified?: boolean;
  DOB?: string | null;
  user_status?: string | null;
}

interface UserDetailModalProps {
  isOpen: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onUpdated?: (updated: AdminUser) => void;
}

export default function UserDetailModal({ isOpen, user, onClose, onUpdated }: UserDetailModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);
  const [dob, setDob] = useState<string>('');
  const [userStatus, setUserStatus] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setUserType(user.user_type || '');
      setIsActive(Boolean(user.is_active));
      setIsStaff(Boolean(user.is_staff));
      setIsSuperuser(Boolean(user.is_superuser));
      setDob(user.DOB ? String(user.DOB) : '');
      setUserStatus(user.user_status || '');
    } else {
      setUsername('');
      setEmail('');
      setUserType('');
      setIsActive(false);
      setIsStaff(false);
      setIsSuperuser(false);
      setDob('');
      setUserStatus('');
    }
  }, [isOpen, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast.error('Not authenticated. Please log in again.');
        return;
      }

      const payload: any = {
        username: username.trim(),
        email: email.trim(),
        user_type: userType,
        is_active: isActive,
        is_staff: isStaff,
        is_superuser: isSuperuser,
        user_status: userStatus,
      };
      if (dob) payload.DOB = dob; // expect yyyy-mm-dd

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updatesUser/${user.u_id}/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof data === 'object' ? Object.values(data).join(' ') : 'Failed to update user';
        throw new Error(msg);
      }

      toast.success('User updated successfully');
      onUpdated?.({
        u_id: user.u_id,
        username,
        email,
        user_type: userType,
        is_active: isActive,
        is_staff: isStaff,
        is_superuser: isSuperuser,
        DOB: dob || null,
        user_status: userStatus,
        otp_verified: user.otp_verified,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/20 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">User Details</h2>
              <p className="text-sm text-gray-400">View and edit user information</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">User Type</label>
              <div className="relative">
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="listener">Listener</option>
                  <option value="seeker">Seeker</option>
                </select>
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Status</label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  Active
                </label>
                {user?.otp_verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                    <CheckCircle className="w-3 h-3" /> OTP Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                    <AlertCircle className="w-3 h-3" /> Not Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">User Status</label>
              <input
                type="text"
                value={userStatus}
                onChange={(e) => setUserStatus(e.target.value)}
                placeholder="e.g., active, suspended"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={isStaff} onChange={(e) => setIsStaff(e.target.checked)} />
              Staff
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={isSuperuser} onChange={(e) => setIsSuperuser(e.target.checked)} />
              Superuser
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-gray-600/50 hover:bg-gray-600 text-white font-semibold rounded-xl">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


