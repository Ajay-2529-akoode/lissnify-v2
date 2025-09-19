import { API_CONFIG, getApiUrl } from '@/config/api';

// Types
export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  supportText: string;
  slug: string;
}

export interface CommunityPost {
  id: number;
  author: {
    u_id: number;
    full_name: string;
    email: string;
    profile_image: string;
  };
  post_type: 'listener' | 'seeker';
  title: string;
  content: string;
  category: number | null;
  category_name: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  comments: Comment[];
}

export interface Comment {
  id: number;
  author: {
    u_id: number;
    full_name: string;
    email: string;
    profile_image: string;
  };
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  category: number | null;
  post_type: 'listener' | 'seeker';
}

export interface CreateCommentData {
  content: string;
}

// API Service Functions
export class CommunityService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES), {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Community Posts
  static async getCommunityPosts(postType?: string, categoryId?: number): Promise<CommunityPost[]> {
    try {
      const params = new URLSearchParams();
      if (postType) params.append('post_type', postType);
      if (categoryId) params.append('category_id', categoryId.toString());

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.COMMUNITY_POSTS)}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching community posts:', error);
      throw error;
    }
  }

  static async getCommunityPost(postId: number): Promise<CommunityPost> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMMUNITY_POST_DETAIL) + `${postId}/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching community post:', error);
      throw error;
    }
  }

  static async createCommunityPost(data: CreatePostData): Promise<CommunityPost> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMMUNITY_POSTS), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating community post:', error);
      throw error;
    }
  }

  static async updateCommunityPost(postId: number, data: Partial<CreatePostData>): Promise<CommunityPost> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMMUNITY_POST_DETAIL) + `${postId}/`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating community post:', error);
      throw error;
    }
  }

  static async deleteCommunityPost(postId: number): Promise<void> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMMUNITY_POST_DETAIL) + `${postId}/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting community post:', error);
      throw error;
    }
  }

  // Likes
  static async likePost(postId: number): Promise<{ message: string; like_count: number; is_liked: boolean }> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMMUNITY_POST_LIKE) + `${postId}/like/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  static async unlikePost(postId: number): Promise<{ message: string; like_count: number; is_liked: boolean }> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMMUNITY_POST_LIKE) + `${postId}/like/`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  // Comments
  static async getPostComments(postId: number): Promise<Comment[]> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMMUNITY_POST_COMMENTS) + `${postId}/comments/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching post comments:', error);
      throw error;
    }
  }

  static async createComment(postId: number, data: CreateCommentData): Promise<Comment> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.COMMUNITY_POST_COMMENTS) + `${postId}/comments/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }
}
