'use client';

import { memo } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Oct 01', historical: 2800 },
  { date: 'Oct 15', historical: 3100 },
  { date: 'Nov 01', historical: 3400 },
  { date: 'Nov 15', historical: 3200 },
  { date: 'Nov 24', historical: 3900 }, 
  { date: 'Dec 01', historical: 3450, forecast: 3450, bounds: [3450, 3450] }, 
  { date: 'Dec 15', forecast: 3800, bounds: [3500, 4100] },
  { date: 'Jan 01', forecast: 4200, bounds: [3800, 4600] },
  { date: 'Jan 15', forecast: 4800, bounds: [4200, 5400] },
  { date: 'Feb 01', forecast: 5100, bounds: [4400, 5900] },
];

export const ForecastingChart = memo(function ForecastingChart() {
  return (
    <div className="h-full w-full min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="colorBounds" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-glass-border)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => `$${val/1000}k`} 
            dx={-10} 
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'var(--theme-obsidian-light)', 
              border: '1px solid var(--theme-glass-border)', 
              borderRadius: '8px', 
              color: 'var(--theme-white)'
            }}
            itemStyle={{ color: 'var(--theme-white)' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="bounds" 
            stroke="none" 
            fill="url(#colorBounds)" 
            isAnimationActive={true}
          />
          <Line 
            type="monotone" 
            dataKey="historical" 
            name="Historical"
            stroke="#2DD4BF" 
            strokeWidth={3} 
            dot={{ r: 4, fill: 'var(--theme-obsidian)', strokeWidth: 2, stroke: '#2DD4BF' }} 
            activeDot={{ r: 6, fill: '#2DD4BF', strokeWidth: 0 }} 
          />
          <Line 
            type="monotone" 
            dataKey="forecast" 
            name="Forecast"
            stroke="#6366F1" 
            strokeWidth={3} 
            strokeDasharray="5 5" 
            dot={{ r: 4, fill: 'var(--theme-obsidian)', strokeWidth: 2, stroke: '#6366F1' }} 
            activeDot={{ r: 6, fill: '#6366F1', strokeWidth: 0 }} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});
