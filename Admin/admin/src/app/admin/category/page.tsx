// This file should be placed at app/admin/category/page.tsx
// It's designed to match the theme of your dashboard.
'use client'; // This page is interactive, so we mark it as a client component.

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/admin/SideBar';
// --- Helper Components & Icons ---
// In a real app, these would be in separate files.

const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;




// --- Mock Data ---
// In a real application, this array would be fetched from your Django API.
const mockCategories = [
  { id: 1, name: 'Breakup' },
  { id: 2, name: 'Relationship issues' },
  { id: 3, name: 'Loneliness' },
  { id: 4, name: 'Career Stress' },
  { id: 5, name: 'Anxiety' },
  { id: 6, name: 'Depression' },
];

// --- Main Page Component ---

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;

    const newCategory = {
      id: Date.now(), // Use a temporary unique ID
      name: newCategoryName.trim(),
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName(''); // Clear the input field
  };

  const handleDeleteCategory = (idToDelete) => {
    setCategories(categories.filter(category => category.id !== idToDelete));
  };

  return (
    <div className="flex min-h-screen bg-[#111827] text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Category Management</h1>
        </header>

        {/* Add Category Form */}
        <div className="bg-[#1e2632] p-6 rounded-lg mb-8">
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="flex gap-4">
                <input
                    type="text"
                    placeholder="E.g., Family issues"
                    className="flex-grow p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
                    Add
                </button>
            </form>
        </div>
        
        {/* Categories List */}
        <div className="bg-[#1e2632] rounded-lg overflow-hidden">
            <h2 className="text-lg font-semibold p-6">Existing Categories</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                    <thead>
                        <tr className="border-b border-gray-700 text-sm text-gray-400 bg-[#1e2632]">
                            <th className="p-3 font-semibold">Category Name</th>
                            <th className="p-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id} className="border-b border-gray-700 hover:bg-gray-700/30 text-sm">
                                <td className="p-3 font-medium">{category.name}</td>
                                <td className="p-3 flex gap-4 justify-end">
                                    <button className="flex items-center gap-1 text-gray-300 hover:text-white font-medium">
                                        <EditIcon /> Edit
                                    </button>
                                    <button onClick={() => handleDeleteCategory(category.id)} className="flex items-center gap-1 text-red-400 hover:text-red-300 font-medium">
                                        <TrashIcon /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}
