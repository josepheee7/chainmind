// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ChainMindStaking
 * @dev Staking contract for ChainMind DAO governance token
 * @notice Allows users to stake MIND tokens and earn rewards
 */
contract ChainMindStaking is Ownable, ReentrancyGuard, Pausable {
    // Token contract
    IERC20 public immutable mindToken;
    
    // Staking pools
    struct StakingPool {
        uint256 id;
        string name;
        string description;
        uint256 totalStaked;
        uint256 rewardRate; // APY in basis points (100 = 1%)
        uint256 lockPeriod; // Lock period in seconds
        uint256 minStake;
        uint256 maxStake;
        bool active;
        uint256 totalRewardsDistributed;
    }
    
    // User staking info
    struct UserStake {
        uint256 amount;
        uint256 startTime;
        uint256 lastRewardTime;
        uint256 accumulatedRewards;
        uint256 poolId;
    }
    
    // State variables
    uint256 public poolCounter;
    uint256 public totalStaked;
    uint256 public totalRewardsDistributed;
    uint256 public constant REWARD_PRECISION = 1e18;
    uint256 public constant MAX_APY = 5000; // 50% max APY
    
    // Mappings
    mapping(uint256 => StakingPool) public pools;
    mapping(address => UserStake[]) public userStakes;
    mapping(address => uint256) public userTotalStaked;
    mapping(address => uint256) public userTotalRewards;
    
    // Events
    event PoolCreated(uint256 indexed poolId, string name, uint256 rewardRate, uint256 lockPeriod);
    event Staked(address indexed user, uint256 indexed poolId, uint256 amount);
    event Unstaked(address indexed user, uint256 indexed poolId, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 indexed poolId, uint256 amount);
    event PoolUpdated(uint256 indexed poolId, uint256 newRewardRate, bool active);
    
    // Modifiers
    modifier poolExists(uint256 poolId) {
        require(poolId > 0 && poolId <= poolCounter, "Pool does not exist");
        _;
    }
    
    modifier poolActive(uint256 poolId) {
        require(pools[poolId].active, "Pool is not active");
        _;
    }
    
    modifier validStake(uint256 poolId, uint256 amount) {
        StakingPool storage pool = pools[poolId];
        require(amount >= pool.minStake, "Amount below minimum stake");
        require(amount <= pool.maxStake, "Amount above maximum stake");
        _;
    }
    
    // Constructor
    constructor(address _mindToken) {
        require(_mindToken != address(0), "Invalid token address");
        mindToken = IERC20(_mindToken);
        
        // Create default pools
        _createPool("Governance Pool", "Stake MIND tokens to participate in governance", 1500, 30 days, 1000 * 10**18, 1000000 * 10**18);
        _createPool("AI Prediction Pool", "Stake tokens to earn from AI prediction accuracy", 1870, 60 days, 5000 * 10**18, 5000000 * 10**18);
        _createPool("Long-term Staking", "Long-term staking with higher rewards", 2500, 365 days, 10000 * 10**18, 10000000 * 10**18);
    }
    
    /**
     * @dev Create a new staking pool
     * @param name Pool name
     * @param description Pool description
     * @param rewardRate APY in basis points
     * @param lockPeriod Lock period in seconds
     * @param minStake Minimum stake amount
     * @param maxStake Maximum stake amount
     */
    function createPool(
        string memory name,
        string memory description,
        uint256 rewardRate,
        uint256 lockPeriod,
        uint256 minStake,
        uint256 maxStake
    ) external onlyOwner {
        require(rewardRate <= MAX_APY, "Reward rate too high");
        require(lockPeriod > 0, "Invalid lock period");
        require(minStake > 0, "Invalid minimum stake");
        require(maxStake > minStake, "Invalid maximum stake");
        
        _createPool(name, description, rewardRate, lockPeriod, minStake, maxStake);
    }
    
    /**
     * @dev Internal function to create pool
     */
    function _createPool(
        string memory name,
        string memory description,
        uint256 rewardRate,
        uint256 lockPeriod,
        uint256 minStake,
        uint256 maxStake
    ) internal {
        poolCounter++;
        
        pools[poolCounter] = StakingPool({
            id: poolCounter,
            name: name,
            description: description,
            totalStaked: 0,
            rewardRate: rewardRate,
            lockPeriod: lockPeriod,
            minStake: minStake,
            maxStake: maxStake,
            active: true,
            totalRewardsDistributed: 0
        });
        
        emit PoolCreated(poolCounter, name, rewardRate, lockPeriod);
    }
    
    /**
     * @dev Stake tokens in a pool
     * @param poolId Pool ID to stake in
     * @param amount Amount to stake
     */
    function stake(uint256 poolId, uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
        poolExists(poolId) 
        poolActive(poolId) 
        validStake(poolId, amount) 
    {
        require(amount > 0, "Cannot stake 0");
        require(mindToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Update pool
        pools[poolId].totalStaked += amount;
        totalStaked += amount;
        
        // Create user stake
        UserStake memory newStake = UserStake({
            amount: amount,
            startTime: block.timestamp,
            lastRewardTime: block.timestamp,
            accumulatedRewards: 0,
            poolId: poolId
        });
        
        userStakes[msg.sender].push(newStake);
        userTotalStaked[msg.sender] += amount;
        
        emit Staked(msg.sender, poolId, amount);
    }
    
    /**
     * @dev Unstake tokens from a pool
     * @param stakeIndex Index of the stake to unstake
     */
    function unstake(uint256 stakeIndex) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        
        UserStake storage userStake = userStakes[msg.sender][stakeIndex];
        StakingPool storage pool = pools[userStake.poolId];
        
        require(block.timestamp >= userStake.startTime + pool.lockPeriod, "Lock period not ended");
        
        uint256 amount = userStake.amount;
        
        // Calculate and add final rewards
        uint256 rewards = calculateRewards(msg.sender, stakeIndex);
        userStake.accumulatedRewards += rewards;
        
        // Update pool
        pool.totalStaked -= amount;
        totalStaked -= amount;
        
        // Update user totals
        userTotalStaked[msg.sender] -= amount;
        userTotalRewards[msg.sender] += userStake.accumulatedRewards;
        
        // Remove stake
        _removeStake(msg.sender, stakeIndex);
        
        // Transfer tokens
        require(mindToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Unstaked(msg.sender, userStake.poolId, amount);
    }
    
    /**
     * @dev Claim accumulated rewards
     * @param stakeIndex Index of the stake to claim rewards from
     */
    function claimRewards(uint256 stakeIndex) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        
        UserStake storage userStake = userStakes[msg.sender][stakeIndex];
        uint256 rewards = calculateRewards(msg.sender, stakeIndex);
        
        require(rewards > 0, "No rewards to claim");
        
        // Update stake
        userStake.lastRewardTime = block.timestamp;
        userStake.accumulatedRewards = 0;
        
        // Update totals
        userTotalRewards[msg.sender] += rewards;
        totalRewardsDistributed += rewards;
        pools[userStake.poolId].totalRewardsDistributed += rewards;
        
        // Transfer rewards
        require(mindToken.transfer(msg.sender, rewards), "Transfer failed");
        
        emit RewardsClaimed(msg.sender, userStake.poolId, rewards);
    }
    
    /**
     * @dev Calculate pending rewards for a stake
     * @param user User address
     * @param stakeIndex Stake index
     * @return Pending rewards
     */
    function calculateRewards(address user, uint256 stakeIndex) public view returns (uint256) {
        if (stakeIndex >= userStakes[user].length) return 0;
        
        UserStake storage userStake = userStakes[user][stakeIndex];
        StakingPool storage pool = pools[userStake.poolId];
        
        if (!pool.active || userStake.amount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - userStake.lastRewardTime;
        uint256 annualReward = (userStake.amount * pool.rewardRate) / 10000; // Convert basis points
        uint256 reward = (annualReward * timeStaked) / 365 days;
        
        return reward + userStake.accumulatedRewards;
    }
    
    /**
     * @dev Get user's total pending rewards
     * @param user User address
     * @return Total pending rewards
     */
    function getTotalPendingRewards(address user) external view returns (uint256) {
        uint256 totalRewards = 0;
        
        for (uint256 i = 0; i < userStakes[user].length; i++) {
            totalRewards += calculateRewards(user, i);
        }
        
        return totalRewards;
    }
    
    /**
     * @dev Get user's stakes
     * @param user User address
     * @return Array of user stakes
     */
    function getUserStakes(address user) external view returns (UserStake[] memory) {
        return userStakes[user];
    }
    
    /**
     * @dev Get pool information
     * @param poolId Pool ID
     * @return Pool information
     */
    function getPool(uint256 poolId) external view poolExists(poolId) returns (StakingPool memory) {
        return pools[poolId];
    }
    
    /**
     * @dev Get all pools
     * @return Array of all pools
     */
    function getAllPools() external view returns (StakingPool[] memory) {
        StakingPool[] memory allPools = new StakingPool[](poolCounter);
        
        for (uint256 i = 1; i <= poolCounter; i++) {
            allPools[i - 1] = pools[i];
        }
        
        return allPools;
    }
    
    /**
     * @dev Update pool parameters
     * @param poolId Pool ID
     * @param rewardRate New reward rate
     * @param active New active status
     */
    function updatePool(uint256 poolId, uint256 rewardRate, bool active) 
        external 
        onlyOwner 
        poolExists(poolId) 
    {
        require(rewardRate <= MAX_APY, "Reward rate too high");
        
        pools[poolId].rewardRate = rewardRate;
        pools[poolId].active = active;
        
        emit PoolUpdated(poolId, rewardRate, active);
    }
    
    /**
     * @dev Emergency function to pause staking
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause staking
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Remove stake from array
     * @param user User address
     * @param index Index to remove
     */
    function _removeStake(address user, uint256 index) internal {
        UserStake[] storage stakes = userStakes[user];
        
        if (index != stakes.length - 1) {
            stakes[index] = stakes[stakes.length - 1];
        }
        
        stakes.pop();
    }
    
    /**
     * @dev Get staking statistics
     * @return totalStaked, totalRewardsDistributed, poolCount
     */
    function getStakingStats() external view returns (uint256, uint256, uint256) {
        return (totalStaked, totalRewardsDistributed, poolCounter);
    }
    
    /**
     * @dev Emergency recovery of tokens sent to contract
     * @param token Token address
     * @param amount Amount to recover
     */
    function emergencyRecover(address token, uint256 amount) external onlyOwner {
        require(token != address(mindToken), "Cannot recover staking token");
        IERC20(token).transfer(owner(), amount);
    }
}
