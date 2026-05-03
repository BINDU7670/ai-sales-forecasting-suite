'use client';

import React, { useMemo } from 'react';
import { 
  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Scatter
} from 'recharts';

const generateData = () => {
  const data = [];
  let currentSales = 10000;
  
  for (let i = -60; i <= 0; i++) {
    currentSales = currentSales + (Math.random() - 0.4) * 1000;
    
    let isAnomaly = false;
    let anomalyValue = null;
    
    
    if (i === -45) {
      isAnomaly = true;
      anomalyValue = currentSales + 4000; 
    } else if (i === -15) {
      isAnomaly = true;
      anomalyValue = currentSales - 3500; 
    }
    
    data.push({
      day: i,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: isAnomaly ? anomalyValue : Math.round(currentSales),
      anomaly: isAnomaly ? anomalyValue : null,
    });
  }

  return data;
};

export function AnomalyDetectionChart() {
  const data = useMemo(() => generateData(), []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-glass-border)" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="var(--color-slate-400)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          minTickGap={30}
        />
        <YAxis 
          stroke="var(--color-slate-400)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--theme-obsidian-light)', 
            border: '1px solid var(--theme-glass-border)',
            borderRadius: '12px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            color: 'var(--theme-white)'
          }}
          itemStyle={{ color: 'var(--theme-white)' }}
          labelStyle={{ color: 'var(--color-slate-400)', marginBottom: '4px' }}
        />
        
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="var(--color-neon-teal)" 
          strokeWidth={2} 
          dot={false}
          activeDot={{ r: 4, fill: 'var(--color-neon-teal)', strokeWidth: 0 }}
        />
        
        <Scatter 
          dataKey="anomaly" 
          fill="var(--color-rose-500)"
          shape="circle"
          r={6}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
