import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutGrid, Compass, Bookmark, User, LogIn, LogOut, Sparkles } from 'lucide-react';
import { signInWithGoogle, logout } from '../firebase';
import { AuthContext } from '../AuthContext';

export const Navbar = () => {
  const { user, loading } = React.useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              AetherAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === item.path ? 'text-white' : 'text-white/60'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {!loading && (
              user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs text-white font-medium">{user.displayName}</span>
                    <button onClick={logout} className="text-[10px] text-white/40 hover:text-white transition-colors">
                      Sign Out
                    </button>
                  </div>
                  <img src={user.photoURL || ''} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20" />
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Connect
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
