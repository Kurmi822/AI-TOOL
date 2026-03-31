export interface Web3Project {
  id: string;
  name: string;
  description: string;
  category: 'Airdrop' | 'Testnet' | 'NFT' | 'DeFi';
  blockchain: string;
  status: 'Active' | 'Ended';
  reward: string;
  steps: string[];
  aiSummary?: string;
  trustScore?: number;
  scamSignals?: string[];
  createdAt: number;
  bookmarksCount: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  bookmarks: string[]; // Array of project IDs
  trackedProjects: { projectId: string; progress: number }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
