import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationCenter } from "./notifications/NotificationCenter";

export const TopNavbar = ({
  pageTitle,
  isCollapsed,
}: {
  pageTitle: string;
  isCollapsed: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-40 ${isCollapsed ? "left-0 sm:left-20" : "left-56"}`}
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-md sm:text-xl font-semibold text-gray-900 dark:text-white uppercase">
            {pageTitle == "sim" ? "sim Usage" : pageTitle}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification Center */}
          <NotificationCenter />
          
          {/* User Avatar with Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">AD</span>
              </div>
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </a>
                  <div className="px-3 py-2">
                    <ThemeToggle />
                  </div>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};