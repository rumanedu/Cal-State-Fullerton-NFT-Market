// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CSUFCampusNFT
 * @dev ERC-721 NFT contract tied to CSUF campus buildings
 * Each building has its own NFT collection identified by buildingId
 */
contract CSUFCampusNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // Platform fee: 2.5%
    uint256 public constant PLATFORM_FEE_BPS = 250;
    uint256 public constant MAX_BPS = 10000;

    struct NFTListing {
        uint256 tokenId;
        address seller;
        uint256 price;       // in wei
        string buildingId;   // e.g. "pollak-library"
        bool active;
    }

    struct BuildingCollection {
        string buildingId;
        string name;
        uint256 maxSupply;
        uint256 minted;
        uint256 mintPrice;   // in wei
        bool active;
    }

    // tokenId => listing
    mapping(uint256 => NFTListing) public listings;

    // buildingId => collection info
    mapping(string => BuildingCollection) public collections;

    // tokenId => buildingId
    mapping(uint256 => string) public tokenBuilding;

    // Accumulated fees for owner withdrawal
    uint256 public accumulatedFees;

    event CollectionCreated(string buildingId, string name, uint256 maxSupply, uint256 mintPrice);
    event NFTMinted(uint256 indexed tokenId, address indexed to, string buildingId, string tokenURI);
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId);
    event NFTSold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price);
    event FeesWithdrawn(address indexed to, uint256 amount);

    constructor() ERC721("CSUF Campus NFT", "CSUFNFT") Ownable(msg.sender) {}

    // ── Admin ──────────────────────────────────────────────────────────────────

    /**
     * @dev Create an NFT collection for a campus building
     */
    function createCollection(
        string calldata buildingId,
        string calldata name,
        uint256 maxSupply,
        uint256 mintPrice
    ) external onlyOwner {
        require(bytes(buildingId).length > 0, "Invalid buildingId");
        require(collections[buildingId].maxSupply == 0, "Collection exists");
        collections[buildingId] = BuildingCollection(buildingId, name, maxSupply, 0, mintPrice, true);
        emit CollectionCreated(buildingId, name, maxSupply, mintPrice);
    }

    // ── Minting ────────────────────────────────────────────────────────────────

    /**
     * @dev Mint an NFT from a building's collection
     * @param buildingId The campus building identifier
     * @param uri IPFS URI to NFT metadata JSON
     */
    function mint(string calldata buildingId, string calldata uri) external payable nonReentrant returns (uint256) {
        BuildingCollection storage col = collections[buildingId];
        require(col.active, "Collection not active");
        require(col.minted < col.maxSupply, "Max supply reached");
        require(msg.value >= col.mintPrice, "Insufficient payment");

        _tokenIds.increment();
        uint256 newId = _tokenIds.current();

        _safeMint(msg.sender, newId);
        _setTokenURI(newId, uri);
        tokenBuilding[newId] = buildingId;
        col.minted++;

        // Refund excess
        if (msg.value > col.mintPrice) {
            payable(msg.sender).transfer(msg.value - col.mintPrice);
        }
        accumulatedFees += col.mintPrice;

        emit NFTMinted(newId, msg.sender, buildingId, uri);
        return newId;
    }

    // ── Marketplace ────────────────────────────────────────────────────────────

    /**
     * @dev List an NFT for sale
     * @param tokenId The NFT to list
     * @param price Sale price in wei
     */
    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");
        require(!listings[tokenId].active, "Already listed");

        // Escrow: transfer to contract
        transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = NFTListing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            buildingId: tokenBuilding[tokenId],
            active: true
        });

        emit NFTListed(tokenId, msg.sender, price);
    }

    /**
     * @dev Cancel a listing and reclaim the NFT
     */
    function unlistNFT(uint256 tokenId) external {
        NFTListing storage listing = listings[tokenId];
        require(listing.active, "Not listed");
        require(listing.seller == msg.sender, "Not seller");

        listing.active = false;
        _transfer(address(this), msg.sender, tokenId);

        emit NFTUnlisted(tokenId);
    }

    /**
     * @dev Buy a listed NFT
     */
    function buyNFT(uint256 tokenId) external payable nonReentrant {
        NFTListing storage listing = listings[tokenId];
        require(listing.active, "Not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy own NFT");

        uint256 fee = (listing.price * PLATFORM_FEE_BPS) / MAX_BPS;
        uint256 sellerProceeds = listing.price - fee;

        listing.active = false;
        accumulatedFees += fee;

        _transfer(address(this), msg.sender, tokenId);
        payable(listing.seller).transfer(sellerProceeds);

        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit NFTSold(tokenId, listing.seller, msg.sender, listing.price);
    }

    // ── Queries ────────────────────────────────────────────────────────────────

    function getListing(uint256 tokenId) external view returns (NFTListing memory) {
        return listings[tokenId];
    }

    function getCollection(string calldata buildingId) external view returns (BuildingCollection memory) {
        return collections[buildingId];
    }

    function totalMinted() external view returns (uint256) {
        return _tokenIds.current();
    }

    // ── Finance ────────────────────────────────────────────────────────────────

    function withdrawFees() external onlyOwner {
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        payable(owner()).transfer(amount);
        emit FeesWithdrawn(owner(), amount);
    }
}
