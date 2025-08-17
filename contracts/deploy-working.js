const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ChainMind Enterprise DAO...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Deploy Token
  console.log("📄 Deploying ChainMind Token...");
  const ChainMindToken = await ethers.getContractFactory("ChainMindToken");
  const token = await ChainMindToken.deploy(deployer.address, deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ Token deployed:", tokenAddress);
  
  // Deploy AI Oracle
  console.log("🧠 Deploying AI Oracle...");
  const AIOracle = await ethers.getContractFactory("AIOracle");
  const aiOracle = await AIOracle.deploy();
  await aiOracle.waitForDeployment();
  const oracleAddress = await aiOracle.getAddress();
  console.log("✅ Oracle deployed:", oracleAddress);
  
  // Deploy DAO
  console.log("🏛️ Deploying DAO...");
  const ChainMindDAO = await ethers.getContractFactory("ChainMindDAO");
  const dao = await ChainMindDAO.deploy(tokenAddress, oracleAddress);
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  console.log("✅ DAO deployed:", daoAddress);
  
  // Deploy Staking
  console.log("💎 Deploying Staking...");
  const ChainMindStaking = await ethers.getContractFactory("ChainMindStaking");
  const staking = await ChainMindStaking.deploy(tokenAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("✅ Staking deployed:", stakingAddress);
  
  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("Token:", tokenAddress);
  console.log("DAO:", daoAddress);
  console.log("Oracle:", oracleAddress);
  console.log("Staking:", stakingAddress);
  
  // Save addresses
  const addresses = {
    chainId: 31337,
    contracts: {
      ChainMindToken: tokenAddress,
      ChainMindDAO: daoAddress,
      AIOracle: oracleAddress,
      ChainMindStaking: stakingAddress
    }
  };
  
  const fs = require('fs');
  fs.writeFileSync('../frontend/src/contracts.json', JSON.stringify(addresses, null, 2));
  console.log("📄 Addresses saved to contracts.json");
}

main().catch(console.error);