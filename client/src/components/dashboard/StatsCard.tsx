import { motion } from "framer-motion";

export const StatsCard = ({
  title,
  value,
  icon,
  color,
  prefix = "",
  suffix = "",
  delay = 0,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
            {suffix}
          </p>
        </div>
        <div
          className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/20`}
        >
          <div className={`text-${color}-600 dark:text-${color}-400`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
