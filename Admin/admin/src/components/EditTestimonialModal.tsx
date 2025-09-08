'use client';

import { useState, useEffect } from 'react';
import { X, Edit3, Upload, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  feedback: string;
  rating: number;
  image?: string;
  created_at: string;
}

interface EditTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestimonialUpdated: () => void;
  testimonial: Testimonial | null;
}

export default function EditTestimonialModal({ isOpen, onClose, onTestimonialUpdated, testimonial }: EditTestimonialModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // Reset form when modal opens/closes or testimonial changes
  useEffect(() => {
    if (isOpen && testimonial) {
      setName(testimonial.name || '');
      setRole(testimonial.role || '');
      setFeedback(testimonial.feedback || '');
      setRating(testimonial.rating || 5);
      
      // Build image URL if we have a stored path
      const base = process.env.NEXT_PUBLIC_API_URL?.replace('/admin-api', '') || '';
      const fullUrl = testimonial.image ? `${base}/${testimonial.image}` : '';
      console.log('EditTestimonialModal - Image URL construction:', {
        base,
        fullUrl,
        originalImage: testimonial.image
      });
      setImageUrl(fullUrl);
    } else {
      setName('');
      setRole('');
      setFeedback('');
      setRating(5);
      setImageUrl('');
      setImageFile(null);
      setError('');
    }
  }, [isOpen, testimonial]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL for new file
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const handleClose = () => {
    if (imageFile && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('name', name);
      submitData.append('role', role);
      submitData.append('feedback', feedback);
      submitData.append('rating', rating.toString());
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${testimonial?.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update testimonial');
      }

      onTestimonialUpdated();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !testimonial) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Edit3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Testimonial</h2>
              <p className="text-sm text-gray-400">Update testimonial details</p>
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
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              placeholder="Enter person's name"
            />
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              placeholder="e.g., Student, Client, Customer"
            />
          </div>

          {/* Feedback Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Feedback *</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none"
              placeholder="Enter the testimonial feedback"
            />
          </div>

          {/* Rating Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`p-1 rounded transition-colors ${
                    star <= rating 
                      ? 'text-yellow-400 hover:text-yellow-300' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
              <span className="text-sm text-gray-400 ml-2">({rating}/5)</span>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Profile Image</label>
            
            {/* Current Image Preview */}
            {imageUrl && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Current Image:</p>
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/20">
                  <img 
                    src={imageUrl} 
                    alt="Current testimonial" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white text-sm">
                    {imageFile ? imageFile.name : 'Click to upload new image'}
                  </p>
                  <p className="text-gray-400 text-xs">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name || !feedback}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Update Testimonial
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
