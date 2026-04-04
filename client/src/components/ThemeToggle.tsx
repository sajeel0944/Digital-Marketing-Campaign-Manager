import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { HiMoon, HiSun } from 'react-icons/hi';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
   <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleTheme}
      className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="flex items-center gap-3">
        {theme === 'light' ? (
          <>
            <HiMoon className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Dark Mode</span>
          </>
        ) : (
          <>
            <HiSun className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Light Mode</span>
          </>
        )}
      </div>

      {/* Right side indicator (Optional) */}
      <span className="text-[10px] uppercase tracking-widest opacity-50">
        {theme === 'light' ? 'OFF' : 'ON'}
      </span>
    </motion.button>
  );
};