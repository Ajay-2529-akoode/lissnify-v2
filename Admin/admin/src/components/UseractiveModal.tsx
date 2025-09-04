// components/admin/ToggleUserStatusModal.tsx
import React from "react";
import { toast } from 'react-toastify';

// It's good practice to define the shape of your props
interface ToggleUserStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Add a success callback to refresh your user list
  user: {
    id: number;
    name: string;
    is_active: boolean; // We need to know the user's current status
  } | null;
}

export default function ToggleUserStatusModal({ isOpen, onClose, onSuccess, user }: ToggleUserStatusModalProps) {
  if (!isOpen || !user) return null;

  // Determine target action based on current status
  console.log("User status in modal:", user.is_active);
  const targetActive = !user.is_active; // what we will set on confirm
  const actionText = user.is_active ? "Deactivate" : "Activate";
  const actionColorClasses = user.is_active
    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    : "bg-green-600 hover:bg-green-700 focus:ring-green-500";
  const iconColorClasses = user.is_active
    ? "bg-yellow-500/20 text-yellow-400"
    : "bg-green-500/20 text-green-400";

  const handleToggleStatus = async () => {
    try {
      console.log("Toggling user status for user ID:", user.id);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/toggle-active/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ u_id: user.id, is_active: targetActive }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Throw an error if the API response is not successful
        throw new Error(data.detail || `Failed to ${actionText.toLowerCase()} user.`);
      }

      toast.success(`User ${user.name} has been ${actionText.toLowerCase()}d!`);
      onSuccess(); // Call the success handler to trigger a data refresh in the parent
      onClose(); // Close the modal
    } catch (error) {
      console.error(`Error ${actionText.toLowerCase()}ing user:`, error);
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div className="bg-[#2a314b] rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <div className="text-center">
          <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-5 ${iconColorClasses}`}>
            {user.is_active ? (
              // Warning Icon for Deactivating
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              // Checkmark Icon for Activating
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{actionText} User?</h3>
          <p className="text-gray-400 mb-8">
            Are you sure you want to {actionText.toLowerCase()}{" "}
            <span className="font-semibold text-white">{user.name}</span>'s account?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 rounded-xl bg-gray-600/50 text-white font-semibold hover:bg-gray-600/80 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#2a314b]"
            >
              Cancel
            </button>
            <button
              onClick={handleToggleStatus}
              className={`w-full px-6 py-3 rounded-xl text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2a314b] ${actionColorClasses}`}
            >
              {actionText}
            </button>
          </div>
        </div>
      </div>
      {/* This animation style can remain the same */}
      <style jsx global>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}