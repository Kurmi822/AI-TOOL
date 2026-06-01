import { db } from '../firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { Web3Project } from '../types';

export const dummyProjects: Web3Project[] = [
  {
    id: "zksync-era",
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
    createdAt: 1717228800000,
    bookmarksCount: 1250,
    shelbyVerification: {
      isVerified: true,
      verifiedAt: 1717228800000,
      auditReport: "ZkSync Era has passed the Shelby Infrastructure audit with high scores in decentralization and security. No malicious patterns detected in smart contracts.",
      score: 98
    }
  },
  {
    id: "berachain",
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
    createdAt: 1717142400000,
    bookmarksCount: 840
  },
  {
    id: "layerzero",
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
    createdAt: 1717056000000,
    bookmarksCount: 2100
  },
  {
    id: "pudgy-penguins",
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
    createdAt: 1716969600000,
    bookmarksCount: 450
  },
  {
    id: "shardeum-sphinx",
    name: "Shardeum Sphinx",
    description: "An EVM-based, linearly scalable smart contract platform that provides low gas fees forever while maintaining true decentralization.",
    category: "Testnet",
    blockchain: "Shardeum",
    status: "Active",
    reward: "SHARD Tokens",
    steps: [
      "Add Shardeum Sphinx Dapp 1.X to MetaMask",
      "Request testnet SHM from the faucet",
      "Deploy a smart contract using Remix",
      "Interact with Shardeum-based dApps like Swapped Finance"
    ],
    aiSummary: "Shardeum uses dynamic state sharding to scale. The testnet is incentivized, making it a high-priority task for airdrop hunters.",
    trustScore: 90,
    scamSignals: ["Occasional faucet downtime"],
    createdAt: 1717228800000,
    bookmarksCount: 620,
    shelbyVerification: {
      isVerified: true,
      verifiedAt: 1717228800000,
      auditReport: "Shardeum's sharding mechanism verified. Infrastructure is stable and decentralized. No critical vulnerabilities found in core protocol.",
      score: 94
    }
  },
  {
    id: "scroll-sepolia",
    name: "Scroll Sepolia",
    description: "Scroll is a bytecode-equivalent zkEVM Rollup on Ethereum. The Sepolia testnet is the final stage before mainnet.",
    category: "Testnet",
    blockchain: "Scroll",
    status: "Active",
    reward: "Potential Airdrop",
    steps: [
      "Add Scroll Sepolia to MetaMask",
      "Get Sepolia ETH from faucet",
      "Bridge ETH to Scroll Sepolia",
      "Deploy a contract or swap on Uniswap fork"
    ],
    aiSummary: "Scroll is one of the most technically sound zkEVMs. High probability of rewarding early testnet participants.",
    trustScore: 96,
    scamSignals: [],
    createdAt: 1717228700000,
    bookmarksCount: 950,
    shelbyVerification: {
      isVerified: true,
      verifiedAt: 1717228800000,
      auditReport: "Scroll's zkEVM implementation is highly secure and follows Ethereum standards closely. Verified as a legitimate scaling solution.",
      score: 97
    }
  },
  {
    id: "hashi",
    name: "Hashi",
    description: "A New era of Bitcoin finance on @SuiNetwork.",
    category: "Testnet",
    blockchain: "Sui",
    status: "Active",
    reward: "Potential Airdrop / Testnet Rewards",
    steps: [
      "Claim Faucet here https://faucet.sui.io/?network=devnet",
      "Go to https://devnet.hashi.sui.io",
      "Connect your SUI Wallet",
      "Click 'Receive BTC' > View BTC Deposit Address then Copy BTC Address",
      "Go to https://coinfaucet.eu/en/btc-testnet4/",
      "Enter the Address and Claim BTC Faucet",
      "Click I've Sent the BTC",
      "Enter Bitcoin Transaction ID (txid)",
      "Submit Deposit Request",
      "Do Onchain Activity Daily"
    ],
    aiSummary: "Hashi is bringing Bitcoin liquidity to the Sui ecosystem. This testnet phase is a great opportunity to get early exposure to the protocol. High potential for future rewards.",
    trustScore: 85,
    scamSignals: ["Ensure you are using the official devnet links"],
    createdAt: 1717228800000,
    bookmarksCount: 320
  },
  {
    id: "monad-devnet",
    name: "Monad Devnet",
    description: "A high-performance Ethereum-compatible Layer-1 blockchain introducing parallel execution to EVM.",
    category: "Testnet",
    blockchain: "Monad",
    status: "Active",
    reward: "Monad Token Allocation",
    steps: [
      "Join the Monad discord to request access/role",
      "Add Monad Devnet RPC parameters to your Web3 wallet",
      "Claim faucet tokens from official faucet channels",
      "Perform daily swaps and interact with early DEX testnets"
    ],
    aiSummary: "Monad is introducing groundbreaking parallel execution to the EVM space. Backed by top tier VCs, the potential valuation and future rewards are extremely high.",
    trustScore: 97,
    scamSignals: ["Beware of fake Monad tokens or airdrops on other chains. No public token sale exists yet."],
    createdAt: 1717228800000,
    bookmarksCount: 3450,
    shelbyVerification: {
      isVerified: true,
      verifiedAt: 1717228800000,
      auditReport: "Shelby systems validated official Monad Devnet gateways. Safe to interact with official devnet smart contracts.",
      score: 99
    }
  },
  {
    id: "fuel-network",
    name: "Fuel Network Upgrade",
    description: "The roll-up operating system for Ethereum, using the Fuel VM designed for parallel transaction execution.",
    category: "Testnet",
    blockchain: "Ethereum L2",
    status: "Active",
    reward: "Fuel Token Incentives",
    steps: [
      "Install the custom Fuel Wallet extension",
      "Claim testnet ETH and Fuel tokens from the faucet",
      "Interact with Spark DEX and SwaySwap",
      "Deploy a smart contract using the Sway programming language"
    ],
    aiSummary: "Fuel's UTXO-based architecture is highly innovative. Running on its testnet is an excellent way to qualify for prospective modular scaling rewards.",
    trustScore: 91,
    scamSignals: ["Requires installing a separate wallet extension (Fuel Wallet) from official sources. Check URLs carefully."],
    createdAt: 1717225200000,
    bookmarksCount: 1420,
    shelbyVerification: {
      isVerified: true,
      verifiedAt: 1717228800000,
      auditReport: "Fuel Network smart contracts and wallet downloads scanned. Official chrome extension verified as trusted.",
      score: 95
    }
  },
  {
    id: "linea-surge",
    name: "Linea Surge",
    description: "A developer-ready Layer 2 framework designed by Consensys, featuring high throughput and complete EVM compatibility.",
    category: "Airdrop",
    blockchain: "Linea L2",
    status: "Active",
    reward: "LXP-L Ecosystem Points",
    steps: [
      "Bridge assets to Linea Mainnet via official canonical bridge",
      "Provide liquidity in audited pools of partners (e.g. Nile, Velocore)",
      "Collect Linea Voyage LXP points through decentralized apps quests",
      "Submit proof-of-humanity verification via Linea portal"
    ],
    aiSummary: "Backed by Consensys (creator of MetaMask), Linea is a top-priority ecosystem with huge backing. Accumulating LXP-L is key.",
    trustScore: 99,
    scamSignals: [],
    createdAt: 1717180000000,
    bookmarksCount: 4890,
    shelbyVerification: {
      isVerified: true,
      verifiedAt: 1717228800000,
      auditReport: "Linea canonical bridges and points indexers verified. No risk of protocol-level rugpull, but users should be cautious of external third-party DApps on Linea.",
      score: 99
    }
  },
  {
    id: "eigenlayer",
    name: "EigenLayer Restaking",
    description: "A protocol built on Ethereum that introduces restaking, a new primitive in cryptoeconomic security.",
    category: "Airdrop",
    blockchain: "Ethereum",
    status: "Active",
    reward: "Eigen Points & AVS Tokens",
    steps: [
      "Deposit Liquid Staking Tokens (e.g. stETH, rETH) into EigenLayer contract",
      "Alternatively, set up Native Restaking via EigenPods",
      "Delegate your restaked balance to verified node operators",
      "Explore Actively Validated Services (AVS) registered on the network"
    ],
    aiSummary: "Largest new primitive in Ethereum's ecosystem. Shared security model allows users to earn yield plus points by securing multiple auxiliary chains.",
    trustScore: 96,
    scamSignals: ["Smart contract risk is present due to complex restaking layering."],
    createdAt: 1717108800000,
    bookmarksCount: 5120
  },
  {
    id: "taiko-hekla",
    name: "Taiko Hekla",
    description: "Taiko is a fully decentralized, Ethereum-equivalent Type-1 ZK-Rollup (ZK-EVM).",
    category: "Testnet",
    blockchain: "Taiko",
    status: "Active",
    reward: "Incentivized Rewards / Badges",
    steps: [
      "Add Taiko Hekla network parameters to your wallet",
      "Request Hekla ETH and ERC-20 tokens from the faucet",
      "Perform cross-chain bridges from Holesky to Hekla",
      "Interact with official partner DEXs and mint a testnet domain"
    ],
    aiSummary: "Taiko's goal of being a Type-1 zkEVM provides max compatibility with Ethereum. Excellent candidate for developers looking to build on truly decentralized rollups.",
    trustScore: 93,
    scamSignals: [],
    createdAt: 1717185600000,
    bookmarksCount: 1670,
    shelbyVerification: {
      isVerified: true,
      verifiedAt: 1717228800000,
      auditReport: "Taiko testnet endpoints audited. Fully open-source codebase verified matching native Ethereum client architecture.",
      score: 96
    }
  },
  {
    id: "mitosis-testnet",
    name: "Mitosis Testnet Quest",
    description: "A Modular Liquidity Protocol unifying fragmented liquidity across sovereign, multi-chain ecosystems.",
    category: "Testnet",
    blockchain: "Ethereum/Arbitrum/Sui",
    status: "Active",
    reward: "Mitosis MITO Points / Badges",
    steps: [
      "Connect your Web3 Wallet to the Mitosis Expedition portal",
      "Mint testnet eETH on Arbitrum Sepolia faucet",
      "Deposit assets into the multi-chain testnet vault",
      "Complete Galxe and Zealy community tasks to boost your point multiplier"
    ],
    aiSummary: "Mitosis solves cross-chain liquidity fragmentation. Backed by leading interoperability protocols, this testnet campaign is highly gamified and rewarding.",
    trustScore: 89,
    scamSignals: ["Be aware of high gas volatility on Sepolia chains when completing tasks."],
    createdAt: 1716728800000,
    bookmarksCount: 1210
  },
  {
    id: "espresso-sequencer",
    name: "Espresso Sequencer Network",
    description: "Espresso is a shared sequencer network designed to offer decentralized sequencing and fast finality for L2 rollups.",
    category: "Testnet",
    blockchain: "Espresso",
    status: "Active",
    reward: "Developer Grants & Future Tokens",
    steps: [
      "Review the developer documentation at Espresso Systems",
      "Configure your roll-up development kit to route transactions through Espresso sequencer",
      "Submit testnet transaction batches via the Espresso explorer",
      "Run an Espresso validator node on testnet"
    ],
    aiSummary: "Crucial infrastructure for scaling Ethereum. Espresso provides key shared security and block proposal layers. Essential for Web3 developers and node operators.",
    trustScore: 94,
    scamSignals: [],
    createdAt: 1717142400000,
    bookmarksCount: 780,
    shelbyVerification: {
      isVerified: true,
      verifiedAt: 1717228800000,
      auditReport: "Espresso consensus layer examined. Infrastructure handles high block load securely with clean ledger proof generation.",
      score: 95
    }
  },
  {
    id: "karak-restaking",
    name: "Karak Restaking",
    description: "The universal risk management and security restaking network safeguarding modern digital systems.",
    category: "Airdrop",
    blockchain: "Karak",
    status: "Active",
    reward: "XP Points & Ecosystem Multipliers",
    steps: [
      "Navigate to Karak Network portal",
      "Input a validated invite code to create your profile",
      "Deposit supported stablecoins, liquid staked ETH, or restaking tokens",
      "Keep funds staked to accumulate Karak XP on a daily cadence"
    ],
    aiSummary: "Karak is a powerful direct competitor to EigenLayer, supporting a wider range of assets like stablecoins and altcoins. Early participants gain highly leveraged points.",
    trustScore: 92,
    scamSignals: ["Invite code system is restricted. Only use codes shared inside the official Karak Discord."],
    createdAt: 1717056000000,
    bookmarksCount: 2890
  }
];

export const seedFirestore = async () => {
  console.log('Starting seedFirestore check with stationary IDs...');
  try {
    const projectsCol = collection(db, 'projects');
    const existingProjects = await getDocs(projectsCol);
    
    // Check if they are matched by stationary ID
    const existingIds = new Set(existingProjects.docs.map(doc => doc.id));
    console.log(`Currently verified Firestore project doc IDs: ${existingIds.size}`);

    for (const project of dummyProjects) {
      if (!existingIds.has(project.id)) {
        console.log(`Setting up brand new stationary project document: ${project.id}`);
        const docRef = doc(db, 'projects', project.id);
        await setDoc(docRef, { ...project });
      } else {
        console.log(`Stationary project document already present: ${project.id}`);
      }
    }
    console.log('Seeding check successfully completed!');
    return true;
  } catch (e) {
    console.error('Error seeding data:', e);
    return false;
  }
};
