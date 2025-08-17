const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 DEPLOYING CHAINMIND TO PRODUCTION (SEPOLIA TESTNET) 🚀");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy ChainMindToken first
  console.log("\n📦 Deploying ChainMindToken...");
  const ChainMindToken = await ethers.getContractFactory("ChainMindToken");
  const token = await ChainMindToken.deploy(deployer.address, deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ ChainMindToken deployed to:", tokenAddress);

  // Deploy AIOracle
  console.log("\n🤖 Deploying AIOracle...");
  const AIOracle = await ethers.getContractFactory("AIOracle");
  const oracle = await AIOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("✅ AIOracle deployed to:", oracleAddress);

  // Deploy ChainMindDAO with token and oracle addresses
  console.log("\n🏛️ Deploying ChainMindDAO...");
  const ChainMindDAO = await ethers.getContractFactory("ChainMindDAO");
  const dao = await ChainMindDAO.deploy(tokenAddress, oracleAddress);
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  console.log("✅ ChainMindDAO deployed to:", daoAddress);

  // Deploy ChainMindStaking
  console.log("\n🔒 Deploying ChainMindStaking...");
  const ChainMindStaking = await ethers.getContractFactory("ChainMindStaking");
  const staking = await ChainMindStaking.deploy(tokenAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("✅ ChainMindStaking deployed to:", stakingAddress);

  // Set up permissions
  console.log("\n🔐 Setting up permissions...");
  await token.transferOwnership(daoAddress);
  console.log("✅ Token ownership transferred to DAO");

  // Initialize with some test data
  console.log("\n🎯 Contracts deployed successfully!");
  console.log("✅ Ready for production use!");

  console.log("\n🎉 DEPLOYMENT COMPLETE! 🎉");
  console.log("\n📋 CONTRACT ADDRESSES:");
  console.log("ChainMindToken:", tokenAddress);
  console.log("AIOracle:", oracleAddress);
  console.log("ChainMindDAO:", daoAddress);
  console.log("ChainMindStaking:", stakingAddress);
  
  console.log("\n🔗 UPDATE YOUR FRONTEND CONFIG:");
  console.log("Replace the contract addresses in frontend/src/contexts/Web3Context.tsx with:");
  console.log(`ChainMindToken: '${tokenAddress}'`);
  console.log(`AIOracle: '${oracleAddress}'`);
  console.log(`ChainMindDAO: '${daoAddress}'`);
  
  console.log("\n🌐 Your ChainMind app is now LIVE on Sepolia testnet!");
  console.log("Visit: https://sepolia.etherscan.io/address/" + daoAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
