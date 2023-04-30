/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { useEffect, useState } from "react";
// import { useNfts } from "../hooks";
import { getNfts } from "../utils";
import Card from "../components/Card";
import { Nft } from "@ankr.com/ankr.js/dist/types";

const Home: NextPage = () => {
  const [walletAddress, setWalletAddress] = useState(
    "0x5139d44fcAF91a3B0c609E4eAF00E2E69cb4A4A6"
  );
  const [network, setNetwork] = useState("eth");
  const [lastToken, setLastToken] = useState("");
  //const { nfts, loading, error } = useNfts(walletAddress);
  const [nftsList, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);
  const [noNFTs, setNoNFTs] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
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
    const { nfts, nextToken } = await getNfts(walletAddress, "", network);
    setLastToken(nextToken);
    console.log(nextToken);

    console.log({ nfts });
    setNfts(nfts);

    setLoading(false);

    if (nfts.length == 0) {
      setNoNFTs(true);
    }

    if (!nextToken) {
      setLoadedAll(true);
      return;
    }
  };

  const loadMoreNFTs = async () => {
    setLoadingMore(true);
    console.log("lasttoken");
    console.log(lastToken);
    const { nfts, nextToken } = await getNfts(
      walletAddress,
      lastToken,
      network
    );
    console.log("nexttoken");
    console.log(nextToken);
    setLastToken(nextToken);
    setNfts((prevNfts) => [...prevNfts, ...nfts]);
    console.log({ nfts });
    setLoadingMore(false);
    if (!nextToken || nextToken === lastToken) {
      setLoadedAll(true);
      return;
    }
  };

  const resetStates = async () => {
    setNfts([]);
    setLastToken("");
    setNoNFTs(false);
    setLoadedAll(false);
  };

  return (
    <div
      className=" bg-black p-10 flex flex-col items-center
    z-0"
    >
      <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-500">
        NFT Gallery
      </h1>

      <div className="flex md:flex-left flex-col mt-4 md:w-[425px]">
        <input
          id="wallet-address"
          type="text"
          value={walletAddress}
          onChange={(e) => {
            setWalletAddress(e.target.value);
            resetStates();
          }}
          className="rounded p-1 w-[90vw] md:w-full border bg-black text-blue-500 text-decoration-none pl-2 md:mx-0 hover:border-blue-500"
          placeholder="Enter a wallet address here to view NFTs"
          spellCheck="false"
        />
        <div className="flex md:flex-left flex-row mt-4 space-x-4">
          <select
            id="network"
            value={network}
            onChange={(e) => {
              setNetwork(e.target.value);
              resetStates();
            }}
            className="rounded p-1 w-[50%] border bg-black text-blue-500 text-decoration-none px-2 md:mx-0"
          >
            <option value="eth">Ethereum</option>
            <option value="bsc">Binance Smart Chain</option>
            <option value="matic">Polygon</option>
          </select>
          <style jsx>{`
            select::-ms-expand {
              display: none;
            }

            select {
              background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6"><path fill="none" stroke="%233B82F6" stroke-width="2" d="M1 1l4 4 4-4"/></svg>');
              background-position: right 0.75rem center;
              background-repeat: no-repeat;
              background-size: 10px 6px;
              border-radius: 0.25rem;
              border: 1px solid #d2d6dc;
              color: #3b82f6;
              font-size: 1rem;
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
            }

            input,
            select:hover {
              border-color: #3b82f6;
            }

            select:focus {
              border-color: #4a5568;
              box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
              outline: none;
            }

            select:disabled {
              opacity: 0.5;
            }

            select::-ms-value {
              color: #374151;
              background-color: #f7fafc;
            }

            select::-moz-focus-inner {
              border-style: none;
            }
          `}</style>

          <button
            className="rounded p-1 w-[50%] border bg-blue-500 text-black text-decoration-none px-2 r-4 md:mx-0 hover:border-blue-500"
            onClick={() => {
              loadNFTs();
            }}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-8 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {nftsList
          .filter((nft) => nft.imageUrl && nft.imageUrl.startsWith("http"))
          .map((nft) => (
            <a target="_blank" href={nft.imageUrl} rel="noreferrer">
              <div
                key={`${nft.contractAddress}/${nft.tokenId}`}
                className="flex flex-col rounded border p-4 hover:border-blue-500"
              >
                <Card
                  name={nft.name}
                  imageSlug={nft.imageUrl}
                  blockchain={nft.blockchain}
                  collection={nft.collectionName}
                />
              </div>
            </a>
          ))}
      </div>

      {nftsList.length > 0 && !loadedAll && (
        <button
          className="bg-[#06c] text-stone-100 p-2 mt-5 rounded-sm hover:[#06c]/80 transition-all transition-300 transition-linear"
          onClick={() => loadMoreNFTs()}
          disabled={loadingMore}
        >
          {!loadingMore ? "Load More" : "Loading..."}
        </button>
      )}

      {noNFTs && <p className="text-blue-500">This address has no NFT's</p>}
    </div>
  );
};

export default Home;
