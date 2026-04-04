import { useState } from 'react';
import type { AiBriefSchema, AiBriefApiResponse } from '../types/AiBrief.type';
import { AiBriefService } from '../api/AiBrief.api';

export const useAiBrief = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<AiBriefApiResponse | null>(null);

  const generateBrief = async (briefData: AiBriefSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AiBriefService(briefData);
      setGeneratedData(response);
      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to generate campaign brief';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const clearGeneratedData = () => {
    setGeneratedData(null);
    setError(null);
  };

  return {
    isLoading,
    error,
    generatedData,
    generateBrief,
    clearGeneratedData,
  };
};