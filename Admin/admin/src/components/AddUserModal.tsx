// src/components/admin/AddUserModal.tsx
'use client';

import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { X, UserPlus, Eye, EyeOff, Check } from 'lucide-react';

interface Category {
  id: number;
  name?: string;
  Category_name?: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (newUser: any) => void;
}

export default function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Seeker');
  const [dob, setDob] = useState('');
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<number[]>([]);

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setUserType('Seeker');
    setDob('');
    setIsStaff(false);
    setIsSuperuser(false);
    setSelectedPreferences([]);
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      const adminToken = localStorage.getItem("adminToken");
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`, { // Using API_URL for consistency
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setAvailableCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Could not load user preferences.");
      }
    };
    
    fetchCategories();
  }, [isOpen]);

  const handlePreferenceToggle = (categoryId: number) => {
    setSelectedPreferences(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      toast.error("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          user_type: userType,
          DOB: dob || undefined,
          is_staff: isStaff,
          is_superuser: isSuperuser,
          preferences: selectedPreferences,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = Object.values(responseData).join(' ');
        throw new Error(errorMessage || 'Failed to create user.');
      }

      toast.success(responseData.message || 'User created successfully!');
      onUserAdded(responseData);
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New User</h2>
              <p className="text-sm text-gray-400">Create a new user account</p>
            </div>
          </div>
          <button onClick={handleClose} disabled={isLoading} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">User Type</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Seeker">Seeker</option>
                <option value="Listener">Listener</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-6 pt-8">
                <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={isStaff} onChange={(e) => setIsStaff(e.target.checked)} />
                  Staff
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={isSuperuser} onChange={(e) => setIsSuperuser(e.target.checked)} />
                  Superuser
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Preferences</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableCategories.map((cat) => {
                  const title = cat.Category_name || cat.name || `Category ${cat.id}`;
                  const checked = selectedPreferences.includes(cat.id);
                  return (
                    <label key={cat.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer select-none ${checked ? 'bg-blue-500/20 border-blue-500/40 text-blue-200' : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'}`}
                      onClick={() => handlePreferenceToggle(cat.id)}
                    >
                      <input type="checkbox" className="hidden" checked={checked} readOnly />
                      <span className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? 'border-blue-400 bg-blue-500/40' : 'border-gray-400'}`}>{checked ? <Check className="w-3 h-3" /> : null}</span>
                      <span className="truncate">{title}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} className="flex-1 px-4 py-3 bg-gray-600/50 hover:bg-gray-600 text-white font-semibold rounded-xl">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}