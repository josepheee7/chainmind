const { ethers, network } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Enhanced ChainMind DAO System to", network.name);
  console.log("===============================================");

  // Get the signers
  const [deployer, signer1, signer2, signer3, signer4] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // 1. Deploy ChainMind Token
  console.log("\n1️⃣ Deploying ChainMind Token (MIND)...");
  const ChainMindToken = await ethers.getContractFactory("ChainMindToken");
  const chainMindToken = await ChainMindToken.deploy(
    deployer.address, // DAO Treasury (initially deployer)
    deployer.address  // Initial owner
  );
  await chainMindToken.waitForDeployment();
  const chainMindTokenAddress = await chainMindToken.getAddress();
  console.log("✅ ChainMindToken deployed to:", chainMindTokenAddress);

  // 2. Deploy AI Oracle
  console.log("\n2️⃣ Deploying AI Oracle...");
  const AIOracle = await ethers.getContractFactory("AIOracle");
  const aiOracle = await AIOracle.deploy();
  await aiOracle.waitForDeployment();
  const aiOracleAddress = await aiOracle.getAddress();
  console.log("✅ AIOracle deployed to:", aiOracleAddress);

  // 3. Deploy Governance Staking
  console.log("\n3️⃣ Deploying Governance Staking...");
  const GovernanceStaking = await ethers.getContractFactory("GovernanceStaking");
  const governanceStaking = await GovernanceStaking.deploy(chainMindTokenAddress);
  await governanceStaking.waitForDeployment();
  const governanceStakingAddress = await governanceStaking.getAddress();
  console.log("✅ GovernanceStaking deployed to:", governanceStakingAddress);

  // 4. Deploy Treasury MultiSig
  console.log("\n4️⃣ Deploying Treasury MultiSig...");
  const TreasuryMultiSig = await ethers.getContractFactory("TreasuryMultiSig");
  const treasurySigners = [deployer.address, signer1.address, signer2.address, signer3.address, signer4.address];
  const signerRoles = ["Lead", "Technical", "Finance", "Community", "Operations"];
  const treasuryMultiSig = await TreasuryMultiSig.deploy(
    treasurySigners,
    signerRoles,
    3, // Require 3 of 5 signatures
    ethers.parseEther("100000") // 100k MIND daily limit
  );
  await treasuryMultiSig.waitForDeployment();
  const treasuryMultiSigAddress = await treasuryMultiSig.getAddress();
  console.log("✅ TreasuryMultiSig deployed to:", treasuryMultiSigAddress);

  // 5. Deploy Grant Funding System
  console.log("\n5️⃣ Deploying Grant Funding System...");
  const GrantFundingSystem = await ethers.getContractFactory("GrantFundingSystem");
  const grantFundingSystem = await GrantFundingSystem.deploy();
  await grantFundingSystem.waitForDeployment();
  const grantFundingSystemAddress = await grantFundingSystem.getAddress();
  console.log("✅ GrantFundingSystem deployed to:", grantFundingSystemAddress);

  // 6. Deploy Enhanced DAO
  console.log("\n6️⃣ Deploying Enhanced ChainMind DAO...");
  const EnhancedChainMindDAO = await ethers.getContractFactory("EnhancedChainMindDAO");
  const enhancedDAO = await EnhancedChainMindDAO.deploy(
    chainMindTokenAddress,
    aiOracleAddress,
    governanceStakingAddress
  );
  await enhancedDAO.waitForDeployment();
  const enhancedDAOAddress = await enhancedDAO.getAddress();
  console.log("✅ EnhancedChainMindDAO deployed to:", enhancedDAOAddress);

  // 7. Configure contracts
  console.log("\n7️⃣ Configuring contract relationships...");
  
  // Update token treasury to DAO
  await chainMindToken.updateTreasury(enhancedDAOAddress);
  console.log("✅ Updated token treasury to Enhanced DAO address");

  // Update staking contract in token
  await chainMindToken.updateStakingContract(governanceStakingAddress);
  console.log("✅ Updated staking contract in token");

  // Set treasury multisig in DAO
  await enhancedDAO.setTreasuryMultiSig(treasuryMultiSigAddress);
  console.log("✅ Set treasury multisig in DAO");

  // Set emergency manager
  await enhancedDAO.setEmergencyManager(deployer.address);
  console.log("✅ Set emergency manager");

  // Authorize AI Oracle
  await aiOracle.setOracleAuthorization(deployer.address, true);
  console.log("✅ Authorized deployer as AI Oracle");

  // Transfer ownership of grant system to DAO
  await grantFundingSystem.transferOwnership(enhancedDAOAddress);
  console.log("✅ Transferred grant system ownership to DAO");

  // 8. Setup initial governance staking pools and experts
  console.log("\n8️⃣ Setting up governance features...");
  
  // Verify some expert delegates
  await governanceStaking.verifyExpert(signer1.address, "DeFi & Protocol Development");
  await governanceStaking.verifyExpert(signer2.address, "Tokenomics & Economics");
  await governanceStaking.verifyExpert(signer3.address, "Community & Growth");
  console.log("✅ Verified expert delegates");

  // Add emergency signers
  await treasuryMultiSig.addEmergencySigner(deployer.address);
  await treasuryMultiSig.addEmergencySigner(signer1.address);
  console.log("✅ Added emergency signers");

  // 9. Initial token distribution and staking setup
  console.log("\n9️⃣ Initial token distribution...");
  
  // Distribute test tokens
  const distributionAmount = ethers.parseEther("500000"); // 500k tokens each
  const stakingAmount = ethers.parseEther("10000"); // 10k for staking
  
  for (let i = 0; i < 5; i++) {
    const signer = [deployer, signer1, signer2, signer3, signer4][i];
    await chainMindToken.distributeTokens(signer.address, distributionAmount);
    console.log(`✅ Distributed 500k tokens to ${signer.address}`);
    
    // Some signers stake for governance power
    if (i > 0) {
      // Approve staking contract
      await chainMindToken.connect(signer).approve(governanceStakingAddress, stakingAmount);
      // Stake with different lock periods
      const lockPeriod = i - 1; // 0=1month, 1=3months, 2=6months, 3=1year
      await governanceStaking.connect(signer).stakeForGovernance(stakingAmount, lockPeriod);
      console.log(`✅ ${signer.address} staked 10k tokens with lock period ${lockPeriod}`);
    }
  }

  // 10. Fund treasury multisig
  console.log("\n🔟 Funding treasury...");
  const treasuryFunding = ethers.parseEther("10"); // 10 ETH
  await deployer.sendTransaction({
    to: treasuryMultiSigAddress,
    value: treasuryFunding
  });
  console.log("✅ Funded treasury with 10 ETH");

  // 11. Create initial test proposals
  console.log("\n1️⃣1️⃣ Creating test proposals...");
  
  const oracleFee = ethers.parseEther("0.001");
  
  // Funding proposal
  await enhancedDAO.createProposal(
    "DeFi Integration Research Grant",
    "Fund research into cross-chain DeFi protocols for enhanced treasury management",
    0, // FUNDING category
    ethers.ZeroAddress,
    0,
    "0x",
    ethers.parseEther("50000"), // 50k tokens requested
    signer2.address, // recipient
    { value: oracleFee }
  );
  console.log("✅ Created funding proposal");

  // Parameter change proposal
  await enhancedDAO.connect(signer1).createProposal(
    "Increase Governance Staking Multipliers",
    "Proposal to increase voting power multipliers for longer staking periods to encourage commitment",
    1, // PARAMETER category
    governanceStakingAddress,
    0,
    "0x",
    0,
    ethers.ZeroAddress,
    { value: oracleFee }
  );
  console.log("✅ Created parameter proposal");

  // Treasury proposal
  await enhancedDAO.connect(signer2).createProposal(
    "Treasury Diversification Strategy",
    "Diversify 30% of treasury into yield-generating DeFi protocols",
    2, // TREASURY category
    treasuryMultiSigAddress,
    0,
    "0x",
    ethers.parseEther("1000000"), // 1M tokens for diversification
    treasuryMultiSigAddress,
    { value: oracleFee }
  );
  console.log("✅ Created treasury proposal");

  // 12. Deploy summary
  console.log("\n🎉 Enhanced ChainMind DAO Deployment Complete!");
  console.log("=============================================");
  
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ChainMindToken: chainMindTokenAddress,
      AIOracle: aiOracleAddress,
      GovernanceStaking: governanceStakingAddress,
      TreasuryMultiSig: treasuryMultiSigAddress,
      GrantFundingSystem: grantFundingSystemAddress,
      EnhancedChainMindDAO: enhancedDAOAddress
    },
    features: {
      governanceStaking: "Enhanced voting power through time-locked staking",
      voteDelegation: "Delegate voting power to verified experts",
      treasuryMultiSig: "3-of-5 multi-signature treasury security",
      proposalCategories: "FUNDING, PARAMETER, TREASURY, EMERGENCY, CONSTITUTIONAL",
      timelockExecution: "Configurable delays for different proposal types",
      grantSystem: "Milestone-based funding with community review",
      aiIntegration: "AI predictions for all governance decisions",
      expertVerification: "Verified expert delegate system",
      emergencyMode: "Fast-track critical proposals",
      reputationSystem: "Community reputation tracking"
    },
    governance: {
      stakingMultipliers: {
        "1 month": "1.2x voting power",
        "3 months": "1.5x voting power", 
        "6 months": "1.8x voting power",
        "1 year": "2.5x voting power"
      },
      proposalThresholds: {
        "PARAMETER": "1,000 MIND tokens",
        "FUNDING": "5,000 MIND tokens",
        "TREASURY": "25,000 MIND tokens", 
        "EMERGENCY": "10,000 MIND tokens",
        "CONSTITUTIONAL": "50,000 MIND tokens"
      },
      experts: [
        `${signer1.address} - DeFi & Protocol Development`,
        `${signer2.address} - Tokenomics & Economics`,
        `${signer3.address} - Community & Growth`
      ]
    },
    initialData: {
      totalProposals: 3,
      totalStakers: 4,
      treasuryBalance: "10 ETH",
      tokenDistribution: "500k MIND per test account"
    }
  };

  console.log("\n📊 Contract Addresses:");
  Object.entries(deploymentInfo.contracts).forEach(([name, address]) => {
    console.log(`${name}: ${address}`);
  });

  console.log("\n🚀 Enhanced Features Deployed:");
  Object.entries(deploymentInfo.features).forEach(([name, description]) => {
    console.log(`✅ ${name}: ${description}`);
  });

  console.log("\n📈 Governance Configuration:");
  console.log("Staking Multipliers:", deploymentInfo.governance.stakingMultipliers);
  console.log("Proposal Thresholds:", deploymentInfo.governance.proposalThresholds);

  console.log("\n👥 Expert Delegates:");
  deploymentInfo.governance.experts.forEach(expert => console.log(`✅ ${expert}`));

  console.log("\n📄 Deployment saved to enhanced-deployment.json");
  
  // Save deployment info
  const fs = require('fs');
  fs.writeFileSync('enhanced-deployment.json', JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎯 READY FOR VITALIK DEMO! 🎯");
  console.log("The most advanced AI-powered governance DAO is deployed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
