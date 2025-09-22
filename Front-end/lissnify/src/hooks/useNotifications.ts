import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: number;
  recipient: number;
  sender: number;
  notification_type: 'message' | 'connection_request' | 'connection_accepted' | 'connection_rejected' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  chat_room_id?: number;
  message_id?: number;
  sender_username: string;
  recipient_username: string;
}

export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  message_notifications: number;
  connection_notifications: number;
  system_notifications: number;
}

export interface NotificationSettings {
  message_notifications: boolean;
  connection_notifications: boolean;
  system_notifications: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://elysian-birt.onrender.com/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchNotifications = useCallback(async (params?: {
    type?: string;
    is_read?: boolean;
    page?: number;
    page_size?: number;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());

      const response = await fetch(
        `${API_BASE_URL}/notifications/?${queryParams.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      console.log('📊 Fetching notification stats...');
      const response = await fetch(`${API_BASE_URL}/notifications/stats/`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification stats');
      }

      const data = await response.json();
      console.log('📊 Stats received:', data);
      setStats(data);
      return data;
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/settings/`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification settings');
      }

      const data = await response.json();
      setSettings(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_read: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );

      // Update stats
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          unread_notifications: Math.max(0, prev.unread_notifications - 1)
        } : null);
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, [stats]);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );

      // Update stats
      setStats(prev => prev ? {
        ...prev,
        unread_notifications: 0
      } : null);

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/settings/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      const data = await response.json();
      setSettings(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      // Update local state
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );

      // Update stats
      if (stats) {
        setStats(prev => prev ? {
          ...prev,
          total_notifications: Math.max(0, prev.total_notifications - 1),
          unread_notifications: Math.max(0, prev.unread_notifications - 1)
        } : null);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }, [stats]);

  // Load initial data
  useEffect(() => {
    console.log('🔔 Loading initial notification data...');
    fetchNotifications();
    fetchStats();
    fetchSettings();
  }, [fetchNotifications, fetchStats, fetchSettings]);

  // Function to refresh stats (can be called from WebSocket)
  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    notifications,
    stats,
    settings,
    loading,
    error,
    fetchNotifications,
    fetchStats,
    fetchSettings,
    markAsRead,
    markAllAsRead,
    updateSettings,
    deleteNotification,
    refreshStats,
  };
};
