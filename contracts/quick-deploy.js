const hre = require("hardhat");

async function main() {
  console.log("Starting ChainMind deployment...");
  
  try {
    // Get deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    // Deploy ChainMindToken
    console.log("\nDeploying ChainMindToken...");
    const Token = await hre.ethers.getContractFactory("ChainMindToken");
    const token = await Token.deploy(deployer.address, deployer.address);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("ChainMindToken deployed to:", tokenAddress);
    
    // Deploy AIOracle
    console.log("\nDeploying AIOracle...");
    const Oracle = await hre.ethers.getContractFactory("AIOracle");
    const oracle = await Oracle.deploy();
    await oracle.waitForDeployment();
    const oracleAddress = await oracle.getAddress();
    console.log("AIOracle deployed to:", oracleAddress);
    
    // Deploy ChainMindDAO
    console.log("\nDeploying ChainMindDAO...");
    const DAO = await hre.ethers.getContractFactory("ChainMindDAO");
    const dao = await DAO.deploy(tokenAddress, oracleAddress);
    await dao.waitForDeployment();
    const daoAddress = await dao.getAddress();
    console.log("ChainMindDAO deployed to:", daoAddress);
    
    // Deploy ChainMindStaking
    console.log("\nDeploying ChainMindStaking...");
    const Staking = await hre.ethers.getContractFactory("ChainMindStaking");
    const staking = await Staking.deploy(tokenAddress);
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();
    console.log("ChainMindStaking deployed to:", stakingAddress);
    
    // Save addresses
    const addresses = {
      ChainMindToken: tokenAddress,
      AIOracle: oracleAddress,
      ChainMindDAO: daoAddress,
      ChainMindStaking: stakingAddress
    };
    
    const fs = require('fs');
    fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
    
    console.log("\n✅ Deployment complete!");
    console.log("Addresses saved to deployed-addresses.json");
    
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
