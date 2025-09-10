// app/admin/blog/page.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/SideBar";
import EditBlogModal from "@/components/EditBlogModal";
import AddBlogModal from "@/components/AddBlogModal"; 

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
//const API_BASE = process.env.NEXT_PUBLIC_API_URL1;

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  // ✅ Get token
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // ✅ Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch categories for blog creation
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL1}/categories/`, {
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
    fetchBlogs();
    fetchCategories();
  }, []);

  // ✅ Open add modal
  const handleAddBlog = () => {
    setIsAddModalOpen(true);
  };

  // ✅ Close add modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // ✅ Handle blog added
  const handleBlogAdded = () => {
    fetchBlogs();
  };

  // ✅ Delete blog
  const handleDeleteBlog = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Open edit modal
  const handleEditBlog = (blog: any) => {
    setSelectedBlog(blog);
    setIsEditModalOpen(true);
  };

  // ✅ Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBlog(null);
  };

  // ✅ Handle blog update
  const handleBlogUpdated = () => {
    fetchBlogs();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Blog Management
          </h1>
          <button
            onClick={handleAddBlog}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Blog
          </button>
        </header>

        {/* Blogs List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <h2 className="text-lg font-semibold p-6">Existing Blogs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-white/20 text-sm text-gray-300 bg-white/5">
                  <th className="p-3 font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    Blog
                  </th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Author</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-white/10 hover:bg-white/5 text-sm">
                    <td className="p-3 font-medium text-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 flex-shrink-0">
                                                     {blog.image ? (
                             <img 
                               src={`${API_BASE.replace('/admin-api', '')}/${blog.image}`}
                               alt={blog.title}
                               className="w-10 h-10 object-cover rounded-lg"
                               onError={(e) => {
                                 const target = e.currentTarget as HTMLImageElement;
                                 target.style.display = 'none';
                                 const nextElement = target.nextElementSibling as HTMLElement;
                                 if (nextElement) {
                                   nextElement.style.display = 'block';
                                 }
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
                            style={{ display: blog.image ? 'none' : 'block' }}
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-white">{blog.title}</div>
                          {blog.description && (
                            <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                              {blog.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-100">
                      {blog.category ? blog.category.Category_name : 'No Category'}
                    </td>
                    <td className="p-3 text-gray-300">
                      {blog.user || 'Unknown'}
                    </td>
                    <td className="p-3 text-gray-300">
                      {new Date(blog.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-4 justify-end">
                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="flex items-center gap-1 text-gray-300 hover:text-white font-medium"
                      >
                        <EditIcon /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
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

      {/* Add Blog Modal */}
      <AddBlogModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onBlogAdded={handleBlogAdded}
        categories={categories}
      />

      {/* Edit Blog Modal */}
      <EditBlogModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onBlogUpdated={handleBlogUpdated}
        blog={selectedBlog}
        categories={categories}
      />
    </div>
  );
}
