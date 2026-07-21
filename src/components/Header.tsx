import { LogOut, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

export default function Header({ currentUser, onLogout }: HeaderProps) {
  return (
    <header className="border-b border-zinc-100 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-900 flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full"></div>
            </div>
            <div>
              <span className="font-sans text-base font-bold tracking-tighter text-zinc-900 block leading-none">
                LUMINA
              </span>
              <span className="font-sans text-[9px] text-zinc-400 block tracking-widest uppercase font-semibold mt-1">
                Security Sandbox
              </span>
            </div>
          </div>

          {/* Session Status Bar */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
              >
                {/* User Status Badge */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-zinc-900">{currentUser.name}</span>
                  <span className="text-[10px] font-mono text-zinc-400 font-medium">{currentUser.email}</span>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm font-medium">
                  <span className="text-xs tracking-tighter font-semibold">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Secure Badge */}
                <div className="hidden md:flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 text-[11px] font-semibold text-zinc-700 border border-zinc-200">
                  <CheckCircle2 className="h-3 w-3 text-zinc-900" />
                  <span>Session Active</span>
                </div>

                <button
                  onClick={onLogout}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  id="logout-btn"
                >
                  <LogOut className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-zinc-100/80 px-3 py-1 text-[11px] font-bold text-zinc-600 border border-zinc-200/50 uppercase tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-400"></div>
                  <span>Gateway Sealed</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

