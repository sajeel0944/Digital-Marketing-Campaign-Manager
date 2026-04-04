import axios from "axios";
import type {
  AddCompSchema,
  Company,
  CompanyApiResponse,
} from "../types/company.type";

const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;
const BACK_END_SECRET_API_KEY = import.meta.env.VITE_PUBLIC_BACK_END_SECRET_API_KEY;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "X-API-KEY": BACK_END_SECRET_API_KEY,
    "Authorization": `Bearer ${token}`,
  };
};

export const getCompanies = async (): Promise<Company[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/company`, {
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

export const addCompany = async (
  companyData: AddCompSchema,
): Promise<CompanyApiResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/company`, companyData, {
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

export const getCompanyById = async (comp_id: number): Promise<Company> => {
  try {
    const response = await axios.get(`${BASE_URL}/company/${comp_id}`, {
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

export const updateCompany = async (
  comp_id: number,
  companyData: AddCompSchema,
): Promise<CompanyApiResponse> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/company/${comp_id}`,
      companyData,
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

export const deleteCompany = async (
  comp_id: number,
): Promise<CompanyApiResponse> => {
  try {
    const response = await axios.delete(`${BASE_URL}/company/${comp_id}`, {
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