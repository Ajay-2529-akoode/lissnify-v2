// app/admin/testimonial/page.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/SideBar";
import AddTestimonialModal from "@/components/AddTestimonialModal";
import EditTestimonialModal from "@/components/EditTestimonialModal";

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
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
  </svg>
);

// ✅ Base API URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

  // ✅ Get token
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // ✅ Fetch testimonials
  const fetchTestimonials = async () => {
    try {
      console.log('Fetching testimonials from:', `${process.env.NEXT_PUBLIC_API_URL}/testimonials/`);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      const data = await res.json();
      console.log('Fetched testimonials:', data);
      setTestimonials(data);
    } catch (err) {
      console.error('Fetch testimonials error:', err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ✅ Open add modal
  const handleAddTestimonial = () => {
    setIsAddModalOpen(true);
  };

  // ✅ Close add modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // ✅ Handle testimonial added
  const handleTestimonialAdded = () => {
    fetchTestimonials();
  };

  // ✅ Delete testimonial
  const handleDeleteTestimonial = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      console.log('Deleting testimonial with ID:', id);
      console.log('Delete URL:', `${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}/`);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials/${id}/`, {
        method: "DELETE",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log('Delete response status:', res.status);
      console.log('Delete response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Delete error response:', errorText);
        throw new Error(`Failed to delete testimonial: ${res.status} ${errorText}`);
      }
      
      const result = await res.json();
      console.log('Delete success:', result);
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete testimonial: ${err.message}`);
    }
  };

  // ✅ Open edit modal
  const handleEditTestimonial = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setIsEditModalOpen(true);
  };

  // ✅ Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTestimonial(null);
  };

  // ✅ Handle testimonial update
  const handleTestimonialUpdated = () => {
    fetchTestimonials();
  };

  // ✅ Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon key={i} className={i < rating ? "text-yellow-400" : "text-gray-400"} />
    ));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Testimonial Management
          </h1>
          <button
            onClick={handleAddTestimonial}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Testimonial
          </button>
        </header>

        {/* Testimonials List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <h2 className="text-lg font-semibold p-6">Existing Testimonials</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-white/20 text-sm text-gray-300 bg-white/5">
                  <th className="p-3 font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Testimonial
                  </th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold">Rating</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="border-b border-white/10 hover:bg-white/5 text-sm">
                    <td className="p-3 font-medium text-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 flex-shrink-0">
                          {testimonial.image ? (
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL.replace('/admin-api', '')}/${testimonial.image}`}
                              alt={testimonial.name}
                              className="w-10 h-10 object-cover rounded-lg"
                              onError={(e) => {
                                console.log('Image failed to load:', `${process.env.NEXT_PUBLIC_API_URL.replace('/admin-api', '')}/${testimonial.image}`);
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                const nextElement = target.nextElementSibling as HTMLElement;
                                if (nextElement) {
                                  nextElement.style.display = 'block';
                                }
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully:', `${process.env.NEXT_PUBLIC_API_URL.replace('/admin-api', '')}/${testimonial.image}`);
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
                            style={{ display: testimonial.image ? 'none' : 'block' }}
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-white">{testimonial.name}</div>
                          {testimonial.feedback && (
                            <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                              {testimonial.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-100">
                      {testimonial.role || 'No Role'}
                    </td>
                    <td className="p-3 text-gray-100">
                      <div className="flex items-center gap-1">
                        {renderStars(testimonial.rating || 5)}
                        <span className="text-xs text-gray-400 ml-1">({testimonial.rating || 5})</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-300">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-4 justify-end">
                      <button
                        onClick={() => handleEditTestimonial(testimonial)}
                        className="flex items-center gap-1 text-gray-300 hover:text-white font-medium"
                      >
                        <EditIcon /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
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

      {/* Add Testimonial Modal */}
      <AddTestimonialModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onTestimonialAdded={handleTestimonialAdded}
      />

      {/* Edit Testimonial Modal */}
      <EditTestimonialModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onTestimonialUpdated={handleTestimonialUpdated}
        testimonial={selectedTestimonial}
      />
    </div>
  );
}
