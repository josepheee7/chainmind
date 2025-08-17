const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying ChainMind contracts...");

  try {
    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    // Deploy ChainMindToken
    console.log("Deploying ChainMindToken...");
    const Token = await hre.ethers.getContractFactory("ChainMindToken");
    const token = await Token.deploy(deployer.address, deployer.address);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("✅ ChainMindToken deployed to:", tokenAddress);

    // Deploy AIOracle
    console.log("Deploying AIOracle...");
    const Oracle = await hre.ethers.getContractFactory("AIOracle");
    const oracle = await Oracle.deploy();
    await oracle.waitForDeployment();
    const oracleAddress = await oracle.getAddress();
    console.log("✅ AIOracle deployed to:", oracleAddress);

    // Deploy ChainMindDAO
    console.log("Deploying ChainMindDAO...");
    const DAO = await hre.ethers.getContractFactory("ChainMindDAO");
    const dao = await DAO.deploy(tokenAddress, oracleAddress);
    await dao.waitForDeployment();
    const daoAddress = await dao.getAddress();
    console.log("✅ ChainMindDAO deployed to:", daoAddress);

    // Deploy ChainMindStaking
    console.log("Deploying ChainMindStaking...");
    const Staking = await hre.ethers.getContractFactory("ChainMindStaking");
    const staking = await Staking.deploy(tokenAddress);
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();
    console.log("✅ ChainMindStaking deployed to:", stakingAddress);

    // Save addresses
    const addresses = {
      ChainMindToken: tokenAddress,
      AIOracle: oracleAddress,
      ChainMindDAO: daoAddress,
      ChainMindStaking: stakingAddress,
      network: "localhost",
      deployer: deployer.address,
      rpcUrl: "http://127.0.0.1:8545"
    };

    fs.writeFileSync('./deployed-addresses.json', JSON.stringify(addresses, null, 2));
    
    // Also save to frontend
    const frontendPath = '../frontend/src/contracts.json';
    fs.writeFileSync(frontendPath, JSON.stringify(addresses, null, 2));

    console.log("\n🎉 All contracts deployed successfully!");
    console.log("Contract Addresses:");
    console.log("==================");
    console.log(`ChainMindToken: ${tokenAddress}`);
    console.log(`AIOracle: ${oracleAddress}`);
    console.log(`ChainMindDAO: ${daoAddress}`);
    console.log(`ChainMindStaking: ${stakingAddress}`);
    console.log("\nAddresses saved to deployed-addresses.json and frontend/src/contracts.json");

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
