import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div className="relative pt-40 pb-32 overflow-hidden tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="inline-block mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500 border border-blue-500/30 px-4 py-1.5 rounded-sm bg-blue-500/5">
              Shelby Intelligence Node v2.0
            </span>
          </div>
          
          <h1 className="text-6xl md:text-[120px] font-bold tracking-[-0.04em] text-white mb-8 leading-[0.85] uppercase">
            Shelby <br />
            <span className="text-white/20">Discovery</span>
          </h1>
          
          <p className="text-sm md:text-base text-white/40 max-w-xl mx-auto mb-16 leading-relaxed font-medium uppercase tracking-widest">
            A secure Web3 project discovery and tracking engine built for the Shelby Team. Map, track, and verify early decentralized opportunities and community networks natively.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link
              to="/explore"
              className="group relative px-12 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all duration-500"
            >
              Initialize Discovery
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 group-hover:bg-white transition-colors" />
            </Link>
            <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors border-b border-white/10 pb-1">
              Read Documentation
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 border-t border-white/5"
        >
          {[
            { label: 'Verified Nodes', value: '512' },
            { label: 'Active Streams', value: '128' },
            { label: 'Network Load', value: '0.02%' },
            { label: 'Uptime', value: '99.99%' },
          ].map((stat, i) => (
            <div key={i} className="py-12 px-8 border-r border-white/5 last:border-r-0 group hover:bg-white/[0.02] transition-colors">
              <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold mb-4 group-hover:text-blue-500 transition-colors">{stat.label}</div>
              <div className="text-3xl font-light text-white tracking-tighter font-mono">{stat.value}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
