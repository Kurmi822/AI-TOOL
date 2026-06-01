import React from 'react';
import { motion } from 'motion/react';
import { Shield, ExternalLink, Bookmark, CheckCircle2, AlertTriangle, Clock, BadgeCheck, ArrowRight } from 'lucide-react';
import { Web3Project } from '../types';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Web3Project;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isBookmarked, onBookmark }) => {
  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20';
  };

  const getTrustColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-[#050505] border border-white/5 rounded-sm overflow-hidden hover:border-blue-500/30 transition-all duration-500"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white flex items-center justify-center text-xl font-black text-black group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500">
              {project.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">{project.blockchain}</span>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{project.category}</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-blue-400 transition-colors duration-500">{project.name}</h3>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBookmark?.(project.id);
            }}
            className={`p-2 transition-all duration-300 ${
              isBookmarked ? 'text-blue-500' : 'text-white/10 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <p className="text-[11px] text-white/40 mb-8 line-clamp-2 leading-relaxed font-medium uppercase tracking-widest">
          {project.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 pt-8 border-t border-white/5">
          <div>
            <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Trust Score</div>
            <div className="flex items-end gap-2">
              <span className="text-lg font-mono font-black text-white leading-none">{project.trustScore}%</span>
              <div className="flex-1 h-1 bg-white/5 mb-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000" style={{ width: `${project.trustScore}%` }} />
              </div>
            </div>
          </div>
          <div>
            <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Potential</div>
            <div className="text-[10px] font-black text-white uppercase tracking-widest truncate">{project.reward}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{project.status}</span>
            </div>
            {project.shelbyVerification?.isVerified && (
              <div className="flex items-center gap-2 text-blue-500">
                <BadgeCheck className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
              </div>
            )}
          </div>
          <Link
            to={`/project/${project.id}`}
            className="flex items-center gap-2 text-[9px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-[0.2em] group/link"
          >
            Details
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
