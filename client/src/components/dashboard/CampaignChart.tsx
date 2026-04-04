import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CampaignMetric } from '../../types/dashboard.type';

export const CampaignChart = ({ data }: {
  data: CampaignMetric[];
}) => {
  const chartData = data.map(item => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
    budget: item.budget,
    spend: item.spend,
    remaining: item.remaining,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top Campaigns - Budget vs Spend
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F3F4F6',
              }}
              formatter={(value: any) => [`$${(value ?? 0).toLocaleString()}`, '']}
            />
            <Legend />
            <Bar dataKey="budget" fill="#3B82F6" name="Budget" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spend" fill="#8B5CF6" name="Spend" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};