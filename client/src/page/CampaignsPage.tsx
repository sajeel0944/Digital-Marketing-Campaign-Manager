import { CampaignsList } from "../components/campaigns/CampaignsList";

export const CampaigsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <CampaignsList allowAdd={true} />
    </div>
  );
};
