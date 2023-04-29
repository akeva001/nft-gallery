/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { useEffect, useState } from "react";
// import { useNfts } from "../hooks";
import { getNfts } from "../utils";
import Card from "../components/Card";
import { Nft } from "@ankr.com/ankr.js/dist/types";

const Home: NextPage = () => {
  const [walletAddress, setWalletAddress] = useState(
    "0xb85D2D0E91D6D1932411ebfb3c151cB62b416e43"
  );
  const [lastToken, setLastToken] = useState("");
  //const { nfts, loading, error } = useNfts(walletAddress);
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);

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
      if (!nextToken) {
        setLoadedAll(true);
        return;
      }
    })();
  }, [walletAddress]);

  const loadMoreNFTs = async () => {
    setLoadingMore(true);
    console.log(lastToken);
    const { nfts, nextToken } = await getNfts(walletAddress, lastToken);
    console.log(nextToken);
    setLastToken(nextToken);
    setNfts((prevNfts) => [...prevNfts, ...nfts]);
    console.log({ nfts });
    setLoadingMore(false);
    if (!nextToken) {
      setLoadedAll(true);
      return;
    }
  };

  const uniqueNfts = new Set(
    nfts
      .filter((nft) => nft.imageUrl && nft.imageUrl.startsWith("http"))
      .map((nft) => ({ ...nft, key: `${nft.contractAddress}/${nft.tokenId}` }))
      .filter(
        (nft, index, self) => index === self.findIndex((t) => t.key === nft.key)
      )
  );

  return (
    <div
      className=" bg-black p-10 flex flex-col items-center
    z-0"
    >
      <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-500">
        NFT Gallery
      </h1>

      <div className="flex md:flex-left flex-col mt-4">
        <input
          id="wallet-address"
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="rounded p-1 w-[90vw] md:w-[425px] border bg-black text-blue-500 text-decoration-none pl-2 md:mx-0"
          placeholder="Enter a wallet address here to view NFTs"
          spellCheck="false"
        />
      </div>

      {loading && (
        <div className="flex flex-col p-5 items-center text-center">
          <p className="text-zinc-700">Loading...</p>
        </div>
      )}

      <div className="grid grid-cols-1 mt-8 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[...uniqueNfts].map((nft) => (
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
        ))}

        {/* {error && (
          <div className="flex flex-col items-center mt-8">
            <p className="text-red-700">
              Error: {JSON.stringify(error, null, 2)}
            </p>
          </div>
        )} */}
      </div>
      {nfts.length > 0 && !loadedAll && (
        <button
          className="bg-[#06c] text-stone-100 p-2 mt-5 rounded-sm hover:[#06c]/80 transition-all transition-300 transition-linear"
          onClick={() => loadMoreNFTs()}
          disabled={loadingMore}
        >
          {!loadingMore ? "Load More" : "Loading..."}
        </button>
      )}
    </div>
  );
};

export default Home;
