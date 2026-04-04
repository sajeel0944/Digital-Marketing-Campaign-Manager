import { motion } from 'framer-motion';
import type { Notification } from '../../types/notification.type';

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: number) => void;
}

export const NotificationCard = ({ notification, onMarkRead }: NotificationCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.01 }}
      className={`relative p-4 rounded-xl transition-all duration-300 ${
        notification.read
          ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500 dark:border-l-blue-400'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Unread Indicator */}
          {!notification.read && (
            <div className="absolute top-4 left-0 w-2 h-2 bg-blue-500 rounded-full -ml-1" />
          )}
          
          {/* Message */}
          <p className={`text-sm ${notification.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white font-medium'}`}>
            {notification.message}
          </p>
          
          {/* Timestamp */}
          <div className="flex items-center gap-2 mt-2">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-400">{formatDate(notification.created_at)}</span>
          </div>
        </div>
        
        {/* Mark Read Button */}
        {!notification.read && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMarkRead(notification.id)}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors whitespace-nowrap cursor-pointer"
          >
            Mark as Read
          </motion.button>
        )}
        
        {/* Read Badge */}
        {notification.read && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-gray-500 dark:text-gray-400">Read</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};