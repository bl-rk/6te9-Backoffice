
import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({
        id: '1',
        email: email || 'admin@6te9.com',
        name: 'Administrator',
        role: 'ADMIN'
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">6TE9</h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Control & Command</p>
        </div>

        <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-2xl shadow-zinc-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">System Sign-in</h2>
            <p className="text-sm text-zinc-400 mt-1">Authorized personnel only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-1 focus:ring-black transition-all"
                  placeholder="admin@6te9.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-1 focus:ring-black transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm tracking-wide uppercase shadow-lg shadow-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Enter System'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <span>Security Level 4</span>
            <button className="hover:text-black">Reset Key</button>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-zinc-400 font-medium">
          © 2025 6TE9 INTERNAL SYSTEMS. UNAUTHORIZED ACCESS IS LOGGED.
        </p>
      </div>
    </div>
  );
};

export default Auth;
