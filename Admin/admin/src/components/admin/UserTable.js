"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import VerifyOTPModal from "../VerifyOtpModal";
import { Search, Filter, MoreVertical, Trash2, Eye, CheckCircle, AlertCircle, User, Users } from "lucide-react";
import UseractiveModal from "../UseractiveModal";
import UserDetailModal from "../UserDetailModal";

export default function UserTable({ searchTerm = "", filterType = "all" }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToVerify, setUserToVerify] = useState(null);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [error, setError] = useState(null);
  const [useractiveModalOpen, setUseractiveModalOpen] = useState(null); // This state will hold the user for the active/deactivate modal
  const [viewUser, setViewUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const adminToken = localStorage.getItem("adminToken");
      
      if (!adminToken) {
        router.push("/admin/login");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        
        const data = await response.json();
        const usersWithStatus = data.map(user => ({
          ...user, 
          otp_verified: user.otp_verified || false
        }));
        setUsers(usersWithStatus);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  const handleUserVerified = (verifiedUserId) => {
    setUsers(users.map(user => 
      user.u_id === verifiedUserId ? { ...user, otp_verified: true } : user
    ));
  };

  const handleUserDeactivated = (deactivatedUserId) => {
    setUsers(users.map(user => 
      user.u_id === deactivatedUserId ? { ...user, is_active: false } : user
    ));
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete the user: ${user.username}?`)) {
      const adminToken = localStorage.getItem("adminToken");
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.u_id}/delete/`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        
        if (!response.ok) throw new Error("Failed to delete user");
        setUsers(users.filter((u) => u.u_id !== user.u_id));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("There was an error deleting the user.");
      }
    }
  };

  // Filter users based on search term and filter type
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || (
      (filterType === 'listener' && user.user_type?.toLowerCase() === 'listener') ||
      (filterType === 'seeker' && user.user_type?.toLowerCase() === 'seeker')
    );
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (user) => {
    if (user.is_active === false) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
          <UserX className="w-3 h-3" />
          Deactivated
        </span>
      );
    } else if (user.otp_verified) {
      return (
       <button onClick={() => setUseractiveModalOpen(user)}>
  {user?.is_active ? (
    // If user is active (true)
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
      <CheckCircle className="w-3 h-3" />
      Active
    </span>
  ) : (
    // If user is inactive (false)
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
      <AlertCircle className="w-3 h-3" />
      Inactive
    </span>
  )}
</button>
      );
    } else {
      return (
        <button
          onClick={() => setUserToVerify(user)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/40 transition-colors"
        >
          <AlertCircle className="w-3 h-3" />
          Verify OTP
        </button>
      );
    }
  };

  const getUserTypeBadge = (userType) => {
    const typeColors = {
      'listener': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'seeker': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'default': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      'admin': 'bg-green-500/20 text-green-300 border-green-500/30'
    };
    
    const colors = typeColors[userType?.toLowerCase()] || typeColors.default;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${colors}`}>
        {userType === 'listener' ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
        {userType || 'Unknown'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-red-300 mb-2">Error Loading Users</h3>
        <p className="text-red-200 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Users ({filteredUsers.length})</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter className="w-4 h-4" />
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredUsers.map((user) => (
              <tr key={user.u_id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{user.username}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getUserTypeBadge(user.user_type)}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(user)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="View Details"
                      onClick={() => setViewUser(user)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      onClick={() => handleDeleteUser(user)}
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No users found</h3>
          <p className="text-gray-400">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No users have been added yet'
            }
          </p>
        </div>
      )}

      {/* OTP Verification Modal */}
      <VerifyOTPModal
        isOpen={!!userToVerify}
        onClose={() => setUserToVerify(null)}
        user={userToVerify}
        onUserVerified={handleUserVerified}
      />
    </div>
  );
}