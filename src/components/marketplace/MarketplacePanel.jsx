import { useState } from 'react';
import { X, ShoppingCart, Tag, Eye, Heart, ExternalLink, TrendingUp, Package } from 'lucide-react';
import { useStore } from '../../store';
import { generateNFTs, RARITY_COLORS } from '../../data/buildings';
import NFTCard from './NFTCard';
import SellModal from './SellModal';
import './MarketplacePanel.css';

const TABS = ['Collection', 'My NFTs', 'Listed'];

export default function MarketplacePanel() {
  const {
    selectedBuilding,
    setSelectedBuilding,
    wallet,
    connectWallet,
    nftCache,
    ownedNFTs,
    listedNFTs,
    buyNFT,
    addNotification,
  } = useStore();

  const [activeTab, setActiveTab] = useState('Collection');
  const [sellTarget, setSellTarget] = useState(null);
  const [buying, setBuying] = useState(null);

  if (!selectedBuilding) return null;

  const collectionNFTs = nftCache[selectedBuilding.id] || generateNFTs(selectedBuilding.id);
  const myNFTs = ownedNFTs.filter(n => n.buildingId === selectedBuilding.id);
  const myListings = listedNFTs.filter(n => n.buildingId === selectedBuilding.id);

  const tabData = {
    'Collection': collectionNFTs,
    'My NFTs': myNFTs,
    'Listed': myListings,
  };

  const handleBuy = async (nft) => {
    if (!wallet) {
      addNotification('Connect your wallet to buy NFTs', 'warn');
      connectWallet();
      return;
    }
    setBuying(nft.id);
    try {
      await buyNFT(nft);
      addNotification(`🎉 You now own "${nft.name}"!`, 'success');
    } catch (err) {
      addNotification('Transaction failed. Try again.', 'error');
    } finally {
      setBuying(null);
    }
  };

  const stats = {
    total: collectionNFTs.length,
    available: collectionNFTs.filter(n => n.available).length,
    floorPrice: Math.min(...collectionNFTs.map(n => parseFloat(n.priceEth))).toFixed(3),
    volume: collectionNFTs.reduce((s, n) => s + parseFloat(n.priceEth), 0).toFixed(2),
  };

  return (
    <>
      <div className="marketplace-panel glass" style={{ '--building-color': selectedBuilding.color }}>
        {/* Header */}
        <div className="panel-header">
          <div className="panel-header-accent" />
          <div className="panel-header-content">
            <div className="panel-building-info">
              <div className="panel-building-code" style={{ color: selectedBuilding.color }}>
                {selectedBuilding.shortName}
              </div>
              <h2 className="panel-building-name">{selectedBuilding.name}</h2>
              <p className="panel-building-desc">{selectedBuilding.description}</p>
            </div>
            <button className="panel-close" onClick={() => setSelectedBuilding(null)}>
              <X size={16} />
            </button>
          </div>

          {/* Collection stats */}
          <div className="panel-stats">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Items</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">{stats.available}</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">{stats.floorPrice} Ξ</div>
              <div className="stat-label">Floor</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value">{stats.volume} Ξ</div>
              <div className="stat-label">Volume</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="panel-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`panel-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === 'My NFTs' && myNFTs.length > 0 && (
                <span className="tab-badge">{myNFTs.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* NFT Grid */}
        <div className="panel-nfts">
          {tabData[activeTab].length === 0 ? (
            <div className="panel-empty">
              <Package size={32} opacity={0.3} />
              <p>{activeTab === 'My NFTs' ? 'No NFTs owned yet' : 'No listings'}</p>
              {activeTab === 'My NFTs' && (
                <button className="empty-cta" onClick={() => setActiveTab('Collection')}>
                  Browse Collection
                </button>
              )}
            </div>
          ) : (
            tabData[activeTab].map(nft => (
              <NFTCard
                key={nft.id}
                nft={nft}
                showSell={activeTab === 'My NFTs'}
                isBuying={buying === nft.id}
                onBuy={() => handleBuy(nft)}
                onSell={() => setSellTarget(nft)}
              />
            ))
          )}
        </div>
      </div>

      {sellTarget && (
        <SellModal
          nft={sellTarget}
          onClose={() => setSellTarget(null)}
        />
      )}
    </>
  );
}
