import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationList } from './NotificationList';
import type { Notification } from '../../types/notification.type';

interface NotificationBellProps {
  unreadCount: number;
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  isConnected: boolean;
}

export const NotificationBell = ({ 
  unreadCount, 
  notifications, 
  onMarkRead, 
  isConnected 
}: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Bell animation when new notification arrives
  useEffect(() => {
    if (unreadCount > 0 && !isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount, isOpen]);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <motion.div
          animate={isAnimating ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </motion.div>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
        
        {/* Connection Indicator */}
        {!isConnected && (
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        )}
      </motion.button>
      
      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <div 
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <NotificationList
              notifications={notifications}
              onMarkRead={onMarkRead}
              onClose={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};