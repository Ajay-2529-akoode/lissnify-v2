import { getApiUrl } from '@/config/api';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RegisterData {
  u_id: string;
  username: string;
  email: string;
  password: string;
  otp: string;
  status: string;
  user_type: string;
  preferences: number[];
  DOB: string;
}

export interface LoginData {
  username_or_email:string,
  password: string;
}


// Generic API call function
export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const url = getApiUrl(endpoint);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `HTTP ${response.status}`,
        data: data
      };
    }

    return {
      success: true,
      data: data,
      message: data.message
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

// Specific API functions
export const registerUser = async (userData: RegisterData): Promise<ApiResponse> => {
  return apiCall('/api/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials: LoginData): Promise<ApiResponse> => {
  return apiCall('/api/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const sendOTP = async (email: string): Promise<ApiResponse> => {
  console.log("Sending OTP request to:", getApiUrl('/api/send-otp/'));
  return apiCall('/api/send-otp/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const verifyOTP = async (email: string, otp: string): Promise<ApiResponse> => {
  return apiCall('/api/verify-otp/', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
};

// Utility function for role-based redirection
export const getDashboardUrl = (userType: string): string => {
  // Validate and normalize user type
  const normalizedType = userType?.toLowerCase()?.trim();
  
  switch (normalizedType) {
    case 'seeker':
      return '/dashboard/seeker';
    case 'listener':
      return '/dashboard/listener';
    default:
      console.warn('Unknown or invalid user type:', userType, 'redirecting to seeker dashboard as fallback');
      return '/dashboard/seeker';
  }
};

// Validation function for user types
export const isValidUserType = (userType: string): boolean => {
  const validTypes = ['seeker', 'listener'];
  return validTypes.includes(userType?.toLowerCase()?.trim());
};

// Test function to check backend connectivity
export const testBackendConnection = async (): Promise<void> => {
  console.log("🔍 Testing backend connectivity...");
  console.log("Base URL:", getApiUrl(''));
  
  // First, test if the server is reachable at all
  try {
    const rootUrl = getApiUrl('/');
    console.log("Testing root endpoint:", rootUrl);
    
    const rootResponse = await fetch(rootUrl, { method: 'GET' });
    console.log(`✅ Root endpoint: ${rootResponse.status} ${rootResponse.statusText}`);
    
    // If we get a response, let's see what's available
    if (rootResponse.ok) {
      try {
        const rootData = await rootResponse.text();
        console.log("Root response:", rootData.substring(0, 200) + "...");
      } catch (e) {
        console.log("Could not read root response");
      }
    }
  } catch (error) {
    console.log(`❌ Root endpoint: ${error}`);
  }
  
  const endpoints = [
    // OTP endpoints to test
    '/api/send-otp/',
    '/api/sendotp/',
    '/api/otp/send/',
    '/api/otp/send',
    '/api/sendotp',
    '/api/send-otp',
    '/api/otp',
    '/api/verify-otp/',
    '/api/verifyotp/',
    '/api/otp/verify/',
    '/api/otp/verify',
    
    // Registration endpoints
    '/api/register/',
    '/api/register',
    '/api/signup/',
    '/api/signup',
    '/api/user/register/',
    '/api/user/register',
    
    // Login endpoints  
    '/api/login/',
    '/api/login',
    '/api/signin/',
    '/api/signin',
    '/api/user/login/',
    '/api/user/login',
    
    // API info endpoints
    '/api/',
    '/api',
    '/docs',
    '/swagger',
    '/openapi'
  ];
  
  console.log("\n🔍 Testing GET requests on endpoints...");
  
  for (const endpoint of endpoints) {
    try {
      const url = getApiUrl(endpoint);
      console.log(`Testing GET: ${url}`);
      
      const response = await fetch(url, { method: 'GET' });
      console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
      
      // If we get a 405, it means the endpoint exists but doesn't allow GET
      if (response.status === 405) {
        console.log(`🎯 ${endpoint} EXISTS but doesn't allow GET (needs POST/PUT/etc)`);
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error}`);
    }
  }
  
  // Now test some key endpoints with POST method
  console.log("\n🔍 Testing POST requests on key endpoints...");
  
  const postEndpoints = [
    '/api/register/',
    '/api/register',
    '/api/login/',
    '/api/login'
  ];
  
  for (const endpoint of postEndpoints) {
    try {
      const url = getApiUrl(endpoint);
      console.log(`Testing POST: ${url}`);
      
      const response = await fetch(url, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      console.log(`✅ POST ${endpoint}: ${response.status} ${response.statusText}`);
      
    } catch (error) {
      console.log(`❌ POST ${endpoint}: ${error}`);
    }
  }
};
