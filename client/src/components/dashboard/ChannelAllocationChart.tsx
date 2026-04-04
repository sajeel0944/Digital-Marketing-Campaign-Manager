import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChannelData } from '../../types/dashboard.type';

export const ChannelAllocationChart = ({ data }: {
  data: ChannelData[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Channel Allocation
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F3F4F6',
              }}
              formatter={(value: any) => [`$${(value ?? 0).toLocaleString()}`, 'Amount']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};