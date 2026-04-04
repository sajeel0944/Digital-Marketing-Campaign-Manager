import { motion } from 'framer-motion';
import type { CompanyMetric } from '../../types/dashboard.type';

export const CompanyPerformance = ({ companies }:  {
  companies: CompanyMetric[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Company Performance
      </h3>
      <div className="space-y-4">
        {companies.map((company, index) => {
          const progress = company.totalBudget > 0 
            ? (company.totalSpend / company.totalBudget) * 100 
            : 0;
          
          return (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {company.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {company.campaignCount} Campaigns
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${company.totalSpend.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    of ${company.totalBudget.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {progress.toFixed(1)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};