const hre = require("hardhat");

async function main() {
    // Deploy Voting contract
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.waitForDeployment?.(); // works in ethers v6
    console.log("Voting contract deployed to:", voting.target || voting.address);

    // Get some test accounts
    const accounts = await hre.ethers.getSigners();

    // Vote for candidates
    console.log("Voting...");
    await voting.connect(accounts[0]).vote(1);
    await voting.connect(accounts[1]).vote(2);

    // Read results
    const candidate1 = await voting.candidates(1);
    const candidate2 = await voting.candidates(2);

    console.log();
    console.log();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
