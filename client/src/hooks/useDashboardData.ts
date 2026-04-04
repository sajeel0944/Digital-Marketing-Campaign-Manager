import { useState, useEffect } from 'react';
import type { DashboardStats, CampaignMetric, CompanyMetric, MonthlyData, ChannelData } from '../types/dashboard.type';
import { getAllCampaigns } from '../api/Campaigns.api';
import { getCompanies } from '../api/company.api';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalCampaigns: 0,
    totalBudget: 0,
    totalSpend: 0,
    remainingBudget: 0,
    averageROI: 0,
  });
  
  const [campaignMetrics, setCampaignMetrics] = useState<CampaignMetric[]>([]);
  const [companyMetrics, setCompanyMetrics] = useState<CompanyMetric[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [campaigns, companies] = await Promise.all([
        getAllCampaigns(),
        getCompanies()
      ]);

      // Calculate Stats from companies (which have spend data)
      const totalBudget = companies.reduce((sum, c) => sum + (c.budget || 0), 0);
      const totalSpend = companies.reduce((sum, c) => sum + (c.spend || 0), 0);
      const remainingBudget = totalBudget - totalSpend;
      const averageROI = totalBudget > 0 ? ((totalSpend / totalBudget) * 100) : 0;

      setStats({
        totalCompanies: companies.length,
        totalCampaigns: campaigns.length,
        totalBudget,
        totalSpend,
        remainingBudget,
        averageROI,
      });

      // Campaign Metrics - use company spend for each campaign
      const campaignMetricsData: CampaignMetric[] = campaigns.map(campaign => {
        // Find the company for this campaign
        const company = companies.find(c => c.id === campaign.company_id);
        const companySpend = company?.spend || 0;
        
        return {
          id: campaign.id,
          name: campaign.campaign_title,
          budget: campaign.budget || 0,
          spend: companySpend,
          remaining: (campaign.budget || 0) - companySpend,
          progress: (campaign.budget || 0) > 0 ? (companySpend / (campaign.budget || 0)) * 100 : 0,
        };
      });
      setCampaignMetrics(campaignMetricsData.sort((a, b) => b.spend - a.spend).slice(0, 5));

      // Company Metrics
      const companyMetricsMap = new Map<number, CompanyMetric>();
      
      companies.forEach(company => {
        const companyCampaigns = campaigns.filter(c => c.company_id === company.id);
        const campaignCount = companyCampaigns.length;
        
        companyMetricsMap.set(company.id, {
          id: company.id,
          name: company.client_name,
          totalBudget: company.budget || 0,
          totalSpend: company.spend || 0,
          campaignCount,
          remainingBudget: (company.budget || 0) - (company.spend || 0),
        });
      });
      
      setCompanyMetrics(Array.from(companyMetricsMap.values()));

      // Monthly Data (Mock - replace with actual API data)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const monthlyDataMock: MonthlyData[] = months.map(month => ({
        month,
        budget: Math.random() * 50000 + 20000,
        spend: Math.random() * 40000 + 10000,
      }));
      setMonthlyData(monthlyDataMock);

      // Channel Allocation Data
      const channelMap = new Map<string, number>();
      campaigns.forEach(campaign => {
        campaign.channel_allocation.forEach(allocation => {
          Object.entries(allocation).forEach(([channel, amount]) => {
            channelMap.set(channel, (channelMap.get(channel) || 0) + amount);
          });
        });
      });
      
      const channelColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];
      const channelDataArray: ChannelData[] = Array.from(channelMap.entries()).map(([name, value], index) => ({
        name,
        value,
        color: channelColors[index % channelColors.length],
      }));
      setChannelData(channelDataArray);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    campaignMetrics,
    companyMetrics,
    monthlyData,
    channelData,
    isLoading,
    error,
    refreshData: fetchDashboardData,
  };
};