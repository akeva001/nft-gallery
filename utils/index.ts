import { AnkrProvider, Blockchain } from "@ankr.com/ankr.js";

const provider = new AnkrProvider(" ");

export const getNfts = async (
  address: string,
  token: string,
  network: string
) => {
  let blockchain: Blockchain;

  switch (network) {
    case "eth":
      blockchain = "eth";
      break;
    case "bsc":
      blockchain = "bsc";
      break;
    case "matic":
      blockchain = "polygon";
      break;
    default:
      throw new Error(`Invalid network: ${network}`);
  }

  const { assets, nextPageToken } = await provider.getNFTsByOwner({
    walletAddress: address,
    pageSize: 40,
    pageToken: token,
    blockchain,
  });

  return {
    nfts: assets,
    nextToken: nextPageToken,
  };
};
