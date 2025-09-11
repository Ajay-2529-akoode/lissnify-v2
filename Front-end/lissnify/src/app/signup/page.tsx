"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { registerUser, sendOTP, verifyOTP, testBackendConnection, getDashboardUrl, isValidUserType, getCategories } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { 
  User, 
  Mail, 
  Lock, 
  Calendar, 
  Venus, 
  Users, 
  ArrowRight,
  Heart,
  Shield,
  Sparkles,
  Check,
  Smartphone
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    // u_id: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    status: "pending",
    user_type: "",
    preferences: [5, 6],
    DOB: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signup'); // 'signup' or 'login'
  const [categories, setCategories] = useState<Array<{id: number, name: string, description: string, icon: string}>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Detect role from query parameters and pre-select user_type
  useEffect(() => {
    const role = searchParams.get('role');
    console.log('Role from URL:', role);
    if (role === 'seeker') {
      setFormData(prev => ({ ...prev, user_type: 'seeker' }));
      console.log('Pre-selected role: seeker');
    } else if (role === 'listener') {
      setFormData(prev => ({ ...prev, user_type: 'listener' }));
      console.log('Pre-selected role: listener');
    } else {
      console.log('No role parameter, keeping default state');
    }
  }, [searchParams]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          console.error('Failed to fetch categories:', response.error);
          // Fallback to hardcoded categories if API fails
          setCategories([
            { id: 1, name: 'Anxiety', description: 'Support for anxiety-related issues', icon: '/CategoryIcon/anxiety.png' },
            { id: 2, name: 'Depression', description: 'Support for depression-related issues', icon: '/CategoryIcon/depression.png' },
            { id: 3, name: 'Breakup', description: 'Support for breakup and heartbreak', icon: '/CategoryIcon/breakup.png' },
            { id: 4, name: 'Career Stress', description: 'Support for career-related stress', icon: '/CategoryIcon/careerStress.png' },
            { id: 5, name: 'Loneliness', description: 'Support for loneliness and isolation', icon: '/CategoryIcon/loneliness.png' },
            { id: 6, name: 'Relationship Issues', description: 'Support for relationship challenges', icon: '/CategoryIcon/relationshipIssue.png' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to hardcoded categories
        setCategories([
          { id: 1, name: 'Anxiety', description: 'Support for anxiety-related issues', icon: '/CategoryIcon/anxiety.png' },
          { id: 2, name: 'Depression', description: 'Support for depression-related issues', icon: '/CategoryIcon/depression.png' },
          { id: 3, name: 'Breakup', description: 'Support for breakup and heartbreak', icon: '/CategoryIcon/breakup.png' },
          { id: 4, name: 'Career Stress', description: 'Support for career-related stress', icon: '/CategoryIcon/careerStress.png' },
          { id: 5, name: 'Loneliness', description: 'Support for loneliness and isolation', icon: '/CategoryIcon/loneliness.png' },
          { id: 6, name: 'Relationship Issues', description: 'Support for relationship challenges', icon: '/CategoryIcon/relationshipIssue.png' },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
    if (tab === 'login') {
      router.push('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    setError("");
    setSuccess("");
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate required fields
    if (!formData.username || !formData.email || 
        !formData.password || !formData.DOB || !formData.user_type) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate user_type is valid
    if (!isValidUserType(formData.user_type)) {
      setError("Please select a valid role (Support Seeker or Listener with Empathy)");
      return;
    }

    // Validate preferences
    if (formData.preferences.length === 0) {
      setError("Please select at least one area of support");
      return;
    }

    // If OTP is not shown yet, send OTP first
    if (!showOTP) {
      await handleSendOTP();
      return;
    }

    // If OTP is shown, verify it and complete registration
    if (showOTP && formData.otp) {
      await handleVerifyOTPAndRegister();
      return;
    }

    // If OTP is shown but no OTP entered
    if (showOTP && !formData.otp) {
      setError("Please enter the OTP to continue");
      return;
    }
  };

  const handleSendOTP = async () => {
    setOtpLoading(true);
    setError("");
    
    try {
      console.log("Sending OTP to:", formData.email);
      const response = await registerUser({
        // u_id: formData.u_id,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        otp: formData.otp,
        status: formData.status,
        user_type: formData.user_type,
        preferences: formData.preferences,
        DOB: formData.DOB
      });
      if (response.success) {
        setShowOTP(true);
        setOtpSent(true);
        setSuccess("OTP sent to your email! Please check and enter the code.");
      } else {
        setError(response.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTPAndRegister = async () => {
    if (!formData.otp) {
      setError("Please enter the OTP");
      return;
    }
    setIsLoading(true);
    setError("");
    
    try {
      // First verify OTP
      console.log("Verifying OTP:", formData.otp, "for email:", formData.email);
      const otpResponse = await verifyOTP(formData.email, formData.otp);
      
      if (!otpResponse.success) {
        setError("Invalid OTP. Please try again.");
        return;
      }

      // If OTP is valid, proceed with registration
      console.log("OTP verified successfully, proceeding with registration...");
     
      if (otpResponse.success) {
        // Auto-login after successful registration
        const userData = {
          username: formData.username,
          email: formData.email,
          user_type: formData.user_type
        };
        
        login(userData);
        setSuccess(`Registration successful! Redirecting to ${formData.user_type === 'seeker' ? 'Seeker' : 'Listener'} dashboard...`);

        setTimeout(() => {
          const dashboardUrl = getDashboardUrl(formData.user_type);
          console.log('Signup successful, redirecting to:', dashboardUrl, 'for user type:', formData.user_type);
          router.push(dashboardUrl);
        }, 2000);
      } else {
        setError(otpResponse.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <Navbar />
      
      <div className="p-4">
        {/* Header Section */}
        <div className="text-center pt-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {activeTab === 'signup' 
              ? (formData.user_type 
                  ? `Create Your ${formData.user_type === 'seeker' ? 'Support Seeker' : 'Listener'} Account`
                  : 'Create Your Account'
                )
              : 'Welcome Back'
            }
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {activeTab === 'signup' 
              ? (formData.user_type 
                  ? `Join our soulful mental wellness community as a ${formData.user_type === 'seeker' ? 'Support Seeker' : 'Listener with Empathy'} and start your journey towards healing and growth`
                  : 'Join our soulful mental wellness community and start your journey towards healing and growth'
                )
              : 'Sign in to continue your journey of healing and growth'
            }
          </p>
        </div>

        {/* Main Card Container - Centered Form */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
            <div className="p-8">
              <div className="max-w-2xl mx-auto w-full">
                {/* Role Pre-selection Message */}
                {searchParams.get('role') && formData.user_type && (
                  <div className="mb-6 p-4 bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] border border-orange-400 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-black" />
                      <div>
                        <p className="text-base font-medium text-black">
                          Role Pre-selected: {formData.user_type === 'seeker' ? 'Support Seeker' : 'Listener with Empathy'}
                        </p>
                        <p className="text-sm text-black mt-1">
                          You can change this selection below if needed
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Header with Role Info */}
                {formData.user_type ? (
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] rounded-full border border-orange-500">
                      <Users className="w-4 h-4 text-black" />
                      <span className="text-base font-medium text-black">
                        Creating account as: {formData.user_type === 'seeker' ? 'Support Seeker' : 'Listener with Empathy'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Please select your role below
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* First Row - User ID and Username */}
                  <div className="grid md:grid-cols-2 gap-4">

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                          placeholder="Enter username"
                          required
                        />
                      </div>
                    </div>
                     <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  </div>

                  {/* Email */}
                 

                  {/* Password and Confirm Password */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                          placeholder="Create password"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                          placeholder="Confirm password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date of Birth and Role Selection */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="DOB"
                          value={formData.DOB}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    {/* User Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        I want to be a
                        {formData.user_type && (
                          <span className="ml-2 text-xs text-green-600 font-medium">
                            (Pre-selected from Hero)
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="user_type"
                          value={formData.user_type}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, user_type: e.target.value})}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 appearance-none ${
                            formData.user_type 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-gray-300 bg-white'
                          }`}
                          required
                        >
                          <option value="">Select your role</option>
                          <option value="seeker">Support Seeker</option>
                          <option value="listener">Listener with Empathy</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What areas would you like support with?
                    </label>
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-2 text-gray-600">Loading categories...</span>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-3 gap-3">
                        {categories.map((category) => (
                          <label key={category.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                            <input
                              type="checkbox"
                              value={category.id}
                              checked={formData.preferences.includes(category.id)}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    preferences: [...prev.preferences, category.id]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    preferences: prev.preferences.filter(p => p !== category.id)
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                            />
                            <span className="text-sm text-gray-700">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* OTP Section */}
                  {showOTP && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-blue-700 text-sm">
                          📧 OTP has been sent to <strong>{formData.email}</strong>
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter OTP
                        </label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="otp"
                            value={formData.otp}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={otpLoading}
                          className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors disabled:opacity-50"
                        >
                          {otpLoading ? "Sending..." : "Resend OTP"}
                        </button>
                        <span className="text-xs text-gray-500">
                          Didn't receive? Check spam folder
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                      {success}
                    </div>
                  )}

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    disabled={isLoading || otpLoading}
                    className={`w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      isLoading || otpLoading
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : otpLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending OTP...</span>
                      </>
                    ) : !showOTP ? (
                      <>
                        <span>Send OTP & Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <span>Verify OTP & Sign Up</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Links */}
                  <div className="text-center space-y-2">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                        Login here
                      </Link>
                    </p>
                    <p className="text-gray-600">
                      <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                        ← Back to Home
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}