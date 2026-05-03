'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InputField } from './InputField';
import { FullScreenLoader } from './FullScreenLoader';

export function ForgotPasswordForm({ onBackToLogin }: { onBackToLogin: () => void }) {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [isLoading, setIsLoading] = useState(false);
  
  
  const [email, setEmail] = useState('');
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; 

    const newOtp = [...otp];
    
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        
        otpRefs.current[index - 1]?.focus();
      } else {
        
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    const nextIndex = Math.min(pastedData.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setError('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('reset');
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onBackToLogin();
  };

  useEffect(() => {
    if (step === 'otp') {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  return (
    <div className="relative">
      <FullScreenLoader 
        isLoading={isLoading} 
        text={
          step === 'email' ? "SENDING CODE..." : 
          step === 'otp' ? "VERIFYING CODE..." : 
          "RESETTING PASSWORD..."
        } 
      />

      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.form 
            key="email"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6" 
            onSubmit={handleEmailSubmit}
          >
            <InputField
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              icon={<Mail className="h-5 w-5 text-slate-500 group-focus-within:text-electric-indigo transition-colors" />}
              disabled={isLoading}
            />
            <div className="flex flex-col gap-4 mt-8">
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-pure-white bg-gradient-ai hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyber-purple focus:ring-offset-obsidian transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                Send Reset Code
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onBackToLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-glass-border rounded-xl shadow-sm text-sm font-medium text-slate-300 hover:text-white hover:bg-obsidian-light/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Login
              </button>
            </div>
          </motion.form>
        )}

        {step === 'otp' && (
          <motion.form 
            key="otp"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6" 
            onSubmit={handleOtpSubmit}
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-widest ml-1 block">
                Enter 6-digit Code
              </label>
              <div className="flex justify-between gap-2 sm:gap-4" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{1}"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-glass-border/50 rounded-xl bg-obsidian-light/40 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyber-purple/60 focus:border-cyber-purple/60 transition-all duration-300 backdrop-blur-xl shadow-inner disabled:opacity-50"
                    disabled={isLoading}
                  />
                ))}
              </div>
              {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}
              <p className="text-xs text-slate-400 mt-2 ml-1">
                Sent to {email}
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('email')}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center py-3.5 px-4 border border-glass-border rounded-xl shadow-sm text-sm font-medium text-slate-300 hover:text-white hover:bg-obsidian-light/50 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="flex-[2] flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-ai hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyber-purple focus:ring-offset-obsidian transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                Verify Code
              </button>
            </div>
          </motion.form>
        )}

        {step === 'reset' && (
          <motion.form 
            key="reset"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6" 
            onSubmit={handleResetSubmit}
          >
            <InputField
              label="New Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5 text-slate-500 group-focus-within:text-neon-teal transition-colors" />}
              disabled={isLoading}
            />
            <InputField
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5 text-slate-500 group-focus-within:text-neon-teal transition-colors" />}
              disabled={isLoading}
              error={error}
            />
            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-ai hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyber-purple focus:ring-offset-obsidian transition-all duration-300 mt-8 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              Reset Password
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
