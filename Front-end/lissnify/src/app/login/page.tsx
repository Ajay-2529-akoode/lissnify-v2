"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { loginUser } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardUrl } from "@/utils/api";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({
        username_or_email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Store user data in auth context - map from response data
        const userData = {
          full_name: response.data?.user?.name || formData.email.split("@")[0], // Use response name or email prefix
          email: response.data?.user?.email || formData.email,
          user_type: response.data?.user?.user_type || "seeker", // Default to seeker if not specified
        };
        login(userData, response.data?.access);

        // Determine redirect URL
        const userType = response.data.user?.user_type || "seeker";
        const dashboardUrl = getDashboardUrl(userType);
        console.log(
          "Redirecting to:",
          dashboardUrl,
          "for user type:",
          userType
        );
        localStorage.setItem("adminToken", response.data?.access);

        // 1. Show the success message
        toast.success("Login successful!");

        // 2. Wait a moment before redirecting
        setTimeout(() => {
          router.push(dashboardUrl);
        }, 1000); // Delay of 1 second (1000ms)
      } else {
        setError(
          response.error || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.log("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      {/* Background Image - Adjusted to fit between navbar and footer */}
      <div className="absolute inset-0 z-0 min-h-screen">
        <Image
          src="/EmotionalSupportLogIn.png"
          alt="Emotional Support Background"
          fill
          className="object-contain object-center"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 via-yellow-100/50 to-white/40"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-24">
        <div className="w-[400px] max-w-[90%] bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Login to continue your soulful journey
            </p>

            {/* Debug Info - Remove in production */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-2 bg-gray-100 rounded-lg text-xs text-gray-600">
                <p><strong>Debug:</strong> Login will redirect based on backend user_type response</p>
              </div>
            )} */}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/80"
                  placeholder="Enter your email or Username"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 bg-white/80"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
            <p className="text-gray-600">
              <Link
                href="/"
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
