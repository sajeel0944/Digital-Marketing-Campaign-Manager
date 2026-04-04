import axios from 'axios';
import type { AuthSchema, LoginResponse } from '../types/auth.type';

export const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL;
export const BACK_END_SECRET_API_KEY = import.meta.env.VITE_PUBLIC_BACK_END_SECRET_API_KEY;

export const loginService = async (payload: AuthSchema): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/login`, payload, {
      headers: {
        'X-API-KEY': BACK_END_SECRET_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
};