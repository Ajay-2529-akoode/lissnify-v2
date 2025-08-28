// This file should be placed at app/admin/category/page.tsx
// It's designed to match the theme of your dashboard.
'use client'; // This page is interactive, so we mark it as a client component.

import { useState } from 'react';
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
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') return;

    setIsAdding(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newCategory = {
      id: Date.now(),
      name: newCategoryName.trim(),
      count: 0,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsAdding(false);
  };

  const handleDeleteCategory = async (idToDelete: number) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCategories(categories.filter(category => category.id !== idToDelete));
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Category Management</h1>
        </header>

        {/* Add Category Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="flex gap-4">
                <input
                    type="text"
                    placeholder="E.g., Family issues"
                    className="flex-grow px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    {isAdding ? 'Adding...' : 'Add'}
                </button>
            </form>
        </div>
        
        {/* Categories List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
            <h2 className="text-lg font-semibold p-6">Existing Categories</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                    <thead>
                        <tr className="border-b border-white/20 text-sm text-gray-300 bg-white/5">
                            <th className="p-3 font-semibold">Category Name</th>
                            <th className="p-3 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id} className="border-b border-white/10 hover:bg-white/5 text-sm">
                                <td className="p-3 font-medium text-gray-100">{category.name}</td>
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
