import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import type {
  AiBriefSchema,
} from "../../types/AiBrief.type";

export const AiBriefForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: AiBriefSchema) => Promise<void>;
  isLoading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AiBriefSchema>({
    defaultValues: {
      name: "",
      industry: "",
      website: "",
      campaign_objective: "awareness",
      target_audience: "",
      budget: 0,
      tone: "professional",
      imagery_style: "",
      do_and_dont: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Name *
          </label>
          <input
            {...register("name", { required: "Company name is required" })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter company name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Industry *
          </label>
          <input
            {...register("industry", { required: "Industry is required" })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter industry"
          />
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.industry.message}
            </p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Website *
          </label>
          <input
            {...register("website", { required: "Website is required" })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="https://example.com"
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.website.message}
            </p>
          )}
        </div>

        {/* Campaign Objective */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Campaign Objective *
          </label>
          <select
            {...register("campaign_objective", {
              required: "Campaign objective is required",
            })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="awareness">Awareness</option>
            <option value="consideration">Consideration</option>
            <option value="conversion">Conversion</option>
          </select>
          {errors.campaign_objective && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.campaign_objective.message}
            </p>
          )}
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Audience *
          </label>
          <textarea
            {...register("target_audience", {
              required: "Target audience is required",
            })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Describe your target audience"
          />
          {errors.target_audience && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.target_audience.message}
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
              min: { value: 0, message: "Budget must be greater than 0" },
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

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tone *
          </label>
          <select
            {...register("tone", { required: "Tone is required" })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="funny">Funny</option>
            <option value="luxury">Luxury</option>
          </select>
          {errors.tone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.tone.message}
            </p>
          )}
        </div>

        {/* Imagery Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Imagery Style *
          </label>
          <input
            {...register("imagery_style", {
              required: "Imagery style is required",
            })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Describe imagery style"
          />
          {errors.imagery_style && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.imagery_style.message}
            </p>
          )}
        </div>

        {/* Do's and Don'ts */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Do's and Don'ts *
          </label>
          <textarea
            {...register("do_and_dont", {
              required: "Do's and Don'ts are required",
            })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="List important do's and don'ts for this campaign"
          />
          {errors.do_and_dont && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.do_and_dont.message}
            </p>
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? "Generating..." : "Generate Campaign Brief"}
      </motion.button>
    </form>
  );
};
