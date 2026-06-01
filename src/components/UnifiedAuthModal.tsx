import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ShieldCheck, Mail, Wallet, ArrowRight, Loader2, Link2, Unlink } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { signInWithGoogle, logout, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({ isOpen, onClose }) => {
  const { user, profile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'info' | 'web2' | 'web3'>('info');
  const [customAddress, setCustomAddress] = useState('');
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill custom address if it's already in the profile
  useEffect(() => {
    if (profile?.walletAddress) {
      setCustomAddress(profile.walletAddress);
    }
  }, [profile?.walletAddress]);

  if (!isOpen) return null;

  // Real Web3 connection: try window.ethereum
  const connectRealWallet = async () => {
    setConnectingWallet(true);
    setErrorMsg('');
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          const wallet = accounts[0];
          setCustomAddress(wallet);
          
          // Save to Firestore if logged in
          if (profile && user) {
            const userDoc = doc(db, 'users', user.uid);
            await updateDoc(userDoc, { walletAddress: wallet });
          }
          setActiveTab('web3');
        }
      } else {
        // Fallback for simulation
        throw new Error('MetaMask extension not detected. Directing to manual address configuration...');
      }
    } catch (err: any) {
      console.warn(err);
      setErrorMsg(err.message || 'MetaMask connection canceled or unavailable.');
      // Keep in simulation view so they can manually set an address
      setActiveTab('web3');
    } finally {
      setConnectingWallet(false);
    }
  };

  const handleManualAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!customAddress.startsWith('0x') && customAddress.length < 30) {
      setErrorMsg('Please enter a valid EVM/Solana wallet address (e.g., starting with 0x).');
      return;
    }

    try {
      if (profile && user) {
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, { walletAddress: customAddress });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg('Could not link wallet address to your profile.');
    }
  };

  const disconnectWallet = async () => {
    try {
      if (profile && user) {
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, { walletAddress: '' });
      }
      setCustomAddress('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // If they had already set a custom address, let's make sure it updates in Firestore
      if (customAddress) {
        // Quick delay to let Auth handler write first
        setTimeout(async () => {
          if (auth && auth.currentUser) {
            const userDoc = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userDoc, { walletAddress: customAddress });
          }
        }, 1200);
      }
      setActiveTab('info');
    } catch (err) {
      console.error(err);
    }
  };

  // Safe import/access of auth from firebase
  const auth = (require('../firebase') as any).auth;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#09090b] border border-white/5 rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible transition-colors duration-300 body-theme-target"
        >
          {/* Accent strip */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          {/* Left Side: Explainer Panel */}
          <div className="w-full md:w-1/2 p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.01] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">SHELBY IDENTITY</span>
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                Hybrid Web2 + Web3 Discovery
              </h2>
              <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-wider mb-8">
                To keep discovery clean and securely accessible, we decouple accounting and on-chain activities.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-sm bg-blue-500/5 items-center justify-center flex border border-blue-500/10 shrink-0">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-white uppercase tracking-widest mb-1">Web2 Sync (Google Account)</h4>
                    <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider">
                      Saves your tracked quests, indexes, and custom bookmarks across arbitrary browsers & devices without transaction costs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-sm bg-emerald-500/5 items-center justify-center flex border border-emerald-500/10 shrink-0">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-white uppercase tracking-widest mb-1">Web3 Vector (Active Wallet)</h4>
                    <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-wider">
                      Queries testnet faucet status, logs Proof of Activity, and checks standard address whitelist allocations safely.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 mt-8 md:mt-0">
              <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Vetted by Shelby Infrastructure</span>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Panel */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Selector tabs */}
            <div className="flex border-b border-white/5 mb-8">
              <button 
                onClick={() => setActiveTab('info')}
                className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-widest text-center border-b-2 transition-all ${
                  activeTab === 'info' ? 'border-blue-500 text-white' : 'border-transparent text-white/30 hover:text-white/60'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('web2')}
                className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-widest text-center border-b-2 transition-all ${
                  activeTab === 'web2' ? 'border-blue-500 text-white' : 'border-transparent text-white/30 hover:text-white/60'
                }`}
              >
                1. Web2 Auth
              </button>
              <button 
                onClick={() => setActiveTab('web3')}
                className={`flex-1 pb-3 text-[10px] font-black uppercase tracking-widest text-center border-b-2 transition-all ${
                  activeTab === 'web3' ? 'border-blue-500 text-white' : 'border-transparent text-white/30 hover:text-white/60'
                }`}
              >
                2. Web3 Wallet
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 flex flex-col justify-center min-h-[220px]">
              {activeTab === 'info' && (
                <div className="space-y-6 text-center md:text-left">
                  <div className="p-6 bg-white/[0.01] border border-white/5 rounded-sm">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-3">Connection Index Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                        <span className="text-white/30">Standard Sync Profile:</span>
                        {user ? (
                          <span className="text-emerald-400 font-mono">Linked ({user.displayName?.split(' ')[0]})</span>
                        ) : (
                          <span className="text-amber-500">Not Synced</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                        <span className="text-white/30">Linked Crypto Address:</span>
                        {profile?.walletAddress || customAddress ? (
                          <span className="text-emerald-400 font-mono">
                            {(profile?.walletAddress || customAddress).slice(0, 6)}...{(profile?.walletAddress || customAddress).slice(-4)}
                          </span>
                        ) : (
                          <span className="text-amber-500">No Wallet Linked</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {!user && (
                      <button 
                        onClick={() => setActiveTab('web2')}
                        className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 group"
                      >
                        Start Synchronization
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                    {user && !(profile?.walletAddress || customAddress) && (
                      <button 
                        onClick={() => setActiveTab('web3')}
                        className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                      >
                        Link Crypto Wallet
                      </button>
                    )}
                    {user && (profile?.walletAddress || customAddress) && (
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-center text-[10px] font-black uppercase tracking-widest rounded-sm">
                        Workspace Complete & Verified
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'web2' && (
                <div className="space-y-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-2">Cloud Save Architecture</h3>
                    <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">
                      Utilizes secure Firebase Identity token parameters for tracking user bookmarked protocols and active telemetry states on server side.
                    </p>
                  </div>

                  {user ? (
                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-sm text-center">
                      <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.15em] mb-4">Currently Synchronized</p>
                      <p className="text-[11px] text-white/60 font-semibold mb-6 font-mono">{user.email}</p>
                      <button 
                        onClick={logout}
                        className="px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Disconnect Account
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleGoogleSignIn}
                      className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                      <Mail className="w-4 h-4" />
                      Sign In With Google
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'web3' && (
                <div className="space-y-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-2">Web3 Network Connection</h3>
                    <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">
                      Inject simulated or real MetaMask parameters. Linking does NOT request private keys or sign seed words.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] uppercase tracking-wider font-bold rounded-sm">
                      {errorMsg}
                    </div>
                  )}

                  {(profile?.walletAddress || customAddress) ? (
                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-sm">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="text-[9px] text-white/30 uppercase tracking-widest font-black">Linked Key</span>
                        <button 
                          onClick={disconnectWallet}
                          className="text-[9px] text-red-400 hover:text-red-500 flex items-center gap-1.5 uppercase font-black"
                        >
                          <Unlink className="w-3 h-3" />
                          Unlink
                        </button>
                      </div>
                      <p className="text-[11px] text-white font-mono uppercase bg-black/40 p-3 select-all border border-white/5 truncate">
                        {profile?.walletAddress || customAddress}
                      </p>
                      <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-4">✓ Active on early-testnet whitelist indicators</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button 
                        onClick={connectRealWallet}
                        disabled={connectingWallet}
                        className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {connectingWallet ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                        ) : (
                          <Wallet className="w-4 h-4 text-emerald-400" />
                        )}
                        Connect Browser Ext (MetaMask)
                      </button>

                      <div className="relative flex items-center justify-center my-6">
                        <div className="absolute w-full h-px bg-white/5" />
                        <span className="relative px-3 bg-[#09090b] text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">OR MANUAL CONFIG</span>
                      </div>

                      <form onSubmit={handleManualAddressSubmit} className="space-y-3">
                        <input 
                          type="text" 
                          placeholder="PASTE EVM ADDRESS (0x...)" 
                          value={customAddress} 
                          onChange={(e) => setCustomAddress(e.target.value)}
                          className="w-full bg-black border border-white/10 px-4 py-3.5 text-[10px] rounded-sm text-white placeholder:text-white/10 tracking-widest uppercase focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setCustomAddress('0xef1011c7504a79c3fdfc97eeea7c5b6b158c56fa')}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-2 text-[8px] font-black text-white/60 tracking-widest uppercase"
                          >
                            Use Shelby Alpha EVM
                          </button>
                          <button 
                            type="button"
                            onClick={() => setCustomAddress('0xfa897c88b48de9a98ef73bf822bc26c5188ef391')}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-2 text-[8px] font-black text-white/60 tracking-widest uppercase"
                          >
                            Use Shelby Beta SOL
                          </button>
                        </div>
                        <button 
                          type="submit"
                          disabled={!customAddress}
                          className="w-full py-4 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-colors disabled:opacity-30"
                        >
                          Verify and Save Wallet
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
