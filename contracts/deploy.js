const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ChainMind contracts...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  
  // Deploy ChainMindToken (treasury, owner)
  const Token = await hre.ethers.getContractFactory("ChainMindToken");
  const token = await Token.deploy(deployer.address, deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ ChainMindToken deployed to:", tokenAddress);

  // Deploy AIOracle
  const Oracle = await hre.ethers.getContractFactory("AIOracle");
  const oracle = await Oracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("✅ AIOracle deployed to:", oracleAddress);

  // Deploy ChainMindDAO
  const DAO = await hre.ethers.getContractFactory("ChainMindDAO");
  const dao = await DAO.deploy(tokenAddress, oracleAddress);
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  console.log("✅ ChainMindDAO deployed to:", daoAddress);

  // Deploy ChainMindStaking
  const Staking = await hre.ethers.getContractFactory("ChainMindStaking");
  const staking = await Staking.deploy(tokenAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("✅ ChainMindStaking deployed to:", stakingAddress);

  // Setup initial configuration
  console.log("\n📝 Setting up initial configuration...");
  
  // Update staking contract in token
  await token.updateStakingContract(stakingAddress);
  console.log("✅ Staking contract set in token");

  // Set Oracle in DAO
  await dao.setOracle(oracleAddress);
  console.log("✅ Oracle set in DAO");

  // Save addresses to file
  const fs = require('fs');
  const addresses = {
    ChainMindToken: tokenAddress,
    AIOracle: oracleAddress,
    ChainMindDAO: daoAddress,
    ChainMindStaking: stakingAddress,
    network: "localhost",
    deployer: deployer.address
  };

  fs.writeFileSync(
    './deployed-addresses.json',
    JSON.stringify(addresses, null, 2)
  );

  console.log("\n🎉 Deployment complete! Addresses saved to deployed-addresses.json");
  console.log("\nContract Addresses:");
  console.log("==================");
  console.log(`ChainMindToken: ${tokenAddress}`);
  console.log(`AIOracle: ${oracleAddress}`);
  console.log(`ChainMindDAO: ${daoAddress}`);
  console.log(`ChainMindStaking: ${stakingAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
