import { getApiUrl } from '@/config/api';


// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RegisterData {
  full_name: string;
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
export interface CategoryId{
  category_id:string
}

export interface ApiCategory {
  id: number;
  Category_name: string; // Backend uses Category_name field
  name?: string; // Fallback for compatibility
  description: string;
  icon: string;
  supportText: string;
  slug: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string | null;
  rating: number;
  feedback: string;
  created_at: string;
}
export interface startDirectChatData {
  listener_id: string;
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

export const listenerCarouselData = async () => {
  try {
    const response = await fetch(getApiUrl('/api/listenerList'));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching listener carousel data:", error);
    return [];
  }
};

export const listenerCategoryWise = async (categorySlug:string): Promise<ApiResponse> => {
  return apiCall('/api/listenerList/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ category_id: categorySlug }),
  });
};

export const listenerList = async (listenerId: string): Promise<ApiResponse> => {
  return apiCall('/api/listenerList/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ listener_id: listenerId }),
  });
};

export const connectionList = async (): Promise<ApiResponse> => {
  return apiCall('/api/get-connection-list/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
  });
};
export const connectedListeners = async (): Promise<ApiResponse> => {
  return apiCall('/api/connections/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
  });
};

export const getRooms = async (): Promise<ApiResponse> => {
  return apiCall('/chat/rooms/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
  });
}

export const startDirectChat = async (listener_id: string): Promise<ApiResponse> => {
  return apiCall('/chat/start-direct/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipient_id:listener_id }),
  });
}

export const getMessages = async (room_id: number): Promise<ApiResponse> => {
  return apiCall(`/chat/${room_id}/messages/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },  
  });
}

export const acceptConnection = async (connectionId: number, action: 'accept' | 'reject'): Promise<ApiResponse> => {
  return apiCall('/api/accept-connection/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      connection_id: connectionId,
      action: action
    }),
  });
}

export const connection = async (listener_id: string): Promise<ApiResponse> => {
  return apiCall('/api/connection-request/', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({listener_id:listener_id} ),
  });
}

export const getUserProfile = async (): Promise<ApiResponse> => {
  return apiCall('/api/user-profile/', {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
  });
}

export const updateUserProfile = async (profileData: FormData): Promise<ApiResponse> => {
  try {
    const url = getApiUrl('/api/user-profile/');
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: profileData,
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
}

export const listener = async (listenerId: string): Promise<ApiResponse> => {
  return listenerList(listenerId);
}

export const getCategories = async (): Promise<ApiResponse<ApiCategory[]>> => {
  return apiCall<ApiCategory[]>('/api/categories/', {
    method: 'GET',
  });
}

export const getBlogs = async (): Promise<ApiResponse> => {
  return apiCall('/api/blogs/', {
    method: 'GET',
  });
}

export const getBlogBySlug = async (slug: string): Promise<ApiResponse> => {
  return apiCall(`/api/blogs/${slug}/`, {
    method: 'GET',
  });
}

// Testimonial API functions
export const getTestimonials = async (): Promise<ApiResponse<Testimonial[]>> => {
  return apiCall<Testimonial[]>('/api/testimonials/', {
    method: 'GET',
  });
}

export const getTestimonialById = async (id: number): Promise<ApiResponse<Testimonial>> => {
  return apiCall<Testimonial>(`/api/testimonials/${id}/`, {
    method: 'GET',
  });
}

export const createTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'created_at'>): Promise<ApiResponse<Testimonial>> => {
  return apiCall<Testimonial>('/api/testimonials/', {
    method: 'POST',
    body: JSON.stringify(testimonialData),
  });
}


export const updateTestimonial = async (id: number, testimonialData: Partial<Testimonial>): Promise<ApiResponse<Testimonial>> => {
  return apiCall<Testimonial>(`/api/testimonials/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(testimonialData),
  });
}

export const deleteTestimonial = async (id: number): Promise<ApiResponse> => {
  return apiCall(`/api/testimonials/${id}/`, {
    method: 'DELETE',
  });
}

// Helper function to check if a listener is already connected
export const isListenerConnected = (listenerId: string, connectedListeners: any[]): boolean => {
  return connectedListeners.some(conn => 
    conn.listener_profile?.l_id === listenerId && conn.status === 'Accepted'
  );
}

// Blog Like API functions
export const likeBlog = async (blogId: number): Promise<ApiResponse> => {
  return apiCall(`/api/blogs/${blogId}/like/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
  });
}

export const unlikeBlog = async (blogId: number): Promise<ApiResponse> => {
  return apiCall(`/api/blogs/${blogId}/like/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
  });
}

export const toggleBlogLike = async (blogId: number): Promise<ApiResponse> => {
  return apiCall(`/api/blogs/${blogId}/toggle-like/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
  });
}

export const getBlogLikes = async (blogId: number): Promise<ApiResponse> => {
  return apiCall(`/api/blogs/${blogId}/likes/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`,
      'Content-Type': 'application/json',
    },
  });
}