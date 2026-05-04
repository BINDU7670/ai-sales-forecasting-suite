'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export function TopProductsChart({ data }: { data?: any[] }) {
  const chartData = data && data.length > 0 ? data.map(item => ({ name: item.name, sales: parseInt(item.revenue.replace(/[^0-9.-]+/g,"")) })) : [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={chartData} 
        layout="vertical" 
        margin={{ top: 20, right: 30, left: 40, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-glass-border)" horizontal={true} vertical={false} />
        <XAxis 
          type="number"
          stroke="var(--color-slate-400)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <YAxis 
          type="category"
          dataKey="name" 
          stroke="var(--color-slate-400)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          width={120}
        />
        <Tooltip 
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          contentStyle={{ 
            backgroundColor: 'var(--theme-obsidian-light)',
            border: '1px solid var(--theme-glass-border)',
            color: 'var(--theme-white)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
          }}
          itemStyle={{ color: 'var(--theme-white)' }}
          labelStyle={{ color: 'var(--color-slate-400)', marginBottom: '4px' }}
          formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
        />
        <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={24}>
          {(data || []).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--color-electric-indigo)' : index === 1 ? 'var(--color-cyber-purple)' : 'var(--color-neon-teal)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
