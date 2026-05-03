'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { InputField } from './InputField';
import { FullScreenLoader } from './FullScreenLoader';

export function LoginForm({ onForgotPassword }: { onForgotPassword?: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    router.push('/dashboard');
  };

  return (
    <div className="relative">
      <FullScreenLoader isLoading={isLoading} text="AUTHENTICATING..." />
      <form className="space-y-6" onSubmit={handleSubmit}>
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

        <InputField
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={<Lock className="h-5 w-5 text-slate-500 group-focus-within:text-neon-teal transition-colors" />}
          disabled={isLoading}
          rightLabel={
            <button 
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-medium text-neon-teal hover:text-neon-teal/80 transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          }
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-pure-white bg-gradient-ai hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyber-purple focus:ring-offset-obsidian transition-all duration-300 mt-8 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? 'Processing...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
