const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ChainMind to Sepolia...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  // Deploy Token
  console.log("📄 Deploying ChainMind Token...");
  const ChainMindToken = await ethers.getContractFactory("ChainMindToken");
  const token = await ChainMindToken.deploy(
    deployer.address, // DAO treasury
    deployer.address  // Initial owner
  );
  await token.waitForDeployment();
  console.log("✅ ChainMind Token deployed to:", await token.getAddress());
  
  // Deploy AI Oracle
  console.log("🧠 Deploying AI Oracle...");
  const AIOracle = await ethers.getContractFactory("AIOracle");
  const aiOracle = await AIOracle.deploy();
  await aiOracle.deployed();
  console.log("✅ AI Oracle deployed to:", aiOracle.address);
  
  // Deploy DAO
  console.log("🏛️ Deploying ChainMind DAO...");
  const ChainMindDAO = await ethers.getContractFactory("ChainMindDAO");
  const dao = await ChainMindDAO.deploy(token.address, aiOracle.address);
  await dao.deployed();
  console.log("✅ ChainMind DAO deployed to:", dao.address);
  
  // Deploy Staking
  console.log("💎 Deploying Staking Contract...");
  const ChainMindStaking = await ethers.getContractFactory("ChainMindStaking");
  const staking = await ChainMindStaking.deploy(token.address, dao.address);
  await staking.deployed();
  console.log("✅ Staking Contract deployed to:", staking.address);
  
  console.log("\n🎉 Deployment Complete!");
  console.log("======================");
  console.log("Token:", token.address);
  console.log("DAO:", dao.address);
  console.log("AI Oracle:", aiOracle.address);
  console.log("Staking:", staking.address);
  
  // Save addresses
  const addresses = {
    chainId: 11155111,
    contracts: {
      ChainMindToken: token.address,
      ChainMindDAO: dao.address,
      AIOracle: aiOracle.address,
      ChainMindStaking: staking.address
    }
  };
  
  const fs = require('fs');
  fs.writeFileSync('../frontend/src/contracts.json', JSON.stringify(addresses, null, 2));
  console.log("📄 Contract addresses saved to frontend/src/contracts.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });