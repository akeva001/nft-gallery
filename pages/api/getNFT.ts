import { NextApiRequest, NextApiResponse } from "next";

type NFT = {
  id: number;
  name: string;
  imageUrl: string;
  blockchain: string;
  contractAddress: string;
  tokenId: string;
};

type WalletNFTs = {
  walletAddress: string;
  nfts: NFT[];
};

type BlockchainUrls = {
  [key: string]: string;
  ethereum: string;
  bsc: string;
  polygon: string;
};

const blockchainUrls: BlockchainUrls = {
  ethereum: "https://etherscan.io/address",
  bsc: "https://bscscan.com/address",
  polygon: "https://polygonscan.com/address",
};

function getBlockchainUrl(blockchain: string): string {
  return blockchainUrls[blockchain];
}

function fetchNFTs(walletAddress: string, blockchain: string): Promise<NFT[]> {
  // TODO: Implement fetching NFTs for a given wallet address and blockchain.
  // You can use a library like web3.js or ethers.js to interact with the blockchain.
  // This function should return a Promise that resolves to an array of NFT objects.
  return Promise.resolve([]);
}

const API_URLS = {
  ethereum: "https://api.opensea.io/api/v1/assets",
  bsc: "https://api.covalenthq.com/v1/56/address/{address}/balances_v2/",
  polygon: "https://api.covalenthq.com/v1/137/address/{address}/balances_v2/",
};

const fetchEthereumNFTs = async (walletAddress: string): Promise<NFT[]> => {
  try {
    const response = await fetch(`${API_URLS.ethereum}?owner=${walletAddress}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch Ethereum NFTs");
    }

    const nfts = data.assets.map((asset: any) => ({
      id: asset.id,
      name: asset.name,
      imageUrl: asset.image_url,
      blockchain: "Ethereum",
      contractAddress: asset.asset_contract.address,
      tokenId: asset.token_id,
    }));

    return nfts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WalletNFTs | { message: string }>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { walletAddress, blockchain } = req.query;
  if (!walletAddress || !blockchain) {
    res.status(400).json({
      message: "Bad Request: walletAddress and blockchain are required",
    });
    return;
  }

  try {
    const nfts = await fetchNFTs(walletAddress as string, blockchain as string);
    const blockchainUrl = getBlockchainUrl(blockchain as string);
    const nftsWithUrl = nfts.map((nft) => ({
      ...nft,
      imageUrl: `https://ipfs.infura.io/ipfs/${nft.imageUrl}`,
      blockchainUrl: `${blockchainUrl}/${nft.contractAddress}`,
    }));

    res.status(200).json({
      walletAddress: walletAddress as string,
      nfts: nftsWithUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
