"use client";

import { useState } from "react";

// ✅ Best Practice: Define an interface for the form state
interface IFormData {
  Category_name: string;
  description: string;
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
    setFormData({ Category_name: "", description: "", icon: null });
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
      if (formData.icon) {
        formDataToSend.append("icon", formData.icon);
      }

      // ✅ FIX 1: Use backticks (`) for the URL to correctly embed the variable
      const response = await fetch(`${API_BASE}/categories/`, {
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
      {/* Rest of your JSX is correct and can remain the same... */}
      {/* ... */}
       <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add New Category</h2>
          <button
            onClick={resetFormAndClose} // Use the refactored function
            className="text-gray-400 hover:text-white transition-colors"
          >
            {/* SVG icon */}
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields and buttons... your JSX here is fine */}
          {/* ... */}
        </form>
      </div>
    </div>
  );
}