import { CampaignsList } from "../components/campaigns/CampaignsList";

export default function CompanyCampaignDetail() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <CampaignsList allowAdd={false}/>
    </div>
  );
}
