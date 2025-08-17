// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ChainMindToken (MIND)
 * @dev Governance token for ChainMind DAO
 * @notice ERC20 token with governance features for AI-powered DAO
 */
contract ChainMindToken is ERC20, Ownable, Pausable {
    // Token details
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion MIND tokens
    uint256 public constant MAX_MINT_PER_YEAR = 50_000_000 * 10**18; // 5% inflation cap
    
    // Minting tracking
    uint256 public lastMintYear;
    uint256 public mintedThisYear;
    
    // Special addresses
    address public daoTreasury;
    address public stakingContract;
    
    // Token distribution
    mapping(address => bool) public isWhitelisted;
    mapping(address => uint256) public lastTransferTime;
    
    // Events
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event StakingContractUpdated(address indexed oldContract, address indexed newContract);
    event WhitelistUpdated(address indexed account, bool whitelisted);
    event TokensMinted(address indexed to, uint256 amount, string reason);
    
    // Modifiers
    modifier onlyDAO() {
        require(msg.sender == daoTreasury, "Only DAO can call this function");
        _;
    }
    
    modifier onlyStaking() {
        require(msg.sender == stakingContract, "Only staking contract can call this");
        _;
    }
    
    // Constructor
    constructor(
        address _daoTreasury,
        address _initialOwner
    ) ERC20("ChainMind Token", "MIND") {
        require(_daoTreasury != address(0), "Invalid DAO treasury address");
        require(_initialOwner != address(0), "Invalid owner address");
        
        daoTreasury = _daoTreasury;
        lastMintYear = block.timestamp / 365 days;
        
        // Initial distribution
        _mint(_daoTreasury, TOTAL_SUPPLY * 30 / 100);        // 30% to DAO Treasury
        _mint(_initialOwner, TOTAL_SUPPLY * 20 / 100);       // 20% to Team/Founders
        _mint(address(this), TOTAL_SUPPLY * 50 / 100);       // 50% for future distribution
        
        // Whitelist initial addresses
        isWhitelisted[_daoTreasury] = true;
        isWhitelisted[_initialOwner] = true;
        isWhitelisted[address(this)] = true;
        
        _transferOwnership(_initialOwner);
    }
    
    /**
     * @dev Mint new tokens (inflation control)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     * @param reason Reason for minting
     */
    function mint(address to, uint256 amount, string memory reason) 
        external 
        onlyDAO 
        whenNotPaused 
    {
        uint256 currentYear = block.timestamp / 365 days;
        
        // Reset counter if new year
        if (currentYear > lastMintYear) {
            lastMintYear = currentYear;
            mintedThisYear = 0;
        }
        
        // Check annual mint limit
        require(
            mintedThisYear + amount <= MAX_MINT_PER_YEAR,
            "Exceeds annual mint limit"
        );
        
        mintedThisYear += amount;
        _mint(to, amount);
        
        emit TokensMinted(to, amount, reason);
    }
    
    /**
     * @dev Distribute tokens from contract reserves
     * @param to Address to send tokens to
     * @param amount Amount of tokens to send
     */
    function distributeTokens(address to, uint256 amount) 
        external 
        onlyOwner 
        whenNotPaused 
    {
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");
        _transfer(address(this), to, amount);
    }
    
    /**
     * @dev Batch distribute tokens to multiple addresses
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to send
     */
    function batchDistribute(
        address[] memory recipients,
        uint256[] memory amounts
    ) external onlyOwner whenNotPaused {
        require(recipients.length == amounts.length, "Array length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Invalid amount");
            
            _transfer(address(this), recipients[i], amounts[i]);
        }
    }
    
    /**
     * @dev Stake tokens (called by staking contract)
     * @param from Address staking tokens
     * @param amount Amount to stake
     */
    function stakeTokens(address from, uint256 amount) 
        external 
        onlyStaking 
        whenNotPaused 
    {
        require(balanceOf(from) >= amount, "Insufficient balance");
        _transfer(from, stakingContract, amount);
    }
    
    /**
     * @dev Unstake tokens (called by staking contract)
     * @param to Address to unstake tokens to
     * @param amount Amount to unstake
     */
    function unstakeTokens(address to, uint256 amount) 
        external 
        onlyStaking 
        whenNotPaused 
    {
        require(balanceOf(stakingContract) >= amount, "Insufficient staked balance");
        _transfer(stakingContract, to, amount);
    }
    
    /**
     * @dev Burn tokens from treasury
     * @param amount Amount of tokens to burn
     */
    function burnFromTreasury(uint256 amount) external onlyDAO {
        require(balanceOf(daoTreasury) >= amount, "Insufficient treasury balance");
        _burn(daoTreasury, amount);
    }
    
    /**
     * @dev Update DAO treasury address
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyDAO {
        require(newTreasury != address(0), "Invalid address");
        address oldTreasury = daoTreasury;
        daoTreasury = newTreasury;
        
        // Update whitelist
        isWhitelisted[oldTreasury] = false;
        isWhitelisted[newTreasury] = true;
        
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }
    
    /**
     * @dev Update staking contract address
     * @param newStakingContract New staking contract address
     */
    function updateStakingContract(address newStakingContract) external onlyOwner {
        require(newStakingContract != address(0), "Invalid address");
        address oldContract = stakingContract;
        stakingContract = newStakingContract;
        
        // Update whitelist
        if (oldContract != address(0)) {
            isWhitelisted[oldContract] = false;
        }
        isWhitelisted[newStakingContract] = true;
        
        emit StakingContractUpdated(oldContract, newStakingContract);
    }
    
    /**
     * @dev Update whitelist status
     * @param account Account to update
     * @param whitelisted Whether to whitelist or not
     */
    function updateWhitelist(address account, bool whitelisted) external onlyOwner {
        isWhitelisted[account] = whitelisted;
        emit WhitelistUpdated(account, whitelisted);
    }
    
    /**
     * @dev Get token holder information
     * @param account Account to get info for
     * @return balance, isWhitelisted, lastTransferTime
     */
    function getHolderInfo(address account) 
        external 
        view 
        returns (uint256, bool, uint256) 
    {
        return (
            balanceOf(account),
            isWhitelisted[account],
            lastTransferTime[account]
        );
    }
    
    /**
     * @dev Get minting information
     * @return currentYear, mintedThisYear, remainingMintCapacity
     */
    function getMintingInfo() 
        external 
        view 
        returns (uint256, uint256, uint256) 
    {
        uint256 currentYear = block.timestamp / 365 days;
        uint256 currentYearMinted = currentYear > lastMintYear ? 0 : mintedThisYear;
        uint256 remainingCapacity = MAX_MINT_PER_YEAR - currentYearMinted;
        
        return (currentYear, currentYearMinted, remainingCapacity);
    }
    
    /**
     * @dev Override transfer to add transfer time tracking
     * @param from From address
     * @param to To address
     * @param amount Amount to transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);
        
        // Update transfer time for non-whitelisted transfers
        if (!isWhitelisted[from] && !isWhitelisted[to]) {
            lastTransferTime[from] = block.timestamp;
            lastTransferTime[to] = block.timestamp;
        }
    }
    
    /**
     * @dev Pause contract (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get contract version
     * @return Version string
     */
    function version() external pure returns (string memory) {
        return "1.0.0";
    }
    
    /**
     * @dev Emergency recovery of tokens sent to contract
     * @param token Token contract address (use address(0) for ETH)
     * @param amount Amount to recover
     */
    function emergencyRecover(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            // Recover ETH
            require(address(this).balance >= amount, "Insufficient ETH balance");
            payable(owner()).transfer(amount);
        } else {
            // Recover ERC20 tokens (except MIND tokens)
            require(token != address(this), "Cannot recover MIND tokens");
            IERC20(token).transfer(owner(), amount);
        }
    }
    
    /**
     * @dev Fallback function to receive ETH
     */
    receive() external payable {
        // Allow receiving ETH for fee collection
    }
}
