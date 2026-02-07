const hre = require("hardhat");

async function main() {
  // Replace with your deployed contract address
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.attach(contractAddress);

  const [voter] = await hre.ethers.getSigners();

  console.log("Voting contract at:", voting.address);

  // Show current candidates and votes
  const candidate1 = await voting.candidates(1);
  const candidate2 = await voting.candidates(2);
  console.log("Before voting:");
  console.log(candidate1.name, "Votes:", candidate1.voteCount.toString());
  console.log(candidate2.name, "Votes:", candidate2.voteCount.toString());

  // Vote for Alice (candidate 1)
  const tx = await voting.connect(voter).vote(1);
  await tx.wait();

  // Show votes after voting
  const updatedCandidate1 = await voting.candidates(1);
  const updatedCandidate2 = await voting.candidates(2);
  console.log("After voting:");
  console.log(updatedCandidate1.name, "Votes:", updatedCandidate1.voteCount.toString());
  console.log(updatedCandidate2.name, "Votes:", updatedCandidate2.voteCount.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
