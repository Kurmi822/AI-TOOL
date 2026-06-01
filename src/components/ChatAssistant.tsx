import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { getAiAssistantResponse } from '../lib/gemini';
import { Web3Project, ChatMessage } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm your Shelby Ecosystem Copilot. How can I help you find and track vetted Web3 opportunities today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Web3Project[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), limit(10));
        const snapshot = await getDocs(q);
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Web3Project)));
      } catch (e) {
        console.error('Failed to fetch projects for AI context');
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAiAssistantResponse(input, projects);
      const aiMsg: ChatMessage = { role: 'model', content: response || "I'm sorry, I couldn't process that.", timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[450px] h-[600px] bg-[#050505]/90 backdrop-blur-3xl border border-white/10 rounded-sm shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white flex items-center justify-center">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Shelby Intelligence</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Protocol Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 text-[11px] font-medium leading-relaxed uppercase tracking-wider ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white border border-blue-500/50' 
                      : 'bg-white/[0.03] text-white/80 border border-white/5 font-mono'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.03] p-5 border border-white/5">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 bg-white/[0.02]">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Query Shelby Index..."
                  className="w-full bg-black border border-white/10 px-6 py-4 text-[11px] text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500 transition-all uppercase tracking-widest pr-16"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-white hover:text-blue-500 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-[8px] text-white/10 font-bold uppercase tracking-widest">Secure Channel</div>
                <div className="text-[8px] text-white/10 font-bold uppercase tracking-widest">v2.4.0-AI</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-white text-black rounded-sm flex items-center justify-center shadow-2xl group hover:bg-blue-500 hover:text-white transition-colors duration-500"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-black rounded-full" />
      </motion.button>
    </div>
  );
};
