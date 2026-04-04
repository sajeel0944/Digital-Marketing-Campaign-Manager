import { motion } from "framer-motion";

export const AddCampaignButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 cursor-pointer"
    >
      <svg
        className="sm:w-5 sm:h-5 w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span className="flex gap-1">Add <span className="sm:block hidden">Campaign</span></span>
    </motion.button>
  );
};
