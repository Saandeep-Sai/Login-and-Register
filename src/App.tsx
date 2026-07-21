/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthCard from './components/AuthCard';
import Dashboard from './components/Dashboard';
import { User, UserSession } from './types';
import { ShieldCheck, Fingerprint, RefreshCcw, Key, HelpCircle } from 'lucide-react';

export default function App() {
  // Stored users database (simulated local server DB)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('auth_portal_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Current session tracking
  const [session, setSession] = useState<UserSession>(() => {
    const savedSession = localStorage.getItem('auth_portal_active_session');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        // Fallback default
      }
    }
    return {
      currentUser: null,
      loginTime: null,
      deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device',
    };
  });

  // Persist registered users
  useEffect(() => {
    localStorage.setItem('auth_portal_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Persist active session
  useEffect(() => {
    localStorage.setItem('auth_portal_active_session', JSON.stringify(session));
  }, [session]);

  // Register account handler
  const handleRegisterUser = (newUser: User) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
  };

  // Login session handler
  const handleLoginSuccess = (user: User) => {
    setSession({
      currentUser: user,
      loginTime: new Date().toISOString(),
      deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device',
    });
  };

  // Logout session handler
  const handleLogout = () => {
    setSession({
      currentUser: null,
      loginTime: null,
      deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device',
    });
  };

  // Update live profile handler (saves instantly)
  const handleUpdateUser = (updatedUser: User) => {
    // 1. Update list database
    setRegisteredUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    // 2. Update active session
    setSession((prev) => ({
      ...prev,
      currentUser: updatedUser,
    }));
  };

  // Purge/delete profile handler
  const handleDeleteAccount = () => {
    if (!session.currentUser) return;
    const deletedId = session.currentUser.id;

    // Remove user notes
    localStorage.removeItem(`auth_vault_notes_${deletedId}`);

    // Update database
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== deletedId));

    // Clear session
    handleLogout();
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 selection:bg-zinc-900 selection:text-white" id="main-layout-root">
      {/* Top sticky brand bar */}
      <Header currentUser={session.currentUser} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {!session.currentUser ? (
          // UNAUTHENTICATED GUEST VIEW: Centered Login/Register & Feature Cards
          <div className="space-y-12">
            {/* Header Hero Title */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-100 px-3.5 py-1.5 rounded-full">
                <Fingerprint className="h-3.5 w-3.5 text-zinc-600" />
                Identity Sandbox Gateway
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900">
                Secure Portal Gateway
              </h1>
              <p className="text-sm sm:text-base text-zinc-500 leading-relaxed max-w-xl mx-auto">
                Experience a mock, highly polished user credentials and authentication simulation. Register your credentials to unlock a local secure workspace session.
              </p>
            </div>

            {/* Auth Cards component */}
            <AuthCard
              onLoginSuccess={handleLoginSuccess}
              registeredUsers={registeredUsers}
              onRegisterUser={handleRegisterUser}
            />

            {/* Feature Bento boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6" id="landing-feature-grid">
              {/* Feature 1 */}
              <div className="bg-white border border-zinc-150 rounded-3xl p-6.5 shadow-sm space-y-3.5">
                <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-900 ring-1 ring-zinc-950/5">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 tracking-tight">Isolated Local Vault</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Authentication states are synchronized to your browser's private storage, simulating real database transactions with 0% data risk.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border border-zinc-150 rounded-3xl p-6.5 shadow-sm space-y-3.5">
                <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-900 ring-1 ring-zinc-950/5">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 tracking-tight">Dynamic Entropy Metrics</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Real-time client password analysis checks for character lengths, lowercase, uppercase, and numerical compliance.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white border border-zinc-150 rounded-3xl p-6.5 shadow-sm space-y-3.5">
                <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-900 ring-1 ring-zinc-950/5">
                  <Key className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 tracking-tight">Access Badging System</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Select customizable professional focus levels and visual theme badges that instantly persist upon entering session dashboards.
                </p>
              </div>
            </div>

            {/* Quick Helper Section */}
            <div className="bg-zinc-100/60 rounded-3xl border border-zinc-200/40 p-6 flex flex-col sm:flex-row gap-4.5 items-start max-w-3xl mx-auto">
              <HelpCircle className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Developer Evaluation Guide</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Testing is instant: click the <strong className="text-zinc-800 font-bold">Pre-fill Demo Credentials</strong> button inside the sign-in form to automatically register a mock profile. You can then edit your name, choose color themes, and create private vault notes securely.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // AUTHENTICATED MEMBER VIEW: Dashboard
          <Dashboard
            currentUser={session.currentUser}
            session={session}
            onUpdateUser={handleUpdateUser}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </main>

      {/* Decorative footer */}
      <footer className="border-t border-zinc-100 bg-white/40 py-10 mt-20">
        <div className="mx-auto max-w-7xl px-4 text-center space-y-3">
          <p className="text-xs text-zinc-400 font-mono tracking-wide">
            © {new Date().getFullYear()} AuthPortal Gateway • Secured Local Session Sandbox
          </p>
          <div className="flex justify-center items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
              Build v1.2.0 • SHA-256 Verified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
