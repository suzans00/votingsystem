require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.21" }, // Voting.sol
      { version: "0.8.28" }, // Lock.sol
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    },
  },
};