import { AnkrProvider } from "@ankr.com/ankr.js";

const provider = new AnkrProvider(" ");

export const getNfts = async (address: string, token: string) => {
  const { assets, nextPageToken } = await provider.getNFTsByOwner({
    walletAddress: address,
    pageSize: 50,
    pageToken: token,
  });
  return {
    nfts: assets,
    nextToken: nextPageToken,
  };
};
