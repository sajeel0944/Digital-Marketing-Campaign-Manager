import type { AddCampaignSchema } from "./campaigns.type";

export type CampaignObjectiveType =
  | "awareness"
  | "consideration"
  | "conversion";
export type ToneType =
  | "formal"
  | "informal"
  | "friendly"
  | "professional"
  | "funny"
  | "luxury";

export interface AiBriefSchema {
  name: string;
  industry: string;
  website: string;
  campaign_objective: CampaignObjectiveType;
  target_audience: string;
  budget: number;
  tone: ToneType;
  imagery_style: string;
  do_and_dont: string;
}

export type AiBriefApiResponse =  AddCampaignSchema