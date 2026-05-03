'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, BarChart, Bar, Cell
} from 'recharts';
import { Sparkles, TrendingUp, ShieldCheck, Settings2, Calendar, BarChart2, Play, ArrowLeft, Info, CloudRain, Globe, AlertTriangle } from 'lucide-react';
import { TransitionLink } from '@/components/TransitionLink';
import { ThemeToggle } from '@/components/ThemeToggle';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { CustomSelect } from '@/components/CustomSelect';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TooltipIcon = ({ text, align = 'center', position = 'top', widthClass = 'w-56' }: { text: string, align?: 'center' | 'left' | 'right', position?: 'top' | 'bottom', widthClass?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
  <button 
    type="button"
    className="relative group flex items-center ml-1 outline-none"
    onMouseEnter={() => setIsOpen(true)}
    onMouseLeave={() => setIsOpen(false)}
    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
    onBlur={() => setIsOpen(false)}
  >
    <Info className="w-4 h-4 text-slate-400 hover:text-slate-200 cursor-help transition-colors" />
    
    {}
    <div className={cn(
      "hidden sm:block absolute p-3 bg-pure-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-800 dark:text-slate-300 transition-all duration-200 z-[99999] shadow-2xl pointer-events-none text-left font-normal leading-relaxed whitespace-normal break-words",
      widthClass,
      position === 'top' ? "bottom-full mb-2" : "top-full mt-2",
      align === 'center' ? "left-1/2 -translate-x-1/2" : align === 'left' ? "left-0" : "right-0",
      isOpen ? "opacity-100 visible" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
    )}>
      {text}
      <div className={cn(
        "absolute border-4 border-transparent",
        position === 'top' ? "top-full -mt-[1px] border-t-slate-200 dark:border-t-slate-600" : "bottom-full -mb-[1px] border-b-slate-200 dark:border-b-slate-600",
        align === 'center' ? "left-1/2 -translate-x-1/2" : align === 'left' ? "left-[4px]" : "right-[4px]"
      )}></div>
      <div className={cn(
        "absolute border-4 border-transparent",
        position === 'top' ? "top-full -mt-[2px] border-t-pure-white dark:border-t-slate-800" : "bottom-full -mb-[2px] border-b-pure-white dark:border-b-slate-800",
        align === 'center' ? "left-1/2 -translate-x-1/2" : align === 'left' ? "left-[4px]" : "right-[4px]"
      )}></div>
    </div>

    {}
    {isOpen && (
      <div 
        className="fixed sm:hidden left-4 right-4 bottom-6 z-[999999] p-4 bg-slate-800 dark:bg-slate-900 border border-slate-600 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-left animate-in fade-in slide-in-from-bottom-5"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); }}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Info</span>
          <span className="text-slate-500 text-lg leading-none">&times;</span>
        </div>
        <p className="text-sm text-slate-200 font-normal leading-relaxed whitespace-normal break-words">{text}</p>
      </div>
    )}
  </button>
)};

const CompactSwitch = ({ checked, onChange, label, tooltip, icon: Icon, colorClass, tooltipAlign = 'right', tooltipPosition = 'bottom' }: any) => (
  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-pure-white/50 dark:bg-obsidian-light/40 border border-glass-border/30 hover:bg-slate-100 dark:hover:bg-obsidian-light/60 transition-colors">
    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 cursor-pointer whitespace-nowrap" onClick={() => onChange(!checked)}>
      {Icon && <Icon className={cn("w-3.5 h-3.5", colorClass)} />}
      {label}
      {tooltip && <TooltipIcon text={tooltip} align={tooltipAlign} position={tooltipPosition} />}
    </label>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        checked ? "bg-neon-teal" : "bg-slate-300 dark:bg-slate-700"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-pure-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-3" : "translate-x-0"
        )}
      />
    </button>
  </div>
);


const generateData = (horizon: number, aggregation: string, marketingSpend: number, holidayBoost: number, useWeather: boolean, useMacro: boolean, ignoreAnomaly: boolean) => {
  const data = [];
  let currentSales = 10000;
  let currentInventory = 150000;
  
  
  for (let i = -30; i <= 0; i++) {
    let dailySales = currentSales + (Math.random() - 0.4) * 1000;
    
    
    if (i === -14) {
      if (!ignoreAnomaly) {
        dailySales = 28000; 
      } else {
        dailySales = currentSales + 500; 
      }
    }

    currentSales = dailySales;
    currentInventory = currentInventory - currentSales;
    if (currentInventory < 30000) currentInventory += 200000;
    
    data.push({
      day: i,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      historical: Math.round(currentSales),
      predictedHoltWinters: i === 0 ? Math.round(currentSales) : null,
      predictedXGBoost: i === 0 ? Math.round(currentSales) : null,
      confidence: i === 0 ? [Math.round(currentSales), Math.round(currentSales)] : null,
      inventory: Math.round(currentInventory),
    });
  }

  
  let hwSales = currentSales;
  let xgbSales = currentSales;
  
  if (!ignoreAnomaly) {
    xgbSales += 2000; 
  }

  for (let i = 1; i <= horizon; i++) {
    
    hwSales = hwSales + (Math.random() - 0.3) * 1000 + 30;
    
    
    const marketingEffect = (marketingSpend / 100) * 500;
    const holidayEffect = (holidayBoost / 100) * (i > horizon / 2 ? 1500 : 200); 
    const weatherEffect = useWeather ? (Math.random() * 800) : 0;
    const macroEffect = useMacro ? (i * 20) : 0; 

    xgbSales = xgbSales + (Math.random() - 0.2) * 1200 + 50 + marketingEffect + holidayEffect + weatherEffect + macroEffect;
    
    const variance = 500 + i * 80;
    
    currentInventory = currentInventory - xgbSales;
    if (currentInventory < 30000) currentInventory += 200000;
    
    data.push({
      day: i,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      historical: null,
      predictedHoltWinters: Math.round(hwSales),
      predictedXGBoost: Math.round(xgbSales),
      confidence: [Math.round(xgbSales - variance), Math.round(xgbSales + variance)],
      inventory: Math.round(currentInventory),
    });
  }

  return data;
};

export function Forecast() {
  const [horizon, setHorizon] = useState(60);
  const [aggregation, setAggregation] = useState('Weekly');
  const [marketingSpend, setMarketingSpend] = useState(0);
  const [holidayBoost, setHolidayBoost] = useState(0);
  const [useWeather, setUseWeather] = useState(false);
  const [useMacro, setUseMacro] = useState(false);
  const [ignoreAnomaly, setIgnoreAnomaly] = useState(false);
  const [isForecasting, setIsForecasting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const data = useMemo(() => generateData(horizon, aggregation, marketingSpend, holidayBoost, useWeather, useMacro, ignoreAnomaly), [horizon, aggregation, marketingSpend, holidayBoost, useWeather, useMacro, ignoreAnomaly]);

  const handleRunForecast = () => {
    setIsForecasting(true);
    setShowResults(false);
    setTimeout(() => {
      setIsForecasting(false);
      setShowResults(true);
    }, 1500);
  };

  const featureImportanceData = useMemo(() => {
    const baseData = [
      { name: 'Historical Trend', value: 65 - (marketingSpend * 0.2) - (holidayBoost * 0.2) },
      { name: 'Marketing Spend', value: 10 + (marketingSpend * 0.4) },
      { name: 'Holiday Season', value: 5 + (holidayBoost * 0.5) },
      { name: 'Day of Week', value: 20 },
    ];
    if (useWeather) baseData.push({ name: 'Weather Data', value: 15 });
    if (useMacro) baseData.push({ name: 'Macro Indicators', value: 12 });
    if (!ignoreAnomaly) baseData.push({ name: 'Viral Anomaly Bias', value: 25 });
    
    return baseData.sort((a, b) => b.value - a.value);
  }, [marketingSpend, holidayBoost, useWeather, useMacro, ignoreAnomaly]);

  const displayFeatureData = showResults ? featureImportanceData : featureImportanceData.map(d => ({ ...d, value: 0 }));

  const displayInventoryData = useMemo(() => {
    return data.filter(d => d.day > 0).map(d => ({
      ...d,
      inventory: showResults ? d.inventory : null,
      predictedXGBoost: showResults ? d.predictedXGBoost : null
    }));
  }, [data, showResults]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-50 dark:bg-obsidian text-slate-900 dark:text-slate-200 font-sans overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-80 glass-panel border-b lg:border-b-0 lg:border-r border-glass-border/50 flex flex-col p-4 md:p-6 z-[100] relative shrink-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-electric-indigo/5 to-transparent pointer-events-none" />
        
        <TransitionLink 
          href="/dashboard" 
          className="hidden lg:flex items-center gap-2 text-sm text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors mb-8 w-fit"
          loaderText="RETURNING TO DASHBOARD..."
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </TransitionLink>

        <div className="flex items-center justify-between gap-3 mb-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.5)]">
              <Sparkles className="w-5 h-5 text-pure-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI Analytics</h1>
              <p className="text-xs text-neon-teal font-mono uppercase tracking-widest">Forecast Module</p>
            </div>
          </div>
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 lg:overflow-y-auto overflow-x-hidden pr-2 space-y-8 relative scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent pb-10 lg:pb-0">
          {}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Calendar className="w-4 h-4 text-cyber-purple" />
              Forecast Horizon (Days)
              <TooltipIcon align="center" text="Determines how far into the future the AI predicts. Longer horizons have wider confidence bounds due to increased uncertainty." />
            </label>
            <div className="relative group">
              <input 
                type="range" 
                min="1" 
                max="365" 
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="w-full h-2 bg-slate-300 dark:bg-obsidian-light rounded-lg appearance-none cursor-pointer relative z-10 accent-neon-teal"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>1</span>
              <span className="text-neon-teal font-bold">{horizon} Days</span>
              <span>365</span>
            </div>
          </div>

          {}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <BarChart2 className="w-4 h-4 text-electric-indigo" />
              Aggregation Level
              <TooltipIcon align="center" text="Groups data by day, week, or month. Daily shows micro-trends, while Monthly smooths out noise to reveal macro-trends." />
            </label>
            <CustomSelect
              value={aggregation}
              onChange={setAggregation}
              options={[
                { value: 'Daily', label: 'Daily' },
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' }
              ]}
              icon={<Settings2 className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Marketing Spend Boost
              <TooltipIcon align="center" text="Simulates the impact of an increased marketing budget. The AI calculates historical ROI to project the expected revenue bump." />
            </label>
            <div className="relative group">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={marketingSpend}
                onChange={(e) => setMarketingSpend(Number(e.target.value))}
                className="w-full h-2 bg-slate-300 dark:bg-obsidian-light rounded-lg appearance-none cursor-pointer relative z-10 accent-emerald-400"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>0%</span>
              <span className="text-emerald-400 font-bold">+{marketingSpend}%</span>
              <span>100%</span>
            </div>
          </div>

          {}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Sparkles className="w-4 h-4 text-cyber-purple" />
              Holiday Season Effect
              <TooltipIcon align="center" text="Simulates massive external events like Black Friday. Injects a seasonal spike into the AI prediction to help plan inventory." />
            </label>
            <div className="relative group">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={holidayBoost}
                onChange={(e) => setHolidayBoost(Number(e.target.value))}
                className="w-full h-2 bg-slate-300 dark:bg-obsidian-light rounded-lg appearance-none cursor-pointer relative z-10 accent-cyber-purple"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>0%</span>
              <span className="text-cyber-purple font-bold">+{holidayBoost}%</span>
              <span>100%</span>
            </div>
          </div>

          {}
          <button
            onClick={handleRunForecast}
            disabled={isForecasting}
            className="w-full relative group overflow-hidden rounded-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-ai opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="relative px-6 py-4 flex items-center justify-center gap-2 text-pure-white font-semibold">
              {isForecasting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
              {isForecasting ? 'Analyzing Data...' : 'Run Claude Forecast'}
            </div>
          </button>
        </div>
      </motion.aside>

      {}
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-10 relative overflow-x-hidden lg:overflow-y-auto min-w-0 pb-20 lg:pb-10">
        <TransitionLink 
          href="/dashboard" 
          className="lg:hidden flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 w-fit"
          loaderText="RETURNING TO DASHBOARD..."
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </TransitionLink>
        {}
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] md:w-[50vw] max-w-[800px] aspect-square rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.1)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[20%] w-[80vw] md:w-[50vw] max-w-[800px] aspect-square rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,transparent_60%)] pointer-events-none" />

        <header className="mb-6 md:mb-8 relative z-[999] flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex justify-between items-start w-full xl:w-auto gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Sales Projection</h2>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">Interactive forecast modeling based on historical trends.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 w-full xl:w-auto">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            {}
            <div className="flex items-center gap-3 bg-pure-white/50 dark:bg-obsidian-light/30 border border-glass-border/50 rounded-xl p-1.5">
               <div className="flex items-center gap-2 px-3 border-r border-glass-border/50">
                 <Globe className="w-4 h-4 text-cyber-purple" />
                 <span className="text-xs font-medium text-slate-300 hidden sm:inline">External Data</span>
               </div>
               <div className="flex items-center gap-2 pr-1.5">
                 <CompactSwitch 
                   checked={useWeather} 
                   onChange={setUseWeather} 
                   label="Weather" 
                   icon={CloudRain}
                   colorClass="text-cyber-purple"
                   tooltip="Feeds 14-day weather forecasts into the model. Useful for retail and seasonal goods."
                 />
                 <CompactSwitch 
                   checked={useMacro} 
                   onChange={setUseMacro} 
                   label="Macro" 
                   icon={TrendingUp}
                   colorClass="text-emerald-400"
                   tooltip="Includes inflation rates and consumer confidence indexes for long-term trend adjustments."
                 />
               </div>
            </div>

            {}
            <div className="flex items-center gap-3 bg-pure-white/50 dark:bg-obsidian-light/30 border border-glass-border/50 rounded-xl p-1.5">
               <div className="flex items-center gap-2 px-3 border-r border-glass-border/50">
                 <AlertTriangle className="w-4 h-4 text-amber-400" />
                 <span className="text-xs font-medium text-slate-300 hidden sm:inline">Overrides</span>
               </div>
               <div className="flex items-center gap-2 pr-1.5">
                 <CompactSwitch 
                   checked={ignoreAnomaly} 
                   onChange={setIgnoreAnomaly} 
                   label="Ignore Viral Spike" 
                   icon={AlertTriangle}
                   colorClass="text-amber-400"
                   tooltip="A massive sales spike occurred 14 days ago. Toggle ON to smooth this out and prevent the AI from over-forecasting."
                 />
               </div>
            </div>
          </div>
        </header>

        {}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full h-[350px] md:h-[400px] lg:h-[500px] glass-panel-glow rounded-2xl p-4 md:p-6 mb-8 z-10 relative flex-shrink-0"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-glass-border)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                minTickGap={30}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip 
                content={({ active, payload, label }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-pure-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md z-[100]">
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 font-medium">{label}</p>
                        {payload.map((entry: any, index: number) => (
                          <div key={`item-${index}`} className="flex items-center gap-2 mb-1.5 last:mb-0">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-600 dark:text-slate-300 text-sm">{entry.name}:</span>
                            <span className="text-slate-900 dark:text-white text-sm font-semibold ml-auto pl-4">
                              ${(entry.value / 1000).toFixed(1)}k
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {}
              {showResults && (
                <Area 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="none" 
                  fill="var(--color-electric-indigo)" 
                  fillOpacity={0.15} 
                />
              )}

              {}
              <Line 
                type="monotone" 
                dataKey="historical" 
                stroke="var(--color-neon-teal)" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: 'var(--color-neon-teal)', strokeWidth: 0, className: "animate-pulse" }}
                name="Historical"
              />
              
              {}
              {showResults && (
                <Line 
                  type="monotone" 
                  dataKey="predictedHoltWinters" 
                  stroke="var(--color-electric-indigo)" 
                  strokeWidth={3} 
                  strokeDasharray="8 8"
                  dot={false}
                  activeDot={{ r: 6, fill: 'var(--color-electric-indigo)', strokeWidth: 0 }}
                  name="Holt-Winters (Classical)"
                />
              )}

              {}
              {showResults && (
                <Line 
                  type="monotone" 
                  dataKey="predictedXGBoost" 
                  stroke="var(--color-cyber-purple)" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: 'var(--color-cyber-purple)', strokeWidth: 0 }}
                  name="XGBoost (AI)"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 z-10 relative mb-6">
          {}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-6 flex flex-col"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-electric-indigo" />
                XGBoost Feature Importance
                <TooltipIcon align="left" text="Shows which factors are driving the AI's prediction. Notice how Marketing and Holiday effects increase as you adjust the sliders." />
              </h3>
            </div>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayFeatureData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-glass-border)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--theme-glass-border)' }}
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-pure-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg backdrop-blur-md z-[100]">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
                              <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">{payload[0].payload.name}:</span>
                              <span className="text-slate-900 dark:text-white text-sm font-bold ml-auto pl-2">
                                {Math.round(payload[0].value)}% Impact
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {displayFeatureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--color-electric-indigo)' : index === 1 ? 'var(--color-cyber-purple)' : 'var(--color-neon-teal)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-6 flex flex-col"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-neon-teal" />
                Projected Inventory vs Demand
                <TooltipIcon align="left" text="Simulates how the forecasted demand will deplete current inventory levels. Spikes in the area chart represent simulated restocks." />
              </h3>
            </div>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayInventoryData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-glass-border)" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} dx={10} />
                  <Tooltip 
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-pure-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xl backdrop-blur-md z-[100]">
                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-3 font-medium uppercase tracking-wider">{label}</p>
                            {payload.map((entry: any, index: number) => (
                              <div key={`item-${index}`} className="flex flex-col mb-2 last:mb-0">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                  <span className="text-slate-600 dark:text-slate-300 text-sm hidden sm:inline">{entry.name}</span>
                                  <span className="text-slate-600 dark:text-slate-300 text-sm sm:hidden hover:text-red-500">{entry.name.replace('Forecasted Demand', 'Demand').replace('Inventory Level', 'Inventory')}</span>
                                </div>
                                <span className="text-slate-900 dark:text-white font-semibold text-base sm:text-lg ml-0 sm:ml-4">
                                  {(entry.value / 1000).toFixed(1)}k units
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area yAxisId="left" type="stepAfter" dataKey="inventory" name="Inventory Level" fill="rgba(45, 212, 191, 0.2)" stroke="var(--color-neon-teal)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="predictedXGBoost" name="Forecasted Demand" stroke="var(--color-cyber-purple)" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {}
        {showResults && (
          <motion.div 
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="glass-panel rounded-2xl p-6 lg:p-8 z-10 relative overflow-hidden border-cyber-purple/30 shadow-[0_0_40px_rgba(168,85,247,0.1)]"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-ai" />
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center border border-cyber-purple/50">
                  <Sparkles className="w-4 h-4 text-cyber-purple" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Claude Forecast Analysis</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 md:gap-3 md:ml-auto">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs md:text-sm font-medium">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                  Trend: Upward
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-electric-indigo/10 border border-electric-indigo/20 text-electric-indigo text-xs md:text-sm font-medium">
                  <ShieldCheck className="w-3 h-3 md:w-4 md:h-4" />
                  Confidence: High (89%)
                </div>
              </div>
            </div>

            <div className="bg-pure-white/50 dark:bg-obsidian-light/50 rounded-xl p-5 border border-glass-border/50">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[15px]">
                <strong className="text-slate-900 dark:text-white font-semibold">Model Comparison:</strong> The XGBoost model (AI) predicts a significantly higher trajectory than the classical Holt-Winters model, largely due to its ability to capture non-linear relationships like the <span className="text-emerald-500 dark:text-emerald-400 font-medium">+{marketingSpend}% Marketing Spend</span> and the <span className="text-cyber-purple font-medium">+{holidayBoost}% Holiday Boost</span>.
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
