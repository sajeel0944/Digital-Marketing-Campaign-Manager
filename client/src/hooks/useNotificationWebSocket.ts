import { useState, useEffect, useCallback, useRef } from 'react';
import type { Notification, WebSocketMessage, MarkReadAction } from '../types/notification.type';

export const useNotificationWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectAttemptsRef = useRef<number>(0);
  const isConnectingRef = useRef<boolean>(false);
  const shouldReconnectRef = useRef<boolean>(true);

  const connect = useCallback(() => {
    // Prevent multiple connection attempts
    if (isConnectingRef.current) {
      console.log('Connection already in progress, skipping...');
      return;
    }

    // Close existing socket if any
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('Socket already connected');
      return;
    }

    if (socket && socket.readyState === WebSocket.CONNECTING) {
      console.log('Socket is already connecting');
      return;
    }

    isConnectingRef.current = true;
    console.log('Attempting to connect to WebSocket...');

    try {
    const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;

      const ws = new WebSocket(`${BASE_URL}/api/notifications/ws`);
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false;
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 Received message:', data.type);
          
          switch (data.type) {
            case 'INITIAL_DATA':
              if (data.data) {
                setNotifications(data.data);
                const unread = data.data.filter((n: Notification) => !n.read).length;
                setUnreadCount(unread);
              }
              break;
              
            case 'NEW_NOTIFICATIONS':
              if (data.data && data.data.length > 0) {
                const incomingNotifs = data.data || []; 
                setNotifications(prev => [...incomingNotifs, ...prev]);
                const newUnread = incomingNotifs.filter((n: Notification) => !n.read).length;
                setUnreadCount(prev => prev + newUnread);
              }
              break;
              
            case 'READ_CONFIRMATION':
              if (data.id) {
                setNotifications(prev => 
                  prev.map(notif => 
                    notif.id === data.id ? { ...notif, read: true } : notif
                  )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
              break;
              
            case 'ERROR':
              setError(data.message || 'WebSocket error occurred');
              break;
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event: Event) => {
        console.error('WebSocket error:', event);
        setError('Connection error occurred');
        setIsConnected(false);
        isConnectingRef.current = false;
      };

      ws.onclose = (event) => {
        console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
        setIsConnected(false);
        isConnectingRef.current = false;
        
        // Only reconnect if it wasn't a manual disconnect and we haven't exceeded max attempts
        if (shouldReconnectRef.current && reconnectAttemptsRef.current < 5) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/5)`);
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= 5) {
          setError('Unable to connect to notification service. Please refresh the page.');
        }
      };

      setSocket(ws);
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError('Failed to establish connection');
      setIsConnected(false);
      isConnectingRef.current = false;
    }
  }, [socket]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setIsConnected(false);
    isConnectingRef.current = false;
    reconnectAttemptsRef.current = 0;
  }, [socket]);

  const markAsRead = useCallback((id: number) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message: MarkReadAction = {
        action: 'mark_read',
        id: id,
      };
      socket.send(JSON.stringify(message));
      console.log('📤 Mark as read sent for notification:', id);
    } else {
      console.warn('Cannot mark as read: WebSocket is not connected');
    }
  }, [socket]);

  // Auto-connect on mount
  useEffect(() => {
    shouldReconnectRef.current = true;
    connect();
    
    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    notifications,
    unreadCount,
    error,
    connect,
    disconnect,
    markAsRead,
  };
};