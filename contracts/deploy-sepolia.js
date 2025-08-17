const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying to Sepolia Testnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.1")) {
    throw new Error("❌ Need at least 0.1 ETH for deployment");
  }
  
  // Deploy contracts
  const Token = await ethers.getContractFactory("ChainMindToken");
  const token = await Token.deploy(deployer.address, deployer.address);
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  
  const Oracle = await ethers.getContractFactory("AIOracle");
  const oracle = await Oracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddr = await oracle.getAddress();
  
  const DAO = await ethers.getContractFactory("ChainMindDAO");
  const dao = await DAO.deploy(tokenAddr, oracleAddr);
  await dao.waitForDeployment();
  const daoAddr = await dao.getAddress();
  
  const Staking = await ethers.getContractFactory("ChainMindStaking");
  const staking = await Staking.deploy(tokenAddr);
  await staking.waitForDeployment();
  const stakingAddr = await staking.getAddress();
  
  console.log("\n✅ SEPOLIA DEPLOYMENT COMPLETE!");
  console.log("Token:", tokenAddr);
  console.log("DAO:", daoAddr);
  console.log("Oracle:", oracleAddr);
  console.log("Staking:", stakingAddr);
  
  // Save for frontend
  const addresses = {
    chainId: 11155111,
    contracts: {
      ChainMindToken: tokenAddr,
      ChainMindDAO: daoAddr,
      AIOracle: oracleAddr,
      ChainMindStaking: stakingAddr
    }
  };
  
  require('fs').writeFileSync('../frontend/src/contracts.json', JSON.stringify(addresses, null, 2));
  console.log("📄 Addresses saved for frontend");
}

main().catch(console.error);