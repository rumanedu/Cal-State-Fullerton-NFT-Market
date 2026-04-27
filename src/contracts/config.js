// Contract deployment config
// After deploying CSUFCampusNFT.sol, fill in the address below

export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // TODO: deploy and fill in

export const CONTRACT_ABI = [
  // Mint
  'function mint(string calldata buildingId, string calldata uri) external payable returns (uint256)',
  // Marketplace
  'function listNFT(uint256 tokenId, uint256 price) external',
  'function unlistNFT(uint256 tokenId) external',
  'function buyNFT(uint256 tokenId) external payable',
  // Queries
  'function getListing(uint256 tokenId) external view returns (tuple(uint256 tokenId, address seller, uint256 price, string buildingId, bool active))',
  'function getCollection(string calldata buildingId) external view returns (tuple(string buildingId, string name, uint256 maxSupply, uint256 minted, uint256 mintPrice, bool active))',
  'function totalMinted() external view returns (uint256)',
  'function tokenBuilding(uint256) external view returns (string)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  // Events
  'event NFTMinted(uint256 indexed tokenId, address indexed to, string buildingId, string tokenURI)',
  'event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price)',
  'event NFTSold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price)',
];

// IPFS Gateway for metadata
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

// Chain config (Ethereum Sepolia testnet for dev)
export const CHAIN_CONFIG = {
  chainId: 11155111,
  name: 'Sepolia',
  rpcUrl: 'https://rpc.sepolia.org',
  explorerUrl: 'https://sepolia.etherscan.io',
};
