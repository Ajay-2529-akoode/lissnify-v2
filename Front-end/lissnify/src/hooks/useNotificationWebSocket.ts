import { useEffect, useRef, useState } from 'react';

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

interface WebSocketMessage {
  type: 'notification' | 'unread_count';
  notification?: Notification;
  count?: number;
}

import { getWebSocketUrl } from '@/config/api';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://elysian-birt.onrender.com';

export const useNotificationWebSocket = (onNotificationReceived?: () => void) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newNotification, setNewNotification] = useState<Notification | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.error('No access token found');
      return;
    }

    try {
      const wsUrl = getWebSocketUrl(`/ws/notifications/?token=${token}`);
      console.log(`🔔 Attempting to connect to notification WebSocket (attempt ${reconnectAttempts.current + 1})`);
      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        console.log('✅ Notification WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        // Request initial unread count
        getUnreadCount();
      };

      newSocket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('🔔 WebSocket message received:', data);
          
          if (data.type === 'notification' && data.notification) {
            console.log('📬 New notification received:', data.notification);
            setNewNotification(data.notification);
            // Call the callback to refresh stats
            if (onNotificationReceived) {
              onNotificationReceived();
            }
            console.log('📬 Notification received, API stats will be refreshed');
          } else if (data.type === 'unread_count' && data.count !== undefined) {
            console.log('📊 Unread count updated:', data.count);
            setUnreadCount(data.count);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      newSocket.onclose = (event) => {
        console.log('🔌 Notification WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not a manual close
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.error('❌ Max reconnection attempts reached for notification WebSocket');
        }
      };

      newSocket.onerror = (error) => {
        console.error('❌ Notification WebSocket error:', error);
        // Don't show error immediately on first attempt - let onclose handle retry logic
        if (reconnectAttempts.current === 0) {
          console.log('🔄 Initial notification connection failed, will retry...');
        }
      };

      setSocket(newSocket);
    } catch (error) {
      console.error('❌ Error creating notification WebSocket:', error);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (socket) {
      socket.close(1000, 'Manual disconnect');
      setSocket(null);
    }
    setIsConnected(false);
  };

  const markAsRead = (notificationId: number) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'mark_read',
        notification_id: notificationId
      }));
    }
  };

  const getUnreadCount = () => {
    if (socket && isConnected) {
      socket.send(JSON.stringify({
        type: 'get_unread_count'
      }));
    }
  };

  // Connect on mount with a delay to allow authentication to complete
  useEffect(() => {
    // Delay to ensure authentication is ready
    const connectTimeout = setTimeout(() => {
      connect();
    }, 500);

    return () => {
      clearTimeout(connectTimeout);
      disconnect();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    unreadCount,
    newNotification,
    markAsRead,
    getUnreadCount,
    connect,
    disconnect,
  };
};
