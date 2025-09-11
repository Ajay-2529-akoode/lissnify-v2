"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/Components/DashboardLayout";
import { 
  User, 
  Mail, 
  Camera, 
  Save,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/utils/api";
import { toast } from "react-toastify";
import { API_CONFIG } from "@/config/api";


// A small component for displaying API feedback
const AlertMessage = ({ message, type }: { message: string | null; type: 'error' | 'success' }) => {
  if (!message) return null;
  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400';
  const textColor = isError ? 'text-red-700' : 'text-green-700';
  const Icon = isError ? AlertCircle : CheckCircle;

  return (
    <div className={`border-l-4 p-4 rounded-md ${bgColor}`} role="alert">
      <div className="flex">
        <div className="py-1"><Icon className={`h-5 w-5 ${textColor}`} /></div>
        <div className="ml-3">
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default function SeekerProfilePage() {
  const router = useRouter();
  
  // State for form data
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    DOB: '',
  });

  // State for UI control
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for API feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for profile picture
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store initial data to revert on cancel
  const [initialData, setInitialData] = useState<any>({});

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getUserProfile();
        
        if (response.success && response.data) {
          const profile = response.data;
          console.log("Fetched profile:", profile);
          setFormData({
            username: profile.username || '',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            email: profile.email || '',
            DOB: profile.DOB || '',
          });
          setInitialData(profile);
          setProfileImageUrl(`${API_CONFIG.BASE_URL}/${profile.profile_image}` || null);
        } else {
          setError(response.error || 'Failed to load profile. Please try again.');
        }
      } catch (err) {
        setError('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImageUrl(URL.createObjectURL(file)); // Create a temporary URL for preview
      setIsEditing(true); // Automatically enter edit mode when image is changed
    }
  };

  const handleCancel = () => {
    setFormData({
      username: initialData.username || '',
      first_name: initialData.first_name || '',
      last_name: initialData.last_name || '',
      email: initialData.email || '',
      DOB: initialData.DOB || '',
    });
    setProfileImageUrl(initialData.profile_image || null);
    setProfileImageFile(null);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      formDataToSend.append('username', formData.username);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('DOB', formData.DOB);

      // Add profile image if a new one was selected
      if (profileImageFile) {
        formDataToSend.append('image', profileImageFile);
      }

      // Update profile information
      const response = await updateUserProfile(formDataToSend);
      
      if (response.success && response.data) {
        setInitialData(response.data.user); // Update the "cancel" state with new saved data
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        
        // Show success toast
        toast.success("Profile updated successfully!");
        
        // Redirect to dashboard after successful save
        setTimeout(() => {
          router.push('/dashboard/seeker');
        }, 800); // 1.5 second delay to show success message
      } else {
        setError(response.error || "Failed to update profile. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
      setProfileImageFile(null); // Clear the file buffer
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="seeker">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="seeker">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Profile Settings
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto">
            Manage your account information and preferences
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <div className="space-y-6">
              
              {/* API Feedback Messages */}
              <AlertMessage message={error} type="error" />
              <AlertMessage message={success} type="success" />

              {/* Profile Picture Section */}
              <div className="text-center">
                <div className="relative inline-block">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto mb-4" />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                      {formData.first_name ? formData.first_name.charAt(0) : <User />}
                    </div>
                  )}
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      name="DOB"
                      type="date"
                      value={formData.DOB}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-6 py-3 bg-white/70 text-[#8B4513] font-semibold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#FFB88C]/30"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
