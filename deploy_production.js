const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 DEPLOYING CHAINMIND TO PRODUCTION (SEPOLIA TESTNET) 🚀");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy ChainMindToken first
  console.log("\n📦 Deploying ChainMindToken...");
  const ChainMindToken = await ethers.getContractFactory("ChainMindToken");
  const token = await ChainMindToken.deploy();
  await token.deployed();
  console.log("✅ ChainMindToken deployed to:", token.address);

  // Deploy AIOracle
  console.log("\n🤖 Deploying AIOracle...");
  const AIOracle = await ethers.getContractFactory("AIOracle");
  const oracle = await AIOracle.deploy();
  await oracle.deployed();
  console.log("✅ AIOracle deployed to:", oracle.address);

  // Deploy ChainMindDAO with token and oracle addresses
  console.log("\n🏛️ Deploying ChainMindDAO...");
  const ChainMindDAO = await ethers.getContractFactory("ChainMindDAO");
  const dao = await ChainMindDAO.deploy(token.address, oracle.address);
  await dao.deployed();
  console.log("✅ ChainMindDAO deployed to:", dao.address);

  // Set up permissions
  console.log("\n🔐 Setting up permissions...");
  await token.transferOwnership(dao.address);
  console.log("✅ Token ownership transferred to DAO");

  // Initialize with some test data
  console.log("\n🎯 Initializing with test data...");
  
  // Create some initial proposals
  const proposal1 = await dao.createProposal(
    "Implement AI-Powered Governance Predictions",
    "Integrate machine learning models to predict proposal outcomes and provide governance insights. This will revolutionize how DAOs make decisions by providing data-driven predictions with 87%+ accuracy."
  );
  await proposal1.wait();
  console.log("✅ Created proposal 1");

  const proposal2 = await dao.createProposal(
    "Upgrade Treasury Management System",
    "Enhance the treasury management system with advanced analytics, risk assessment tools, and real-time monitoring capabilities. This will provide better financial oversight and decision-making."
  );
  await proposal2.wait();
  console.log("✅ Created proposal 2");

  const proposal3 = await dao.createProposal(
    "Community Governance Framework",
    "Establish a comprehensive framework for community-driven governance decisions with transparent voting mechanisms and reputation systems."
  );
  await proposal3.wait();
  console.log("✅ Created proposal 3");

  // Mint some tokens for testing
  await token.mint(deployer.address, ethers.utils.parseEther("10000"));
  console.log("✅ Minted 10,000 MIND tokens for testing");

  // Cast some votes
  await dao.castVote(1, true, "Strong support for AI integration");
  await dao.castVote(2, true, "Treasury upgrades are essential");
  await dao.castVote(3, false, "Need more details on framework");
  console.log("✅ Cast initial votes");

  console.log("\n🎉 DEPLOYMENT COMPLETE! 🎉");
  console.log("\n📋 CONTRACT ADDRESSES:");
  console.log("ChainMindToken:", token.address);
  console.log("AIOracle:", oracle.address);
  console.log("ChainMindDAO:", dao.address);
  
  console.log("\n🔗 UPDATE YOUR FRONTEND CONFIG:");
  console.log("Replace the contract addresses in frontend/src/contexts/Web3Context.tsx with:");
  console.log(`ChainMindToken: '${token.address}'`);
  console.log(`AIOracle: '${oracle.address}'`);
  console.log(`ChainMindDAO: '${dao.address}'`);
  
  console.log("\n🌐 Your ChainMind app is now LIVE on Sepolia testnet!");
  console.log("Visit: https://sepolia.etherscan.io/address/" + dao.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
