import { useState } from 'react';
import { Heart, Eye, ShoppingCart, Tag, CheckCircle } from 'lucide-react';
import { RARITY_COLORS } from '../../data/buildings';
import './NFTCard.css';

export default function NFTCard({ nft, showSell, isBuying, onBuy, onSell }) {
  const [liked, setLiked] = useState(false);

  const rarityColor = RARITY_COLORS[nft.rarity] || '#6B7A99';

  return (
    <div className={`nft-card ${!nft.available ? 'sold' : ''}`}>
      {/* NFT Image / Emoji Art */}
      <div className="nft-art" style={{ '--rarity-color': rarityColor }}>
        <div className="nft-emoji">{nft.image}</div>
        <div className="nft-rarity-badge" style={{ color: rarityColor, borderColor: rarityColor }}>
          {nft.rarity}
        </div>
        {!nft.available && (
          <div className="nft-sold-overlay">
            <CheckCircle size={20} />
            <span>Owned</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="nft-info">
        <div className="nft-header">
          <div>
            <div className="nft-token-id">#{nft.tokenId}</div>
            <div className="nft-name">{nft.name}</div>
          </div>
          <button
            className={`nft-like ${liked ? 'liked' : ''}`}
            onClick={() => setLiked(!liked)}
          >
            <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
            <span>{nft.likes + (liked ? 1 : 0)}</span>
          </button>
        </div>

        <div className="nft-meta">
          <div className="nft-owner">
            <span className="meta-label">Owner</span>
            <span className="meta-value mono">{nft.owner}</span>
          </div>
          <div className="nft-views">
            <Eye size={11} />
            <span>{nft.views}</span>
          </div>
        </div>

        <div className="nft-footer">
          <div className="nft-price">
            <span className="price-eth">Ξ {nft.priceEth}</span>
            <span className="price-usd">${nft.priceUsd}</span>
          </div>

          <div className="nft-actions">
            {showSell ? (
              <button className="btn-sell" onClick={onSell}>
                <Tag size={13} />
                List
              </button>
            ) : (
              <button
                className={`btn-buy ${isBuying ? 'loading' : ''} ${!nft.available ? 'disabled' : ''}`}
                onClick={nft.available ? onBuy : undefined}
                disabled={!nft.available || isBuying}
              >
                {isBuying ? (
                  <span className="spinner" />
                ) : (
                  <ShoppingCart size={13} />
                )}
                {isBuying ? 'Buying...' : nft.available ? 'Buy' : 'Sold'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
