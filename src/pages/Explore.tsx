import React, { useState, useEffect, useContext } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Web3Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { AuthContext } from '../AuthContext';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';

export const Explore = () => {
  const [projects, setProjects] = useState<Web3Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { profile } = useContext(AuthContext);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Web3Project)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'projects'));

    return () => unsubscribe();
  }, []);

  const handleBookmark = async (projectId: string) => {
    if (!profile) return;
    const userDoc = doc(db, 'users', profile.uid);
    const isBookmarked = profile.bookmarks.includes(projectId);
    
    try {
      await updateDoc(userDoc, {
        bookmarks: isBookmarked ? arrayRemove(projectId) : arrayUnion(projectId)
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${profile.uid}`);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Explore Opportunities</h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Discover the best of Web3</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors w-full sm:w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/40" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
              >
                {['All', 'Airdrop', 'Testnet', 'NFT', 'DeFi'].map(c => (
                  <option key={c} value={c} className="bg-black text-white">{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isBookmarked={profile?.bookmarks.includes(project.id)}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="text-white/20 mb-4">No projects found matching your criteria</div>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="text-blue-400 font-bold text-sm hover:underline">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
