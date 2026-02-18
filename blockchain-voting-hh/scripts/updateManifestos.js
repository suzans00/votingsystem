// scripts/updateManifestos.js
const hre = require("hardhat");

async function main() {
    console.log("Starting to update manifestos...\n");

    // 1️⃣ Connect to deployed contract
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace if different
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = Voting.attach(contractAddress);

    // 2️⃣ Get admin signer
    const [adminSigner] = await hre.ethers.getSigners();
    console.log("Admin address:", adminSigner.address);

    // 3️⃣ Manifestos for each candidate (only 4 candidates)
    const manifestos = [
        "I will bring transparency and accountability to student governance.",
        "We will improve academic policies and student welfare.",
        "Focus on youth empowerment and skill development.",
        "Independent voice for fair and equal representation."
    ];

    // 4️⃣ Update manifestos for first 4 candidates
    for (let i = 1; i <= manifestos.length; i++) {
        const candidate = await voting.candidates(i);
        console.log(`\nUpdating manifesto for: ${candidate.name}`);

        const tx = await voting.connect(adminSigner).updateManifesto(i, manifestos[i - 1]);
        await tx.wait();

        console.log(`  ✅ Manifesto updated!`);
    }

    // 5️⃣ Verify updates
    console.log("\n📋 Updated Candidate List:");
    for (let i = 1; i <= manifestos.length; i++) {
        const c = await voting.candidates(i);
        console.log(`\n${c.name}:`);
        console.log(`  Manifesto: ${c.manifesto}`);
    }

    console.log("\n✨ Manifesto update script completed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Error:", error);
        process.exit(1);
    });