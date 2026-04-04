import { motion } from 'framer-motion';
import type { CampaignMetric } from '../../types/dashboard.type';

export const TopCampaignsTable = ({ campaigns }: {
    campaigns: CampaignMetric[];
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Performing Campaigns
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Campaign Name
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Budget
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Spend
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Remaining
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Progress
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((campaign, index) => (
                            <motion.tr
                                key={campaign.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {campaign.name}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 text-right">
                                    ${(campaign.budget ?? 0).toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 text-right">
                                    ${(campaign.spend ?? 0).toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 text-right">
                                    ${(campaign.remaining ?? 0).toLocaleString()}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, campaign.progress)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {campaign.progress.toFixed(1)}%
                                        </span>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};