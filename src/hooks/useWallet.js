import { useStore } from '../store';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/config';

export function useWallet() {
  const { wallet, walletBalance, isConnecting, connectWallet, disconnectWallet } = useStore();
  return { wallet, walletBalance, isConnecting, connectWallet, disconnectWallet };
}

export function useContract() {
  const { wallet } = useStore();

  const getContract = async () => {
    if (!wallet?.signer) return null;
    const { ethers } = await import('ethers');
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet.signer);
  };

  const mintNFT = async (buildingId, metadataUri, mintPriceEth) => {
    const contract = await getContract();
    if (!contract) throw new Error('No contract');
    const { ethers } = await import('ethers');
    const tx = await contract.mint(buildingId, metadataUri, {
      value: ethers.parseEther(mintPriceEth),
    });
    return await tx.wait();
  };

  const buyNFT = async (tokenId, priceEth) => {
    const contract = await getContract();
    if (!contract) throw new Error('No contract');
    const { ethers } = await import('ethers');
    const tx = await contract.buyNFT(tokenId, { value: ethers.parseEther(priceEth) });
    return await tx.wait();
  };

  const listNFT = async (tokenId, priceEth) => {
    const contract = await getContract();
    if (!contract) throw new Error('No contract');
    const { ethers } = await import('ethers');
    const tx = await contract.listNFT(tokenId, ethers.parseEther(priceEth));
    return await tx.wait();
  };

  return { getContract, mintNFT, buyNFT, listNFT };
}
