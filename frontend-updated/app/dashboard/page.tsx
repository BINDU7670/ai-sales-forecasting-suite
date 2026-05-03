'use client';

import { useState, memo } from 'react';
import { TransitionLink } from '@/components/TransitionLink';
import {
  LayoutDashboard, UploadCloud, LineChart as LineChartIcon, Settings,
  Calendar, Filter, Download, ArrowUpRight, Sparkles, AlertTriangle,
  TrendingUp, Send, Menu, ChevronLeft, BarChart2
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { NavItem } from '@/components/NavItem';
import { SalesDistributionChart } from '@/components/SalesDistributionChart';
import { ThemeToggle } from '@/components/ThemeToggle';

const ForecastingChart = dynamic(() => import('@/components/ForecastingChart').then(mod => mod.ForecastingChart), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-slate-500 bg-obsidian-light/20 rounded-xl border border-glass-border/50 animate-pulse">
      Loading chart...
    </div>
  )
});

export default function Dashboard() {
  const [isDesktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-obsidian flex overflow-hidden text-slate-200">
      {}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {}
      <aside className={`fixed md:relative z-50 md:z-20 flex flex-col h-screen transition-[width,transform] duration-300 ease-in-out will-change-[width,transform] border-r border-glass-border bg-obsidian-light shrink-0 ${isDesktopSidebarOpen ? 'w-64' : 'w-64 md:w-20'} ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-glass-border">
          <span className={`font-bold text-lg tracking-tight text-white transition-all duration-300 whitespace-nowrap overflow-hidden ${!isDesktopSidebarOpen ? 'md:max-w-0 md:opacity-0' : 'md:max-w-[150px] md:opacity-100'}`}>Forecast</span>
          
          {}
          <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer">
            <ChevronLeft size={20} />
          </button>

          {}
          <button onClick={() => setDesktopSidebarOpen(!isDesktopSidebarOpen)} className={`hidden md:block p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer ${!isDesktopSidebarOpen ? 'mx-auto' : ''}`}>
            {isDesktopSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          <TransitionLink href="/dashboard" className="block" loaderText="LOADING DASHBOARD...">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
          <TransitionLink href="/analytics" className="block" loaderText="LOADING ANALYTICS...">
            <NavItem icon={<BarChart2 size={20} />} label="Analytics" isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
          <TransitionLink href="/upload" className="block" loaderText="LOADING DATA UPLOAD...">
            <NavItem icon={<UploadCloud size={20} />} label="Data Upload" isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
          <TransitionLink href="/forecasts" className="block" loaderText="LOADING FORECASTS...">
            <NavItem icon={<LineChartIcon size={20} />} label="Forecasts" isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
          <TransitionLink href="/settings" className="block" loaderText="LOADING SETTINGS...">
            <NavItem icon={<Settings size={20} />} label="Settings" isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
        </nav>

        <div className="p-4 border-t border-glass-border">
          <div className={`flex items-center gap-3 ${isDesktopSidebarOpen ? 'md:gap-3' : 'md:justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-ai p-[2px] shrink-0">
              <div className="w-full h-full rounded-full bg-obsidian flex items-center justify-center text-sm font-bold">JD</div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-300 whitespace-nowrap ${!isDesktopSidebarOpen ? 'md:max-w-0 md:opacity-0' : 'md:max-w-[150px] md:opacity-100'}`}>
              <span className="text-sm font-medium text-white truncate">Jane Doe</span>
              <span className="text-xs text-slate-400 truncate">Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        {}
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] md:w-[50vw] max-w-[800px] aspect-square rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[80vw] md:w-[50vw] max-w-[800px] aspect-square rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.15)_0%,transparent_70%)] pointer-events-none" />

        {}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-glass-border glass-panel z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileSidebarOpen(true)} 
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold text-white">Overview</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-2 glass-panel px-3 py-1.5 rounded-lg text-sm text-slate-300">
              <Calendar size={16} className="text-electric-indigo" />
              <span>Last 90 Days</span>
            </div>
            <div className="hidden md:flex items-center gap-2 glass-panel px-3 py-1.5 rounded-lg text-sm text-slate-300">
              <Filter size={16} className="text-cyber-purple" />
              <span>All Categories</span>
            </div>
            <button className="flex items-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-glass-border px-3 sm:px-4 py-1.5 rounded-lg text-sm text-slate-800 dark:text-white font-medium transition-colors">
              <Download size={16} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </header>

        {}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10">
          <div className="max-w-7xl mx-auto space-y-6">

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard title="Total Revenue" value="$3.45M" subtitle="+8.4% vs last period" subtitleColor="text-neon-teal" icon={<TrendingUp size={20} className="text-neon-teal" />} />
              <KpiCard title="Growth Rate" value="14.2%" subtitle="Target: 12.0%" icon={<ArrowUpRight size={20} className="text-cyber-purple" />} />
              <KpiCard title="Average Order Value" value="$124.50" subtitle="Consistent across Q3" icon={<LineChartIcon size={20} className="text-electric-indigo" />} />
              <KpiCard title="Peak Sales Date" value="Nov 24, 2025" subtitle="Black Friday Event" icon={<Calendar size={20} className="text-slate-400" />} />
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {}
              <div className="lg:col-span-7 glass-panel rounded-2xl p-4 sm:p-6 flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Revenue Forecast</h2>
                    <p className="text-sm text-slate-400">Historical data vs AI predicted bounds</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-1 bg-neon-teal rounded-full"></div>
                      <span className="text-slate-300">Historical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-1 bg-electric-indigo rounded-full border border-dashed border-electric-indigo bg-transparent"></div>
                      <span className="text-slate-300">Forecast</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-[350px]">
                  <ForecastingChart />
                </div>
              </div>

              {}
              <div className="lg:col-span-3 glass-panel rounded-2xl p-4 sm:p-6 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white">Sales Distribution</h2>
                  <p className="text-sm text-slate-400">Revenue by category</p>
                </div>
                <div className="flex-1 min-h-[250px] lg:min-h-[350px]">
                  <SalesDistributionChart />
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {}
              <div className="lg:col-span-2 glass-panel-glow rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-ai" />
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-cyber-purple" />
                    <h3 className="text-base font-semibold text-white">Claude Executive Summary</h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Q4 revenue is stabilizing. The model detects a high-probability seasonal spike approaching in <span className="text-neon-teal font-medium">14 days</span>, driven by the Electronics category.
                  </p>
                  <div className="mt-4 p-3 rounded-lg bg-electric-indigo/10 border border-electric-indigo/20">
                    <p className="text-xs text-electric-indigo font-medium">
                      Recommended action: Ensure inventory levels are optimized for a 15-20% demand surge.
                    </p>
                  </div>
                </div>
                {}
                <div className="mt-6">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Ask Claude about your sales data..."
                      className="w-full bg-obsidian-light/80 border border-glass-border rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyber-purple/50 focus:ring-1 focus:ring-cyber-purple/50 transition-all backdrop-blur-md"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-electric-indigo hover:bg-electric-indigo/80 text-pure-white rounded-lg transition-colors">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {}
              <div className="lg:col-span-1 space-y-3 flex flex-col justify-center">
                <InsightCard title="Seasonal Anomaly Detected" impact="High" type="info" />
                <InsightCard title="Growth Trend in B2B Segment" impact="Medium" type="success" />
                <InsightCard title="Risk: Stockout likely for SKU-892" impact="High" type="warning" />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

const KpiCard = memo(function KpiCard({ title, value, subtitle, subtitleColor = "text-slate-400", icon }: { title: string, value: string, subtitle: string, subtitleColor?: string, icon: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className="p-2 bg-obsidian rounded-lg border border-glass-border">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className={`text-xs font-medium ${subtitleColor}`}>{subtitle}</div>
      </div>
    </div>
  );
});

const InsightCard = memo(function InsightCard({ title, impact, type }: { title: string, impact: string, type: 'info' | 'warning' | 'success' }) {
  const impactColors = {
    High: type === 'warning' ? 'bg-rose-500/20 text-rose-400' : 'bg-electric-indigo/20 text-electric-indigo',
    Medium: 'bg-amber-500/20 text-amber-400',
    Low: 'bg-slate-500/20 text-slate-300'
  };

  return (
    <div className={`glass-panel rounded-xl p-4 border-l-2 ${type === 'warning' ? 'border-l-rose-500' : type === 'success' ? 'border-l-neon-teal' : 'border-l-electric-indigo'} flex items-start justify-between gap-4`}>
      <div className="flex items-start gap-3">
        {type === 'warning' ? <AlertTriangle size={16} className="text-rose-500 mt-0.5 shrink-0" /> : <Sparkles size={16} className={type === 'success' ? 'text-neon-teal mt-0.5 shrink-0' : 'text-electric-indigo mt-0.5 shrink-0'} />}
        <p className="text-sm text-slate-300 font-medium">{title}</p>
      </div>
      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md shrink-0 ${impactColors[impact as keyof typeof impactColors]}`}>
        {impact}
      </span>
    </div>
  );
});
