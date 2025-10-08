// Environment configuration
export const CONTRACT_ADDRESS = 
  import.meta.env.VITE_CONTRACT_ADDRESS || "PASTE_CA_HERE";

export const BUY_URL = 
  import.meta.env.VITE_BUY_URL || 
  "https://dexscreener.com/solana/PASTE_PAIR_OR_USE_YOUR_LINK";

// Roadmap configuration
export const ROADMAP_CONFIG = {
  start: 0.40,
  end: 0.70
};