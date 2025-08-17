const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Creating test proposals for ChainMind DAO");
  console.log("==========================================");

  // Get contract addresses from the latest deployment
  const daoAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";
  const tokenAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

  // Get signers
  const [deployer, voter1, voter2, voter3] = await ethers.getSigners();
  console.log("📝 Creating proposals with account:", deployer.address);

  // Connect to contracts
  const ChainMindDAO = await ethers.getContractFactory("ChainMindDAO");
  const dao = ChainMindDAO.attach(daoAddress);

  const ChainMindToken = await ethers.getContractFactory("ChainMindToken");
  const token = ChainMindToken.attach(tokenAddress);

  // Check deployer's token balance first
  const deployerBalance = await token.balanceOf(deployer.address);
  const minThreshold = await dao.MIN_PROPOSAL_THRESHOLD();
  
  console.log(`💰 Deployer token balance: ${ethers.formatEther(deployerBalance)} MIND`);
  console.log(`📏 Min proposal threshold: ${ethers.formatEther(minThreshold)} MIND`);
  
  if (deployerBalance < minThreshold) {
    console.log("❌ Insufficient tokens! Distributing tokens to deployer...");
    const distributeTx = await token.distributeTokens(deployer.address, ethers.parseEther("10000"));
    await distributeTx.wait();
    console.log("✅ Distributed 10,000 MIND tokens to deployer");
  }

  // Also distribute tokens to other voters
  console.log("🪙 Distributing tokens to other voters...");
  for (let i = 1; i <= 3; i++) {
    const voter = [voter1, voter2, voter3][i-1];
    const voterBalance = await token.balanceOf(voter.address);
    if (voterBalance < minThreshold) {
      const distributeTx = await token.distributeTokens(voter.address, ethers.parseEther("5000"));
      await distributeTx.wait();
      console.log(`✅ Distributed 5,000 MIND tokens to voter ${i} (${voter.address})`);
    }
  }

  // Test proposals data
  const proposals = [
    {
      title: "Implement AI-Powered Risk Assessment",
      description: "Deploy advanced machine learning models to automatically assess proposal risks and provide governance insights. This would include sentiment analysis, economic impact modeling, and predictive voting patterns."
    },
    {
      title: "Establish Treasury Diversification Strategy",
      description: "Allocate 30% of treasury funds into DeFi protocols for yield generation while maintaining 70% in stable assets. Include yield farming, liquidity provision, and strategic partnerships."
    },
    {
      title: "Launch Community Education Program",
      description: "Create a comprehensive educational initiative to onboard new DAO members, including workshops, documentation, and mentorship programs. Budget: 50,000 MIND tokens."
    },
    {
      title: "Upgrade Smart Contract Infrastructure",
      description: "Implement modular contract architecture with proxy patterns for upgradability, gas optimization, and enhanced security features. Include comprehensive testing and audit requirements."
    },
    {
      title: "Integrate Cross-Chain Governance",
      description: "Enable multi-chain governance across Ethereum, Polygon, and Arbitrum networks. Implement bridge mechanisms and cross-chain vote aggregation for unified decision making."
    }
  ];

  console.log(`📊 Creating ${proposals.length} test proposals...`);

  // Create proposals
  for (let i = 0; i < proposals.length; i++) {
    try {
      console.log(`\n${i + 1}️⃣ Creating proposal: "${proposals[i].title}"`);
      
      // Send ETH fee for AI Oracle prediction (0.001 ETH)
      const oracleFee = ethers.parseEther("0.001");
      const tx = await dao.connect(deployer).createProposal(
        proposals[i].title,
        proposals[i].description,
        { value: oracleFee }
      );
      
      await tx.wait();
      console.log(`✅ Proposal ${i + 1} created successfully`);
      
      // Add some votes for realism
      if (i < 3) {
        console.log(`🗳️ Adding votes to proposal ${i + 1}...`);
        
        try {
          // Deployer votes in favor
          const voteDeployer = await dao.connect(deployer).castVote(i + 1, true);
          await voteDeployer.wait();
          console.log(`✅ Deployer voted in favor`);
          
          // Other voters
          if (i === 0) {
            // Proposal 1: Mixed votes
            const voteVoter1 = await dao.connect(voter1).castVote(i + 1, true);
            await voteVoter1.wait();
            const voteVoter2 = await dao.connect(voter2).castVote(i + 1, false);
            await voteVoter2.wait();
            console.log(`✅ Added mixed votes`);
          } else if (i === 1) {
            // Proposal 2: Mostly in favor
            const voteVoter1 = await dao.connect(voter1).castVote(i + 1, true);
            await voteVoter1.wait();
            const voteVoter2 = await dao.connect(voter2).castVote(i + 1, true);
            await voteVoter2.wait();
            console.log(`✅ Added favorable votes`);
          }
        } catch (voteError) {
          console.log(`⚠️ Voting failed for proposal ${i + 1}:`, voteError.message);
        }
      }
      
    } catch (error) {
      console.error(`❌ Failed to create proposal ${i + 1}:`, error.message);
    }
  }

  // Get final stats
  try {
    const proposalCount = await dao.getProposalCount();
    console.log(`\n🎉 Test setup completed!`);
    console.log(`📊 Total proposals created: ${proposalCount}`);
    
    const treasuryBalance = await ethers.provider.getBalance(daoAddress);
    console.log(`💰 Treasury balance: ${ethers.formatEther(treasuryBalance)} ETH`);
    
  } catch (error) {
    console.error("❌ Failed to get final stats:", error.message);
  }

  console.log("\n🚀 ChainMind DAO is ready with test data! 🚀");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
