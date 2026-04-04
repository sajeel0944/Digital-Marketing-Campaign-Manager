import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import type {
  AddCompSchema,
  Company,
  CompanyFormMode,
} from "../../types/company.type";
import { X } from "lucide-react";

export const CompanyForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddCompSchema) => Promise<void>;
  initialData?: Company | null;
  mode: CompanyFormMode;
  isLoading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCompSchema>({
    defaultValues: {
      client_name: "",
      status: "active",
      budget: 0,
      spend: 0,
    },
  });

  useEffect(() => {
    if (initialData && mode === "edit") {
      reset({
        client_name: initialData.client_name,
        status: initialData.status,
        budget: initialData.budget,
        spend: initialData.spend,
      });
    } else if (mode === "add") {
      reset({
        client_name: "",
        status: "active",
        budget: 0,
        spend: 0,
      });
    }
  }, [initialData, mode, reset]);

  const onFormSubmit = async (data: AddCompSchema) => {
    await onSubmit(data);
    onClose();
    reset();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mode === "add" ? "Add New Company" : "Edit Company"}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Name *
                  </label>
                  <input
                    {...register("client_name", {
                      required: "Client name is required",
                      minLength: {
                        value: 2,
                        message: "Client name must be at least 2 characters",
                      },
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter client name"
                  />
                  {errors.client_name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.client_name.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    {...register("status", { required: "Status is required" })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.status.message}
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter budget"
                  />
                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.budget.message}
                    </p>
                  )}
                </div>

                {/* Spend */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Spend ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("spend", {
                      required: "Spend is required",
                      min: {
                        value: 0,
                        message: "Spend must be greater than 0",
                      },
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter spend"
                  />
                  {errors.spend && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.spend.message}
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4">
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
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading
                      ? "Saving..."
                      : mode === "add"
                        ? "Add Company"
                        : "Update Company"}
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
