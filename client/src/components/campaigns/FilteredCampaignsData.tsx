import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, ArrowUpDown } from "lucide-react";
import { CampaignTable } from "./CampaignTable";
import type {
  Campaign,
  DateRangePreset,
  SortField,
  SortOrder,
} from "../../types/campaigns.type";

export const FilteredCampaignsData = ({
  campaigns,
  onEdit,
  onDelete,
}: {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateRangePreset, setDateRangePreset] =
    useState<DateRangePreset>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Calculate date range based on preset
  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date(0); // Default to epoch for 'all'

    switch (dateRangePreset) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "custom":
        if (customStartDate) {
          startDate = new Date(customStartDate);
        }
        break;
    }

    const endDate = customEndDate ? new Date(customEndDate) : now;
    return { startDate, endDate };
  };

  // Filter and sort campaigns
  let filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.campaign_title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const campaignDate = new Date(campaign.created_at);
    const { startDate, endDate } = getDateRange();
    const matchesDateRange =
      campaignDate >= startDate && campaignDate <= endDate;

    return matchesSearch && matchesDateRange;
  });

  // Sort campaigns
  filteredCampaigns = [...filteredCampaigns].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === "created_at") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4"
      >
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search campaigns by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Date Range Picker */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            Date Range
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
            {[
              { label: "Last 7 Days", value: "7d" },
              { label: "Last 30 Days", value: "30d" },
              { label: "Last 90 Days", value: "90d" },
              { label: "Custom", value: "custom" },
              { label: "All Time", value: "all" },
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() =>
                  setDateRangePreset(preset.value as DateRangePreset)
                }
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  dateRangePreset === preset.value
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Inputs */}
          {dateRangePreset === "custom" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sort Options */}
        <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <ArrowUpDown className="w-4 h-4" />
            Sort By
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="created_at">Created Date</option>
              <option value="campaign_title">Campaign Title</option>
              <option value="budget">Budget</option>
              <option value="spend">Spend</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium text-sm transition-all cursor-pointer"
            >
              {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Found{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredCampaigns.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {campaigns.length}
            </span>{" "}
            campaigns
          </p>
        </div>
      </motion.div>

      {/* Data Display */}
      {filteredCampaigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No campaigns found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? `No campaigns match "${searchQuery}"`
              : "Try adjusting your filters"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <CampaignTable
            campaigns={filteredCampaigns}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      )}
    </div>
  );
};
