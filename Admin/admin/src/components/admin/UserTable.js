// components/admin/UserTable.js
'use client'; // This component will be interactive

import { useState, useEffect } from 'react';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // In a real app, you would fetch this data from your API
  useEffect(() => {
    // const fetchedUsers = await fetch('/api/users'); // Your Django API endpoint
    // setUsers(fetchedUsers);
    // Placeholder data:
    setUsers([
        { id: 1, username: 'seeker_test', email: 'seeker@test.com', user_type: 'seeker', is_active: true },
        { id: 2, username: 'listener_test', email: 'listener@test.com', user_type: 'listener', is_active: false },
    ]);
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 mb-4 bg-gray-700 rounded"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
            <th className="p-2">Type</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.user_type}</td>
              <td className="p-2">
                <span className={user.is_active ? 'text-green-400' : 'text-red-400'}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="p-2">
                <button className="text-indigo-400 hover:text-indigo-300">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}