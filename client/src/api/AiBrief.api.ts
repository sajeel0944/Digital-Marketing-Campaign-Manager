import axios from "axios";
import type { AiBriefApiResponse, AiBriefSchema } from "../types/AiBrief.type";

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

export const AiBriefService = async (
  briefData: AiBriefSchema
): Promise<AiBriefApiResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/agent/aibrief`, briefData, {
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