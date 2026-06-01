import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, signInWithGoogle } from '../firebase';
import { Web3Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { LayoutGrid, Bookmark, Clock, User, LogIn, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, profile, loading: authLoading } = useContext(AuthContext);
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Web3Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.bookmarks.length) {
      setBookmarkedProjects([]);
      setLoading(false);
      return;
    }

    // Firestore 'in' query is limited to 10 items, but for demo we'll just fetch all and filter
    const q = query(collection(db, 'projects'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Web3Project));
      setBookmarkedProjects(all.filter(p => profile.bookmarks.includes(p.id)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'projects'));

    return () => unsubscribe();
  }, [profile?.bookmarks]);

  const handleRemoveBookmark = async (id: string) => {
    if (!profile) return;
    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        bookmarks: arrayRemove(id)
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${profile.uid}`);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-[#050505] pt-32 px-4 text-center tech-grid">
      <div className="max-w-md mx-auto p-12 bg-white/[0.01] border border-white/5 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
        <User className="w-12 h-12 text-white/10 mx-auto mb-8" />
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-4">Access Denied</h2>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">Authentication Required</h2>
        <p className="text-[11px] text-white/20 font-bold uppercase tracking-widest mb-12 leading-relaxed">Sign in to initialize your personal discovery protocol and index opportunities.</p>
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all duration-500"
        >
          <LogIn className="w-4 h-4" />
          Initialize Google Auth
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#050505] tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-20 pb-12 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="relative">
            <img src={user.photoURL || ''} alt="Avatar" className="w-24 h-24 rounded-sm border border-white/10 grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-600 flex items-center justify-center border-2 border-[#050505]">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Operator Profile</div>
              <div className="h-px flex-1 bg-white/5" />
              <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">ID: {user.uid.slice(0, 8)}</div>
            </div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-2">{user.displayName}</h1>
            <div className="flex items-center gap-6">
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{user.email}</p>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Session
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <section>
              <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                    <Bookmark className="w-5 h-5 text-blue-500" />
                    Indexed Opportunities
                  </h2>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-2">Personal Discovery Database</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest">
                    {bookmarkedProjects.length} Records
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : bookmarkedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {bookmarkedProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isBookmarked={true}
                      onBookmark={handleRemoveBookmark}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-24 border border-dashed border-white/5 text-center bg-white/[0.01] group hover:bg-white/[0.02] transition-colors">
                  <p className="text-[11px] text-white/20 font-bold uppercase tracking-widest mb-8">No opportunities indexed in current session.</p>
                  <Link to="/explore" className="inline-flex px-8 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-colors">
                    Access Global Index
                  </Link>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <section className="p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-2 h-2 rounded-full bg-blue-500/20 animate-ping" />
              </div>
              <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-500" />
                System Telemetry
              </h2>
              <div className="space-y-6">
                {[
                  { label: 'Sync Status', value: 'Nominal', color: 'text-emerald-500' },
                  { label: 'Network Latency', value: '24ms', color: 'text-blue-500' },
                  { label: 'Protocol Version', value: 'v2.4.0', color: 'text-white/40' },
                  { label: 'Uptime', value: '99.99%', color: 'text-white/40' }
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between border-b border-white/[0.03] pb-4">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</span>
                    <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="text-[8px] text-white/10 font-bold uppercase tracking-widest italic mb-4">Recent Activity Log:</div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-blue-500 mt-1" />
                    <div className="text-[9px] text-white/30 font-mono uppercase tracking-tighter">Session initialized successfully</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-blue-500 mt-1" />
                    <div className="text-[9px] text-white/30 font-mono uppercase tracking-tighter">Opportunity index synchronized</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="p-8 bg-blue-600/[0.03] border border-blue-500/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:w-full transition-all duration-700 opacity-10" />
              <div className="relative z-10">
                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6">Shelby Operator Node</h2>
                <p className="text-[11px] text-white/40 mb-8 leading-relaxed font-medium uppercase tracking-widest">
                  You are currently authenticated as an active collaborator within the Shelby Team Workspace. Custom lists, private testnets, and verified logs are unlocked.
                </p>
                <div className="w-full py-4 bg-white/5 border border-white/10 text-white text-center text-[10px] font-black uppercase tracking-[0.2em]">
                  Workspace Sync Active
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
