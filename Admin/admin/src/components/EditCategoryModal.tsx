'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Edit3, Image, FileText } from 'lucide-react';

interface Category {
  id: number;
  Category_name: string;
  icon?: string;
  description?: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpdated: () => void;
  category: Category | null;
}

export default function EditCategoryModal({ isOpen, onClose, onCategoryUpdated, category }: EditCategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Reset form when modal opens/closes or category changes
  useEffect(() => {
    if (isOpen && category) {
      setCategoryName(category.Category_name || '');
      // build absolute preview URL if we have a stored relative path
      // const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
      // const relative = (category.icon || '').replace(/^\//, '');
      // setIconUrl(relative ? `${base}/${relative}` : '');
      const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
      const iconPath = category.icon || '';
      // Handle both relative and absolute URLs
      if (iconPath.startsWith('http')) {
        setIconUrl(iconPath);
      } else if (iconPath) {
        setIconUrl(`${base}${iconPath.startsWith('/') ? '' : '/'}${iconPath}`);
      } else {
        setIconUrl('');
      }
      setDescription(category.description || '');
      setSlug(category.slug || '');
      setMetaTitle(category.meta_title || '');
      setMetaDescription(category.meta_description || '');
    } else {
      setSlug('');
      setCategoryName('');
      setIconUrl('');
      setIconFile(null);
      setDescription('');
      setMetaTitle('');
      setMetaDescription('');
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setIsLoading(true);

    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      toast.error("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Category_name', categoryName.trim());
      formData.append('description', description.trim());
      formData.append('slug', slug.trim());
      formData.append('meta_title', metaTitle.trim());
      formData.append('meta_description', metaDescription.trim());
      if (iconFile) {
        formData.append('icon', iconFile);
      } else if (iconUrl && !iconUrl.startsWith('blob:')) {
        // if it's already an absolute URL, backend expects relative or file; allow passing through existing value
        // skip appending to avoid overwriting with full URL
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${category.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = Object.values(responseData).join(' ') || 'Failed to update category.';
        throw new Error(errorMessage);
      }

      toast.success('Category updated successfully!');
      onCategoryUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error updating category:", error);
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

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Edit3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Category</h2>
              <p className="text-sm text-gray-400">Update category details</p>
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
          {/* Category Name */}
          <div className="space-y-2">
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-300">
              Category Name *
            </label>
            <input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter category name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category-slug" className="block text-sm font-medium text-gray-300">
              Slug
            </label>
            <input
              id="category-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter category slug"
            />
          </div>


          {/* Icon (single combined input) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Icon</label>
            <div className="relative flex items-stretch gap-2">
              <input
                type="text"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="Paste image URL or use Choose File..."
                className="flex-1 px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => document.getElementById('edit-cat-icon-input')?.click()}
                className="px-4 py-3 bg-purple-600/80 hover:bg-purple-700 text-white font-semibold rounded-xl"
              >
                Choose File
              </button>
              <input
                id="edit-cat-icon-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setIconFile(file);
                  if (file) {
                    setIconUrl(file.name);
                  }
                }}
              />
              <Image className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {/* {(iconFile || (iconUrl && iconUrl.startsWith('http'))) && ( */}
            {(iconFile || iconUrl) && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-2">Preview:</p>
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                  <img
                    src={iconFile ? URL.createObjectURL(iconFile) : iconUrl}
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

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="category-description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <div className="relative">
              <textarea
                id="category-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Enter category description..."
              />
              <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="meta-title" className="block text-sm font-medium text-gray-300">
              Meta Title
            </label>
            <input
              id="meta-title"
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter Meta Title"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="meta-description" className="block text-sm font-medium text-gray-300">
              Meta Description
            </label>
            <textarea
              id="meta-description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3  bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter Meta Description..."
            />
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
              disabled={isLoading || !categoryName.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
