import React from 'react';
import { Hero } from '../components/Hero';
import { ProjectCard } from '../components/ProjectCard';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Web3Project } from '../types';
import { motion } from 'motion/react';
import { Sparkles, Shield, Zap, Globe, ArrowRight, MessageSquare, LayoutGrid, Bookmark, CheckCircle2, Trophy, Smartphone, LineChart, Compass, Bell, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dummyProjects } from '../lib/seedData';

export const Landing = () => {
  const [trending, setTrending] = React.useState<Web3Project[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Try ordered query first
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Fallback to simple query if ordered one is empty (might be missing createdAt)
        const fallbackQ = query(collection(db, 'projects'), limit(3));
        onSnapshot(fallbackQ, (fallbackSnapshot) => {
          if (fallbackSnapshot.empty) {
            setTrending(dummyProjects.slice(0, 3));
          } else {
            setTrending(fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Web3Project)));
          }
          setLoading(false);
        });
      } else {
        setTrending(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Web3Project)));
        setLoading(false);
      }
    }, (error) => {
      console.warn('Landing page query error, falling back to local slice:', error);
      // Fallback on error
      const fallbackQ = query(collection(db, 'projects'), limit(3));
      onSnapshot(fallbackQ, (fallbackSnapshot) => {
        if (fallbackSnapshot.empty) {
          setTrending(dummyProjects.slice(0, 3));
        } else {
          setTrending(fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Web3Project)));
        }
        setLoading(false);
      }, (fallbackError) => {
        setTrending(dummyProjects.slice(0, 3));
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: 'Shelby Synthesis',
      description: 'Instantly synthesize multi-layered protocol specs, testnets, and contract architectures via Shelby models.',
      color: 'text-blue-400'
    },
    {
      icon: Shield,
      title: 'Rigorous Verification',
      description: 'Automated trust analytics mapping smart contracts and off-chain developer footprints to safeguard the community.',
      color: 'text-emerald-400'
    },
    {
      icon: MessageSquare,
      title: 'Ecosystem Co-pilot',
      description: 'Interactive deep research and guided advice tailored for explorers tracking early alpha streams.',
      color: 'text-purple-400'
    },
    {
      icon: Bookmark,
      title: 'Proof of Activity',
      description: 'A structured local bookkeeping engine keeping you highly synchronized with faucets, quests, and daily tasks.',
      color: 'text-pink-400'
    }
  ];

  return (
    <div className="bg-[#050505] min-h-screen tech-grid">
      <Hero />

      {/* Trending Section */}
      {!loading && trending.length > 0 && (
        <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16 border-b border-white/5 pb-8">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                Live Feed
              </h2>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mt-2">Latest Opportunities Indexed</p>
            </div>
            <Link to="/explore" className="text-[10px] font-black text-blue-500 hover:text-white transition-colors uppercase tracking-[0.2em] border border-blue-500/20 px-4 py-2 rounded-sm">
              Access Full Index
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trending.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-32 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.85]">
                Advanced <br />
                <span className="text-white/20">Capabilities</span>
              </h2>
              <p className="text-sm text-white/40 font-medium uppercase tracking-widest leading-relaxed">
                Our protocol leverages distributed intelligence to provide a comprehensive view of the decentralized landscape.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-2">Protocol Status</div>
              <div className="text-2xl font-mono text-blue-500">OPERATIONAL</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 bg-[#050505] hover:bg-white/[0.02] transition-colors group"
              >
                <feature.icon className={`w-8 h-8 ${feature.color} mb-8 group-hover:scale-110 transition-transform duration-500`} />
                <h3 className="text-xs font-black text-white mb-4 uppercase tracking-[0.2em]">{feature.title}</h3>
                <p className="text-[11px] text-white/40 font-medium leading-relaxed uppercase tracking-wider">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-32 border-b border-white/5 relative bg-black/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4">Development Timeline</div>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8">
                Ecosystem <br />
                <span className="text-white/20">Roadmap</span>
              </h2>
              <p className="text-sm text-white/40 font-medium uppercase tracking-widest leading-relaxed">
                Strategic advancement of our distributed verification network—engineered for maximum clarity and community alignment.
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">Completion Rate</div>
              <div className="text-3xl font-mono text-emerald-500 font-bold">25% VERIFIED</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {/* 1. Initial MVP */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 bg-[#050505] relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-sm bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 animate-pulse" />
                  </div>
                  <span className="text-[9px] font-mono px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest rounded-full font-bold">
                    ✓ Completed
                  </span>
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3">1. Initial MVP</h3>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider mb-8 leading-relaxed">
                  Core Web3 project indexing and lookup engine deployed with full Firestore persistence, beautiful custom UI, and theme support.
                </p>
              </div>
              <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest font-mono">
                Milestone 01
              </div>
            </motion.div>

            {/* 2. Project Discovery Engine */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-10 bg-[#050505] relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-700 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-sm bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-widest rounded-full font-bold">
                    🚧 In Development
                  </span>
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3">2. Project Discovery Engine</h3>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider mb-8 leading-relaxed">
                  Advanced multi-chain protocol scanner indexing active alpha opportunities, smart-contract structures, and testnet endpoints.
                </p>
              </div>
              <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest font-mono">
                Milestone 02
              </div>
            </motion.div>

            {/* 3. AI Recommendation System */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-10 bg-[#050505] relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-700 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-sm bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-widest rounded-full font-bold">
                    🚧 In Development
                  </span>
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3">3. AI Recommendation System</h3>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider mb-8 leading-relaxed">
                  Fine-tuned models analyzing on-chain actions to serve tailored, high-relevance decentralized recommendations right to your dashboard.
                </p>
              </div>
              <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest font-mono">
                Milestone 03
              </div>
            </motion.div>

            {/* 4. Testnet Tracking Module */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-10 bg-[#050505] relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-700 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-sm bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-widest rounded-full font-bold">
                    🚧 In Development
                  </span>
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3">4. Testnet Tracking Module</h3>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider mb-8 leading-relaxed">
                  Automated tracker for faucet timers, active testnet contract engagement, transaction statuses, and complete proof-of-activity logs.
                </p>
              </div>
              <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest font-mono">
                Milestone 04
              </div>
            </motion.div>

            {/* 5. Notification System */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-10 bg-[#050505] relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-700 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-sm bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-widest rounded-full font-bold">
                    🚧 In Development
                  </span>
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3">5. Notification System</h3>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider mb-8 leading-relaxed">
                  Smart alerts via browser push, email, and telegram notify you instantly when smart contracts pass verification or launch.
                </p>
              </div>
              <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest font-mono">
                Milestone 05
              </div>
            </motion.div>

            {/* 6. Community Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-10 bg-[#050505] relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-700 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-sm bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase tracking-widest rounded-full font-bold">
                    📈 Expansion Stage
                  </span>
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3">6. Community Leaderboard</h3>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider mb-8 leading-relaxed">
                  Engage in healthy ecosystem tracking by staking your reputational metrics and competing in community index activities.
                </p>
              </div>
              <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest font-mono">
                Milestone 06
              </div>
            </motion.div>

            {/* 7. Mobile Application */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="p-10 bg-[#050505] relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-700 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-sm bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-widest rounded-full font-bold">
                    📱 Future Deployment
                  </span>
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3">7. Mobile Application</h3>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider mb-8 leading-relaxed">
                  A high-fidelity mobile companion optimized for scanning QR-faucets, fast wallet linkage, and immediate notifications.
                </p>
              </div>
              <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest font-mono">
                Milestone 07
              </div>
            </motion.div>

            {/* 8. Advanced Analytics Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="p-10 bg-[#050505] relative overflow-hidden group flex flex-col justify-between lg:col-span-2"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-700 pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-sm bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-400">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-widest rounded-full font-bold">
                    📊 Future Deployment
                  </span>
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3">8. Advanced Analytics Dashboard</h3>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider mb-8 leading-relaxed">
                  Real-time network visualizers graphing developer commit ratios, smart contract interaction trends, and verified coin transactions statistics.
                </p>
              </div>
              <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest font-mono">
                Milestone 08
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-12">Shelby Connection</div>
          <h2 className="text-5xl md:text-8xl font-black text-white mb-12 uppercase tracking-tighter leading-[0.85]">
            Verify first, <br />
            <span className="text-white/20">then deploy</span>
          </h2>
          <p className="text-sm text-white/40 font-medium uppercase tracking-widest mb-16 max-w-xl mx-auto leading-relaxed">
            Empower the Shelby Team with high-fidelity telemetry, clean state tracking, and decentralized discovery tools designed for secure execution.
          </p>
          <Link
            to="/explore"
            className="group relative inline-flex items-center gap-4 px-16 py-6 bg-white text-black text-[12px] font-black uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all duration-500"
          >
            Access Shelby Portal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 group-hover:bg-white transition-colors" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-16 mb-20">
            <div className="flex flex-col gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                  <Sparkles className="w-5 h-5 text-black group-hover:text-white transition-colors" />
                </div>
                <span className="text-lg font-bold tracking-[0.2em] uppercase text-white">
                  Aether
                </span>
              </Link>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest max-w-xs leading-relaxed">
                Distributed intelligence for the decentralized ecosystem.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div>
                <div className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">Network</div>
                <div className="flex flex-col gap-4">
                  {['Explore', 'Dashboard', 'Protocol', 'Nodes'].map(item => (
                    <a key={item} href="#" className="text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">{item}</a>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">Social</div>
                <div className="flex flex-col gap-4">
                  {['Twitter', 'Discord', 'Telegram', 'Github'].map(social => (
                    <a key={social} href="#" className="text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">{social}</a>
                  ))}
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">Legal</div>
                <div className="flex flex-col gap-4">
                  {['Privacy', 'Terms', 'Cookies'].map(item => (
                    <a key={item} href="#" className="text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">{item}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
            <div className="text-[9px] text-white/10 font-bold uppercase tracking-[0.3em]">
              © 2026 Aether Protocol. All rights reserved.
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">System Normal</span>
              </div>
              <div className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">v2.4.0-Stable</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
