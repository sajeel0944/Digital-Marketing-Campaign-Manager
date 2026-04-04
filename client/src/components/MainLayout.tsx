import React, { useState } from "react";
import { motion } from "framer-motion";

import { useLocation } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const pathname = location.pathname || "/";
  const pathnameLower = pathname.toLowerCase();
  const firstSegment = pathnameLower.split("/")[1];

  const [activeMenuItem] = useState(firstSegment || "");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isLoginPage = location.pathname === "/login";
  if (isLoginPage) return <>{children}</>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar
          activeItem={activeMenuItem}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div
          className={`${isCollapsed ? "ml-0 sm:ml-20" : "ml-56"} transition-all duration-300`}
        >
          <TopNavbar pageTitle={activeMenuItem} isCollapsed={isCollapsed} />

          <main className="pt-20 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
