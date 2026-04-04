import { useState, useEffect, useCallback } from 'react';
import type { Company, AddCompSchema } from '../types/company.type';
import { addCompany, deleteCompany, getCompanies, updateCompany } from '../api/company.api';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch companies');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNewCompany = async (companyData: AddCompSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      await addCompany(companyData);
      await fetchCompanies();
      return { success: true, message: 'Company added successfully' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add company';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const editCompany = async (id: number, companyData: AddCompSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateCompany(id, companyData);
      await fetchCompanies();
      return { success: true, message: 'Company updated successfully' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update company';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const removeCompany = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteCompany(id);
      await fetchCompanies();
      return { success: true, message: 'Company deleted successfully' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete company';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    isLoading,
    error,
    addNewCompany,
    editCompany,
    removeCompany,
    refreshCompanies: fetchCompanies,
  };
};