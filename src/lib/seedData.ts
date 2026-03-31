import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { Web3Project } from '../types';

const dummyProjects: Partial<Web3Project>[] = [
  {
    name: "ZkSync Era",
    description: "A Layer 2 scaling solution for Ethereum based on ZK-Rollup technology. High potential for a major airdrop.",
    category: "Airdrop",
    blockchain: "Ethereum L2",
    status: "Active",
    reward: "$1,000 - $5,000",
    steps: [
      "Bridge ETH to ZkSync Era mainnet",
      "Interact with SyncSwap and Mute.io",
      "Mint a ZkSync Name Service domain",
      "Provide liquidity on decentralized exchanges"
    ],
    aiSummary: "ZkSync is one of the most anticipated airdrops in 2026. Its ZK-Rollup tech is industry-leading. Low risk, high reward potential.",
    trustScore: 95,
    scamSignals: [],
    createdAt: Date.now(),
    bookmarksCount: 1250
  },
  {
    name: "Berachain",
    description: "A high-performance EVM-compatible blockchain built on Proof-of-Liquidity consensus.",
    category: "Testnet",
    blockchain: "Berachain",
    status: "Active",
    reward: "Governance Tokens",
    steps: [
      "Add Berachain Artio testnet to MetaMask",
      "Claim BERA from the faucet",
      "Swap tokens on BEX",
      "Mint Honey stablecoin"
    ],
    aiSummary: "Strong community backing and unique consensus mechanism. Testnet is currently free to participate in.",
    trustScore: 88,
    scamSignals: ["High network congestion during peak hours"],
    createdAt: Date.now() - 86400000,
    bookmarksCount: 840
  },
  {
    name: "LayerZero",
    description: "An omnichain interoperability protocol designed for lightweight message passing across chains.",
    category: "Airdrop",
    blockchain: "Omnichain",
    status: "Active",
    reward: "ZRO Tokens",
    steps: [
      "Use Stargate Finance bridge",
      "Interact with LiquidSwap bridge",
      "Vote on Stargate DAO proposals",
      "Use Merkly for cross-chain minting"
    ],
    aiSummary: "Essential infrastructure for cross-chain communication. Airdrop is highly likely given the project's scale.",
    trustScore: 92,
    scamSignals: [],
    createdAt: Date.now() - 172800000,
    bookmarksCount: 2100
  },
  {
    name: "Pudgy Penguins NFT",
    description: "A collection of 8,888 cute penguins on the Ethereum blockchain. Strong IP and physical toy integration.",
    category: "NFT",
    blockchain: "Ethereum",
    status: "Active",
    reward: "Ecosystem Access",
    steps: [
      "Purchase a Pudgy Penguin on OpenSea",
      "Join the Pudgy World alpha",
      "Participate in community votes"
    ],
    aiSummary: "One of the most successful NFT collections transitioning into a global brand. High trust score due to transparent leadership.",
    trustScore: 98,
    scamSignals: [],
    createdAt: Date.now() - 259200000,
    bookmarksCount: 450
  }
];

export const seedFirestore = async () => {
  try {
    const q = query(collection(db, 'projects'), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('Seeding dummy data...');
      for (const project of dummyProjects) {
        await addDoc(collection(db, 'projects'), project);
      }
      console.log('Seeding complete!');
    }
  } catch (e) {
    console.error('Error seeding data:', e);
  }
};
