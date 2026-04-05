import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCampaigns } from "../../hooks/useCampaigns";
import { useAiBrief } from "../../hooks/useAiBrief";
import { useCompanies } from "../../hooks/useCompanies";
import { FilteredCampaignsData } from "./FilteredCampaignsData";
import { CampaignForm } from "./CampaignForm";
import { AiBriefForm } from "./AiBriefForm";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { AddCampaignButton } from "./AddCampaignButton";
import type { Campaign, AddCampaignSchema } from "../../types/campaigns.type";
import type { AiBriefSchema } from "../../types/AiBrief.type";
import { X } from "lucide-react";

export const CampaignsList = ({ allowAdd }: { allowAdd: boolean }) => {
  const {
    campaigns,
    isLoading,
    error,
    addNewCampaign,
    editCampaign,
    removeCampaign,
  } = useCampaigns();
  const { companies, refreshCompanies } = useCompanies();
  const {
    isLoading: isGenerating,
    generatedData,
    generateBrief,
    clearGeneratedData,
  } = useAiBrief();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isAiBriefOpen, setIsAiBriefOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    refreshCompanies();
  }, [refreshCompanies]);

  const handleAddClick = () => {
    setFormMode("add");
    setSelectedCampaign(null);
    setSelectedCompanyId(null);
    clearGeneratedData();
    setIsAiBriefOpen(true);
  };

  const handleEditClick = (campaign: Campaign) => {
    setFormMode("edit");
    setSelectedCampaign(campaign);
    clearGeneratedData();
    setIsFormOpen(true);
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteOpen(true);
  };

  const handleAiBriefSubmit = async (data: AiBriefSchema) => {
    const result = await generateBrief(data);
    if (result.success && result.data) {
      setIsAiBriefOpen(false);
      setIsFormOpen(true);
    }
  };

  const handleFormSubmit = async (
    companyId: number,
    data: AddCampaignSchema,
  ) => {
    setIsSubmitting(true);
    let result;

    if (formMode === "add") {
      result = await addNewCampaign(companyId, data);
    } else if (selectedCampaign) {
      result = await editCampaign(selectedCampaign.id, data);
    }

    setIsSubmitting(false);

    if (result?.success) {
      setIsFormOpen(false);
      setSelectedCampaign(null);
      setSelectedCompanyId(null);
      clearGeneratedData();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCampaign) return;

    setIsSubmitting(true);
    const result = await removeCampaign(selectedCampaign.id);
    setIsSubmitting(false);

    if (result.success) {
      setIsDeleteOpen(false);
      setSelectedCampaign(null);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Retry
        </button>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Campaigns
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your marketing campaigns
          </p>
        </motion.div>
        {allowAdd && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <AddCampaignButton onClick={handleAddClick} />
          </motion.div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && campaigns.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No campaigns
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by adding a new campaign.
          </p>
        </div>
      ) : (
        <FilteredCampaignsData
          campaigns={campaigns}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* AI Brief Form Modal */}
      <AnimatePresence>
        {isAiBriefOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiBriefOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Generate Campaign with AI
                    </h2>
                    <button
                      onClick={() => setIsAiBriefOpen(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Fill in the details to generate an AI-powered campaign brief
                  </p>
                </div>

                <div className="p-6">
                  <AiBriefForm
                    onSubmit={handleAiBriefSubmit}
                    isLoading={isGenerating}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Campaign Form */}
      <CampaignForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          clearGeneratedData();
          setSelectedCompanyId(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedCampaign}
        generatedData={generatedData}
        mode={formMode}
        isLoading={isSubmitting}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        campaignTitle={selectedCampaign?.campaign_title || ""}
        isLoading={isSubmitting}
      />
    </div>
  );
};
