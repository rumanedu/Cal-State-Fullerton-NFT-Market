https://github.com/rumanedu/Cal-State-Fullerton-NFT-Market

**## Contributers**
1. Abdul Muqeet Ahmed, 877550566
2. Ruman Saiyed, 819882275
3. Asim Ali Mohammed, 868328634
4. Matheen Baba Mahammed, 861600625
5. Siddhi Mane, 832480206

# 🏛️ CSUF Campus NFT Marketplace

A premium, 3D interactive NFT marketplace built for the Cal State Fullerton community. Users can explore a digital twin of the CSUF campus, mint building-specific NFTs, and trade them on a local blockchain marketplace.

---

## ✨ Features

1. **Interactive 3D Campus Map:**
   Explore a high-fidelity digital twin of the Cal State Fullerton campus. Users can navigate using a smooth orbit camera, zoom into specific buildings, and click on    landmarks to interact with their associated NFT collections.
2. **SVG-Based Generative Art(NFTs):**
   Instead of static images, every NFT is a piece of code-generated art. Using dynamic SVGs, the system creates unique "CSUF F" designs with billions of                 combinations, including varying colors, backgrounds, and premium visual effects like Gold Foil, Holographic, and Glitch.
3. **Sorting and Building Categories:**
   The campus map is organized into logical categories such as Academic, Student Life, Athletics, and Arts. Users can instantly filter the view to find buildings        belonging to a specific category, making navigation intuitive for a large campus.
4. **Real-time Activity Feed:**
   A global transaction log that slides in from the navbar. It provides a "live pulse" of the marketplace, showing every mint, sale, listing, and bid as they happen     across the entire blockchain network.
5. **Advanced Search (Buildings & NFTs):**
   The platform includes dual search capabilities: a Navbar search to find and fly to specific buildings on the 3D map, and a Marketplace search to filter individual    NFTs within a collection by their name, ID, or rarity.
6. **Primary Minting & Secondary Listing:**
    Users can participate in the primary market by minting brand-new NFTs directly from building collections. Once owned, users can enter the secondary market by         listing their NFTs for a custom price in ETH, allowing other users to purchase them.
7. **NFT Auctions & Bidding:**
    For high-value items, users can start timed auctions. This features a bidding system where potential buyers can place ETH bids, with the smart contract               automatically handling the transfer to the highest bidder once the auction concludes.
8. **Live Pin Editor:**
    A built-in administrative tool that allows developers to visually drag-and-drop building markers in the 3D scene. It provides real-time coordinate output that        can be copied directly into the source code, ensuring the 3D markers always stay perfectly aligned with the map.
9. **Global Favorites System:**
    A "wishlist" for the campus. Users can click a Heart icon on any NFT to save it to a global Favorites panel. This panel is accessible from the top navbar and         provides a quick way to track the price and status of interesting NFTs across all collections.
10. **Notification System:**
    A sleek, color-coded Toast notification system provides instant feedback for every user action. Whether a transaction is pending, successful, or failed, users        are kept informed with clear, non-intrusive alerts.
11. **Advanced Wallet Integration:**
    Fully integrated with MetaMask and local blockchain providers like Ganache. Features include:
         -Automatic Network Switching to the correct chain.
         -Live Balance Tracking in the navbar.
         -Demo Mode Fallback which allows users to explore the full UI even if they don't have a crypto wallet installed.   

## 🚀 Quick Start & Setup

### 1. Prerequisites
*   **Node.js**: v18+ recommended.
*   **Ganache**: [Download Ganache GUI](https://trufflesuite.com/ganache/) (Port 7545).
*   **MetaMask**: Browser extension installed.
*   **Git**: Version control system.

### 2. Clone the Repository
Clone the project and navigate into the directory:
```bash
git clone https://github.com/rumanedu/Cal-State-Fullerton-NFT-Market.git
cd Cal-State-Fullerton-NFT-Market
```

### 3. Install Dependencies
The project correctly ignores the `node_modules` folder to prevent cross-environment corruption. You **must** install the dependencies locally after cloning:
```bash
npm install
```

### 4. Setup Local Blockchain (Ganache)
1.  Open **Ganache GUI** and click **Quickstart**.
2.  Ensure it is running on `http://127.0.0.1:7545`.
3.  In **MetaMask**, add a custom network:
    *   **Network Name**: Ganache Local
    *   **RPC URL**: `http://127.0.0.1:7545`
    *   **Chain ID**: `1337`
    *   **Currency**: ETH

### 5. Deploy Smart Contracts
Run the deployment script to initialize the building collections:
```bash
npx hardhat run scripts/deploy.cjs --network ganache
```
*Note: This will print a contract address. Copy it.*

### 6. Configure Frontend
1.  Open `src/contracts/config.js`.
2.  Paste your deployed address into `CONTRACT_ADDRESS`:
    ```javascript
    export const CONTRACT_ADDRESS = '0xYourAddressHere';
    ```

### 7. Run Development Server
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
