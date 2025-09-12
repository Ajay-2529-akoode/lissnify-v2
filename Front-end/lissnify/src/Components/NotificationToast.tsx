'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, MessageCircle, Users } from 'lucide-react';

interface NotificationToastProps {
  notification: {
    id: number;
    title: string;
    message: string;
    notification_type: 'message' | 'connection_request' | 'connection_accepted' | 'connection_rejected' | 'system';
    sender_username?: string;
    created_at: string;
  };
  onClose: () => void;
  onMarkAsRead?: (id: number) => void;
  autoClose?: boolean;
  duration?: number;
}

export default function NotificationToast({
  notification,
  onClose,
  onMarkAsRead,
  autoClose = true,
  duration = 5000,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    handleClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'connection_request':
        return <Users className="w-5 h-5 text-orange-500" />;
      case 'connection_accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'connection_rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-gray-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'border-l-blue-500 bg-blue-50';
      case 'connection_request':
        return 'border-l-orange-500 bg-orange-50';
      case 'connection_accepted':
        return 'border-l-green-500 bg-green-50';
      case 'connection_rejected':
        return 'border-l-red-500 bg-red-50';
      case 'system':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 w-80 max-w-sm bg-white rounded-lg shadow-lg border-l-4 ${getNotificationColor(
        notification.notification_type
      )} transform transition-all duration-300 ease-in-out z-50 ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getNotificationIcon(notification.notification_type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {notification.title}
              </h4>
              <button
                onClick={handleClose}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {notification.message}
            </p>
            {notification.sender_username && (
              <p className="text-xs text-gray-500 mt-1">
                from {notification.sender_username}
              </p>
            )}
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                {new Date(notification.created_at).toLocaleTimeString()}
              </span>
              {onMarkAsRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Toast Manager
interface NotificationToastManagerProps {
  notifications: Array<{
    id: number;
    title: string;
    message: string;
    notification_type: 'message' | 'connection_request' | 'connection_accepted' | 'connection_rejected' | 'system';
    sender_username?: string;
    created_at: string;
  }>;
  onMarkAsRead?: (id: number) => void;
  maxToasts?: number;
}

export function NotificationToastManager({
  notifications,
  onMarkAsRead,
  maxToasts = 3,
}: NotificationToastManagerProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<typeof notifications>([]);

  useEffect(() => {
    // Show only the latest notifications up to maxToasts
    const latestNotifications = notifications.slice(0, maxToasts);
    setVisibleNotifications(latestNotifications);
  }, [notifications, maxToasts]);

  const handleClose = (notificationId: number) => {
    setVisibleNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ 
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index 
          }}
        >
          <NotificationToast
            notification={notification}
            onClose={() => handleClose(notification.id)}
            onMarkAsRead={onMarkAsRead}
            autoClose={true}
            duration={5000}
          />
        </div>
      ))}
    </div>
  );
}
