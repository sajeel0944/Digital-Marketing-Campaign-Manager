import { useEffect, useState } from "react";
import { NotificationBell } from "./NotificationBell";
import { useNotificationWebSocket } from "../../hooks/useNotificationWebSocket";

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter = ({
  className = "",
}: NotificationCenterProps) => {
  const [showReconnect, setShowReconnect] = useState<boolean>(false);

  const {
    isConnected,
    notifications,
    unreadCount,
    error,
    connect,
    disconnect,
    markAsRead,
  } = useNotificationWebSocket();

  // Show reconnect button after 3 seconds of disconnection
  useEffect(() => {
    if (!isConnected && error) {
      const timer = setTimeout(() => {
        setShowReconnect(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowReconnect(false);
    }
  }, [isConnected, error]);

  const handleReconnect = () => {
    setShowReconnect(false);
    disconnect();
    setTimeout(() => {
      connect();
    }, 500);
  };

  return (
    <div className={`relative ${className}`}>
      <NotificationBell
        unreadCount={unreadCount}
        notifications={notifications}
        onMarkRead={markAsRead}
        isConnected={isConnected}
      />

      {/* Connection Status Tooltip */}
      {!isConnected && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-yellow-500 dark:bg-yellow-600 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Manual Reconnect Button */}
      {showReconnect && !isConnected && (
        <div className="absolute bottom-full right-0 mb-2">
          <button
            onClick={handleReconnect}
            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg shadow-lg transition-colors flex items-center gap-1"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reconnect
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-red-500 text-white text-xs rounded-lg shadow-lg max-w-xs whitespace-normal z-50">
          {error}
        </div>
      )}
    </div>
  );
};
