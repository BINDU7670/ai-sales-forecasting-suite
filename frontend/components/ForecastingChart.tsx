'use client';
import React, { memo, useState, useEffect } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UploadCloud, BarChart2 } from 'lucide-react';
import Link from 'next/link';

interface ForecastingChartProps {
  data: any[];
  noDataset?: boolean;
}

export const ForecastingChart = memo(function ForecastingChart({ data, noDataset }: ForecastingChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[350px] w-full bg-black/5 dark:bg-white/5 animate-pulse rounded-2xl" />;

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full min-h-[320px] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${noDataset ? 'bg-electric-indigo/10' : 'bg-black/5 dark:bg-white/5'}`}>
          {noDataset
            ? <UploadCloud className="w-8 h-8 text-electric-indigo/70" />
            : <BarChart2 className="w-8 h-8 text-slate-600" />}
        </div>
        <div>
          {noDataset ? (
            <>
              <p className="text-white font-semibold mb-1">No Dataset Uploaded</p>
              <p className="text-slate-500 text-sm mb-4 max-w-xs leading-relaxed">
                Upload a CSV or Excel file to generate your AI-powered forecast chart.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 text-sm font-semibold text-electric-indigo hover:text-white bg-electric-indigo/10 hover:bg-electric-indigo/20 border border-electric-indigo/20 hover:border-electric-indigo/50 px-4 py-2 rounded-xl transition-all"
              >
                <UploadCloud size={15} />
                Upload Dataset
              </Link>
            </>
          ) : (
            <>
              <p className="text-slate-400 font-medium mb-1">No Date Column Detected</p>
              <p className="text-slate-600 text-xs max-w-xs leading-relaxed">
                Ensure your dataset has a column named &apos;Date&apos;, &apos;Order Date&apos;, or &apos;Transaction Date&apos; to generate the forecast chart.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="colorBounds" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-electric-indigo)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--color-electric-indigo)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="var(--color-slate-400)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10} 
          />
          <YAxis 
            stroke="var(--color-slate-400)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val: number) => `$${(val/1000).toFixed(1)}k`} 
            dx={-10} 
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'var(--color-obsidian-light)', 
              border: '1px solid var(--color-glass-border)', 
              borderRadius: '8px', 
              backdropFilter: 'blur(8px)',
              color: 'var(--theme-white)'
            }}
            itemStyle={{ color: 'var(--theme-white)' }}
            labelStyle={{ color: 'var(--color-slate-400)', marginBottom: '4px' }}
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
            stroke="var(--color-neon-teal)" 
            strokeWidth={3} 
            dot={{ r: 4, fill: 'var(--color-obsidian)', strokeWidth: 2, stroke: 'var(--color-neon-teal)' }} 
            activeDot={{ r: 6, fill: 'var(--color-neon-teal)', strokeWidth: 0 }} 
          />
          <Line 
            type="monotone" 
            dataKey="forecast" 
            name="Forecast"
            stroke="var(--color-electric-indigo)" 
            strokeWidth={3} 
            strokeDasharray="5 5" 
            dot={{ r: 4, fill: 'var(--color-obsidian)', strokeWidth: 2, stroke: 'var(--color-electric-indigo)' }} 
            activeDot={{ r: 6, fill: 'var(--color-electric-indigo)', strokeWidth: 0 }} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});

