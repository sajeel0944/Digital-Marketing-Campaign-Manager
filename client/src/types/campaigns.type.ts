export interface Campaign {
  id: number;
  company_id: number;
  campaign_title: string;
  headline: string[];
  tone_guide: string;
  budget: number;
  spend: number;
  channel_allocation: { [key: string]: number }[];
  visual_direction: string;
  tag: string[];
  description_about_brirf: string;
}

export interface AddCampaignSchema {
  campaign_title: string;
  headline: string[];
  tone_guide: string;
  budget: number;
  spend?: number;
  channel_allocation: { [key: string]: number }[];
  visual_direction: string;
  tag: string[];
  description_about_brirf: string;
}

export interface CampaignApiResponse {
  message: string;
  status: string;
}

export type CampaignFormMode = 'add' | 'edit';

