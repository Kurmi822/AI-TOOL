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
  Sparkles
} from 'lucide-react';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Web3Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useContext(AuthContext);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'projects', id), (snapshot) => {
      if (snapshot.exists()) {
        setProject({ id: snapshot.id, ...snapshot.data() } as Web3Project);
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, `projects/${id}`));

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
    <div className="pt-24 pb-20 min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/explore" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Explore
        </Link>

        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
                  {project.name[0]}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      project.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'
                    }`}>
                      {project.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-white/60 border border-white/10">
                      {project.blockchain}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-white/60 border border-white/10">
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  profile?.bookmarks.includes(project.id) 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${profile?.bookmarks.includes(project.id) ? 'fill-current' : ''}`} />
                {profile?.bookmarks.includes(project.id) ? 'Bookmarked' : 'Bookmark'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <Shield className="w-6 h-6 text-blue-400 mb-4" />
                <div className="text-2xl font-bold text-white mb-1">{project.trustScore}%</div>
                <div className="text-xs text-white/40 uppercase font-bold tracking-widest">AI Trust Score</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <Zap className="w-6 h-6 text-amber-400 mb-4" />
                <div className="text-2xl font-bold text-white mb-1">{project.reward}</div>
                <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Potential Reward</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <Clock className="w-6 h-6 text-purple-400 mb-4" />
                <div className="text-2xl font-bold text-white mb-1">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Added On</div>
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  About Project
                </h2>
                <p className="text-white/60 leading-relaxed">{project.description}</p>
              </section>

              {project.aiSummary && (
                <section className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    AI Insights
                  </h2>
                  <p className="text-white/80 leading-relaxed italic">"{project.aiSummary}"</p>
                </section>
              )}

              <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  How to Participate
                </h2>
                <div className="space-y-4">
                  {project.steps.map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                        {i + 1}
                      </div>
                      <p className="text-sm text-white/80">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              {project.scamSignals && project.scamSignals.length > 0 && (
                <section className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Risk Warnings
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-sm text-red-400/80">
                    {project.scamSignals.map((signal, i) => (
                      <li key={i}>{signal}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
