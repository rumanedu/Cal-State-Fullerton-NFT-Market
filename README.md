# 🏛️ CSUF Campus NFT Marketplace

A 3D interactive NFT marketplace built on top of the Cal State Fullerton campus map, exported from Blender.

---

## 🗂 Project Structure

```
csuf-nft-campus/
├── contracts/
│   └── CSUFCampusNFT.sol        ← Solidity smart contract (ERC-721 + Marketplace)
├── public/
│   └── Csuf.glb                 ← ⬅ PLACE YOUR BLENDER MODEL HERE
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── CampusScene.jsx  ← Main Three.js / R3F scene
│   │   │   └── BuildingMarker.jsx ← Floating building signs
│   │   ├── marketplace/
│   │   │   ├── MarketplacePanel.jsx ← Side panel NFT UI
│   │   │   ├── NFTCard.jsx      ← Individual NFT display
│   │   │   └── SellModal.jsx    ← List NFT for sale modal
│   │   └── ui/
│   │       ├── Navbar.jsx       ← Top nav with wallet + search
│   │       ├── HUD.jsx          ← On-screen overlays
│   │       └── Toast.jsx        ← Notification toasts
│   ├── contracts/
│   │   └── config.js            ← Contract ABI + address
│   ├── data/
│   │   └── buildings.js         ← Building definitions + mock NFT data
│   ├── hooks/
│   │   └── useWallet.js         ← Wallet / contract hooks
│   ├── store/
│   │   └── index.js             ← Zustand global state
│   ├── App.jsx
│   ├── index.css                ← Design system variables
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Blender model
Copy your exported file to:
```
public/Csuf.glb
```
The app will automatically center and scale it.

### 3. Run development server
```bash
npm run dev
```
Open http://localhost:5173

---

## 🎨 Importing Your Blender Model

### Export settings in Blender:
1. **File → Export → glTF 2.0 (.glb/.gltf)**
2. Use these settings:
   - Format: **glTF Binary (.glb)**
   - Include: ✅ Selected Objects or ✅ Visible Objects
   - Transform: Y Forward, Z Up (Blender default)
   - Geometry: ✅ Apply Modifiers, ✅ UVs, ✅ Normals
   - Materials: ✅ Export (PBR)
3. Save as `Csuf.glb` and place in the `public/` folder

### Building position mapping:
In `src/data/buildings.js`, each building has a `position: [x, y, z]` array.
These are world-space coordinates. After loading your model:
1. Run the app, open browser DevTools
2. Use `scene.traverse(c => console.log(c.name, c.position))` in the console to find building positions
3. Update the positions in `buildings.js` to match

---

## ⛓️ Smart Contract Setup

### Deploy to testnet (Sepolia)

1. Install Hardhat:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

2. Initialize Hardhat:
```bash
npx hardhat init
```

3. Copy `contracts/CSUFCampusNFT.sol` into your Hardhat `contracts/` folder

4. Create deploy script `scripts/deploy.js`:
```js
const { ethers } = require("hardhat");

async function main() {
  const NFT = await ethers.getContractFactory("CSUFCampusNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log("Deployed to:", await nft.getAddress());

  // Create building collections
  const buildings = [
    ["pollak-library", "Pollak Library Collection", 100, ethers.parseEther("0.01")],
    ["titan-student-union", "TSU Collection", 50, ethers.parseEther("0.005")],
    // ... add all buildings
  ];
  for (const [id, name, supply, price] of buildings) {
    await nft.createCollection(id, name, supply, price);
    console.log(`Created collection: ${name}`);
  }
}

main().catch(console.error);
```

5. Deploy:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

6. Copy the deployed address into `src/contracts/config.js`:
```js
export const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_ADDRESS';
```

### Configure Hardhat for Sepolia:
```js
// hardhat.config.js
module.exports = {
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: "0.8.20",
};
```

---

## 👛 Wallet Integration

The app supports:
- **MetaMask** (and any EIP-1193 provider)
- **Demo Mode** — if no wallet is found, simulates a connected wallet for UI testing

To add WalletConnect support, install `@web3modal/wagmi` and wrap the app.

---

## 🏗️ Building Positions

Update `src/data/buildings.js` positions to match your GLB model:

```js
{
  id: 'pollak-library',
  name: 'Pollak Library',
  position: [x, y, z],   // ← World coordinates from your model
  ...
}
```

To find the right coordinates:
- In Blender: select a building roof, check its world XYZ coordinates
- After GLB export and auto-scaling, divide by the auto-scale factor the app applies (~10/maxDim)

---

## 🖼️ NFT Metadata (IPFS)

When minting real NFTs:
1. Upload images to IPFS (use [Pinata](https://pinata.cloud) or [NFT.Storage](https://nft.storage))
2. Create metadata JSON:
```json
{
  "name": "Pollak Library Genesis",
  "description": "Legendary NFT from CSUF's Pollak Library",
  "image": "ipfs://QmYOUR_IMAGE_CID",
  "attributes": [
    { "trait_type": "Building", "value": "Pollak Library" },
    { "trait_type": "Rarity", "value": "Legendary" }
  ]
}
```
3. Upload metadata JSON to IPFS
4. Pass the `ipfs://QmMETADATA_CID` URI to the `mint()` function

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| 3D Engine | Three.js via React Three Fiber |
| 3D Helpers | @react-three/drei |
| State | Zustand |
| Blockchain | ethers.js v6 |
| Smart Contract | Solidity 0.8.20 + OpenZeppelin |
| Animations | CSS animations + Framer Motion |
| Fonts | Syne, Space Mono, DM Sans |

---

## 🔧 Customization

### Add a new building:
```js
// src/data/buildings.js
{
  id: 'new-building',
  name: 'New Building Name',
  shortName: 'NB',
  position: [x, y, z],
  color: '#hexcolor',
  description: 'Description here',
  category: 'Academic', // Academic | Student Life | Administration | Athletics | Arts
  year: 2020,
  sqft: '50,000 sq ft',
}
```

### Add real NFT images:
Replace the `image` emoji field with a URL or IPFS hash in `generateNFTs()`.

### Change the blockchain network:
Update `CHAIN_CONFIG` in `src/contracts/config.js` to your target network.

---

## 📦 Build for Production

```bash
npm run build
# Output in dist/
```

Deploy `dist/` to Vercel, Netlify, or any static host.
Make sure `Csuf.glb` is in `public/` so it gets copied to `dist/`.

---

## 🎓 Credits

Built for CSUF · Powered by React Three Fiber · Smart contracts on Ethereum
