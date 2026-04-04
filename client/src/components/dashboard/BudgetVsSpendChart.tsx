import { motion } from 'framer-motion';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import type { MonthlyData } from '../../types/dashboard.type';

export const BudgetVsSpendChart = ({ data }: {
  data: MonthlyData[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Monthly Budget vs Spend Trend
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
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
            <Area
              type="monotone"
              dataKey="budget"
              fill="#3B82F6"
              stroke="#3B82F6"
              fillOpacity={0.2}
              name="Budget"
            />
            <Line
              type="monotone"
              dataKey="spend"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Spend"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};