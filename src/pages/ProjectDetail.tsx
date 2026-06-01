import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Web3Project } from '../types';
import { AuthContext } from '../AuthContext';
import { motion } from 'motion/react';
import { 
  Shield, 
  Clock, 
  ChevronLeft, 
  Bookmark, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Zap,
  Globe,
  Loader2,
  Sparkles,
  BadgeCheck,
  FileSearch
} from 'lucide-react';
import { performShelbyVerification } from '../lib/gemini';
import { dummyProjects } from '../lib/seedData';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Web3Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const { profile } = useContext(AuthContext);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'projects', id), (snapshot) => {
      if (snapshot.exists()) {
        setProject({ id: snapshot.id, ...snapshot.data() } as Web3Project);
      } else {
        // Fallback to local dummy list
        const localProd = dummyProjects.find(p => p.id === id);
        if (localProd) {
          setProject(localProd);
        }
      }
      setLoading(false);
    }, (error) => {
      console.warn('ProjectDetail onSnapshot error, searching local dummyProjects list:', error);
      const localProd = dummyProjects.find(p => p.id === id);
      if (localProd) {
        setProject(localProd);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleBookmark = async () => {
    if (!profile || !id) return;
    const userDoc = doc(db, 'users', profile.uid);
    const isBookmarked = profile.bookmarks.includes(id);
    
    try {
      await updateDoc(userDoc, {
        bookmarks: isBookmarked ? arrayRemove(id) : arrayUnion(id)
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${profile.uid}`);
    }
  };

  const handleShelbyVerify = async () => {
    if (!project || !id) return;
    setVerifying(true);
    try {
      const result = await performShelbyVerification(project);
      await updateDoc(doc(db, 'projects', id), {
        shelbyVerification: {
          ...result,
          verifiedAt: Date.now()
        }
      });
    } catch (e) {
      console.error('Shelby verification failed', e);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <p className="mb-4">Project not found</p>
      <Link to="/explore" className="text-blue-400 hover:underline">Back to Explore</Link>
    </div>
  );

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#050505] tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/explore" className="inline-flex items-center gap-2 text-[10px] font-black text-white/20 hover:text-white transition-colors mb-12 uppercase tracking-[0.3em] group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Index
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-white flex items-center justify-center text-4xl font-black text-black">
                  {project.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`text-[10px] font-black px-3 py-1 uppercase tracking-widest ${
                      project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-[10px] font-black px-3 py-1 bg-white/5 text-white/40 border border-white/10 uppercase tracking-widest">
                      {project.blockchain}
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">{project.name}</h1>
                </div>
              </div>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                  profile?.bookmarks.includes(project.id) 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-transparent text-white border-white/10 hover:border-white/40'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${profile?.bookmarks.includes(project.id) ? 'fill-current' : ''}`} />
                {profile?.bookmarks.includes(project.id) ? 'Indexed' : 'Index Project'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
              <div className="p-8 bg-[#050505]">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Trust Index</div>
                <div className="text-4xl font-mono font-black text-white">{project.trustScore}%</div>
                <div className="mt-4 h-1 bg-white/5 w-full">
                  <div className="h-full bg-blue-500" style={{ width: `${project.trustScore}%` }} />
                </div>
              </div>
              <div className="p-8 bg-[#050505]">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Reward Potential</div>
                <div className="text-2xl font-black text-white uppercase tracking-tight">{project.reward}</div>
                <div className="mt-4 text-[9px] font-bold text-amber-500 uppercase tracking-widest">High Probability</div>
              </div>
              <div className="p-8 bg-[#050505]">
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Deployment Date</div>
                <div className="text-2xl font-mono font-black text-white">
                  {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                </div>
                <div className="mt-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">UTC Timestamp</div>
              </div>
            </div>

            <section className="space-y-16">
              <div>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-8">01 / Overview</div>
                <p className="text-lg text-white/60 leading-relaxed font-medium uppercase tracking-wide">{project.description}</p>
              </div>

              {project.aiSummary && (
                <div className="p-12 bg-white/[0.02] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-8">02 / AI Synthesis</div>
                  <p className="text-xl text-white/80 leading-relaxed italic font-serif">"{project.aiSummary}"</p>
                </div>
              )}

              <div>
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-8">03 / Participation Protocol</div>
                <div className="grid grid-cols-1 gap-4">
                  {project.steps.map((step, i) => (
                    <div key={i} className="flex gap-8 p-8 bg-white/[0.01] border border-white/5 group hover:bg-white/[0.03] transition-colors">
                      <div className="text-2xl font-mono font-black text-white/10 group-hover:text-blue-500 transition-colors">
                        {(i + 1).toString().padStart(2, '0')}
                      </div>
                      <p className="text-sm text-white/60 font-medium uppercase tracking-widest leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {project.scamSignals && project.scamSignals.length > 0 && (
                <div className="p-12 bg-red-500/[0.02] border border-red-500/10">
                  <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4" />
                    Risk Assessment
                  </div>
                  <ul className="space-y-4">
                    {project.scamSignals.map((signal, i) => (
                      <li key={i} className="text-[11px] text-red-500/60 font-black uppercase tracking-widest flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-red-500" />
                        {signal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 border border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-8">
                <div className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Shelby Verification</div>
                {project.shelbyVerification?.isVerified ? (
                  <BadgeCheck className="w-5 h-5 text-blue-500" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
                )}
              </div>

              {project.shelbyVerification ? (
                <div className="space-y-8">
                  <div className="flex items-end gap-4">
                    <div className="text-6xl font-mono font-black text-white leading-none">
                      {project.shelbyVerification.score}
                    </div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest pb-1">Reliability Rating</div>
                  </div>
                  
                  <div className="pt-8 border-t border-white/5">
                    <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <FileSearch className="w-3 h-3" />
                      Verification Log
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed font-medium uppercase tracking-wider">
                      {project.shelbyVerification.auditReport}
                    </p>
                  </div>

                  <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    Last Audit: {new Date(project.shelbyVerification.verifiedAt).toISOString().split('T')[0].replace(/-/g, '.')}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <p className="text-[11px] text-white/40 font-medium uppercase tracking-widest leading-relaxed">
                    This project has not yet been processed by the Shelby verification protocol.
                  </p>
                  <button
                    onClick={handleShelbyVerify}
                    disabled={verifying}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Initialize Audit
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="p-8 border border-white/5 bg-white/[0.01]">
              <div className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Network Specs</div>
              <div className="space-y-6">
                {[
                  { label: 'Layer', value: 'L1 Protocol' },
                  { label: 'Consensus', value: 'PoS / Hybrid' },
                  { label: 'Security', value: 'Audited' },
                  { label: 'Liquidity', value: 'Locked' }
                ].map(spec => (
                  <div key={spec.label} className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
