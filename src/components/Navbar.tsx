import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutGrid, Compass, Bookmark, User, LogIn, LogOut, Sparkles, Sun, Moon, Wallet } from 'lucide-react';
import { logout } from '../firebase';
import { AuthContext } from '../AuthContext';
import { seedFirestore } from '../lib/seedData';
import { UnifiedAuthModal } from './UnifiedAuthModal';

export const Navbar = () => {
  const { user, profile, loading } = React.useContext(AuthContext);
  const location = useLocation();
  const [syncing, setSyncing] = React.useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Initialize and track theme changes
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (theme === 'light') {
      bodyClass.add('light');
    } else {
      bodyClass.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isAdmin = user?.email === "onlineguruji691997@gmail.com";

  const handleSync = async () => {
    setSyncing(true);
    const success = await seedFirestore();
    setSyncing(false);
    if (success) {
      alert('Database synced successfully!');
    } else {
      alert('Sync failed. Check console for details.');
    }
  };

  const navItems = [
    { name: 'Project List', path: '/explore', icon: Compass },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-7 h-7 bg-white rounded-sm flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                <Sparkles className="w-4 h-4 text-black group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-bold tracking-[0.2em] uppercase text-white">
                Aether
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:text-white ${
                    location.pathname === item.path ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-6">
              {isAdmin && (
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 text-white/40 border border-white/10 rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                >
                  <Sparkles className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing' : 'Sync'}
                </button>
              )}

              {/* Theme Toggle Button right next to Connection block */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="w-8 h-8 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-blue-500" />
                )}
              </button>

              {!loading && (
                user ? (
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">{user.displayName}</span>
                      <button 
                        onClick={() => setAuthModalOpen(true)}
                        className="text-[8px] text-blue-400 hover:text-blue-500 transition-colors uppercase tracking-widest font-mono flex items-center gap-1.5"
                      >
                        <Wallet className="w-2.5 h-2.5" />
                        {profile?.walletAddress ? (
                          `${profile.walletAddress.slice(0, 6)}...${profile.walletAddress.slice(-4)}`
                        ) : (
                          'Link Wallet'
                        )}
                      </button>
                    </div>
                    <img 
                      src={user.photoURL || ''} 
                      alt="Avatar" 
                      onClick={() => setAuthModalOpen(true)}
                      className="w-6 h-6 rounded-sm border border-white/10 grayscale hover:grayscale-0 cursor-pointer transition-all" 
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-4 py-1.5 bg-white text-black rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-2"
                  >
                    Connect
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      <UnifiedAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};
