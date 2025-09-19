// API Configuration

export const API_CONFIG = {
  // Update this URL to match your backend server
  BASE_URL: "https://elysian-birt.onrender.com", // Real backend URL
  
  // API Endpoints
  ENDPOINTS: {
    // Auth endpoints
    REGISTER: "/api/register/",
    LOGIN: "/api/login/",
    LOGOUT: "/api/logout/",
    VERIFY_OTP: "/api/verify-otp/",
    FORGOT_PASSWORD: "/api/forgot-password/",
    
    // User endpoints
    USER_PROFILE: "/api/user-profile/",
    LISTENER_PROFILE: "/api/listener-profile/",
    
    // Category endpoints
    CATEGORIES: "/api/categories/",
    
    // Community endpoints
    COMMUNITY_POSTS: "/api/community-posts/",
    COMMUNITY_POST_DETAIL: "/api/community-posts/",
    COMMUNITY_POST_LIKE: "/api/community-posts/",
    COMMUNITY_POST_COMMENTS: "/api/community-posts/",
    
    // Connection endpoints
    CONNECTIONS: "/api/connections/",
    CONNECTION_REQUEST: "/api/connection-request/",
    ACCEPT_CONNECTION: "/api/accept-connection/",
    LISTENERS_BOP: "/api/listeners-bop/",
    ACCEPTED_LIST_SEEKER: "/api/accepted-list-seeker/",
    GET_CONNECTION_LIST: "/api/get-connection-list/",
    
    // Blog endpoints
    BLOGS: "/api/blogs/",
    BLOG_DETAIL: "/api/blogs/",
    BLOG_LIKE: "/api/blogs/",
    BLOG_TOGGLE_LIKE: "/api/blogs/",
    BLOG_LIKES: "/api/blogs/",
    
    // Notification endpoints
    NOTIFICATIONS: "/api/notifications/",
    NOTIFICATION_DETAIL: "/api/notifications/",
    NOTIFICATION_MARK_ALL_READ: "/api/notifications/mark-all-read/",
    NOTIFICATION_STATS: "/api/notifications/stats/",
    NOTIFICATION_SETTINGS: "/api/notifications/settings/",
    CREATE_MESSAGE_NOTIFICATION: "/api/notifications/create-message/",
    TEST_NOTIFICATION: "/api/notifications/test/",
    
    // Testimonial endpoints
    TESTIMONIALS: "/api/testimonials/",
    TESTIMONIAL_DETAIL: "/api/testimonials/",
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

