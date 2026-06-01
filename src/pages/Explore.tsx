import React, { useState, useEffect, useContext } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Web3Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { AuthContext } from '../AuthContext';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { dummyProjects } from '../lib/seedData';

export const Explore = () => {
  const [projects, setProjects] = useState<Web3Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [blockchain, setBlockchain] = useState('All');
  const [status, setStatus] = useState('All');
  const [rewardType, setRewardType] = useState('All');
  const { profile } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Fallback to simple query if ordered one is empty
        const fallbackQ = query(collection(db, 'projects'));
        onSnapshot(fallbackQ, (fallbackSnapshot) => {
          if (fallbackSnapshot.empty) {
            console.log('Firestore empty, using local dummyProjects fallback');
            setProjects(dummyProjects);
          } else {
            const data = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Web3Project));
            console.log('Fetched projects from Firestore (fallback):', data.length);
            setProjects(data);
          }
          setLoading(false);
        });
      } else {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Web3Project));
        console.log('Fetched projects from Firestore:', data.length);
        setProjects(data);
        setLoading(false);
      }
    }, (error) => {
      console.warn('Firestore onSnapshot query restriction/error, falling back to local dataset:', error);
      // Fallback on error to local dummy dataset or fallback query if Firestore allows
      const fallbackQ = query(collection(db, 'projects'));
      onSnapshot(fallbackQ, (fallbackSnapshot) => {
        if (fallbackSnapshot.empty) {
          setProjects(dummyProjects);
        } else {
          const data = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Web3Project));
          setProjects(data);
        }
        setLoading(false);
      }, (fallbackError) => {
        console.warn('Fallback Firestore query failed. Operating fully on local dummyProjects dataset.', fallbackError);
        setProjects(dummyProjects);
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = profile?.email === "onlineguruji691997@gmail.com";

  const handleSync = async () => {
    const { seedFirestore } = await import('../lib/seedData');
    const success = await seedFirestore();
    if (success) {
      alert('Database synced successfully!');
    } else {
      alert('Sync failed. Check console for details.');
    }
  };

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

  const blockchains = ['All', ...new Set(projects.map(p => p.blockchain))];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    const matchesBlockchain = blockchain === 'All' || p.blockchain === blockchain;
    const matchesStatus = status === 'All' || p.status === status;
    
    let matchesReward = true;
    if (rewardType !== 'All') {
      const r = p.reward.toLowerCase();
      if (rewardType === 'Tokens') matchesReward = r.includes('token') || r.includes('coin');
      else if (rewardType === 'Cash') matchesReward = r.includes('$') || r.includes('stable');
      else if (rewardType === 'Access') matchesReward = r.includes('access') || r.includes('whitelist');
      else if (rewardType === 'NFT') matchesReward = r.includes('nft') || r.includes('mint');
    }

    return matchesSearch && matchesCategory && matchesBlockchain && matchesStatus && matchesReward;
  });

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#050505] tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16 mb-20">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-12 border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div>
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4">Shelby Index</div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">Shelby Explorer</h1>
              <p className="text-white/20 text-[11px] font-bold uppercase tracking-[0.4em] mt-6">Vetted Blockchain projects, testnets, and community activities in one place</p>
            </div>
            <button 
              onClick={() => {
                setSearch('');
                setCategory('All');
                setBlockchain('All');
                setStatus('All');
                setRewardType('All');
              }}
              className="px-8 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-all group"
            >
              <span className="group-hover:tracking-[0.3em] transition-all">Reset Filters</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/5 border border-white/5">
            <div className="bg-[#050505] p-8 group">
              <label className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mb-4 block group-hover:text-blue-500 transition-colors">Search Query</label>
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-hover:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="ID / NAME / TAG"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 bg-transparent text-[11px] font-bold text-white placeholder:text-white/10 focus:outline-none w-full uppercase tracking-widest"
                />
              </div>
            </div>
            
            <div className="bg-[#050505] p-8 group">
              <label className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mb-4 block group-hover:text-blue-500 transition-colors">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer w-full uppercase tracking-widest appearance-none"
              >
                {['All', 'Airdrop', 'Testnet', 'NFT', 'DeFi'].map(c => (
                  <option key={c} value={c} className="bg-black text-white">{c}</option>
                ))}
              </select>
            </div>

            <div className="bg-[#050505] p-8 group">
              <label className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mb-4 block group-hover:text-blue-500 transition-colors">Blockchain</label>
              <select
                value={blockchain}
                onChange={(e) => setBlockchain(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer w-full uppercase tracking-widest appearance-none"
              >
                {blockchains.map(b => (
                  <option key={b} value={b} className="bg-black text-white">{b}</option>
                ))}
              </select>
            </div>

            <div className="bg-[#050505] p-8 group">
              <label className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mb-4 block group-hover:text-blue-500 transition-colors">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer w-full uppercase tracking-widest appearance-none"
              >
                {['All', 'Active', 'Ended'].map(s => (
                  <option key={s} value={s} className="bg-black text-white">{s}</option>
                ))}
              </select>
            </div>

            <div className="bg-[#050505] p-8 group">
              <label className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mb-4 block group-hover:text-blue-500 transition-colors">Reward Type</label>
              <select
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer w-full uppercase tracking-widest appearance-none"
              >
                {['All', 'Tokens', 'NFT', 'Cash', 'Access'].map(r => (
                  <option key={r} value={r} className="bg-black text-white">{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
          <div className="text-center py-40 border border-dashed border-white/5 bg-white/[0.01]">
            <div className="text-white/20 text-[11px] font-black uppercase tracking-[0.3em] mb-8">
              {projects.length === 0 ? 'Database is currently empty' : 'No records match the current telemetry filters'}
            </div>
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => { 
                  setSearch(''); 
                  setCategory('All'); 
                  setBlockchain('All');
                  setStatus('All');
                  setRewardType('All');
                }} 
                className="px-8 py-4 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-all"
              >
                Reset All Telemetry
              </button>
              
              {isAdmin && projects.length === 0 && (
                <button 
                  onClick={handleSync}
                  className="px-8 py-4 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-colors"
                >
                  Initialize Database (Admin)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
