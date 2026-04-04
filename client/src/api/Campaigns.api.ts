import axios from "axios";
import type {
  AddCampaignSchema,
  Campaign,
  CampaignApiResponse,
} from "../types/campaigns.type";

const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;
const BACK_END_SECRET_API_KEY = import.meta.env
  .VITE_PUBLIC_BACK_END_SECRET_API_KEY;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "X-API-KEY": BACK_END_SECRET_API_KEY,
    Authorization: `Bearer ${token}`,
  };
};

export const getAllCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/campaign`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getCompanyCampaigns = async (
  company_id: number,
): Promise<Campaign[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/campaign/${company_id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const addCampaign = async (
  company_id: number,
  campaignData: AddCampaignSchema,
): Promise<CampaignApiResponse> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/campaign/${company_id}`,
      campaignData,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateCampaign = async (
  campaign_id: number,
  campaignData: AddCampaignSchema,
): Promise<CampaignApiResponse> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/campaign/${campaign_id}`,
      campaignData,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteCampaign = async (
  campaign_id: number,
): Promise<CampaignApiResponse> => {
  try {
    const response = await axios.delete(`${BASE_URL}/campaign/${campaign_id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};
