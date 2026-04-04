import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { CampaignChart } from '../components/dashboard/CampaignChart';
import { BudgetVsSpendChart } from '../components/dashboard/BudgetVsSpendChart';
import { ChannelAllocationChart } from '../components/dashboard/ChannelAllocationChart';
import { CompanyPerformance } from '../components/dashboard/CompanyPerformance';
import { TopCampaignsTable } from '../components/dashboard/TopCampaignsTable';
import { useDashboardData } from '../hooks/useDashboardData';
import { getCompanies } from '../api/company.api';
import type { Company } from '../types/company.type';
import type { CompanyMetric } from '../types/dashboard.type';


export const DashboardPage = () => {
  const { stats, campaignMetrics, companyMetrics, monthlyData, channelData, isLoading, error, refreshData } = useDashboardData();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [filteredMetrics, setFilteredMetrics] = useState(campaignMetrics);
  const [filteredCompanyStats, setFilteredCompanyStats] = useState<CompanyMetric | null>(companyMetrics[0] || null);

  // Load companies list
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companiesList = await getCompanies();
        setCompanies(companiesList);
      } catch (err) {
        console.error('Failed to load companies:', err);
      }
    };
    loadCompanies();
  }, []);

  // Filter metrics based on selected company
  useEffect(() => {
    if (selectedCompanyId && companyMetrics.length > 0) {
      // Find company metrics
      const companyMetric = companyMetrics.find(c => c.id === selectedCompanyId);
      setFilteredCompanyStats(companyMetric || null);
      
      // Filter campaigns for this company (match by company_id pattern or relationship)
      // For now, we'll show top campaigns for all data
      setFilteredMetrics(campaignMetrics);
    } else {
      setFilteredMetrics(campaignMetrics);
      setFilteredCompanyStats(companyMetrics[0] || null);
    }
  }, [selectedCompanyId, campaignMetrics, companyMetrics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of campaign performance and metrics</p>
      </div>

      {/* Company Filter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Company:
          </label>
          <select
            value={selectedCompanyId || ''}
            onChange={(e) => setSelectedCompanyId(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 cursor-pointer focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.client_name}
              </option>
            ))}
          </select>
          {selectedCompany && (
            <div className="ml-auto flex items-center gap-4">
              <div className="text-sm">
                <p className="text-gray-600 dark:text-gray-400">Status: <span className="font-semibold text-gray-900 dark:text-white">{selectedCompany.status}</span></p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Company Details Summary */}
      {selectedCompany && filteredCompanyStats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
        >
          <h3 className="text-xl font-semibold mb-4">{selectedCompany.client_name} - Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Total Budget</p>
              <p className="text-2xl font-bold">${(filteredCompanyStats.totalBudget ?? 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Total Spend</p>
              <p className="text-2xl font-bold">${(filteredCompanyStats.totalSpend ?? 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Remaining</p>
              <p className="text-2xl font-bold">${(filteredCompanyStats.remainingBudget ?? 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Campaigns</p>
              <p className="text-2xl font-bold">{filteredCompanyStats.campaignCount ?? 0}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="blue"
          delay={0.1}
        />
        <StatsCard
          title="Total Campaigns"
          value={stats.totalCampaigns}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          color="purple"
          delay={0.2}
        />
        <StatsCard
          title="Total Budget"
          value={stats.totalBudget}
          prefix="$"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
          delay={0.3}
        />
        <StatsCard
          title="Total Spend"
          value={stats.totalSpend}
          prefix="$"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="orange"
          delay={0.4}
        />
        <StatsCard
          title="Remaining Budget"
          value={stats.remainingBudget}
          prefix="$"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          color="teal"
          delay={0.5}
        />
        <StatsCard
          title="Average ROI"
          value={stats.averageROI}
          suffix="%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color="pink"
          delay={0.6}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignChart data={filteredMetrics} />
        <BudgetVsSpendChart data={monthlyData} />
      </div>

      {/* Channel Allocation & Company Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelAllocationChart data={channelData} />
        <CompanyPerformance companies={companyMetrics} />
      </div>

      {/* Top Campaigns Table */}
      <TopCampaignsTable campaigns={filteredMetrics} />
    </motion.div>
  );
};

export default DashboardPage;
