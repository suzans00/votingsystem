const hre = require("hardhat");

async function main() {
    console.log("Starting to add candidates...\n");
    
    // 1️⃣ Get the deployed contract
    const Voting = await hre.ethers.getContractFactory("Voting");
    
    // Replace this with your deployed contract address
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const voting = Voting.attach(contractAddress);
    
    console.log("Contract address:", contractAddress);
    
    // 2️⃣ Get the admin signer
    const [adminSigner] = await hre.ethers.getSigners();
    console.log("Admin address:", adminSigner.address);
    
    // 3️⃣ Check current candidates count
    let count = await voting.candidatesCount();
    console.log("Current candidates count:", count.toString());
    
    // 4️⃣ Add candidates with their addresses
    const candidates = [
        { name: "Akhil Krantikari", address: adminSigner.address },
        { name: "ANNFSU", address: adminSigner.address },
        { name: "NSU", address: adminSigner.address },
        { name: "Independent", address: adminSigner.address }
    ];
    
    for (const c of candidates) {
        console.log(`\nAdding candidate: ${c.name}...`);
        console.log(`  Address: ${c.address}`);
        
        const tx = await voting.connect(adminSigner).addCandidate(c.name, c.address);
        const receipt = await tx.wait();
        
        console.log(`  ✅ Transaction hash: ${receipt.hash}`);
        console.log(`  ✅ ${c.name} added successfully!`);
    }
    
    // 5️⃣ Verify candidates count
    count = await voting.candidatesCount();
    console.log("\n📊 Total candidates added:", count.toString());
    
    // 6️⃣ List all candidates
    console.log("\n📋 Candidate List:");
    console.log("==================");
    
    for (let i = 1; i <= count; i++) {
        const c = await voting.candidates(i);
        console.log(`\nCandidate ${i}:`);
        console.log(`  ID: ${c.id.toString()}`);
        console.log(`  Name: ${c.name}`);
        console.log(`  Votes: ${c.voteCount.toString()}`);
        console.log(`  Manifesto: ${c.manifesto || "(not set)"}`);
        console.log(`  Address: ${c.candidateAddress}`);
    }
}

main()
    .then(() => {
        console.log("\n✨ Script completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Error:", error);
        process.exit(1);
    });