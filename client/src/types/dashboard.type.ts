export interface DashboardStats {
  totalCompanies: number;
  totalCampaigns: number;
  totalBudget: number;
  totalSpend: number;
  remainingBudget: number;
  averageROI: number;
}

export interface CampaignMetric {
  id: number;
  name: string;
  budget: number;
  spend: number;
  remaining: number;
  progress: number;
}

export interface CompanyMetric {
  id: number;
  name: string;
  totalBudget: number;
  totalSpend: number;
  campaignCount: number;
  remainingBudget: number;
}

export interface MonthlyData {
  month: string;
  budget: number;
  spend: number;
}

export interface ChannelData {
  name: string;
  value: number;
  color: string;
}