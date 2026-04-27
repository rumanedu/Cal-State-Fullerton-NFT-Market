import { create } from 'zustand';
import { generateNFTs } from '../data/buildings';

export const useStore = create((set, get) => ({
  // Wallet
  wallet: null,
  walletBalance: null,
  isConnecting: false,

  connectWallet: async () => {
    set({ isConnecting: true });
    try {
      if (!window.ethereum) throw new Error('MetaMask not found');
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      set({
        wallet: {
          address,
          shortAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
          signer,
          provider,
        },
        walletBalance: ethers.formatEther(balance),
      });
    } catch (err) {
      console.error('Wallet connect failed:', err);
      // Demo mode - simulate wallet
      set({
        wallet: {
          address: '0xDemo1234...5678',
          shortAddress: '0xDemo...5678',
          signer: null,
          provider: null,
          isDemo: true,
        },
        walletBalance: '4.2069',
      });
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnectWallet: () => set({ wallet: null, walletBalance: null }),

  // Scene
  selectedBuilding: null,
  hoveredBuilding: null,
  searchQuery: '',
  filterCategory: 'All',

  setSelectedBuilding: (building) => {
    set({ selectedBuilding: building, activePanel: building ? 'marketplace' : null });
    if (building) {
      const nfts = get().nftCache[building.id] || generateNFTs(building.id);
      set(state => ({ nftCache: { ...state.nftCache, [building.id]: nfts } }));
    }
  },
  setHoveredBuilding: (building) => set({ hoveredBuilding: building }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterCategory: (c) => set({ filterCategory: c }),

  // UI
  activePanel: null,
  setActivePanel: (panel) => set({ activePanel: panel }),

  // NFTs
  nftCache: {},
  ownedNFTs: [],
  listedNFTs: [],

  buyNFT: async (nft) => {
    const { wallet } = get();
    if (!wallet) throw new Error('Connect wallet first');
    // In production: call smart contract
    // For demo: update local state
    set(state => ({
      ownedNFTs: [...state.ownedNFTs, { ...nft, owner: wallet.shortAddress }],
      nftCache: {
        ...state.nftCache,
        [nft.buildingId]: state.nftCache[nft.buildingId]?.map(n =>
          n.id === nft.id ? { ...n, owner: wallet.shortAddress, available: false } : n
        ),
      },
    }));
  },

  listNFT: async (nft, price) => {
    set(state => ({
      listedNFTs: [...state.listedNFTs, { ...nft, priceEth: price, listed: true }],
      nftCache: {
        ...state.nftCache,
        [nft.buildingId]: state.nftCache[nft.buildingId]?.map(n =>
          n.id === nft.id ? { ...n, priceEth: price, listed: true, available: true } : n
        ),
      },
    }));
  },

  // Notifications
  notifications: [],
  addNotification: (msg, type = 'info') => {
    const id = Date.now();
    set(state => ({ notifications: [...state.notifications, { id, msg, type }] }));
    setTimeout(() => set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })), 4000);
  },
}));
