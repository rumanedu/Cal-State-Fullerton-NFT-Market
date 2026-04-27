import { useState } from 'react';
import { Search, Menu, X, Wallet, ChevronDown, Layers } from 'lucide-react';
import { useStore } from '../../store';
import { CAMPUS_BUILDINGS } from '../../data/buildings';
import './Navbar.css';

const CATEGORIES = ['All', 'Academic', 'Student Life', 'Administration', 'Athletics', 'Arts'];

export default function Navbar() {
  const {
    wallet, walletBalance, isConnecting, connectWallet, disconnectWallet,
    searchQuery, setSearchQuery,
    filterCategory, setFilterCategory,
    setSelectedBuilding,
  } = useStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const searchResults = searchQuery.length > 1
    ? CAMPUS_BUILDINGS.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <nav className="navbar glass">
      {/* Logo */}
      <div className="navbar-brand">
        <div className="brand-icon">
          <Layers size={18} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <span className="brand-name">CSUF</span>
          <span className="brand-sub">NFT CAMPUS</span>
        </div>
      </div>

      {/* Category filters */}
      <div className="navbar-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-pill ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className={`navbar-search ${searchOpen ? 'open' : ''}`}>
        <button className="search-toggle" onClick={() => setSearchOpen(!searchOpen)}>
          {searchOpen ? <X size={16} /> : <Search size={16} />}
        </button>
        {searchOpen && (
          <div className="search-input-wrap">
            <input
              autoFocus
              className="search-input"
              placeholder="Search buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="search-dropdown glass">
                {searchResults.map(b => (
                  <button
                    key={b.id}
                    className="search-result"
                    onClick={() => {
                      setSelectedBuilding(b);
                      setSearchQuery('');
                      setSearchOpen(false);
                    }}
                  >
                    <span className="result-code" style={{ color: b.color }}>{b.shortName}</span>
                    <span className="result-name">{b.name}</span>
                    <span className="result-cat">{b.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wallet */}
      <div className="navbar-wallet">
        {wallet ? (
          <div className="wallet-connected">
            <button
              className="wallet-badge"
              onClick={() => setWalletOpen(!walletOpen)}
            >
              <div className="wallet-dot" />
              <span className="wallet-address">{wallet.shortAddress}</span>
              <span className="wallet-balance">{parseFloat(walletBalance).toFixed(3)} ETH</span>
              <ChevronDown size={12} />
            </button>
            {walletOpen && (
              <div className="wallet-dropdown glass">
                <div className="wallet-info">
                  <div className="wallet-info-label">Connected Wallet</div>
                  <div className="wallet-info-address">{wallet.address}</div>
                  <div className="wallet-info-balance">{walletBalance} ETH</div>
                  {wallet.isDemo && (
                    <div className="wallet-demo-badge">Demo Mode</div>
                  )}
                </div>
                <button className="wallet-disconnect" onClick={() => { disconnectWallet(); setWalletOpen(false); }}>
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="wallet-connect-btn"
            onClick={connectWallet}
            disabled={isConnecting}
          >
            <Wallet size={15} />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </nav>
  );
}
