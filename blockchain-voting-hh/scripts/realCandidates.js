const hre = require("hardhat");

async function main() {
  // 1️⃣ Connect to your deployed Voting contract
  const voting = await hre.ethers.getContractAt(
    "Voting", // Contract name from contracts/Voting.sol
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C" // Replace with your deployed address
  );

  // 2️⃣ Read admin address
  const admin = await voting.admin();
  console.log("Admin:", admin);

  // 3️⃣ Read total candidates
  const countBN = await voting.candidatesCount();
  const count = countBN.toNumber();
  console.log("Candidates count:", count);

  // 4️⃣ Loop through all candidates and print info
  for (let i = 1; i <= count; i++) {
    const c = await voting.getCandidate(i);
    console.log(`ID: ${c.id}, Name: ${c.name}, Votes: ${c.voteCount}`);
    console.log(`Manifesto: ${c.manifesto}`);
    console.log(`Login Address: ${c.candidateAddress}`);
    console.log("----------------------");
  }
}

// Catch errors
main().catch((err) => {
  console.error(err);
  process.exit(1);
});