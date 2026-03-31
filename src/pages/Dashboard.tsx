import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, signInWithGoogle } from '../firebase';
import { Web3Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { LayoutGrid, Bookmark, Clock, User, LogIn, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-black pt-32 px-4 text-center">
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <User className="w-12 h-12 text-white/20 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Access Your Dashboard</h2>
        <p className="text-white/40 mb-8">Sign in to track your Web3 journey and save your favorite projects.</p>
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-black rounded-2xl font-bold hover:bg-white/90 transition-all"
        >
          <LogIn className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 mb-12">
          <img src={user.photoURL || ''} alt="Avatar" className="w-20 h-20 rounded-3xl border-2 border-white/10" />
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">{user.displayName}</h1>
            <p className="text-white/40 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-blue-400" />
                  Bookmarked Opportunities
                </h2>
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                  {bookmarkedProjects.length} Saved
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              ) : bookmarkedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div className="p-12 rounded-3xl border border-dashed border-white/10 text-center">
                  <p className="text-white/20 mb-4">You haven't bookmarked any projects yet.</p>
                  <Link to="/explore" className="text-blue-400 font-bold hover:underline">Explore Projects</Link>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <section className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="text-center py-8 text-white/20 text-sm italic">
                  Activity tracking coming soon...
                </div>
              </div>
            </section>

            <section className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-2">Pro Insights</h2>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                Unlock advanced AI analysis and real-time alerts for high-potential airdrops.
              </p>
              <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-white/90 transition-colors">
                Upgrade to Pro
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
