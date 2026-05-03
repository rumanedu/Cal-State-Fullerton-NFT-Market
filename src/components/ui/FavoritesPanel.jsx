import { X, Heart, Package, ShoppingCart } from 'lucide-react';
import { useStore } from '../../store';
import NFTCard from '../marketplace/NFTCard';
import './FavoritesPanel.css';

export default function FavoritesPanel({ open, onClose }) {
  const { 
    favoriteNFTs, 
    buyNFT, 
    mintNFT, 
    addNotification, 
    wallet, 
    connectWallet 
  } = useStore();

  const handleBuy = async (nft) => {
    if (!wallet) {
      addNotification('Connect your wallet to buy NFTs', 'warn');
      connectWallet();
      return;
    }
    
    const isMint = !nft.onChainTokenId;
    try {
      if (isMint) {
        await mintNFT(nft);
        addNotification(`🔨 Successfully minted "${nft.name}"!`, 'success');
      } else {
        await buyNFT(nft);
        addNotification(`🎉 You now own "${nft.name}"!`, 'success');
      }
    } catch (err) {
      addNotification(`${isMint ? 'Mint' : 'Buy'} failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className={`favorites-panel-overlay ${open ? 'visible' : ''}`} onClick={onClose}>
      <div 
        className={`favorites-panel glass ${open ? 'open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="fp-header">
          <div className="fp-title">
            <Heart size={16} fill="#FF4F6A" color="#FF4F6A" />
            Favorite NFTs
            {favoriteNFTs.length > 0 && (
              <span className="fp-count">{favoriteNFTs.length}</span>
            )}
          </div>
          <button className="fp-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Content */}
        <div className="fp-content">
          {favoriteNFTs.length === 0 ? (
            <div className="fp-empty">
              <Heart size={32} opacity={0.2} />
              <p>No favorites yet</p>
              <p className="fp-empty-hint">Click the heart icon on any NFT to save it here for quick access</p>
            </div>
          ) : (
            <div className="fp-grid">
              {favoriteNFTs.map(nft => (
                <NFTCard 
                  key={nft.id} 
                  nft={nft} 
                  onBuy={() => handleBuy(nft)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
