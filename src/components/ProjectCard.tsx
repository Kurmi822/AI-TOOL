import React from 'react';
import { motion } from 'motion/react';
import { Shield, ExternalLink, Bookmark, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
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
      whileHover={{ y: -4 }}
      className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
              <span className="text-xl font-bold text-white">{project.name[0]}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                  {project.blockchain}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onBookmark?.(project.id);
            }}
            className={`p-2 rounded-lg border transition-all ${
              isBookmarked ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <p className="text-sm text-white/60 line-clamp-2 mb-6 leading-relaxed">
          {project.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold mb-1">Reward</div>
            <div className="text-xs font-bold text-white truncate">{project.reward}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-white/40 uppercase font-bold mb-1">Category</div>
            <div className="text-xs font-bold text-white">{project.category}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Shield className={`w-4 h-4 ${getTrustColor(project.trustScore || 0)}`} />
            <span className={`text-xs font-bold ${getTrustColor(project.trustScore || 0)}`}>
              {project.trustScore}% Trust
            </span>
          </div>
          <Link
            to={`/project/${project.id}`}
            className="flex items-center gap-1 text-xs font-bold text-white/60 hover:text-white transition-colors"
          >
            Details
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
