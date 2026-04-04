import React from "react";
import { motion } from "framer-motion";
import { HiOutlineOfficeBuilding, HiOutlineSpeakerphone, HiOutlineViewGrid } from "react-icons/hi";

export const Sidebar = ({
  activeItem,
  isCollapsed,
  setIsCollapsed,
}: {
  activeItem: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}) => {
  const menuItems: {
    id: string;
    label: string;
    icon: React.ReactNode;
  }[] = [
  {
    id: "",
    label: "Dashboard",
    icon: <HiOutlineViewGrid className="w-5 h-5" />,
  },
  {
    id: "companies",
    label: "Companies",
    icon: <HiOutlineOfficeBuilding className="w-5 h-5" />,
  },
  {
    id: "campaigns",
    label: "Campaigns",
    icon: <HiOutlineSpeakerphone className="w-5 h-5" />,
  },
];

  return (
    <>
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50 ${
          isCollapsed ? "hidden sm:block sm:w-20" : "w-full sm:w-56"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
            <h1
              className={`font-semibold text-gray-900 dark:text-white transition-all ${
                isCollapsed ? "text-sm" : "text-lg"
              }`}
            >
              {isCollapsed ? "CF" : "Campaign Flow"}
            </h1>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-4">
            {menuItems.map((item) => (
              <motion.a
                key={item.id}
                whileHover={{ x: 4 }}
                href={`/${item.id}`}
                className={`w-full flex items-center px-4 py-3 transition-colors ${
                  activeItem === item.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </motion.a>
            ))}
          </nav>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="m-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </motion.aside>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="block sm:hidden m-3 p-2 z-50 fixed bottom-0  rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      )}
    </>
  );
};
