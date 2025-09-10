'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Edit3, Image, FileText, Tag } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  description: string;
  meta_title?: string;
  meta_description?: string;
  category?: any;
  image?: string;
  date?: string;
  user?: string;
}

interface EditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlogUpdated: () => void;
  blog: Blog | null;
  categories: any[];
}

export default function EditBlogModal({ isOpen, onClose, onBlogUpdated, blog, categories }: EditBlogModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debug log to check categories
  console.log("EditBlogModal - Categories received:", categories);

  // Reset form when modal opens/closes or blog changes
  useEffect(() => {
    if (isOpen && blog) {
      setTitle(blog.title || '');
      setDescription(blog.description || '');
      setMetaTitle(blog.meta_title || '');
      setMetaDescription(blog.meta_description || '');
      setCategoryId(blog.category?.id?.toString() || '');
      
      // Build image URL if we have a stored path
      const base = process.env.NEXT_PUBLIC_API_URL1?.replace('/admin-api', '') || '';
      const relative = (blog.image || '').replace(/^\//, '');
      setImageUrl(relative ? `${base}/${relative}` : '');
    } else {
      setTitle('');
      setDescription('');
      setMetaTitle('');
      setMetaDescription('');
      setCategoryId('');
      setImageUrl('');
      setImageFile(null);
    }
  }, [isOpen, blog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;
    
    setIsLoading(true);

    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      toast.error("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('meta_title', metaTitle.trim());
      formData.append('meta_description', metaDescription.trim());
      formData.append('category_id', categoryId.trim());
      
      if (imageFile) {
        console.log("Adding image file:", imageFile);
        formData.append('image', imageFile);
      } else if (imageUrl && imageUrl.startsWith('http')) {
        console.log("Using image URL:", imageUrl);
        // If using URL, we might need to handle this differently
        // For now, let's not append anything if no file is selected
      } else {
        console.log("No image file or valid URL provided");
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${blog.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = Object.values(responseData).join(' ') || 'Failed to update blog.';
        throw new Error(errorMessage);
      }

      toast.success('Blog updated successfully!');
      onBlogUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error updating blog:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Edit3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Blog</h2>
              <p className="text-sm text-gray-400">Update blog details</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            disabled={isLoading} 
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Blog Title */}
          <div className="space-y-2">
            <label htmlFor="edit-blog-title" className="block text-sm font-medium text-gray-300">
              Blog Title *
            </label>
            <input
              id="edit-blog-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter blog title"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label htmlFor="edit-blog-category" className="block text-sm font-medium text-gray-300">
              Category *
            </label>
            <div className="relative">
              <select
                id="edit-blog-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-gray-800">
                      {category.Category_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled className="bg-gray-800">No categories available</option>
                )}
              </select>
              <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="edit-blog-description" className="block text-sm font-medium text-gray-300">
              Description *
            </label>
            <div className="relative">
              <textarea
                id="edit-blog-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Enter blog description..."
              />
              <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Meta Title */}
          <div className="space-y-2">
            <label htmlFor="edit-blog-meta-title" className="block text-sm font-medium text-gray-300">
              Meta Title
            </label>
            <input
              id="edit-blog-meta-title"
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter meta title"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <label htmlFor="edit-blog-meta-description" className="block text-sm font-medium text-gray-300">
              Meta Description
            </label>
            <textarea
              id="edit-blog-meta-description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Enter meta description..."
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Blog Image</label>
            <div className="relative flex items-stretch gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL or use Choose File..."
                className="flex-1 px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => document.getElementById('edit-blog-image-input')?.click()}
                className="px-4 py-3 bg-purple-600/80 hover:bg-purple-700 text-white font-semibold rounded-xl"
              >
                Choose File
              </button>
              <input
                id="edit-blog-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  if (file) {
                    setImageUrl(file.name);
                  }
                }}
              />
              <Image className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {(imageFile || (imageUrl && imageUrl.startsWith('http'))) && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-2">Preview:</p>
                <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-600/50 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !description.trim() || !categoryId}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
