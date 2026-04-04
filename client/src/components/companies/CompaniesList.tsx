import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCompanies } from '../../hooks/useCompanies';
import { CompanyTable } from './CompanyTable';
import { CompanyForm } from './CompanyForm';
import { DeleteConfirmation } from './DeleteConfirmation';
import { AddCompanyButton } from './AddCompanyButton';
import type { Company, AddCompSchema } from '../../types/company.type';

export const CompaniesList = () => {
  const { companies, isLoading, error, addNewCompany, editCompany, removeCompany } = useCompanies();
  
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddClick = () => {
    setFormMode('add');
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (company: Company) => {
    setFormMode('edit');
    setSelectedCompany(company);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: AddCompSchema) => {
    setIsSubmitting(true);
    let result;
    
    if (formMode === 'add') {
      result = await addNewCompany(data);
    } else if (selectedCompany) {
      result = await editCompany(selectedCompany.id, data);
    }
    
    setIsSubmitting(false);
    
    if (result?.success) {
      setIsFormOpen(false);
      setSelectedCompany(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCompany) return;
    
    setIsSubmitting(true);
    const result = await removeCompany(selectedCompany.id);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsDeleteOpen(false);
      setSelectedCompany(null);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Companies</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your client companies</p>
        </motion.div>
        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <AddCompanyButton onClick={handleAddClick} />
        </motion.div>
      </div>

      {/* Loading State */}
      {isLoading && companies.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No companies</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new company.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <CompanyTable 
            companies={companies}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </motion.div>
      )}

      {/* Forms */}
      <CompanyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCompany}
        mode={formMode}
        isLoading={isSubmitting}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        companyName={selectedCompany?.client_name || ''}
        isLoading={isSubmitting}
      />
    </div>
  );
};