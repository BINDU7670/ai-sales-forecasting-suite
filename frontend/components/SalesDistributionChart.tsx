'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function SalesDistributionChart({ data = [] }: { data?: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium italic">
        No distribution data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--color-obsidian-light)',
            border: '1px solid var(--color-glass-border)',
            color: 'var(--theme-white)',
            borderRadius: '8px',
            backdropFilter: 'blur(12px)',
          }}
          itemStyle={{ color: 'var(--theme-white)' }}
          formatter={(value: any) => [`${value}%`, 'Revenue Share']}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          wrapperStyle={{ fontSize: '12px', color: 'var(--color-slate-400)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
