const { ethers, network } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ChainMind contracts to", network.name);
  console.log("==========================================");

  // Get the ContractFactory and Signers here
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", balance.toString());

  // Deploy ChainMind Token first
  console.log("\n1️⃣ Deploying ChainMind Token (MIND)...");
  const ChainMindToken = await ethers.getContractFactory("ChainMindToken");
  const chainMindToken = await ChainMindToken.deploy(
    deployer.address, // DAO Treasury (initially deployer)
    deployer.address  // Initial owner
  );
  await chainMindToken.waitForDeployment();
  const chainMindTokenAddress = (chainMindToken.getAddress ? await chainMindToken.getAddress() : chainMindToken.address);
  console.log("✅ ChainMindToken deployed to:", chainMindTokenAddress);

  // Deploy AI Oracle
  console.log("\n2️⃣ Deploying AI Oracle...");
  const AIOracle = await ethers.getContractFactory("AIOracle");
  const aiOracle = await AIOracle.deploy();
  await aiOracle.waitForDeployment();
  const aiOracleAddress = (aiOracle.getAddress ? await aiOracle.getAddress() : aiOracle.address);
  console.log("✅ AIOracle deployed to:", aiOracleAddress);

  // Deploy ChainMind DAO
  console.log("\n3️⃣ Deploying ChainMind DAO...");
  const ChainMindDAO = await ethers.getContractFactory("ChainMindDAO");
  const chainMindDAO = await ChainMindDAO.deploy(
    chainMindTokenAddress,
    aiOracleAddress
  );
  await chainMindDAO.waitForDeployment();
  const chainMindDAOAddress = (chainMindDAO.getAddress ? await chainMindDAO.getAddress() : chainMindDAO.address);
  console.log("✅ ChainMindDAO deployed to:", chainMindDAOAddress);

  // Update token contract to recognize DAO
  console.log("\n4️⃣ Configuring contracts...");
  await chainMindToken.updateTreasury(chainMindDAOAddress);
  console.log("✅ Updated token treasury to DAO address");

  // Authorize AI Oracle
  if (aiOracle.setOracleAuthorization) {
    await aiOracle.setOracleAuthorization(deployer.address, true);
  }
  console.log("✅ Authorized deployer as AI Oracle");

  // Distribute some tokens for testing
  if (network.name !== "mainnet") {
    console.log("\n5️⃣ Distributing test tokens...");
    const testAmount = (ethers.parseEther ? ethers.parseEther("10000") : ethers.utils.parseEther("10000")); // 10,000 MIND tokens
    await chainMindToken.distributeTokens(deployer.address, testAmount);
    console.log("✅ Distributed test tokens");
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("==========================================");
  console.log("📋 Contract Addresses:");
  console.log("ChainMindToken:", chainMindTokenAddress);
  console.log("AIOracle:", aiOracleAddress);
  console.log("ChainMindDAO:", chainMindDAOAddress);
  console.log("==========================================");

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ChainMindToken: chainMindTokenAddress,
      AIOracle: aiOracleAddress,
      ChainMindDAO: chainMindDAOAddress,
    },
    transactionHashes: {}
  };

  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Wait for confirmations on testnets/mainnet
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n⏳ Waiting for confirmations...");
    if (chainMindToken.deploymentTransaction) {
      await chainMindToken.deploymentTransaction().wait(5);
    }
    if (aiOracle.deploymentTransaction) {
      await aiOracle.deploymentTransaction().wait(5);
    }
    if (chainMindDAO.deploymentTransaction) {
      await chainMindDAO.deploymentTransaction().wait(5);
    }
    console.log("✅ Confirmations received");

    // Verify contracts on Etherscan (if API key is available)
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("\n🔍 Verifying contracts on Etherscan...");
      
      try {
        await hre.run("verify:verify", {
          address: chainMindToken.address,
          constructorArguments: [deployer.address, deployer.address],
        });
        console.log("✅ ChainMindToken verified");
      } catch (error) {
        console.log("❌ ChainMindToken verification failed:", error.message);
      }

      try {
        await hre.run("verify:verify", {
          address: aiOracle.address,
          constructorArguments: [],
        });
        console.log("✅ AIOracle verified");
      } catch (error) {
        console.log("❌ AIOracle verification failed:", error.message);
      }

      try {
        await hre.run("verify:verify", {
          address: chainMindDAO.address,
          constructorArguments: [chainMindToken.address, aiOracle.address],
        });
        console.log("✅ ChainMindDAO verified");
      } catch (error) {
        console.log("❌ ChainMindDAO verification failed:", error.message);
      }
    }
  }

  console.log("\n🚀 ChainMind is ready for the hackathon demo! 🚀");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Deployment failed:");
    console.error(error);
    process.exit(1);
  });
