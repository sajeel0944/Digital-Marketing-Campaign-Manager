import { motion } from "framer-motion";
import type { Campaign } from "../../types/campaigns.type";
import { useState } from "react";
import Pagination from "../Pagination";
import { Edit, Trash } from "lucide-react";

export const CampaignTable = ({
  campaigns,
  onEdit,
  onDelete,
}: {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = campaigns.slice(startIndex, endIndex);
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  return (
    <>
      <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Campaign Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tone Guide
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((campaign, index) => (
              <motion.tr
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.campaign_title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {campaign.headline.slice(0, 2).join(", ")}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                    {campaign.tone_guide}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${campaign.budget.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {campaign.tag.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {campaign.tag.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        +{campaign.tag.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(campaign)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(campaign)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table Footer with Record Count */}
      <Pagination
        currentPage={currentPage}
        endIndex={endIndex}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        startIndex={startIndex}
        dataLength={paginatedData.length}
      />
    </>
  );
};
