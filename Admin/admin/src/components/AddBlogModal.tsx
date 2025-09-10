"use client";

import { useState } from "react";

// ✅ Best Practice: Define an interface for the form state
interface IFormData {
  title: string;
  description: string;
  meta_title: string;
  meta_description: string;
  category_id: string;
  image: File | null;
}

interface AddBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlogAdded: () => void;
  categories: any[];
}

export default function AddBlogModal({ isOpen, onClose, onBlogAdded, categories }: AddBlogModalProps) {
  const [formData, setFormData] = useState<IFormData>({
    title: "",
    description: "",
    meta_title: "",
    meta_description: "",
    category_id: "",
    image: null,
  });
 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // Debug log to check categories
  console.log("AddBlogModal - Categories received:", categories);
  //const API_BASE = process.env.NEXT_PUBLIC_API_URL1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  // ✅ Refactor: Create a single function to reset and close
  const resetFormAndClose = () => {
    setFormData({ title: "", description: "", meta_title: "", meta_description: "", category_id: "", image: null });
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Blog title is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("meta_title", formData.meta_title);
      formDataToSend.append("meta_description", formData.meta_description);
      formDataToSend.append("category_id", formData.category_id);
      if (formData.image) {
        console.log("Adding image file:", formData.image);
        formDataToSend.append("image", formData.image);
      } else {
        console.log("No image file selected");
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog");
      }

      onBlogAdded();
      resetFormAndClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Add New Blog</h2>
          <button
            onClick={resetFormAndClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Blog Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Blog Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter blog title"
              />
            </div>


            {/* Category Selection */}
            <div className="space-y-2">
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-300">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                // ✅ I've added a specific class here for the options
                className="w-full px-4 py-3 bg-gray-800/90 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px'
                }}
              >
                {/* The options themselves do not need className */}
                <option value="">Select a category</option>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.Category_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No categories available</option>
                )}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Enter blog description"
              />
            </div>

            {/* Meta Title */}
            <div className="space-y-2">
              <label htmlFor="meta_title" className="block text-sm font-medium text-gray-300">
                Meta Title
              </label>
              <input
                id="meta_title"
                name="meta_title"
                type="text"
                value={formData.meta_title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter meta title (optional)"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <label htmlFor="meta_description" className="block text-sm font-medium text-gray-300">
                Meta Description
              </label>
              <textarea
                id="meta_description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Enter meta description (optional)"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                Blog Image
              </label>
              <div className="relative">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {formData.image && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                  <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Image preview"
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-3 p-6 border-t border-white/10 flex-shrink-0">
          <button
            type="button"
            onClick={resetFormAndClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-600/50 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !formData.title.trim() || !formData.description.trim() || !formData.category_id}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Blog'}
          </button>
        </div>
      </div>
    </div>
  );
}
