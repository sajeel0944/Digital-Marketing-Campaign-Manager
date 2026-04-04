import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import type {
  AddCampaignSchema,
  Campaign,
  CampaignFormMode,
} from "../../types/campaigns.type";
import type { Company } from "../../types/company.type";
import { X } from "lucide-react";

interface CampaignFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyId: number, data: AddCampaignSchema) => Promise<void>;
  initialData?: Campaign | null;
  generatedData?: AddCampaignSchema | null;
  mode: CampaignFormMode;
  isLoading: boolean;
  companies: Company[];
  selectedCompanyId?: number | null;
}

export const CampaignForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  generatedData,
  mode,
  isLoading,
  companies,
  selectedCompanyId,
}: CampaignFormProps) => {
  const [channelInputs, setChannelInputs] = useState<
    { key: string; value: number }[]
  >([]);
  const [selectedCompany, setSelectedCompany] = useState<number>(
    selectedCompanyId || 0,
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AddCampaignSchema>({
    defaultValues: {
      campaign_title: "",
      headline: [""],
      tone_guide: "",
      budget: 0,
      channel_allocation: [],
      visual_direction: "",
      tag: [""],
      description_about_brirf: "",
    },
  });

  const {
    fields: headlineFields,
    append: appendHeadline,
    remove: removeHeadline,
  } = useFieldArray({
    control,
    name: "headline" as any,
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control,
    name: "tag" as any,
  });

  useEffect(() => {
    if (generatedData && mode === "add") {
      reset(generatedData);
      if (generatedData.channel_allocation) {
        const channels = Object.entries(
          generatedData.channel_allocation[0] || {},
        ).map(([key, value]) => ({
          key,
          value,
        }));
        setChannelInputs(channels);
      }
    } else if (initialData && mode === "edit") {
      reset(initialData);
      if (
        initialData.channel_allocation &&
        initialData.channel_allocation.length > 0
      ) {
        const channels = Object.entries(initialData.channel_allocation[0]).map(
          ([key, value]) => ({
            key,
            value,
          }),
        );
        setChannelInputs(channels);
      }
      if (initialData.id) {
        setSelectedCompany(initialData.id);
      }
    } else if (mode === "add") {
      reset({
        campaign_title: "",
        headline: [""],
        tone_guide: "",
        budget: 0,
        channel_allocation: [],
        visual_direction: "",
        tag: [""],
        description_about_brirf: "",
      });
      setChannelInputs([]);
      if (selectedCompanyId) {
        setSelectedCompany(selectedCompanyId);
      }
    }
  }, [initialData, generatedData, mode, reset, selectedCompanyId]);

  const addChannel = () => {
    setChannelInputs([...channelInputs, { key: "", value: 0 }]);
  };

  const updateChannel = (index: number, key: string, value: number) => {
    const updated = [...channelInputs];
    updated[index] = { key, value };
    setChannelInputs(updated);
  };

  const removeChannel = (index: number) => {
    setChannelInputs(channelInputs.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data: AddCampaignSchema) => {
    const channelAllocationObj: { [key: string]: number } = {};
    channelInputs.forEach((channel) => {
      if (channel.key) {
        channelAllocationObj[channel.key] = channel.value;
      }
    });

    const submitData = {
      ...data,
      channel_allocation: [channelAllocationObj],
    };

    await onSubmit(selectedCompany, submitData);
    onClose();
    reset();
    setChannelInputs([]);
    setSelectedCompany(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                    {mode === "add" ? "Add New Campaign" : "Edit Campaign"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="p-6 space-y-6"
              >
                {/* Company Selection - Only show in add mode */}
                {mode === "add" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Company *
                    </label>
                    <select
                      value={selectedCompany}
                      onChange={(e) =>
                        setSelectedCompany(Number(e.target.value))
                      }
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value={0}>Select a company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.client_name}
                        </option>
                      ))}
                    </select>
                    {selectedCompany === 0 && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        Please select a company
                      </p>
                    )}
                  </div>
                )}

                {/* Campaign Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    {...register("campaign_title", {
                      required: "Campaign title is required",
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter campaign title"
                  />
                  {errors.campaign_title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.campaign_title.message}
                    </p>
                  )}
                </div>

                {/* Headlines */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Headlines *
                  </label>
                  {headlineFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 mb-2">
                      <input
                        {...register(`headline.${index}`, {
                          required: "Headline is required",
                        })}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder={`Headline ${index + 1}`}
                      />
                      {headlineFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHeadline(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendHeadline("")}
                    className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Add Headline
                  </button>
                </div>

                {/* Tone Guide */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tone Guide *
                  </label>
                  <textarea
                    {...register("tone_guide", {
                      required: "Tone guide is required",
                    })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the tone guide for this campaign"
                  />
                  {errors.tone_guide && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.tone_guide.message}
                    </p>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("budget", {
                      required: "Budget is required",
                      min: {
                        value: 0,
                        message: "Budget must be greater than 0",
                      },
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter budget"
                  />
                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.budget.message}
                    </p>
                  )}
                </div>

                {/* Channel Allocation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Channel Allocation *
                  </label>
                  {channelInputs.map((channel, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        value={channel.key}
                        onChange={(e) =>
                          updateChannel(index, e.target.value, channel.value)
                        }
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Channel name (e.g., Facebook, Google)"
                      />
                      <input
                        type="number"
                        value={channel.value}
                        onChange={(e) =>
                          updateChannel(
                            index,
                            channel.key,
                            Number(e.target.value),
                          )
                        }
                        className="w-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Amount"
                      />
                      <button
                        type="button"
                        onClick={() => removeChannel(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addChannel}
                    className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Add Channel
                  </button>
                </div>

                {/* Visual Direction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visual Direction *
                  </label>
                  <textarea
                    {...register("visual_direction", {
                      required: "Visual direction is required",
                    })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the visual direction"
                  />
                  {errors.visual_direction && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.visual_direction.message}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags *
                  </label>
                  {tagFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 mb-2">
                      <input
                        {...register(`tag.${index}`, {
                          required: "Tag is required",
                        })}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={`Tag ${index + 1}`}
                      />
                      {tagFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendTag("")}
                    className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Add Tag
                  </button>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Description *
                  </label>
                  <textarea
                    {...register("description_about_brirf", {
                      required: "Description is required",
                    })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the campaign brief"
                  />
                  {errors.description_about_brirf && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.description_about_brirf.message}
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={
                      isLoading || (mode === "add" && selectedCompany === 0)
                    }
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading
                      ? "Saving..."
                      : mode === "add"
                        ? "Add Campaign"
                        : "Update Campaign"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
