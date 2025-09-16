"use client"

import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function DemoPage() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const handleDemoLogin = () => {
    login({
      full_name: 'DemoUser',
      email: 'demo@example.com',
      user_type: 'seeker'
    });
  };

  const handleDemoLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Authentication Demo
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Authentication Status */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Status</h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Checking authentication...</p>
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✅ Authenticated</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">User Info:</h3>
                    <p className="text-blue-800"><strong>Full Name:</strong> {user?.full_name}</p>
                    <p className="text-blue-800"><strong>Email:</strong> {user?.email}</p>
                    <p className="text-blue-800"><strong>Role:</strong> {user?.user_type}</p>
                  </div>
                  
                  <button
                    onClick={handleDemoLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 font-medium">❌ Not Authenticated</p>
                  </div>
                  
                  <button
                    onClick={handleDemoLogin}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
                  >
                    Demo Login
                  </button>
                </div>
              )}
            </div>
            
            {/* Instructions */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Test</h2>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Check Navbar</h3>
                  <p>Look at the top navigation bar. It should show "Login" and "Sign Up" buttons when not authenticated.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Demo Login</h3>
                  <p>Click "Demo Login" to simulate a successful login. The Navbar should change to show "Hello, DemoUser" with a dropdown.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. Test Persistence</h3>
                  <p>Refresh the page. The authentication state should persist and still show the logged-in user.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">4. Logout</h3>
                  <p>Click "Logout" to clear the authentication state. The Navbar should return to showing "Login" and "Sign Up" buttons.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="mt-12 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Features Implemented</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">✅ Authentication Context</h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Global state management with React Context</li>
                  <li>• User data storage and retrieval</li>
                  <li>• Login/logout functionality</li>
                  <li>• Persistent authentication state</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">✅ Dynamic Navbar</h3>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Shows Login/Signup when not authenticated</li>
                  <li>• Shows username greeting when authenticated</li>
                  <li>• User dropdown with logout option</li>
                  <li>• Responsive mobile menu support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
