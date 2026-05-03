'use client';

import { useState, memo } from 'react';
import { TransitionLink } from '@/components/TransitionLink';
import { NavItem } from '@/components/NavItem';
import { CustomSelect } from '@/components/CustomSelect';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  LayoutDashboard, UploadCloud, LineChart as LineChartIcon, Settings,
  Menu, ChevronLeft, BarChart2, User, Key, Sliders, Database,
  Eye, EyeOff, CheckCircle2, Loader2, AlertTriangle, Trash2, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InputField } from '@/app/auth/components/InputField';

const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean, onChange: (checked: boolean) => void, label: string }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-sm font-medium text-slate-300 whitespace-nowrap">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-neon-teal focus:ring-offset-2 focus:ring-offset-obsidian cursor-pointer ${
        checked ? 'bg-neon-teal' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-pure-white transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default function SettingsPage() {
  const [isDesktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'preferences' | 'data'>('profile');

  
  const [fullName, setFullName] = useState('Admin Developer');
  const [email, setEmail] = useState('admin@sales-ai.com');
  const [location, setLocation] = useState('Bangalore, India');

  
  const [apiKey, setApiKey] = useState('sk-ant-api03-xxxxxxxxxxxxxxxxxxxx');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [connectDb, setConnectDb] = useState(false);

  
  const [currency, setCurrency] = useState('usd');
  const [dateFormat, setDateFormat] = useState('mm-dd-yyyy');

  const handleVerifyKey = async () => {
    setIsVerifying(true);
    setIsVerified(false);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerifying(false);
    setIsVerified(true);
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Account', icon: <User size={18} /> },
    { id: 'api', label: 'API & Integrations', icon: <Key size={18} /> },
    { id: 'preferences', label: 'Application Preferences', icon: <Sliders size={18} /> },
    { id: 'data', label: 'Data Management', icon: <Database size={18} /> },
  ] as const;

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
            <NavItem icon={<BarChart2 size={20} />} label="Analytics" isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
          <TransitionLink href="/upload" className="block" loaderText="LOADING DATA UPLOAD...">
            <NavItem icon={<UploadCloud size={20} />} label="Data Upload" isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
          <TransitionLink href="/forecasts" className="block" loaderText="LOADING FORECASTS...">
            <NavItem icon={<LineChartIcon size={20} />} label="Forecasts" isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
          <TransitionLink href="/settings" className="block" loaderText="LOADING SETTINGS...">
            <NavItem icon={<Settings size={20} />} label="Settings" active isDesktopOpen={isDesktopSidebarOpen} />
          </TransitionLink>
        </nav>

        <div className="p-4 border-t border-glass-border">
          <div className={`flex items-center gap-3 ${isDesktopSidebarOpen ? 'md:gap-3' : 'md:justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-ai p-[2px] shrink-0">
              <div className="w-full h-full rounded-full bg-obsidian flex items-center justify-center text-sm font-bold">AD</div>
            </div>
            <div className={`flex flex-col overflow-hidden transition-all duration-300 whitespace-nowrap ${!isDesktopSidebarOpen ? 'md:max-w-0 md:opacity-0' : 'md:max-w-[150px] md:opacity-100'}`}>
              <span className="text-sm font-medium text-white truncate">Admin Developer</span>
              <span className="text-xs text-slate-400 truncate">Super Admin</span>
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
            <h1 className="text-xl font-semibold text-white">Settings & Preferences</h1>
          </div>
          <ThemeToggle />
        </header>

        {}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            
            {}
            <div className="w-full lg:w-64 shrink-0 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-electric-indigo/20 to-transparent text-white border-l-2 border-electric-indigo shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-l-2 border-transparent'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-electric-indigo' : 'text-slate-500'}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {}
                  {activeTab === 'profile' && (
                    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-8 border border-glass-border/50 relative">
                      <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-neon-teal to-electric-indigo" />
                      
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Profile & Account</h2>
                        <p className="text-sm text-slate-400">Manage your personal information and account security.</p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-full bg-obsidian border-2 border-neon-teal shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                            AD
                          </div>
                          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                            <span className="text-xs font-medium text-white">Change</span>
                          </div>
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple text-xs font-bold uppercase tracking-widest mb-2">
                            Role: Super Admin
                          </div>
                          <p className="text-sm text-slate-400">Update your photo and personal details.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="Full Name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          icon={<User className="h-5 w-5 text-slate-500 group-focus-within:text-neon-teal transition-colors" />}
                        />
                        <InputField
                          label="Email Address"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          icon={<User className="h-5 w-5 text-slate-500 group-focus-within:text-neon-teal transition-colors" />}
                        />
                        <div className="md:col-span-2">
                          <InputField
                            label="Location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            icon={<User className="h-5 w-5 text-slate-500 group-focus-within:text-neon-teal transition-colors" />}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-glass-border/50">
                        <button className="px-6 py-2.5 rounded-xl bg-gradient-ai text-pure-white font-medium text-sm hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(99,102,241,0.3)] cursor-pointer">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {}
                  {activeTab === 'api' && (
                    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-8 border border-glass-border/50 relative">
                      <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-electric-indigo to-cyber-purple" />
                      
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">API & Integrations</h2>
                        <p className="text-sm text-slate-400">Manage external connections crucial for the AI Engine.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Anthropic API Key</h3>
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                            <div className="flex-1 w-full">
                              <InputField
                                label="Secret Key"
                                type={showApiKey ? "text" : "password"}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                icon={<Key className="h-5 w-5 text-slate-500 group-focus-within:text-electric-indigo transition-colors" />}
                                rightIcon={
                                  <button 
                                    type="button" 
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                                  >
                                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                  </button>
                                }
                              />
                            </div>
                            <button 
                              onClick={handleVerifyKey}
                              disabled={isVerifying || !apiKey}
                              className="w-full sm:w-auto px-6 py-3.5 mb-4 rounded-xl bg-obsidian-light border border-glass-border text-slate-800 dark:text-white font-medium text-sm hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {isVerifying ? (
                                <Loader2 className="w-4 h-4 animate-spin text-electric-indigo" />
                              ) : isVerified ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <RefreshCw className="w-4 h-4 text-slate-400" />
                              )}
                              {isVerifying ? 'Verifying...' : isVerified ? 'Verified' : 'Verify Key'}
                            </button>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-glass-border/50 space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">Database Connection</h3>
                              <p className="text-xs text-slate-400">Phase 3 Preview: Connect directly to your PostgreSQL instance.</p>
                            </div>
                            <ToggleSwitch 
                              checked={connectDb} 
                              onChange={setConnectDb} 
                              label={connectDb ? "Enabled" : "Disabled"} 
                            />
                          </div>

                          <AnimatePresence>
                            {connectDb && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
                              >
                                <InputField
                                  label="Host"
                                  type="text"
                                  placeholder="db.example.com"
                                  disabled
                                  icon={<Database className="h-5 w-5 text-slate-600" />}
                                  className="opacity-50 cursor-not-allowed"
                                />
                                <InputField
                                  label="Port"
                                  type="text"
                                  placeholder="5432"
                                  disabled
                                  icon={<Database className="h-5 w-5 text-slate-600" />}
                                  className="opacity-50 cursor-not-allowed"
                                />
                                <InputField
                                  label="User"
                                  type="text"
                                  placeholder="postgres_user"
                                  disabled
                                  icon={<User className="h-5 w-5 text-slate-600" />}
                                  className="opacity-50 cursor-not-allowed"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}

                  {}
                  {activeTab === 'preferences' && (
                    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-8 border border-glass-border/50 relative">
                      <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-cyber-purple to-neon-teal" />
                      
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Application Preferences</h2>
                        <p className="text-sm text-slate-400">Customize your regional and display settings.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest ml-1 block">
                            Default Currency
                          </label>
                          <CustomSelect
                            value={currency}
                            onChange={setCurrency}
                            options={[
                              { value: 'usd', label: 'USD ($)' },
                              { value: 'eur', label: 'EUR (€)' },
                              { value: 'inr', label: 'INR (₹)' },
                              { value: 'gbp', label: 'GBP (£)' }
                            ]}
                            className="w-full"
                            buttonClassName="py-3.5 bg-obsidian-light/40 border-glass-border/50 backdrop-blur-xl shadow-inner"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest ml-1 block">
                            Date Format
                          </label>
                          <CustomSelect
                            value={dateFormat}
                            onChange={setDateFormat}
                            options={[
                              { value: 'mm-dd-yyyy', label: 'MM/DD/YYYY' },
                              { value: 'dd-mm-yyyy', label: 'DD/MM/YYYY' }
                            ]}
                            className="w-full"
                            buttonClassName="py-3.5 bg-obsidian-light/40 border-glass-border/50 backdrop-blur-xl shadow-inner"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {}
                  {activeTab === 'data' && (
                    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-8 border border-rose-500/30 relative bg-rose-500/5">
                      <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-rose-500 to-red-600" />
                      
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                          <AlertTriangle className="text-rose-500" />
                          Danger Zone
                        </h2>
                        <p className="text-sm text-slate-400">Destructive actions that cannot be undone.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-rose-500/20 bg-obsidian/50 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-white">Clear All Cached AI Contexts</h4>
                            <p className="text-xs text-slate-400 mt-1">Removes all temporary data used by the forecasting engine.</p>
                          </div>
                          <button className="px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer">
                            Clear Cache
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-rose-500/20 bg-obsidian/50 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-white">Delete Account</h4>
                            <p className="text-xs text-slate-400 mt-1">Permanently delete your account and all associated data.</p>
                          </div>
                          <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-pure-white text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.3)] cursor-pointer">
                            <Trash2 size={16} />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
