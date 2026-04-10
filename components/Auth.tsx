import React, { useState } from 'react';
import { Lock, Mail, ChevronRight, Info, Terminal } from 'lucide-react';
import { User, UserStatus } from '../types';
import { authService } from '../services/authService';
import GenericModal from './modals/GenericModal';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = isSuperAdmin
        ? await authService.superAdminLogin(email, pin)
        : await authService.login(email, pin);

      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_role', response.role);

      onLogin({
        id: 'system',
        email: email,
        name: email.split('@')[0].toUpperCase(),
        role: response.role.toUpperCase().replace('_', '_') as any,
        status: UserStatus.ACTIVE,
        dateAdded: new Date().toISOString()
      });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <img src="/logo.svg" alt="6TE9 Logo" className="h-16 mx-auto mb-4 hover:scale-110 transition-transform cursor-pointer" onClick={() => window.location.reload()} />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
            {isSuperAdmin ? 'Command & Control' : 'Corporate Access'}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 p-10 rounded-[2.5rem] shadow-2xl shadow-zinc-100 relative overflow-hidden group">
          {isSuperAdmin && (
            <div className="absolute top-0 left-0 w-full h-1 bg-black animate-in slide-in-from-left duration-500" />
          )}

          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tighter italic uppercase">
              {isSuperAdmin ? 'Command Center' : 'System Sign-in'}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">
              {isSuperAdmin ? 'Terminal Level 4 Access' : 'Authorized Personnel Record'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-in shake duration-500">
                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest leading-relaxed text-center">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Identity Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/input:text-black transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all font-inter text-sm font-bold shadow-sm"
                  placeholder="name@6te9.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">6-Digit Secure PIN</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/input:text-black transition-colors" />
                <input
                  type="password"
                  required
                  maxLength={6}
                  minLength={6}
                  pattern="\d{6}"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-11 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all font-mono tracking-[1em] text-center text-sm font-bold shadow-sm"
                  placeholder="••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-black text-white rounded-[1.25rem] font-black text-[10px] tracking-[0.3em] uppercase shadow-xl hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                'Synchronizing...'
              ) : (
                <>
                  {isSuperAdmin ? 'Access Command Center' : 'Access Platform'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-100 flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Info className="w-3 h-3" />
              SL-4 ENCRYPTED
            </span>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="hover:text-black transition-colors border-b-2 border-transparent hover:border-black"
            >
              Reset Key
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsSuperAdmin(!isSuperAdmin)}
            className="group flex items-center gap-2 px-6 py-3 rounded-full hover:bg-zinc-50 transition-all"
          >
            {isSuperAdmin ? (
              <>
                <Mail className="w-3 h-3 text-zinc-400 group-hover:text-black" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">Standard Personnel Portal</span>
              </>
            ) : (
              <>
                <Terminal className="w-3 h-3 text-zinc-400 group-hover:text-black" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">Secure Command Terminal</span>
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-zinc-300 font-black uppercase tracking-[0.2em]">
            © 2026 6TE9 INTERNAL SYSTEMS. UNAUTHORIZED ACCESS IS LOGGED.
          </p>
        </div>
      </div>

      <GenericModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Credential Recovery"
        width="max-w-sm"
      >
        <div className="text-center space-y-6 py-4">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Restricted Action</p>
            <p className="text-sm font-bold leading-relaxed text-zinc-600">
              For security reasons, remote key resets are disabled. Please contact the administrator at:
            </p>
            <p className="text-lg font-black italic tracking-tighter text-black">info@6te9.com</p>
          </div>
          <button
            onClick={() => setIsResetModalOpen(false)}
            className="w-full py-4 bg-zinc-100 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
          >
            Dismiss
          </button>
        </div>
      </GenericModal>
    </div>
  );
};

export default Auth;
