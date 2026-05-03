'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Electronics', value: 40, color: 'var(--color-electric-indigo)' },
  { name: 'Clothing', value: 35, color: 'var(--color-cyber-purple)' },
  { name: 'Home Goods', value: 25, color: 'var(--color-neon-teal)' },
];

export function SalesDistributionChart() {
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
            backgroundColor: 'var(--theme-obsidian-light)',
            border: '1px solid var(--theme-glass-border)',
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
