import { useState } from 'react';
import { X, Tag, AlertCircle } from 'lucide-react';
import { useStore } from '../../store';
import { RARITY_COLORS } from '../../data/buildings';
import './SellModal.css';

export default function SellModal({ nft, onClose }) {
  const { listNFT, wallet, addNotification } = useStore();
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const usdEstimate = price ? (parseFloat(price) * 2340).toFixed(0) : null;
  const rarityColor = RARITY_COLORS[nft.rarity];

  const handleList = async () => {
    const p = parseFloat(price);
    if (!p || p <= 0) { setError('Enter a valid price'); return; }
    if (!wallet) { setError('Connect wallet first'); return; }
    setLoading(true);
    setError('');
    try {
      await listNFT(nft, price);
      addNotification(`🏷️ "${nft.name}" listed for Ξ ${price}`, 'success');
      onClose();
    } catch {
      setError('Listing failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sell-modal glass">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Tag size={16} style={{ color: '#9B5FFF' }} />
            <span>List NFT for Sale</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* NFT preview */}
        <div className="modal-nft-preview" style={{ '--rarity-color': rarityColor }}>
          <div className="preview-art">
            <div className="preview-emoji">{nft.image}</div>
          </div>
          <div className="preview-info">
            <div className="preview-rarity" style={{ color: rarityColor }}>{nft.rarity}</div>
            <div className="preview-name">{nft.name}</div>
            <div className="preview-id">Token #{nft.tokenId}</div>
          </div>
        </div>

        {/* Price input */}
        <div className="modal-field">
          <label className="field-label">Listing Price (ETH)</label>
          <div className="price-input-wrap">
            <span className="price-prefix">Ξ</span>
            <input
              type="number"
              className="price-input"
              placeholder="0.00"
              value={price}
              min="0"
              step="0.001"
              onChange={(e) => { setPrice(e.target.value); setError(''); }}
            />
            {usdEstimate && (
              <span className="price-usd-est">≈ ${usdEstimate}</span>
            )}
          </div>
        </div>

        {/* Fee breakdown */}
        {price && parseFloat(price) > 0 && (
          <div className="modal-fees">
            <div className="fee-row">
              <span>Listing price</span>
              <span>Ξ {parseFloat(price).toFixed(4)}</span>
            </div>
            <div className="fee-row">
              <span>Platform fee (2.5%)</span>
              <span>- Ξ {(parseFloat(price) * 0.025).toFixed(4)}</span>
            </div>
            <div className="fee-row total">
              <span>You receive</span>
              <span>Ξ {(parseFloat(price) * 0.975).toFixed(4)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="modal-error">
            <AlertCircle size={13} />
            <span>{error}</span>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className={`btn-confirm ${loading ? 'loading' : ''}`}
            onClick={handleList}
            disabled={loading || !price}
          >
            {loading ? <span className="spinner" /> : <Tag size={14} />}
            {loading ? 'Listing...' : 'List for Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}
