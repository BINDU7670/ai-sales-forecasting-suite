'use client';

import { useState, memo } from 'react';
import { TransitionLink } from '@/components/TransitionLink';
import { NavItem } from '@/components/NavItem';
import { CustomSelect } from '@/components/CustomSelect';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  LayoutDashboard, UploadCloud, LineChart as LineChartIcon, Settings,
  Calendar, Filter, Download, ArrowUpRight, Sparkles, AlertTriangle,
  TrendingUp, Activity, DollarSign, ShoppingCart, BarChart2, Menu, ChevronLeft,
  ArrowDownRight, Zap, Target
} from 'lucide-react';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';

const AnomalyDetectionChart = dynamic(() => import('@/components/AnomalyDetectionChart').then(mod => mod.AnomalyDetectionChart), { ssr: false });
const TopProductsChart = dynamic(() => import('@/components/TopProductsChart').then(mod => mod.TopProductsChart), { ssr: false });

const KpiCard = memo(function KpiCard({ title, value, subtitle, trend, icon, colorClass }: { title: string, value: string, subtitle: string, trend?: 'up' | 'down' | 'neutral', icon: React.ReactNode, colorClass: string }) {
  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-opacity group-hover:opacity-20`} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className={`p-2 rounded-lg bg-obsidian-light/50 border border-glass-border/50 ${colorClass.split(' ')[1]}`}>
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="flex items-center gap-2">
          {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-emerald-400" />}
          {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-rose-400" />}
          {trend === 'neutral' && <Activity className="w-4 h-4 text-amber-400" />}
          <span className={`text-xs ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : trend === 'neutral' ? 'text-amber-400' : 'text-slate-400'}`}>
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
});

const InsightCard = memo(function InsightCard({ title, description, impact, type }: { title: string, description: string, impact: string, type: 'opportunity' | 'anomaly' | 'risk' }) {
  const styles = {
    opportunity: {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />
    },
    anomaly: {
      border: 'border-amber-500/30 hover:border-amber-500/60',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      icon: <Activity className="w-5 h-5 text-amber-400" />
    },
    risk: {
      border: 'border-rose-500/50 hover:border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-pulse-slow',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />
    }
  };

  const style = styles[type];

  return (
    <div className={`glass-panel rounded-xl p-6 border transition-all duration-300 ${style.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${style.bg}`}>
          {style.icon}
        </div>
        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
          {impact} Impact
        </span>
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
});

export default function AnalyticsPage() {
  const [isDesktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState('ytd');
  const [category, setCategory] = useState('all');

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
          
          <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer">
            <ChevronLeft size={20} />
          </button>

          <button onClick={() => setDesktopSidebarOpen(!isDesktopSidebarOpen)} className={`hidden md:block p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white cursor-pointer ${!isDesktopSidebarOpen ? 'mx-auto' : ''}`}>
            {isDesktopSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          <TransitionLink href="/dashboard" className="block" loaderText="LOADING DASHBOARD...">
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
          <TransitionLink href="/analytics" className="block" loaderText="LOADING ANALYTICS...">
            <NavItem icon={<BarChart2 size={20} />} label="Analytics" active isDesktopOpen={isDesktopSidebarOpen} />
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
            <h1 className="text-xl font-semibold text-white">Business Analytics & AI Insights</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-2 glass-panel px-1 py-1 rounded-lg text-sm text-slate-300">
              <CustomSelect
                value={dateRange}
                onChange={setDateRange}
                options={[
                  { value: 'ytd', label: 'Year to Date' },
                  { value: '6m', label: 'Last 6 Months' },
                  { value: '30d', label: 'Last 30 Days' }
                ]}
                icon={<Calendar size={16} className="text-electric-indigo" />}
                className="w-40"
                buttonClassName="border-none bg-transparent py-1.5 px-3 hover:bg-white/5"
              />
            </div>
            <div className="hidden lg:flex items-center gap-2 glass-panel px-1 py-1 rounded-lg text-sm text-slate-300">
              <CustomSelect
                value={category}
                onChange={setCategory}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'electronics', label: 'Electronics' },
                  { value: 'hardware', label: 'Hardware' },
                  { value: 'software', label: 'Software' }
                ]}
                icon={<Filter size={16} className="text-cyber-purple" />}
                className="w-44"
                buttonClassName="border-none bg-transparent py-1.5 px-3 hover:bg-white/5"
              />
            </div>
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-glass-border px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              <Download size={16} />
              <span className="hidden sm:inline">Export PDF Report</span>
            </button>
          </div>
        </header>

        {}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10">
          <div className="max-w-7xl mx-auto space-y-8">

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <KpiCard 
                title="Total Revenue" 
                value="$1.24M" 
                subtitle="vs previous period" 
                trend="up"
                icon={<DollarSign size={20} className="text-electric-indigo" />}
                colorClass="from-electric-indigo text-electric-indigo"
              />
              <KpiCard 
                title="Avg Sales/Period" 
                value="$41.3K" 
                subtitle="Consistent baseline" 
                trend="neutral"
                icon={<BarChart2 size={20} className="text-neon-teal" />}
                colorClass="from-neon-teal text-neon-teal"
              />
              <KpiCard 
                title="Growth Rate" 
                value="+14.2%" 
                subtitle="Accelerating" 
                trend="up"
                icon={<TrendingUp size={20} className="text-emerald-400" />}
                colorClass="from-emerald-400 text-emerald-400"
              />
              <KpiCard 
                title="Peak Sales Date" 
                value="Black Friday '25" 
                subtitle="Historical max" 
                icon={<Target size={20} className="text-cyber-purple" />}
                colorClass="from-cyber-purple text-cyber-purple"
              />
              <KpiCard 
                title="Sales Variance" 
                value="8.4%" 
                subtitle="Increasing volatility" 
                trend="down"
                icon={<Activity size={20} className="text-rose-400" />}
                colorClass="from-rose-400 text-rose-400"
              />
            </div>

            {}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel-glow rounded-2xl p-6 sm:p-8 relative overflow-hidden border-electric-indigo/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-ai" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-electric-indigo/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-ai p-[1px] flex items-center justify-center">
                  <div className="w-full h-full bg-obsidian rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-neon-teal" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Executive Summary</h2>
                <div className="ml-auto px-3 py-1 rounded-full bg-electric-indigo/10 border border-electric-indigo/20 text-electric-indigo text-xs font-bold uppercase tracking-widest">
                  AI Generated
                </div>
              </div>
              
              <p className="text-slate-300 text-lg leading-relaxed relative z-10 font-light">
                Historical analysis shows strong, consistent growth driven primarily by the B2B segment. However, sales variance is increasing. The model detected a significant anomaly in Q3 where revenue dropped 15% due to a supply chain bottleneck in the <span className="text-white font-medium px-1.5 py-0.5 rounded bg-white/10 border border-white/10">&apos;Hardware&apos;</span> category. Resolving this constraint presents the largest opportunity for next quarter.
              </p>
            </motion.div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InsightCard 
                type="opportunity"
                impact="High"
                title="Seasonal Growth in Electronics"
                description="Historical patterns strongly suggest a 22% surge in electronics category over the next 45 days. Recommended action: Increase inventory buffers."
              />
              <InsightCard 
                type="anomaly"
                impact="Medium"
                title="Unexplained Drop in Q2 Software Sales"
                description="Software subscriptions fell 8% below forecasted baseline in Q2. Correlation analysis points to a potential pricing elasticity issue."
              />
              <InsightCard 
                type="risk"
                impact="Critical"
                title="High Stockout Probability for SKU-892"
                description="Current run rate exceeds replenishment lead time. 94% probability of stockout within 12 days if emergency PO is not issued."
              />
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {}
              <div className="glass-panel rounded-2xl p-6 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white">Anomaly Detection</h3>
                  <p className="text-sm text-slate-400">Historical sales with AI-flagged anomalies</p>
                </div>
                <div className="flex-1 min-h-[300px]">
                  <AnomalyDetectionChart />
                </div>
              </div>

              {}
              <div className="glass-panel rounded-2xl p-6 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white">Top 5 Products</h3>
                  <p className="text-sm text-slate-400">Best-selling items by revenue</p>
                </div>
                <div className="flex-1 min-h-[300px]">
                  <TopProductsChart />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
