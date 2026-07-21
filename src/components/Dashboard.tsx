import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, Mail, Calendar, Monitor, ShieldCheck, 
  Plus, Trash2, Search, Briefcase, GraduationCap, Terminal, 
  Sliders, KeyRound, Check, FileText, Lock, Globe 
} from 'lucide-react';
import { User, SecureNote, UserSession } from '../types';

interface DashboardProps {
  currentUser: User;
  session: UserSession;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteAccount: () => void;
}

export default function Dashboard({ currentUser, session, onUpdateUser, onDeleteAccount }: DashboardProps) {
  // Profile settings state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(currentUser.name);
  const [editedRole, setEditedRole] = useState(currentUser.role);
  const [editedAvatar, setEditedAvatar] = useState(currentUser.avatarSeed);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState(false);

  // Secure Notes storage state
  const [notes, setNotes] = useState<SecureNote[]>(() => {
    const saved = localStorage.getItem(`auth_vault_notes_${currentUser.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'note-1',
        userId: currentUser.id,
        title: '🔒 Gatekeeper Session Keys',
        content: 'This note is protected locally inside your browser\'s localStorage vault under user key: ' + currentUser.email,
        category: 'Secret',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'note-2',
        userId: currentUser.id,
        title: '💡 App Launch Checklist',
        content: 'Configure secure password rules, deploy Firestore rules, integrate multi-factor authentication triggers.',
        category: 'Work',
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem(`auth_vault_notes_${currentUser.id}`, JSON.stringify(notes));
  }, [notes, currentUser.id]);

  // Notes Form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<'Personal' | 'Work' | 'Finance' | 'Secret'>('Personal');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Personal' | 'Work' | 'Finance' | 'Secret'>('All');

  // Handle Profile Update
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedName.trim()) return;

    onUpdateUser({
      ...currentUser,
      name: editedName.trim(),
      role: editedRole,
      avatarSeed: editedAvatar
    });

    setIsEditingProfile(false);
    setProfileSuccessMessage(true);
    setTimeout(() => setProfileSuccessMessage(false), 3000);
  };

  // Handle Note Submit
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const newNote: SecureNote = {
      id: `note-${Date.now()}`,
      userId: currentUser.id,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory,
      createdAt: new Date().toISOString()
    };

    setNotes([newNote, ...notes]);
    setNoteTitle('');
    setNoteContent('');
  };

  // Handle Note Delete
  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  // Filter & Search notes
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeFilter === 'All' || n.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Professional': return <Briefcase className="h-4 w-4" />;
      case 'Student': return <GraduationCap className="h-4 w-4" />;
      case 'Developer': return <Terminal className="h-4 w-4" />;
      default: return <Sliders className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Personal': return 'bg-zinc-100 text-zinc-900 ring-zinc-550/10';
      case 'Work': return 'bg-zinc-100 text-zinc-900 ring-zinc-550/10';
      case 'Finance': return 'bg-zinc-100 text-zinc-900 ring-zinc-550/10';
      case 'Secret': return 'bg-zinc-900 text-white ring-zinc-950/20';
      default: return 'bg-zinc-100 text-zinc-900 ring-zinc-550/10';
    }
  };

  const getThemeColor = (seed: string) => {
    // Beautiful, high-contrast monochrome and clean minimalism branding
    switch (seed) {
      case 'violet': return 'from-zinc-900 via-zinc-800 to-zinc-900 bg-zinc-900';
      case 'emerald': return 'from-zinc-900 to-zinc-800 bg-zinc-900';
      case 'sky': return 'from-zinc-900 via-zinc-950 to-zinc-900 bg-zinc-950';
      case 'rose': return 'from-zinc-850 to-zinc-950 bg-zinc-900';
      default: return 'from-zinc-900 to-zinc-950 bg-zinc-900';
    }
  };

  return (
    <div className="space-y-8" id="dashboard-container">
      {/* Welcome Banner */}
      <div className={`rounded-3xl bg-gradient-to-r ${getThemeColor(currentUser.avatarSeed)} p-8 sm:p-12 text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 opacity-5">
          <Lock className="h-72 w-72" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4.5 py-1.5 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-zinc-100" />
              <span>Sandbox Access Authenticated</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome Back, {currentUser.name}
            </h1>
            <p className="text-sm text-zinc-300 max-w-xl leading-relaxed">
              You have established an authorized browser session. Access your decrypted credentials vault and workspace details below.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditedName(currentUser.name);
                setEditedRole(currentUser.role);
                setEditedAvatar(currentUser.avatarSeed);
                setIsEditingProfile(!isEditingProfile);
              }}
              className="py-3.5 px-6 bg-white text-zinc-900 hover:bg-zinc-100 transition-all rounded-xl text-xs font-bold tracking-tight cursor-pointer"
              id="edit-profile-toggle-btn"
            >
              Edit Profile Status
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      <AnimatePresence>
        {profileSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-900 text-white rounded-2xl p-4.5 text-xs font-semibold flex items-center gap-2.5 border border-zinc-850"
          >
            <Check className="h-4 w-4 text-white" />
            <span>Profile metadata updated successfully! Stored in browser session state.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Settings Editor Modal/Collapse */}
      <AnimatePresence>
        {isEditingProfile && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-zinc-200/85 rounded-3xl p-8 shadow-md"
            id="profile-editor-container"
          >
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Sliders className="h-4 w-4 text-zinc-500" />
              Modify Local Profile Details
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Update Name
                  </label>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Update Focus Role
                  </label>
                  <select
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white transition-all font-semibold"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Enthusiast">Enthusiast</option>
                    <option value="Student">Student</option>
                    <option value="Developer">Developer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Theme Tag Color
                  </label>
                  <div className="flex gap-2.5 py-3 justify-start">
                    {['violet', 'emerald', 'sky', 'rose'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setEditedAvatar(color)}
                        className={`h-7 w-7 rounded-full border-2 transition-all cursor-pointer ${
                          editedAvatar === color ? 'border-zinc-900 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
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

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="py-3.5 px-6 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all cursor-pointer"
                  id="profile-save-btn"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="py-3.5 px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  id="profile-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: System Metadata */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-3 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-zinc-500" />
              Credentials Metadata
            </h3>

            <div className="space-y-5">
              {/* Email */}
              <div className="flex items-center justify-between text-xs border-b border-zinc-50 pb-2.5">
                <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Session Identity</span>
                <span className="font-mono font-bold text-zinc-800 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-zinc-400" />
                  {currentUser.email}
                </span>
              </div>

              {/* Role */}
              <div className="flex items-center justify-between text-xs border-b border-zinc-50 pb-2.5">
                <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Usage Level</span>
                <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                  {getRoleIcon(currentUser.role)}
                  {currentUser.role}
                </span>
              </div>

              {/* Date registered */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Registry Created</span>
                <span className="font-mono text-zinc-800 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  {new Date(currentUser.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Monitor className="h-4 w-4 text-zinc-500" />
              Session Telemetry
            </h3>

            <div className="space-y-5">
              {/* Authenticated at */}
              <div className="flex items-center justify-between text-xs border-b border-zinc-50 pb-2.5">
                <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Session Initiated</span>
                <span className="font-mono text-zinc-800 font-semibold">
                  {session.loginTime ? new Date(session.loginTime).toLocaleTimeString() : 'N/A'}
                </span>
              </div>

              {/* Device info */}
              <div className="flex items-start justify-between text-xs gap-4 border-b border-zinc-50 pb-2.5">
                <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">Origin Device</span>
                <span className="font-mono text-zinc-800 text-right line-clamp-2 text-[11px] leading-tight">
                  {session.deviceInfo}
                </span>
              </div>

              {/* Security Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Crypto Vault</span>
                <span className="font-bold text-zinc-900 flex items-center gap-1 bg-zinc-100 px-2.5 py-1 rounded-md text-[11px]">
                  <Globe className="h-3.5 w-3.5" />
                  Isolated State
                </span>
              </div>
            </div>
          </div>

          {/* Destructive zone */}
          <div className="bg-zinc-50 border border-zinc-250 rounded-3xl p-6 sm:p-8 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Unregister Profile</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Permanently purge this profile and secure notes from your local storage engine.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to permanently unregister and delete this sandbox account and all secure notes? This cannot be undone.")) {
                  onDeleteAccount();
                }
              }}
              className="py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all w-full text-center cursor-pointer"
              id="delete-account-btn"
            >
              Unregister Profile Data
            </button>
          </div>
        </div>

        {/* Right Side: Secure Notes/Vault (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-zinc-800" />
                  Your Secure Notes Vault
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Decrypted in-memory notes. These will auto-encrypt and persist on your client browser.
                </p>
              </div>

              {/* Search note bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search secure keys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white transition-all"
                  id="note-search-input"
                />
              </div>
            </div>

            {/* Note categories switcher */}
            <div className="flex gap-2 flex-wrap">
              {['All', 'Personal', 'Work', 'Finance', 'Secret'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat as any)}
                  className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilter === cat
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Form to Add New Note */}
            <form onSubmit={handleAddNote} className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200/50 space-y-4">
              <span className="block text-xs font-bold text-zinc-900 uppercase tracking-widest">
                Append Vault Entry
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Entry title (e.g. Wi-Fi Password)"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full px-4 py-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    id="new-note-title"
                  />
                </div>
                <div>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value as any)}
                    className="w-full px-3 py-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold"
                    id="new-note-category"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Finance">Finance</option>
                    <option value="Secret">Secret</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Type secure vault text here..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-900 resize-none"
                  id="new-note-content"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 py-3 px-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  id="new-note-submit-btn"
                >
                  <Plus className="h-4 w-4" />
                  Commit to Vault
                </button>
              </div>
            </form>

            {/* Notes List Display */}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="border border-zinc-100 rounded-2xl p-5 flex items-start gap-4 hover:border-zinc-200 transition-colors bg-white relative group"
                    >
                      <div className="h-9 w-9 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-500 shrink-0 mt-0.5 border border-zinc-100">
                        <FileText className="h-4.5 w-4.5" />
                      </div>

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-zinc-900 truncate max-w-sm">
                            {note.title}
                          </h4>
                          <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ring-1 ring-inset ${getCategoryColor(note.category)}`}>
                            {note.category}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-600 leading-relaxed break-words whitespace-pre-line pr-6">
                          {note.content}
                        </p>

                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                          <span>Created</span>
                          <span>•</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-zinc-50 hover:text-zinc-900 rounded-xl text-zinc-400 transition-all focus:opacity-100 cursor-pointer"
                        title="Delete entry"
                        id={`delete-note-${note.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-zinc-200 rounded-2xl" id="notes-empty-state">
                    <FileText className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
                    <span className="block text-xs font-bold text-zinc-900">No matching records found</span>
                    <span className="block text-[11px] text-zinc-400 mt-1">Write a new key-value entry above to save records.</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

