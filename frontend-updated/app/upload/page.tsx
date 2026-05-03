'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TransitionLink } from '@/components/TransitionLink';
import { 
  UploadCloud, FileSpreadsheet, CheckCircle2, ArrowRight, 
  LayoutDashboard, LineChart as LineChartIcon, Settings, Menu, ChevronLeft, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavItem } from '@/components/NavItem';
import { ThemeToggle } from '@/components/ThemeToggle';

const processingSteps = [
  "Validating file structure...",
  "Parsing dates and cleaning missing values...",
  "Aggregating time-series data...",
  "Building LLM context..."
];

export default function UploadPage() {
  const [isDesktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'processing') {
      const totalDuration = 4800; 
      const stepDuration = totalDuration / processingSteps.length;
      
      
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setStatus('success');
        }
      }, 50);

      
      const textInterval = setInterval(() => {
        setStepIndex((prev) => {
          if (prev < processingSteps.length - 1) return prev + 1;
          return prev;
        });
      }, stepDuration);

      return () => {
        clearInterval(progressInterval);
        clearInterval(textInterval);
      };
    }
  }, [status]);

  const handleFileAction = useCallback(() => {
    if (status === 'idle') {
      setStatus('processing');
      setStepIndex(0);
      setProgress(0);
    }
  }, [status]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileAction();
  }, [handleFileAction]);

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
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
          <TransitionLink href="/analytics" className="block" loaderText="LOADING ANALYTICS...">
            <NavItem icon={<BarChart2 size={20} />} label="Analytics" isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
          <TransitionLink href="/upload" className="block" loaderText="LOADING DATA UPLOAD...">
            <NavItem icon={<UploadCloud size={20} />} label="Data Upload" active isDesktopOpen={isDesktopSidebarOpen} />
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
            <h1 className="text-xl font-semibold text-white">Data Upload & Preprocessing</h1>
          </div>
          <ThemeToggle />
        </header>

        {}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 z-10 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <AnimatePresence mode="wait">
              
              {}
              {status === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`relative group rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out p-12 md:p-20 text-center flex flex-col items-center justify-center glass-panel ${
                    isDragging 
                      ? 'border-neon-teal bg-neon-teal/5 shadow-[0_0_30px_rgba(45,212,191,0.2)]' 
                      : 'border-glass-border hover:border-cyber-purple/50 hover:bg-white/[0.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]'
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-obsidian-light/50 rounded-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 mb-8 rounded-2xl bg-white dark:bg-obsidian border border-glass-border flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-ai opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      <UploadCloud className="w-10 h-10 text-electric-indigo relative z-10" />
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                      Drag & drop your sales data here
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                      Supports CSV and Excel (Max 50MB). Our AI engine will automatically parse, clean, and structure your data.
                    </p>
                    
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileAction}
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-3 rounded-xl font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-obsidian-light border border-glass-border hover:border-black/10 dark:hover:border-neon-teal/50 hover:bg-slate-200 dark:hover:bg-obsidian-light transition-all duration-300 shadow-lg"
                    >
                      Browse Files
                    </button>
                  </div>
                </motion.div>
              )}

              {}
              {status === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel-glow rounded-3xl p-12 md:p-20 text-center flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-glass-border overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-ai"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>

                  <div className="relative w-32 h-32 mb-10">
                    <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--color-electric-indigo)" />
                          <stop offset="50%" stopColor="var(--color-cyber-purple)" />
                          <stop offset="100%" stopColor="var(--color-neon-teal)" />
                        </linearGradient>
                      </defs>
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="var(--theme-glass-border)" 
                        strokeWidth="2" 
                      />
                      <motion.circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="url(#spinnerGradient)" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset="70"
                        animate={{ strokeDashoffset: [283, 70, 283], rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="origin-center"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileSpreadsheet className="w-8 h-8 text-cyber-purple animate-pulse" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Processing Dataset</h2>
                  
                  <div className="h-8 relative w-full max-w-md overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      <motion.p
                        key={stepIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="text-neon-teal font-medium absolute inset-0 flex items-center justify-center"
                      >
                        {processingSteps[stepIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  
                  <div className="w-full max-w-md mt-8 bg-obsidian rounded-full h-2 overflow-hidden border border-glass-border">
                    <motion.div 
                      className="h-full bg-gradient-ai"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-slate-500 text-sm mt-3 font-mono">{Math.round(progress)}% Complete</p>
                </motion.div>
              )}

              {}
              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="glass-panel rounded-3xl p-12 md:p-20 text-center flex flex-col items-center justify-center relative overflow-hidden border-neon-teal/30 shadow-[0_0_50px_rgba(45,212,191,0.1)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.1)_0%,_transparent_70%)] pointer-events-none" />
                  
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 }}
                    className="w-24 h-24 mb-8 rounded-full bg-neon-teal/20 flex items-center justify-center border border-neon-teal/50 shadow-[0_10px_30px_rgba(45,212,191,0.15)] dark:shadow-[0_0_30px_rgba(45,212,191,0.3)] relative z-10"
                  >
                    <CheckCircle2 className="w-12 h-12 text-neon-teal" />
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight relative z-10"
                  >
                    Dataset Processed Successfully
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-300 mb-10 max-w-md mx-auto relative z-10"
                  >
                    <span className="text-neon-teal font-bold">14,203 rows</span> cleaned, structured, and ready for AI analysis.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10"
                  >
                    <TransitionLink 
                      href="/dashboard"
                      loaderText="GENERATING FORECAST..."
                      className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-pure-white transition-all duration-300 ease-in-out rounded-xl bg-gradient-ai hover:opacity-90 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] overflow-hidden"
                    >
                      <span className="relative flex items-center gap-2">
                        Generate AI Forecast & Dashboard
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </TransitionLink>
                  </motion.div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
