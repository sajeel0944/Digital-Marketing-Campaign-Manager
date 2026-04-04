import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from "react";
import type { Campaign, AddCampaignSchema } from "../types/campaigns.type";
import {
  addCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCompanyCampaigns,
  updateCampaign,
} from "../api/Campaigns.api";

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (id) {
        const data = await getCompanyCampaigns(parseInt(id));
        setCampaigns(data);
      } else {
        const data = await getAllCampaigns();
        setCampaigns(data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch campaigns");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNewCampaign = async (
    company_id: number,
    campaignData: AddCampaignSchema,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await addCampaign(company_id, campaignData);
      await fetchCampaigns();
      return { success: true, message: "Campaign added successfully" };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to add campaign";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const editCampaign = async (id: number, campaignData: AddCampaignSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateCampaign(id, campaignData);
      await fetchCampaigns();
      return { success: true, message: "Campaign updated successfully" };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update campaign";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const removeCampaign = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteCampaign(id);
      await fetchCampaigns();
      return { success: true, message: "Campaign deleted successfully" };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete campaign";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    isLoading,
    error,
    addNewCampaign,
    editCampaign,
    removeCampaign,
    refreshCampaigns: fetchCampaigns,
  };
};
