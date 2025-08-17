// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./AIOracle.sol";

/**
 * @title ChainMindDAO
 * @dev AI-Powered Predictive Governance DAO
 * @notice First DAO to use AI predictions for governance decisions
 */
contract ChainMindDAO is Ownable, ReentrancyGuard {
    // State variables
    IERC20 public governanceToken;
    AIOracle public aiOracle;
    
    uint256 public proposalCounter;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 1000 * 10**18; // 1000 tokens
    uint256 public constant QUORUM_PERCENTAGE = 20; // 20% of total supply
    
    // Structs
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        bool canceled;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) votes;
        // AI Prediction data
        uint8 aiSuccessProbability;
        int16 aiEconomicImpact;
        uint8 aiRiskScore;
        bool aiAnalysisComplete;
    }
    
    struct ProposalInfo {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        bool canceled;
        uint8 aiSuccessProbability;
        int16 aiEconomicImpact;
        uint8 aiRiskScore;
        bool aiAnalysisComplete;
    }
    
    // Mappings
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public memberReputation;
    mapping(address => uint256) public totalVotes;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        string description
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    
    event AIPredictionReceived(
        uint256 indexed proposalId,
        uint8 successProbability,
        int16 economicImpact,
        uint8 riskScore
    );
    
    // Modifiers
    modifier onlyMember() {
        require(
            governanceToken.balanceOf(msg.sender) >= MIN_PROPOSAL_THRESHOLD,
            "Insufficient tokens to participate"
        );
        _;
    }
    
    modifier proposalExists(uint256 proposalId) {
        require(proposalId <= proposalCounter, "Proposal does not exist");
        _;
    }
    
    modifier votingActive(uint256 proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(
            block.timestamp >= proposal.startTime &&
            block.timestamp <= proposal.endTime,
            "Voting period not active"
        );
        require(!proposal.executed && !proposal.canceled, "Proposal not active");
        _;
    }
    
    // Constructor
    constructor(address _governanceToken, address _aiOracle) {
        governanceToken = IERC20(_governanceToken);
        aiOracle = AIOracle(_aiOracle);
    }
    
    /**
     * @dev Create a new governance proposal
     * @param title The proposal title
     * @param description The proposal description
     */
    function createProposal(
        string memory title,
        string memory description
    ) external payable onlyMember returns (uint256) {
        proposalCounter++;
        
        Proposal storage newProposal = proposals[proposalCounter];
        newProposal.id = proposalCounter;
        newProposal.proposer = msg.sender;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + VOTING_PERIOD;
        
        // Request AI analysis (forward the sent ETH to pay the oracle fee)
        aiOracle.requestPrediction{value: msg.value}(proposalCounter, title, description);
        
        emit ProposalCreated(proposalCounter, msg.sender, title, description);
        
        return proposalCounter;
    }
    
    /**
     * @dev Cast vote on a proposal
     * @param proposalId The proposal ID
     * @param support True for support, false for against
     */
    function castVote(
        uint256 proposalId,
        bool support
    ) external proposalExists(proposalId) votingActive(proposalId) onlyMember {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        uint256 voterWeight = getVotingWeight(msg.sender);
        
        proposal.hasVoted[msg.sender] = true;
        proposal.votes[msg.sender] = voterWeight;
        
        if (support) {
            proposal.votesFor += voterWeight;
        } else {
            proposal.votesAgainst += voterWeight;
        }
        
        // Update member reputation based on AI prediction alignment
        updateMemberReputation(msg.sender, proposalId, support);
        
        emit VoteCast(proposalId, msg.sender, support, voterWeight);
    }
    
    /**
     * @dev Execute a proposal if it passes
     * @param proposalId The proposal ID
     */
    function executeProposal(uint256 proposalId) 
        external 
        proposalExists(proposalId) 
        nonReentrant 
    {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.endTime, "Voting still active");
        require(!proposal.executed && !proposal.canceled, "Proposal not executable");
        
        uint256 voteTotal = proposal.votesFor + proposal.votesAgainst;
        uint256 quorum = (governanceToken.totalSupply() * QUORUM_PERCENTAGE) / 100;
        
        require(voteTotal >= quorum, "Quorum not reached");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");
        
        proposal.executed = true;
        
        // Update reputation for voters based on AI prediction accuracy
        updateVoterReputations(proposalId, true);
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Receive AI prediction from oracle
     * @param proposalId The proposal ID
     * @param successProbability AI predicted success probability (0-100)
     * @param economicImpact AI predicted economic impact
     * @param riskScore AI predicted risk score (0-100)
     */
    function receiveAIPrediction(
        uint256 proposalId,
        uint8 successProbability,
        int16 economicImpact,
        uint8 riskScore
    ) external {
        require(msg.sender == address(aiOracle), "Only AI Oracle can call this");
        
        Proposal storage proposal = proposals[proposalId];
        proposal.aiSuccessProbability = successProbability;
        proposal.aiEconomicImpact = economicImpact;
        proposal.aiRiskScore = riskScore;
        proposal.aiAnalysisComplete = true;
        
        emit AIPredictionReceived(proposalId, successProbability, economicImpact, riskScore);
    }
    
    /**
     * @dev Get voting weight for an address
     * @param voter The voter address
     * @return The voting weight
     */
    function getVotingWeight(address voter) public view returns (uint256) {
        uint256 tokenBalance = governanceToken.balanceOf(voter);
        uint256 reputation = memberReputation[voter];
        
        // Base weight from token balance
        uint256 baseWeight = tokenBalance;
        
        // Reputation multiplier (1.0x to 1.5x based on reputation)
        uint256 reputationBonus = (reputation * baseWeight) / 1000; // Max 50% bonus
        
        return baseWeight + reputationBonus;
    }
    
    /**
     * @dev Get proposal information
     * @param proposalId The proposal ID
     * @return ProposalInfo struct with all proposal data
     */
    function getProposal(uint256 proposalId) 
        external 
        view 
        proposalExists(proposalId) 
        returns (ProposalInfo memory) 
    {
        Proposal storage proposal = proposals[proposalId];
        
        return ProposalInfo({
            id: proposal.id,
            proposer: proposal.proposer,
            title: proposal.title,
            description: proposal.description,
            startTime: proposal.startTime,
            endTime: proposal.endTime,
            votesFor: proposal.votesFor,
            votesAgainst: proposal.votesAgainst,
            executed: proposal.executed,
            canceled: proposal.canceled,
            aiSuccessProbability: proposal.aiSuccessProbability,
            aiEconomicImpact: proposal.aiEconomicImpact,
            aiRiskScore: proposal.aiRiskScore,
            aiAnalysisComplete: proposal.aiAnalysisComplete
        });
    }
    
    /**
     * @dev Get AI prediction for a proposal
     * @param proposalId The proposal ID
     * @return successProbability, economicImpact, riskScore, analysisComplete
     */
    function getAIPrediction(uint256 proposalId) 
        external 
        view 
        proposalExists(proposalId)
        returns (uint8, int16, uint8, bool) 
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.aiSuccessProbability,
            proposal.aiEconomicImpact,
            proposal.aiRiskScore,
            proposal.aiAnalysisComplete
        );
    }
    
    /**
     * @dev Update member reputation based on voting alignment with AI
     * @param member The member address
     * @param proposalId The proposal ID
     * @param vote The vote cast (true = for, false = against)
     */
    function updateMemberReputation(
        address member,
        uint256 proposalId,
        bool vote
    ) internal {
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.aiAnalysisComplete) {
            // Reward alignment with AI prediction
            bool aiRecommendation = proposal.aiSuccessProbability > 50;
            
            if (vote == aiRecommendation) {
                // Increase reputation for following AI recommendation
                memberReputation[member] += 10;
            } else {
                // Small penalty for going against AI (encourage informed dissent)
                if (memberReputation[member] >= 5) {
                    memberReputation[member] -= 5;
                }
            }
        }
    }
    
    /**
     * @dev Update voter reputations after proposal execution
     * @param proposalId The proposal ID
     * @param successful Whether the proposal was successful
     */
    function updateVoterReputations(uint256 proposalId, bool successful) internal {
        // This would be implemented to track long-term accuracy
        // For hackathon, we'll keep it simple
    }
    
    /**
     * @dev Check if address has voted on proposal
     * @param proposalId The proposal ID
     * @param voter The voter address
     * @return Whether the voter has voted
     */
    function hasVoted(uint256 proposalId, address voter) 
        external 
        view 
        proposalExists(proposalId) 
        returns (bool) 
    {
        return proposals[proposalId].hasVoted[voter];
    }
    
    /**
     * @dev Get total number of proposals
     * @return The total number of proposals
     */
    function getProposalCount() external view returns (uint256) {
        return proposalCounter;
    }
    
    /**
     * @dev Emergency function to cancel a proposal
     * @param proposalId The proposal ID
     */
    function cancelProposal(uint256 proposalId) 
        external 
        onlyOwner 
        proposalExists(proposalId) 
    {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Cannot cancel executed proposal");
        
        proposal.canceled = true;
        emit ProposalCanceled(proposalId);
    }
    
    /**
     * @dev Update AI Oracle address
     * @param newOracle The new oracle address
     */
    function updateAIOracle(address newOracle) external onlyOwner {
        aiOracle = AIOracle(newOracle);
    }
}
