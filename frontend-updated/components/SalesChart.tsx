'use client';

import { memo } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 7500 },
  { name: 'Jul', revenue: 8200 },
];

export const SalesChart = memo(function SalesChart() {
  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            stroke="var(--color-slate-400)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--color-slate-400)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--theme-obsidian-light)', 
              border: '1px solid var(--theme-glass-border)',
              borderRadius: '8px',
              color: 'var(--theme-white)'
            }} 
            itemStyle={{ color: 'var(--theme-neon-teal)' }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="var(--color-cyber-purple)" 
            strokeWidth={3} 
            dot={{ r: 4, fill: 'var(--color-electric-indigo)', strokeWidth: 0 }} 
            activeDot={{ r: 6, fill: 'var(--color-neon-teal)', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});
