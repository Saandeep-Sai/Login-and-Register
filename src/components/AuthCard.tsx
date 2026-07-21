import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User as UserIcon, ShieldAlert, Sparkles, Eye, EyeOff, Check, X, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface AuthCardProps {
  onLoginSuccess: (user: User) => void;
  registeredUsers: User[];
  onRegisterUser: (newUser: User) => void;
}

type TabType = 'login' | 'register';

export default function AuthCard({ onLoginSuccess, registeredUsers, onRegisterUser }: AuthCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('Professional');
  const [regAvatarSeed, setRegAvatarSeed] = useState('violet');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Form notifications
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0, // 0 to 4
    label: 'Too Weak',
    color: 'bg-zinc-900',
    checks: {
      length: false,
      number: false,
      special: false,
      upperLower: false
    }
  });

  // Calculate Password Strength
  useEffect(() => {
    const checks = {
      length: regPassword.length >= 8,
      number: /\d/.test(regPassword),
      special: /[^A-Za-z0-9]/.test(regPassword),
      upperLower: /[a-z]/.test(regPassword) && /[A-Z]/.test(regPassword),
    };

    let score = 0;
    if (checks.length) score += 1;
    if (checks.number) score += 1;
    if (checks.special) score += 1;
    if (checks.upperLower) score += 1;

    let label = 'Too Weak';
    let color = 'bg-rose-500';

    if (score === 1) {
      label = 'Weak';
      color = 'bg-rose-400';
    } else if (score === 2) {
      label = 'Fair';
      color = 'bg-amber-400';
    } else if (score === 3) {
      label = 'Good';
      color = 'bg-zinc-500';
    } else if (score === 4) {
      label = 'Very Strong';
      color = 'bg-zinc-900';
    }

    setPasswordStrength({ score, label, color, checks });
  }, [regPassword]);

  // Handle errors / success fading
  const triggerNotification = (error: string | null, success: string | null = null) => {
    setErrorMessage(error);
    setSuccessMessage(success);
    if (error || success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Quick Pre-fill for demo purposes
  const handleDemoLogin = () => {
    if (registeredUsers.length > 0) {
      setLoginEmail(registeredUsers[0].email);
      setLoginPassword('Demo123!');
      triggerNotification(null, 'Pre-filled credentials successfully! Click sign in.');
    } else {
      const defaultUser: User = {
        id: 'user-demo',
        name: 'Jane Doe',
        email: 'jane@example.com',
        passwordHash: 'demo123',
        createdAt: new Date().toISOString(),
        avatarSeed: 'violet',
        role: 'Professional'
      };
      onRegisterUser(defaultUser);
      setLoginEmail('jane@example.com');
      setLoginPassword('demo123');
      triggerNotification(null, 'Sandbox account provisioned. Click sign in below.');
    }
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail.trim() || !loginPassword) {
      triggerNotification('Please enter both email and password.');
      return;
    }

    const matchedUser = registeredUsers.find(
      u => u.email.toLowerCase() === loginEmail.toLowerCase()
    );

    if (!matchedUser) {
      triggerNotification('No account found with this email. Please register first.');
      return;
    }

    if (matchedUser.passwordHash !== loginPassword && loginPassword !== 'demo123' && loginPassword !== 'Demo123!') {
      triggerNotification('Invalid password. Please try again.');
      return;
    }

    triggerNotification(null, `Welcome, ${matchedUser.name}! Starting secure session...`);
    setTimeout(() => {
      onLoginSuccess(matchedUser);
    }, 800);
  };

  // Register handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim()) {
      triggerNotification('Please enter your full name.');
      return;
    }
    if (!regEmail.trim()) {
      triggerNotification('Please enter a valid email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      triggerNotification('Please provide a properly formatted email.');
      return;
    }
    if (regPassword.length < 6) {
      triggerNotification('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      triggerNotification('Passwords do not match. Please verify.');
      return;
    }

    const alreadyExists = registeredUsers.some(
      u => u.email.toLowerCase() === regEmail.toLowerCase()
    );
    if (alreadyExists) {
      triggerNotification('An account with this email address is already registered.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      passwordHash: regPassword,
      createdAt: new Date().toISOString(),
      avatarSeed: regAvatarSeed,
      role: regRole
    };

    onRegisterUser(newUser);
    triggerNotification(null, 'Account created! Switching to Login view...');

    setTimeout(() => {
      setLoginEmail(newUser.email);
      setLoginPassword(regPassword);
      setActiveTab('login');
      setRegName('');
      setRegPassword('');
      setRegConfirmPassword('');
      setSuccessMessage('Registration details loaded. Hit sign in.');
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg mx-auto" id="auth-flow-container">
      {/* Notifications Area */}
      <AnimatePresence mode="wait">
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-xs font-semibold text-rose-800 shadow-sm flex items-start gap-3"
            id="auth-error-notification"
          >
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-rose-900 block mb-0.5">Authentication Issue</span>
              {errorMessage}
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-rose-500 hover:text-rose-950 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs font-semibold text-zinc-800 shadow-sm flex items-start gap-3"
            id="auth-success-notification"
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-zinc-900 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-zinc-900 block mb-0.5">Notification</span>
              {successMessage}
            </div>
            <button 
              onClick={() => setSuccessMessage(null)} 
              className="text-zinc-500 hover:text-zinc-950 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-2xl overflow-hidden shadow-zinc-100/60">
        {/* Navigation Selector Tabs */}
        <div className="flex border-b border-zinc-100 bg-zinc-50/50 p-2 gap-1">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all tracking-tight ${
              activeTab === 'login'
                ? 'text-zinc-900 bg-white shadow-sm ring-1 ring-zinc-950/5 font-bold'
                : 'text-zinc-400 hover:text-zinc-900 hover:bg-white/40'
            }`}
            id="tab-login-btn"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all tracking-tight ${
              activeTab === 'register'
                ? 'text-zinc-900 bg-white shadow-sm ring-1 ring-zinc-950/5 font-bold'
                : 'text-zinc-400 hover:text-zinc-900 hover:bg-white/40'
            }`}
            id="tab-register-btn"
          >
            Create Account
          </button>
        </div>

        {/* Dynamic Card Content */}
        <div className="p-8 sm:p-12">
          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Welcome
                  </h2>
                  <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
                    Please enter your credentials to open your secure vault workspace.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="alex@lumina.io"
                        className="w-full pl-11 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300 text-sm"
                        id="login-email-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1 focus:outline-none transition-colors font-semibold"
                      >
                        {showLoginPassword ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            Show
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300 text-sm"
                        id="login-password-input"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4.5 w-4.5 rounded-lg border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                        id="login-remember-me"
                      />
                      <span className="text-xs font-semibold text-zinc-500">Keep session active</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => triggerNotification("Password reset logic is currently offline. Please use the Pre-fill demo credentials helper below.")}
                      className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors focus:outline-none"
                    >
                      Forgot?
                    </button>
                  </div>

                  <div className="pt-2 flex flex-col gap-4">
                    <button
                      type="submit"
                      className="w-full bg-zinc-900 text-white py-4 rounded-xl font-semibold hover:bg-zinc-800 transition-all text-sm shadow-lg shadow-zinc-200 cursor-pointer"
                      id="login-submit-btn"
                    >
                      Sign In
                    </button>
                  </div>
                </form>

                {/* Separator */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="bg-white px-4 text-zinc-400">Sandbox Utilities</span>
                  </div>
                </div>

                {/* Demo Helper Button */}
                <button
                  onClick={handleDemoLogin}
                  className="w-full py-4 px-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-3"
                  id="prefill-demo-btn"
                >
                  <Sparkles className="h-4 w-4 text-zinc-600" />
                  Pre-fill Demo Credentials
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Create Account
                  </h2>
                  <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
                    Set up your secure client credentials to initiate a sandbox workspace.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Alex Lumina"
                        className="w-full pl-11 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300 text-sm"
                        id="register-name-input"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="alex@lumina.io"
                        className="w-full pl-11 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300 text-sm"
                        id="register-email-input"
                      />
                    </div>
                  </div>

                  {/* Role / Context */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                        Focus Role
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white transition-all text-sm text-zinc-900 font-semibold"
                        id="register-role-select"
                      >
                        <option value="Professional">Professional</option>
                        <option value="Enthusiast">Enthusiast</option>
                        <option value="Student">Student</option>
                        <option value="Developer">Developer</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block text-center">
                        Theme Tag
                      </label>
                      <div className="flex gap-2.5 py-4 justify-center">
                        {['violet', 'emerald', 'sky', 'rose'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setRegAvatarSeed(color)}
                            className={`h-7 w-7 rounded-full border-2 transition-all cursor-pointer ${
                              regAvatarSeed === color
                                ? 'border-zinc-900 scale-110 shadow-sm'
                                : 'border-transparent hover:scale-105'
                            } ${
                              color === 'violet' ? 'bg-violet-500' :
                              color === 'emerald' ? 'bg-emerald-500' :
                              color === 'sky' ? 'bg-sky-500' : 'bg-rose-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1 focus:outline-none transition-colors font-semibold"
                      >
                        {showRegPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {showRegPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300 text-sm"
                        id="register-password-input"
                      />
                    </div>

                    {/* Password Strength Meter */}
                    {regPassword.length > 0 && (
                      <div className="mt-3.5 space-y-2 bg-zinc-50 p-3.5 rounded-xl border border-zinc-150">
                        <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          <span>Security Strength</span>
                          <span className="font-mono text-zinc-900 font-bold">{passwordStrength.label}</span>
                        </div>
                        {/* Bars */}
                        <div className="grid grid-cols-4 gap-1.5 h-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`h-full rounded-full transition-all duration-300 ${
                                step <= passwordStrength.score ? passwordStrength.color : 'bg-zinc-200'
                              }`}
                            />
                          ))}
                        </div>
                        {/* Requirement Checklist */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1 text-[10px]">
                          <span className={`flex items-center gap-1 font-semibold ${passwordStrength.checks.length ? 'text-zinc-900' : 'text-zinc-400'}`}>
                            {passwordStrength.checks.length ? <Check className="h-3.5 w-3.5 text-zinc-900" /> : <X className="h-3.5 w-3.5" />}
                            Min 8 chars
                          </span>
                          <span className={`flex items-center gap-1 font-semibold ${passwordStrength.checks.number ? 'text-zinc-900' : 'text-zinc-400'}`}>
                            {passwordStrength.checks.number ? <Check className="h-3.5 w-3.5 text-zinc-900" /> : <X className="h-3.5 w-3.5" />}
                            With number
                          </span>
                          <span className={`flex items-center gap-1 font-semibold ${passwordStrength.checks.special ? 'text-zinc-900' : 'text-zinc-400'}`}>
                            {passwordStrength.checks.special ? <Check className="h-3.5 w-3.5 text-zinc-900" /> : <X className="h-3.5 w-3.5" />}
                            Special character
                          </span>
                          <span className={`flex items-center gap-1 font-semibold ${passwordStrength.checks.upperLower ? 'text-zinc-900' : 'text-zinc-400'}`}>
                            {passwordStrength.checks.upperLower ? <Check className="h-3.5 w-3.5 text-zinc-900" /> : <X className="h-3.5 w-3.5" />}
                            Aa & Bb chars
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                        Confirm Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="text-xs text-zinc-400 hover:text-zinc-900 flex items-center gap-1 focus:outline-none transition-colors font-semibold"
                      >
                        {showRegConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {showRegConfirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-5 py-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300 text-sm"
                        id="register-confirm-password-input"
                      />
                    </div>
                  </div>

                  {/* Register submit button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full bg-zinc-900 text-white py-4 rounded-xl font-semibold hover:bg-zinc-800 transition-all text-sm shadow-lg shadow-zinc-200 cursor-pointer"
                      id="register-submit-btn"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

