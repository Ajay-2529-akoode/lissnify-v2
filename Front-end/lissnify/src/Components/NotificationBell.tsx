
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Settings, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationWebSocket } from '@/hooks/useNotificationWebSocket';

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    notifications,
    stats,
    settings,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    refreshStats,
    fetchNotifications,
  } = useNotifications();

  const {
    isConnected,
    unreadCount,
    newNotification,
  } = useNotificationWebSocket(() => {
    // Refresh stats when a new notification is received
    refreshStats();
  });

  // Debug logging
  useEffect(() => {
    console.log('🔔 NotificationBell - isConnected:', isConnected);
    console.log('🔔 NotificationBell - unreadCount (WebSocket):', unreadCount);
    console.log('🔔 NotificationBell - stats (API):', stats);
    console.log('🔔 NotificationBell - final count:', unreadCount || stats?.unread_notifications || 0);
  }, [isConnected, unreadCount, stats]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show new notification toast
  useEffect(() => {
    if (newNotification) {
      // You can implement a toast notification here
      console.log('New notification:', newNotification);
    }
  }, [newNotification]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleUpdateSettings = async (newSettings: any) => {
    try {
      await updateSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleDropdownToggle = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // If opening the dropdown, refresh notifications
    if (newIsOpen) {
      console.log('🔔 Opening notification dropdown, refreshing notifications...');
      try {
        await fetchNotifications();
        await refreshStats();
      } catch (error) {
        console.error('❌ Error refreshing notifications:', error);
      }
    }
  };

  const handleTestNotification = async () => {
    try {
      console.log('🧪 Creating test notification...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://elysian-birt.onrender.com/api'}/notifications/test/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Test notification created:', data);
        // Refresh notifications
        fetchNotifications();
        refreshStats();
      } else {
        console.error('❌ Failed to create test notification:', response.status);
      }
    } catch (error) {
      console.error('❌ Error creating test notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'connection_request':
        return '👥';
      case 'connection_accepted':
        return '✅';
      case 'connection_rejected':
        return '❌';
      case 'system':
        return '🔔';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={handleDropdownToggle}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {(() => {
          const count = stats?.unread_notifications || 0;
          return count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {count > 99 ? '99+' : count}
            </span>
          );
        })()}
        {!isConnected && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
                {stats && stats.unread_notifications > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({stats.unread_notifications} unread)
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTestNotification}
                  className="p-1 text-blue-400 hover:text-blue-600 rounded text-xs"
                  title="Test notification"
                >
                  🧪
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && settings && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Settings</h4>
              <div className="space-y-2">
                {Object.entries(settings).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleUpdateSettings({ [key]: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              <>
            {stats && stats.unread_notifications > 0 && (
              <div className="p-2 border-b border-gray-200">
                <button
                  onClick={handleMarkAllAsRead}
                  className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1"
                >
                  Mark all as read
                </button>
              </div>
            )}
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-1">
                            {!notification.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-green-600 rounded"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                          {notification.sender_username && (
                            <p className="text-xs text-gray-500">
                              from {notification.sender_username}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          {stats && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Total: {stats.total_notifications}</span>
                <span>Unread: {stats.unread_notifications}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
