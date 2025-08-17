const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Production deployment configuration
const DEPLOYMENT_CONFIG = {
  network: "sepolia",
  gasPrice: ethers.utils.parseUnits("20", "gwei"),
  gasLimit: 8000000,
  confirmations: 2,
  
  // Initial parameters
  initialSupply: ethers.utils.parseEther("1000000000"), // 1B tokens
  treasuryAllocation: ethers.utils.parseEther("300000000"), // 30%
  teamAllocation: ethers.utils.parseEther("200000000"), // 20%
  
  // Governance parameters
  votingPeriod: 7 * 24 * 60 * 60, // 7 days
  proposalThreshold: ethers.utils.parseEther("1000"), // 1000 tokens
  quorumPercentage: 20, // 20%
  
  // Staking parameters
  stakingPools: [
    { name: "Governance", apy: 1500, lockPeriod: 30 * 24 * 60 * 60 }, // 15% APY, 30 days
    { name: "AI Prediction", apy: 1870, lockPeriod: 90 * 24 * 60 * 60 }, // 18.7% APY, 90 days
    { name: "Long-term", apy: 2500, lockPeriod: 365 * 24 * 60 * 60 } // 25% APY, 1 year
  ]
};

async function main() {
  console.log("🚀 Starting ChainMind Production Deployment");
  console.log("==========================================");
  
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log(`📡 Network: ${network.name} (${network.chainId})`);
  console.log(`👤 Deployer: ${deployer.address}`);
  
  const balance = await deployer.getBalance();
  console.log(`💰 Balance: ${ethers.utils.formatEther(balance)} ETH`);
  
  if (balance.lt(ethers.utils.parseEther("0.1"))) {
    throw new Error("❌ Insufficient ETH balance for deployment");
  }
  
  const deploymentResults = {};
  const gasUsed = {};
  
  try {
    // 1. Deploy ChainMind Token
    console.log("\n📄 Deploying ChainMind Token...");
    const ChainMindToken = await ethers.getContractFactory("ChainMindToken");
    const token = await ChainMindToken.deploy(
      deployer.address, // Initial DAO treasury (will be updated)
      deployer.address, // Initial owner
      {
        gasPrice: DEPLOYMENT_CONFIG.gasPrice,
        gasLimit: DEPLOYMENT_CONFIG.gasLimit
      }
    );
    
    await token.deployed();
    await token.deployTransaction.wait(DEPLOYMENT_CONFIG.confirmations);
    
    deploymentResults.token = token.address;
    gasUsed.token = (await token.deployTransaction.wait()).gasUsed;
    
    console.log(`✅ ChainMind Token deployed: ${token.address}`);
    console.log(`⛽ Gas used: ${gasUsed.token.toString()}`);
    
    // 2. Deploy AI Oracle
    console.log("\n🧠 Deploying AI Oracle...");
    const AIOracle = await ethers.getContractFactory("AIOracle");
    const aiOracle = await AIOracle.deploy({
      gasPrice: DEPLOYMENT_CONFIG.gasPrice,
      gasLimit: DEPLOYMENT_CONFIG.gasLimit
    });
    
    await aiOracle.deployed();
    await aiOracle.deployTransaction.wait(DEPLOYMENT_CONFIG.confirmations);
    
    deploymentResults.aiOracle = aiOracle.address;
    gasUsed.aiOracle = (await aiOracle.deployTransaction.wait()).gasUsed;
    
    console.log(`✅ AI Oracle deployed: ${aiOracle.address}`);
    console.log(`⛽ Gas used: ${gasUsed.aiOracle.toString()}`);
    
    // 3. Deploy ChainMind DAO
    console.log("\n🏛️ Deploying ChainMind DAO...");
    const ChainMindDAO = await ethers.getContractFactory("ChainMindDAO");
    const dao = await ChainMindDAO.deploy(
      token.address,
      aiOracle.address,
      {
        gasPrice: DEPLOYMENT_CONFIG.gasPrice,
        gasLimit: DEPLOYMENT_CONFIG.gasLimit
      }
    );
    
    await dao.deployed();
    await dao.deployTransaction.wait(DEPLOYMENT_CONFIG.confirmations);
    
    deploymentResults.dao = dao.address;
    gasUsed.dao = (await dao.deployTransaction.wait()).gasUsed;
    
    console.log(`✅ ChainMind DAO deployed: ${dao.address}`);
    console.log(`⛽ Gas used: ${gasUsed.dao.toString()}`);
    
    // 4. Deploy Staking Contract
    console.log("\n💎 Deploying Staking Contract...");
    const ChainMindStaking = await ethers.getContractFactory("ChainMindStaking");
    const staking = await ChainMindStaking.deploy(
      token.address,
      dao.address,
      {
        gasPrice: DEPLOYMENT_CONFIG.gasPrice,
        gasLimit: DEPLOYMENT_CONFIG.gasLimit
      }
    );
    
    await staking.deployed();
    await staking.deployTransaction.wait(DEPLOYMENT_CONFIG.confirmations);
    
    deploymentResults.staking = staking.address;
    gasUsed.staking = (await staking.deployTransaction.wait()).gasUsed;
    
    console.log(`✅ Staking Contract deployed: ${staking.address}`);
    console.log(`⛽ Gas used: ${gasUsed.staking.toString()}`);
    
    // 5. Configure contracts
    console.log("\n⚙️ Configuring contracts...");
    
    // Update token's DAO treasury address
    console.log("📝 Updating DAO treasury address...");
    const updateTreasuryTx = await token.updateTreasury(dao.address, {
      gasPrice: DEPLOYMENT_CONFIG.gasPrice
    });
    await updateTreasuryTx.wait(DEPLOYMENT_CONFIG.confirmations);
    console.log("✅ DAO treasury updated");
    
    // Update token's staking contract address
    console.log("📝 Updating staking contract address...");
    const updateStakingTx = await token.updateStakingContract(staking.address, {
      gasPrice: DEPLOYMENT_CONFIG.gasPrice
    });
    await updateStakingTx.wait(DEPLOYMENT_CONFIG.confirmations);
    console.log("✅ Staking contract updated");
    
    // Set AI Oracle owner to DAO
    console.log("📝 Transferring AI Oracle ownership to DAO...");
    const transferOracleTx = await aiOracle.transferOwnership(dao.address, {
      gasPrice: DEPLOYMENT_CONFIG.gasPrice
    });
    await transferOracleTx.wait(DEPLOYMENT_CONFIG.confirmations);
    console.log("✅ AI Oracle ownership transferred");
    
    // 6. Initial token distribution
    console.log("\n💰 Performing initial token distribution...");
    
    // Distribute tokens to DAO treasury (already done in constructor)
    const daoBalance = await token.balanceOf(dao.address);
    console.log(`✅ DAO Treasury balance: ${ethers.utils.formatEther(daoBalance)} MIND`);
    
    // Distribute some tokens for testing
    const testAmount = ethers.utils.parseEther("10000"); // 10k tokens for testing
    const distributeTx = await token.distributeTokens(deployer.address, testAmount, {
      gasPrice: DEPLOYMENT_CONFIG.gasPrice
    });
    await distributeTx.wait(DEPLOYMENT_CONFIG.confirmations);
    console.log(`✅ Distributed ${ethers.utils.formatEther(testAmount)} MIND to deployer for testing`);
    
    // 7. Verify deployment
    console.log("\n🔍 Verifying deployment...");
    
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const totalSupply = await token.totalSupply();
    const proposalCount = await dao.getProposalCount();
    
    console.log(`📄 Token: ${tokenName} (${tokenSymbol})`);
    console.log(`📊 Total Supply: ${ethers.utils.formatEther(totalSupply)} MIND`);
    console.log(`🏛️ DAO Proposals: ${proposalCount.toString()}`);
    
    // 8. Calculate total gas used
    const totalGasUsed = Object.values(gasUsed).reduce((sum, gas) => sum.add(gas), ethers.BigNumber.from(0));
    const totalCost = totalGasUsed.mul(DEPLOYMENT_CONFIG.gasPrice);
    
    console.log("\n💸 Deployment Summary:");
    console.log(`⛽ Total Gas Used: ${totalGasUsed.toString()}`);
    console.log(`💰 Total Cost: ${ethers.utils.formatEther(totalCost)} ETH`);
    
    // 9. Save deployment addresses
    const deploymentData = {
      network: network.name,
      chainId: network.chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: deploymentResults,
      gasUsed: Object.fromEntries(
        Object.entries(gasUsed).map(([key, value]) => [key, value.toString()])
      ),
      totalGasUsed: totalGasUsed.toString(),
      totalCost: ethers.utils.formatEther(totalCost),
      configuration: DEPLOYMENT_CONFIG
    };
    
    // Save to multiple formats
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    // Save detailed deployment info
    const deploymentFile = path.join(deploymentsDir, `${network.name}-deployment.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));
    
    // Save addresses for frontend
    const addressesFile = path.join(__dirname, "..", "..", "frontend", "src", "contracts.json");
    const frontendAddresses = {
      chainId: network.chainId,
      contracts: {
        ChainMindToken: deploymentResults.token,
        ChainMindDAO: deploymentResults.dao,
        AIOracle: deploymentResults.aiOracle,
        ChainMindStaking: deploymentResults.staking
      }
    };
    fs.writeFileSync(addressesFile, JSON.stringify(frontendAddresses, null, 2));
    
    // Update .env file
    const envFile = path.join(__dirname, "..", "..", ".env");
    let envContent = fs.readFileSync(envFile, "utf8");
    
    envContent = envContent.replace(
      /REACT_APP_CHAINMIND_DAO_ADDRESS=.*/,
      `REACT_APP_CHAINMIND_DAO_ADDRESS=${deploymentResults.dao}`
    );
    envContent = envContent.replace(
      /REACT_APP_CHAINMIND_TOKEN_ADDRESS=.*/,
      `REACT_APP_CHAINMIND_TOKEN_ADDRESS=${deploymentResults.token}`
    );
    envContent = envContent.replace(
      /REACT_APP_AI_ORACLE_ADDRESS=.*/,
      `REACT_APP_AI_ORACLE_ADDRESS=${deploymentResults.aiOracle}`
    );
    
    fs.writeFileSync(envFile, envContent);
    
    console.log("\n📁 Files saved:");
    console.log(`📄 Deployment details: ${deploymentFile}`);
    console.log(`📄 Frontend addresses: ${addressesFile}`);
    console.log(`📄 Environment updated: ${envFile}`);
    
    console.log("\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=====================================");
    console.log("\n📋 Contract Addresses:");
    console.log(`🪙 ChainMind Token: ${deploymentResults.token}`);
    console.log(`🏛️ ChainMind DAO: ${deploymentResults.dao}`);
    console.log(`🧠 AI Oracle: ${deploymentResults.aiOracle}`);
    console.log(`💎 Staking Contract: ${deploymentResults.staking}`);
    
    console.log("\n🔗 Etherscan Links:");
    const etherscanBase = network.chainId === 11155111 ? "https://sepolia.etherscan.io" : "https://etherscan.io";
    console.log(`🪙 Token: ${etherscanBase}/address/${deploymentResults.token}`);
    console.log(`🏛️ DAO: ${etherscanBase}/address/${deploymentResults.dao}`);
    console.log(`🧠 Oracle: ${etherscanBase}/address/${deploymentResults.aiOracle}`);
    console.log(`💎 Staking: ${etherscanBase}/address/${deploymentResults.staking}`);
    
    console.log("\n🚀 Next Steps:");
    console.log("1. Verify contracts on Etherscan");
    console.log("2. Start the AI backend service");
    console.log("3. Launch the frontend application");
    console.log("4. Create initial governance proposals");
    console.log("5. Set up monitoring and analytics");
    
    return deploymentResults;
    
  } catch (error) {
    console.error("\n❌ DEPLOYMENT FAILED!");
    console.error("=====================");
    console.error(error);
    
    // Save error log
    const errorLog = {
      timestamp: new Date().toISOString(),
      network: network.name,
      deployer: deployer.address,
      error: error.message,
      stack: error.stack,
      deploymentResults
    };
    
    const errorFile = path.join(__dirname, "..", "deployments", `${network.name}-error.json`);
    fs.writeFileSync(errorFile, JSON.stringify(errorLog, null, 2));
    console.error(`📄 Error log saved: ${errorFile}`);
    
    throw error;
  }
}

// Verification function
async function verifyContracts(addresses) {
  console.log("\n🔍 Verifying contracts on Etherscan...");
  
  try {
    // Note: This requires hardhat-etherscan plugin and ETHERSCAN_API_KEY
    const { run } = require("hardhat");
    
    for (const [name, address] of Object.entries(addresses)) {
      console.log(`📝 Verifying ${name} at ${address}...`);
      
      try {
        await run("verify:verify", {
          address: address,
          constructorArguments: [], // Add constructor args if needed
        });
        console.log(`✅ ${name} verified`);
      } catch (error) {
        console.log(`⚠️ ${name} verification failed: ${error.message}`);
      }
    }
  } catch (error) {
    console.log(`⚠️ Verification setup failed: ${error.message}`);
  }
}

// Run deployment
if (require.main === module) {
  main()
    .then((addresses) => {
      console.log("\n🎯 Deployment completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = { main, verifyContracts, DEPLOYMENT_CONFIG };