"use client";

import { useState } from "react";

// ✅ Best Practice: Define an interface for the form state
interface IFormData {
  Category_name: string;
  description: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  icon: File | null;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
}

export default function AddCategoryModal({ isOpen, onClose, onCategoryAdded }: AddCategoryModalProps) {
  const [formData, setFormData] = useState<IFormData>({
    Category_name: "",
    description: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    icon: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, icon: file }));
    }
  };

  // ✅ Refactor: Create a single function to reset and close
  const resetFormAndClose = () => {
    setFormData({ Category_name: "", description: "", slug: "", meta_title: "", meta_description: "", icon: null });
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Category_name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Category_name", formData.Category_name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("meta_title", formData.meta_title);
      formDataToSend.append("meta_description", formData.meta_description);
      if (formData.icon) {
        formDataToSend.append("icon", formData.icon);
      }

      // ✅ FIX 1: Use backticks (`) for the URL to correctly embed the variable
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`, {
        method: "POST",
        headers: {
          // ✅ FIX 2: Use backticks (`) for the Authorization header
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }
      
      onCategoryAdded();
      resetFormAndClose(); // Use the refactored function
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Add New Category</h2>
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

          {/* Category Name */}
          <div className="space-y-2">
            <label htmlFor="Category_name" className="block text-sm font-medium text-gray-300">
              Category Name *
            </label>
            <input
              id="Category_name"
              name="Category_name"
              type="text"
              value={formData.Category_name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter category name"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="Enter category description (optional)"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-300">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter category slug (optional)"
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

          {/* Icon Upload */}
          <div className="space-y-2">
            <label htmlFor="icon" className="block text-sm font-medium text-gray-300">
              Category Icon
            </label>
            <div className="relative">
              <input
                id="icon"
                name="icon"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            {formData.icon && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-2">Preview:</p>
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                  <img
                    src={URL.createObjectURL(formData.icon)}
                    alt="Icon preview"
                    className="w-8 h-8 object-contain"
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
            disabled={isLoading || !formData.Category_name.trim()}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
}