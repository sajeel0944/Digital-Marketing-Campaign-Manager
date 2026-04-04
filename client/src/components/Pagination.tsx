import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  setCurrentPage,
  currentPage,
  itemsPerPage,
  setItemsPerPage,
  startIndex,
  endIndex,
  totalPages,
  dataLength,
}: {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  startIndex: number;
  endIndex: number;
  totalPages: number;
  dataLength: number;
}) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {/* Pagination Controls */}
      {totalPages && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/[0.03] rounded-b-lg">
          <div className="flex items-center gap-4">
            <p className="text-gray-600 dark:text-slate-400 text-sm hidden sm:block">
              Showing {startIndex + 1} to {Math.min(endIndex, dataLength)} of{" "}
              {dataLength} opportunities
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-slate-400 text-sm hidden sm:block">
                Rows per page:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 rounded px-2 py-1 text-sm text-gray-900 dark:text-white cursor-pointer"
              >
                <option
                  className="bg-white dark:bg-slate-800 cursor-pointer"
                  value={10}
                >
                  10
                </option>
                <option
                  className="bg-white dark:bg-slate-800 cursor-pointer"
                  value={15}
                >
                  15
                </option>
                <option
                  className="bg-white dark:bg-slate-800 cursor-pointer"
                  value={25}
                >
                  25
                </option>
                <option
                  className="bg-white dark:bg-slate-800 cursor-pointer"
                  value={50}
                >
                  50
                </option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-all duration-300 ${
                currentPage === 1
                  ? "bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="md:flex md:gap-1 hidden">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded text-sm min-w-[36px] transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-blue-600 dark:bg-cyan-600 text-white cursor-not-allowed"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 py-1 text-gray-600 dark:text-slate-400">
                    ...
                  </span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-1 rounded text-sm transition-all duration-300 cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-blue-600 dark:bg-cyan-600 text-white"
                        : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-all duration-300 cursor-pointer ${
                currentPage === totalPages
                  ? "bg-gray-100 dark:bg-slate-800/50 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Pagination;
