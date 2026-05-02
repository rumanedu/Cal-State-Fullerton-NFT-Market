# 🏛️ CSUF Campus NFT Marketplace

A premium, 3D interactive NFT marketplace built for the Cal State Fullerton community. Users can explore a digital twin of the CSUF campus, mint building-specific NFTs, and trade them on a local blockchain marketplace.

---

## ✨ Features

### 🏢 3D Interactive Campus
*   **Real-time 3D Navigation**: Explore the CSUF campus map (Blender model) using a smooth orbit camera.
*   **Building Markers**: Floating labels that identify campus landmarks like Pollak Library, TSU, and McCarthy Hall.
*   **Contextual UI**: Clicking a building opens its specific NFT collection and marketplace panel.

### 🎨 NFT Collections
*   **Dynamic SVG Art**: Each NFT features a unique "CSUF F" design generated on-the-fly with varied colors, effects (Gold Foil, Holographic, Glitch), and backgrounds.
*   **Building-Specific Supplies**: Each building has its own unique collection with limited supply (e.g., 50 NFTs per building).
*   **Rarity System**: Items range from **Common** to **Legendary**, affecting their visual design and floor price.

### ⛓️ Blockchain Marketplace
*   **Minting**: Buy brand-new NFTs directly from the campus collection.
*   **Trading**: List your owned NFTs for sale, unlist them, or transfer them to other wallets.
*   **Escrow System**: Listed NFTs are securely held by the smart contract until sold or unlisted.
*   **Activity Feed**: A real-time log of all blockchain actions (mints, sales, listings) across the platform.

---

## 🚀 Quick Start & Setup

### 1. Prerequisites
*   **Node.js**: v18+ recommended.
*   **Ganache**: [Download Ganache GUI](https://trufflesuite.com/ganache/) (Port 7545).
*   **MetaMask**: Browser extension installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Local Blockchain (Ganache)
1.  Open **Ganache GUI** and click **Quickstart**.
2.  Ensure it is running on `http://127.0.0.1:7545`.
3.  In **MetaMask**, add a custom network:
    *   **Network Name**: Ganache Local
    *   **RPC URL**: `http://127.0.0.1:7545`
    *   **Chain ID**: `1337`
    *   **Currency**: ETH

### 4. Deploy Smart Contracts
Run the deployment script to initialize the building collections:
```bash
npx hardhat run scripts/deploy.cjs --network ganache
```
*Note: This will print a contract address. Copy it.*

### 5. Configure Frontend
1.  Open `src/contracts/config.js`.
2.  Paste your deployed address into `CONTRACT_ADDRESS`:
    ```javascript
    export const CONTRACT_ADDRESS = '0xYourAddressHere';
    ```

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite |
| **3D Engine** | Three.js via React Three Fiber (R3F) |
| **3D Helpers** | @react-three/drei |
| **Blockchain** | Solidity 0.8.20 + Hardhat |
| **State Management** | Zustand |
| **Wallet Interaction** | Ethers.js v6 |
| **Styling** | Vanilla CSS + Framer Motion |
| **Icons** | Lucide React |

---

## 🎨 3D Model Management

### Customizing the Map
The 3D campus map is loaded from `public/Csuf.glb`. To use your own model:
1.  Export your Blender model as a **.glb** (glTF Binary).
2.  Place it in the `public/` folder.
3.  The app will automatically center and scale the model to fit the viewport.

### Updating Building Positions
If you move buildings in your 3D model, update their "pins" in `src/data/buildings.js`:
```javascript
{
  id: 'pollak-library',
  position: [x, y, z], // [horizontal, vertical, depth]
  ...
}
```

---

## 🎓 Credits & Development

Developed for CSUF.
*   **Smart Contracts**: CSUFCampusNFT.sol (ERC-721 Standard).
*   **3D Art**: Cal State Fullerton Campus Map (Blender).
*   **Frontend**: Interactive React-Three-Fiber Dashboard.

---

## 📦 Production Build
```bash
npm run build
```
The production-ready files will be in the `dist/` directory.
