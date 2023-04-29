/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { useEffect, useState } from "react";
// import { useNfts } from "../hooks";
import { getNfts } from "../utils";
import Card from "../components/Card";
import { Nft } from "@ankr.com/ankr.js/dist/types";

const Home: NextPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [lastToken, setLastToken] = useState("");
  //const { nfts, loading, error } = useNfts(walletAddress);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      console.log("ADDRESS");
      console.log(walletAddress.length);
      setLoading(true);
      if (
        walletAddress.length == 0 ||
        walletAddress.length % 2 !== 0 ||
        walletAddress.length < 30
      ) {
        console.log("RETURN");
        setLoading(false);
        return;
      }
      const { nfts, nextToken } = await getNfts(walletAddress, "");
      setLastToken(nextToken);
      console.log(nextToken);

      console.log({ nfts });
      setNfts(nfts);
      setLoading(false);
    })();
  }, [walletAddress]);

  const loadMoreNFTs = async () => {
    console.log(lastToken);
    const { nfts, nextToken } = await getNfts(walletAddress, lastToken);
    setLastToken(nextToken);
    setNfts((prevNfts) => [...prevNfts, ...nfts]);
    console.log({ nfts });
  };

  return (
    <div className="p-10 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-400">
        NFT Gallery
      </h1>
      {/* <h3 className="text-zinc-700">
        Powered by{" "}
        <a
          href="https://www.ankr.com/advanced-api/"
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer underline"
        >
          Ankr Advanced APIs
        </a>
      </h3> */}

      <div className="flex-left flex-col mt-4">
        <label
          className="text-zinc-700 text-1xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400"
          htmlFor="wallet-address"
        >
          &nbsp; Wallet address: &nbsp;
        </label>
        <input
          id="wallet-address"
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="rounded p-1 w-[425px] border text-black"
          placeholder="Enter a wallet address here to view NFTs"
        />
      </div>

      {loading && (
        <div className="flex flex-col p-4 items-center text-center">
          <p className="text-zinc-700">Loading...</p>
        </div>
      )}

      <div className="grid grid-cols-4 mt-8 gap-4">
        {nfts
          .filter((nft) => nft.imageUrl)
          .map((nft) => {
            return (
              <div
                key={`${nft.contractAddress}/${nft.tokenId}`}
                className="flex flex-col rounded border p-4"
              >
                <Card
                  name={nft.name}
                  imageSlug={nft.imageUrl}
                  blockchain={nft.blockchain}
                  collection={nft.collectionName}
                />
              </div>
            );
          })}

        {/* {error && (
          <div className="flex flex-col items-center mt-8">
            <p className="text-red-700">
              Error: {JSON.stringify(error, null, 2)}
            </p>
          </div>
        )} */}
      </div>
      <button
        className="bg-[#06d6a0] text-stone-100 p-2 rounded-sm hover:bg-green-500 transition-all transition-300 transition-linear "
        onClick={() => loadMoreNFTs()}
      >
        Load More NFT's
      </button>
    </div>
  );
};

export default Home;
