// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title EnterpriseDAO
 * @dev Production-grade DAO with real-world governance features
 */
contract EnterpriseDAO is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");
    
    IERC20 public immutable governanceToken;
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        bytes callData;
        address target;
        uint256 value;
        uint256 startTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votesAbstain;
        bool executed;
        bool canceled;
        ProposalType proposalType;
        uint256 quorumRequired;
    }
    
    enum ProposalType {
        STANDARD,
        TREASURY,
        CONSTITUTIONAL,
        EMERGENCY
    }
    
    enum VoteType {
        FOR,
        AGAINST,
        ABSTAIN
    }
    
    struct Vote {
        VoteType vote;
        uint256 weight;
        string reason;
    }
    
    // State variables
    uint256 public proposalCounter;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant EXECUTION_DELAY = 2 days;
    uint256 public constant PROPOSAL_THRESHOLD = 100000 * 10**18; // 100k tokens
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => uint256) public delegatedVotes;
    mapping(address => address) public delegates;
    
    // Treasury management
    uint256 public treasuryBalance;
    mapping(address => uint256) public budgetAllocations;
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, ProposalType proposalType);
    event VoteCast(uint256 indexed proposalId, address indexed voter, VoteType vote, uint256 weight, string reason);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    event TreasuryTransfer(address indexed to, uint256 amount, string purpose);
    
    constructor(address _governanceToken, address _admin) {
        governanceToken = IERC20(_governanceToken);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(GUARDIAN_ROLE, _admin);
    }
    
    /**
     * @dev Create a new proposal
     */
    function createProposal(
        string memory title,
        string memory description,
        address target,
        uint256 value,
        bytes memory callData,
        ProposalType proposalType
    ) external returns (uint256) {
        require(getVotingPower(msg.sender) >= PROPOSAL_THRESHOLD, "Insufficient voting power");
        
        proposalCounter++;
        
        uint256 quorum = _getQuorumForType(proposalType);
        
        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            proposer: msg.sender,
            title: title,
            description: description,
            callData: callData,
            target: target,
            value: value,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_PERIOD,
            votesFor: 0,
            votesAgainst: 0,
            votesAbstain: 0,
            executed: false,
            canceled: false,
            proposalType: proposalType,
            quorumRequired: quorum
        });
        
        emit ProposalCreated(proposalCounter, msg.sender, proposalType);
        return proposalCounter;
    }
    
    /**
     * @dev Cast vote on proposal
     */
    function castVote(
        uint256 proposalId,
        VoteType vote,
        string memory reason
    ) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.startTime && block.timestamp <= proposal.endTime, "Voting not active");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        
        uint256 weight = getVotingPower(msg.sender);
        require(weight > 0, "No voting power");
        
        hasVoted[proposalId][msg.sender] = true;
        votes[proposalId][msg.sender] = Vote(vote, weight, reason);
        
        if (vote == VoteType.FOR) {
            proposal.votesFor += weight;
        } else if (vote == VoteType.AGAINST) {
            proposal.votesAgainst += weight;
        } else {
            proposal.votesAbstain += weight;
        }
        
        emit VoteCast(proposalId, msg.sender, vote, weight, reason);
    }
    
    /**
     * @dev Execute proposal after voting period
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.endTime, "Voting still active");
        require(block.timestamp > proposal.endTime + EXECUTION_DELAY, "Execution delay not met");
        require(!proposal.executed && !proposal.canceled, "Proposal not executable");
        
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
        require(totalVotes >= proposal.quorumRequired, "Quorum not reached");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");
        
        proposal.executed = true;
        
        if (proposal.target != address(0)) {
            (bool success, ) = proposal.target.call{value: proposal.value}(proposal.callData);
            require(success, "Execution failed");
        }
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Delegate voting power
     */
    function delegate(address delegatee) external {
        address currentDelegate = delegates[msg.sender];
        delegates[msg.sender] = delegatee;
        
        uint256 amount = governanceToken.balanceOf(msg.sender);
        
        if (currentDelegate != address(0)) {
            delegatedVotes[currentDelegate] -= amount;
        }
        
        if (delegatee != address(0)) {
            delegatedVotes[delegatee] += amount;
        }
        
        emit DelegateChanged(msg.sender, currentDelegate, delegatee);
    }
    
    /**
     * @dev Get voting power (tokens + delegated)
     */
    function getVotingPower(address account) public view returns (uint256) {
        return governanceToken.balanceOf(account) + delegatedVotes[account];
    }
    
    /**
     * @dev Treasury transfer (only through governance)
     */
    function treasuryTransfer(
        address to,
        uint256 amount,
        string memory purpose
    ) external onlyRole(EXECUTOR_ROLE) {
        require(address(this).balance >= amount, "Insufficient treasury balance");
        
        treasuryBalance -= amount;
        payable(to).transfer(amount);
        
        emit TreasuryTransfer(to, amount, purpose);
    }
    
    /**
     * @dev Emergency cancel (guardians only)
     */
    function emergencyCancel(uint256 proposalId) external onlyRole(GUARDIAN_ROLE) {
        proposals[proposalId].canceled = true;
        emit ProposalCanceled(proposalId);
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 votesAbstain,
        bool executed,
        bool canceled,
        ProposalType proposalType
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.startTime,
            proposal.endTime,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.votesAbstain,
            proposal.executed,
            proposal.canceled,
            proposal.proposalType
        );
    }
    
    function _getQuorumForType(ProposalType proposalType) internal view returns (uint256) {
        uint256 totalSupply = governanceToken.totalSupply();
        
        if (proposalType == ProposalType.CONSTITUTIONAL) {
            return totalSupply * 40 / 100; // 40% for constitutional changes
        } else if (proposalType == ProposalType.TREASURY) {
            return totalSupply * 25 / 100; // 25% for treasury decisions
        } else if (proposalType == ProposalType.EMERGENCY) {
            return totalSupply * 15 / 100; // 15% for emergency actions
        } else {
            return totalSupply * 20 / 100; // 20% for standard proposals
        }
    }
    
    receive() external payable {
        treasuryBalance += msg.value;
    }
}