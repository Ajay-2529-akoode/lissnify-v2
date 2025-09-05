// src/components/admin/VerifyOTPModal.tsx
'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

interface User {
  id: number;
  username: string;
  email: string;
}

interface VerifyOTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserVerified: (userId: number) => void;
  user: User | null;
}

export default function VerifyOTPModal({ isOpen, onClose, onUserVerified, user }: VerifyOTPModalProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    const adminToken = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL1}/verify-otp/`, { // Using API_URL for consistency
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          otp: otp,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to verify OTP.');
      }

      toast.success('User verified and activated successfully!');
      onUserVerified(user.id); // Notify parent component to update the user's status
      setOtp(''); // Reset OTP field
      onClose();
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e2632] rounded-lg shadow-xl p-6 w-full max-w-sm border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-2">Verify User: {user.username}</h2>
        <p className="text-gray-400 mb-6">Enter the 6-digit OTP to activate this user's account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="otp-input" className="block text-sm font-medium text-gray-300 mb-2">OTP Code</label>
            <input
              id="otp-input"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg text-white"
              placeholder="- - - - - -"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-semibold bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Verifying...' : 'Verify & Activate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}