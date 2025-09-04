"use client";

import { useState } from "react";
import { AlertTriangle, X, UserX } from "lucide-react";

export default function DeactivateUserModal({ isOpen, onClose, user, onUserDeactivated }) {
  const [isDeactivating, setIsDeactivating] = useState(false);

  if (!isOpen || !user) return null;

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/deactivate/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.u_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate user");
      }

      onUserDeactivated(user.u_id);
      onClose();
    } catch (error) {
      console.error("Error deactivating user:", error);
      alert("There was an error deactivating the user.");
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Deactivate User</h3>
              <p className="text-sm text-gray-400">This action can be reversed later</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-300 mb-1">Warning</h4>
              <p className="text-sm text-yellow-200">
                Deactivating this user will prevent them from accessing the platform. 
                They will need to be reactivated by an admin to regain access.
              </p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-white font-medium">{user.username}</div>
              <div className="text-gray-400 text-sm">{user.email}</div>
              <div className="text-gray-400 text-sm capitalize">{user.user_type || 'Unknown'}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeactivating}
            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDeactivate}
            disabled={isDeactivating}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeactivating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Deactivating...
              </>
            ) : (
              <>
                <UserX className="w-4 h-4" />
                Deactivate User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
