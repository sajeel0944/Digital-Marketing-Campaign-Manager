import { AnimatePresence } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './page/LoginPage';
import { CompanyPage } from './page/CompanyPage';
import { CampaigsPage } from './page/CampaignsPage';
import { DashboardPage } from './page/DashboardPage';
import CompanyCampaignDetail from './page/CompanyCampaignDetail';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/companies/:id" element={<CompanyCampaignDetail />} />
        <Route path="/campaigns" element={<CampaigsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;