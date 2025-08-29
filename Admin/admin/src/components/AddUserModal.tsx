'use client';

import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { X, UserPlus, Eye, EyeOff, Check, X as XMark } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Seeker');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const adminToken = localStorage.getItem("adminToken");
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL1}/categories/`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setAvailableCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Could not load categories.");
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handlePreferenceToggle = (categoryId) => {
    setSelectedPreferences(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e) => {
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
      onClose();
      
      // Reset form
      setUsername('');
      setEmail('');
      setPassword('');
      setUserType('Seeker');
      setSelectedPreferences([]);

    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form
      setUsername('');
      setEmail('');
      setPassword('');
      setUserType('Seeker');
      setSelectedPreferences([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
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
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter email address"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User Type
            </label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="Seeker">Seeker</option>
              <option value="Listener">Listener</option>
            </select>
          </div>
          
          {/* Preferences */}
          {availableCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Preferences (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => handlePreferenceToggle(category.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      selectedPreferences.includes(category.id)
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
                    }`}
                  >
                    {selectedPreferences.includes(category.id) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <XMark className="w-4 h-4" />
                    )}
                    {category.name}
                  </button>
                ))}
              </div>
              {selectedPreferences.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  {selectedPreferences.length} preference(s) selected
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
