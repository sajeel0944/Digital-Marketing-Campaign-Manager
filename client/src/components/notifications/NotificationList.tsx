import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCard } from './NotificationCard';
import type { Notification } from '../../types/notification.type';

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  onClose: () => void;
}

export const NotificationList = ({ notifications, onMarkRead, onClose }: NotificationListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute -right-24 sm:right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </div>
        
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                No notifications yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                New notifications will appear here
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <NotificationCard
                  notification={notification}
                  onMarkRead={onMarkRead}
                />
              </div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            {notifications.filter(n => !n.read).length} unread notifications
          </p>
        </div>
      )}
    </motion.div>
  );
};