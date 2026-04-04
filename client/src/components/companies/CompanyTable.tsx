import { motion } from "framer-motion";
import type { Company } from "../../types/company.type";
import { useState } from "react";
import Pagination from "../Pagination";
import { Edit, Eye, Trash } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300";
    case "inactive":
      return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300";
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
  }
};

export const CompanyTable = ({
  companies,
  onEdit,
  onDelete,
}: {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = companies.slice(startIndex, endIndex);
  const totalPages = Math.ceil(companies.length / itemsPerPage);

  return (
    <>
      <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Spend
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Remaining
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((company, index) => {
              const remaining = company.budget - company.spend;
              const remainingPercentage = (remaining / company.budget) * 100;

              return (
                <motion.tr
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {company.client_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(company.status)}`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900 dark:text-white">
                      ${company.budget.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900 dark:text-white">
                      ${company.spend.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${remaining.toLocaleString()}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(0, Math.min(100, remainingPercentage))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(company)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4"/>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(company)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash className="w-4 h-4"/>
                      </motion.button>
                       <motion.a
                       href={`/companies/${company.id}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4"/>
                      </motion.a>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
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
