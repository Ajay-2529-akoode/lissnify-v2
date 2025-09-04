// API Configuration
export const API_CONFIG = {
  // Update this URL to match your backend server
  BASE_URL: "https://ztb7926t-8000.inc1.devtunnels.ms", // Real backend URL
  
  // API Endpoints
  ENDPOINTS: {
    REGISTER: "/api/register/",
    LOGIN: "/api/login/",
    LOGOUT: "/api/logout/",
    USER_PROFILE: "/api/user/profile/",
    SEND_OTP: "/api/send-otp/",
    VERIFY_OTP: "/api/verify-otp/",
    // Alternative endpoint names that might exist
    SEND_OTP_ALT: "/api/sendotp/",
    VERIFY_OTP_ALT: "/api/verifyotp/",
    REGISTER_ALT: "/api/register",
    LOGIN_ALT: "/api/login",
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
