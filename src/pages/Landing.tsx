import React from 'react';
import { Hero } from '../components/Hero';
import { motion } from 'motion/react';
import { Sparkles, Shield, Zap, Globe, ArrowRight, MessageSquare, LayoutGrid, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI Summaries',
      description: 'Get concise, AI-generated summaries of complex Web3 projects in seconds.',
      color: 'text-blue-400'
    },
    {
      icon: Shield,
      title: 'Trust Scoring',
      description: 'Our AI analyzes smart contracts and social signals to detect potential scams.',
      color: 'text-emerald-400'
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'Ask our intelligent bot for personalized airdrop recommendations.',
      color: 'text-purple-400'
    },
    {
      icon: Bookmark,
      title: 'Smart Tracking',
      description: 'Bookmark and track your progress across multiple testnets and airdrops.',
      color: 'text-pink-400'
    }
  ];

  return (
    <div className="bg-black min-h-screen">
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-white/40 max-w-2xl mx-auto">Everything you need to discover and participate in the next big Web3 project.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <feature.icon className={`w-10 h-10 ${feature.color} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to find your next <br /> <span className="text-blue-400">100x opportunity?</span></h2>
          <p className="text-lg text-white/60 mb-12">Join thousands of Web3 explorers using AetherAI to stay ahead of the curve.</p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
          >
            Explore Projects Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AetherAI</span>
          </div>
          <div className="text-white/20 text-sm">
            © 2026 AetherAI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            {['Twitter', 'Discord', 'Telegram'].map(social => (
              <a key={social} href="#" className="text-sm text-white/40 hover:text-white transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
