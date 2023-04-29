import React, { useState } from "react";

interface SearchProps {}

const Search: React.FC<SearchProps> = () => {
  const [address, setAddress] = useState<string>("");
  const [blockchain, setBlockchain] = useState<string>("ethereum");

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleBlockchainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBlockchain(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(
      `/api/getNFT?walletAddress=${address}&blockchain=${blockchain}`
    );
    const data = await response.json();

    console.log(data);
    // Do something with the NFT metadata returned from the API
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Welcome to my app</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 font-bold mb-2"
          >
            Wallet Address:
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={handleAddressChange}
            className="border-2 border-gray-400 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="blockchain"
            className="block text-gray-700 font-bold mb-2"
          >
            Blockchain:
          </label>
          <select
            id="blockchain"
            value={blockchain}
            onChange={handleBlockchainChange}
            className="border-2 border-gray-400 rounded-md p-2 w-full"
          >
            <option value="ethereum">Ethereum</option>
            <option value="bsc">Binance Smart Chain</option>
            <option value="polygon">Polygon</option>
            {/* add more options for other blockchains */}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Search;
