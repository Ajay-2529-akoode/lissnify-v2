'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationWebSocket } from '@/hooks/useNotificationWebSocket';
import { NotificationToastManager } from '@/Components/NotificationToast';

interface NotificationContextType {
  // Notification data
  notifications: any[];
  stats: any;
  settings: any;
  loading: boolean;
  error: string | null;
  
  // WebSocket state
  isConnected: boolean;
  unreadCount: number;
  newNotification: any;
  
  // Actions
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  updateSettings: (settings: any) => Promise<void>;
  fetchNotifications: (params?: any) => Promise<void>;
  
  // Toast management
  showToast: boolean;
  setShowToast: (show: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [showToast, setShowToast] = useState(true);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  const {
    notifications,
    stats,
    settings,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    fetchNotifications,
  } = useNotifications();

  const {
    isConnected,
    unreadCount,
    newNotification,
  } = useNotificationWebSocket();

  // Handle new notifications from WebSocket
  useEffect(() => {
    if (newNotification) {
      setRecentNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep last 5
    }
  }, [newNotification]);

  const contextValue: NotificationContextType = {
    notifications,
    stats,
    settings,
    loading,
    error,
    isConnected,
    unreadCount,
    newNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    fetchNotifications,
    showToast,
    setShowToast,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {showToast && (
        <NotificationToastManager
          notifications={recentNotifications}
          onMarkAsRead={markAsRead}
          maxToasts={3}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
