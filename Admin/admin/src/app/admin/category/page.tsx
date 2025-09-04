// app/admin/category/page.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/SideBar";
import EditCategoryModal from "@/components/EditCategoryModal";
import AddCategoryModal from "@/components/AddCategoryModal"; 

// --- Helper Icons ---
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

// ✅ Base API URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL1;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // ✅ Get token
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Open add modal
  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  // ✅ Close add modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // ✅ Handle category added
  const handleCategoryAdded = () => {
    fetchCategories();
  };

  // ✅ Delete category
  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${API_BASE}/categories/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete category");
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Open edit modal
  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // ✅ Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  // ✅ Handle category update
  const handleCategoryUpdated = () => {
    fetchCategories();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Category Management
          </h1>
          <button
            onClick={handleAddCategory}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Category
          </button>
        </header>



        {/* Categories List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <h2 className="text-lg font-semibold p-6">Existing Categories</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-white/20 text-sm text-gray-300 bg-white/5">
                  <th className="p-3 font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                    Category
                  </th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-white/10 hover:bg-white/5 text-sm">
                    <td className="p-3 font-medium text-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 flex-shrink-0">
                          {category.icon ? (
                            <img 
                              src={`http://localhost:8000/public/${category.icon}`}
                              alt={category.name}
                              className="w-6 h-6 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="text-gray-400"
                            style={{ display: category.icon ? 'none' : 'block' }}
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21,15 16,10 5,21"></polyline>
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-white">{category.name}</div>
                          {category.description && (
                            <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 flex gap-4 justify-end">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="flex items-center gap-1 text-gray-300 hover:text-white font-medium"
                      >
                        <EditIcon /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 font-medium"
                      >
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

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onCategoryAdded={handleCategoryAdded}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onCategoryUpdated={handleCategoryUpdated}
        category={selectedCategory}
      />
    </div>
  );
}