// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RegularStaking
 * @notice A REGULAR staking contract (NOT hub-aware) to demonstrate hub compatibility
 * @dev This is a standard staking contract that can work with ContractMind hub
 *
 * KEY DIFFERENCES from HubAwareStaking:
 * 1. NO tx.origin pattern - uses msg.sender directly
 * 2. NO hubModeEnabled flag
 * 3. Works with hub IF users approve hub to spend tokens
 *
 * USAGE WITH HUB:
 * - User must: token.approve(hubAddress, amount)
 * - Then hub can call: hub.executeOnTarget(agentId, stakingAddress, stakeData)
 * - Limitation: Staking is attributed to HUB address, not user
 * - This is why hub-aware pattern is preferred for user-centric contracts
 */
contract RegularStaking is ReentrancyGuard {
    IERC20 public immutable stakingToken;

    // Staking balances - maps staker to their balance
    mapping(address => uint256) public stakes;

    // Rewards tracking
    mapping(address => uint256) public rewards;
    uint256 public rewardsPool;
    uint256 public totalStaked;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardsFunded(uint256 amount);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    /**
     * @notice Stake tokens
     * @dev msg.sender is the staker (or hub if called through hub)
     *
     * REGULAR CONTRACT BEHAVIOR:
     * - Uses msg.sender as the staker
     * - If called through hub: msg.sender = hub address
     * - Tokens are pulled FROM msg.sender (hub must have allowance)
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");

        // Calculate rewards before changing stake
        _updateRewards(msg.sender);

        // Transfer tokens FROM msg.sender
        // If called through hub: pulls from hub (hub needs user's approval)
        require(
            stakingToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        stakes[msg.sender] += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Withdraw staked tokens
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot withdraw 0");
        require(stakes[msg.sender] >= amount, "Insufficient stake");

        // Calculate rewards before changing stake
        _updateRewards(msg.sender);

        stakes[msg.sender] -= amount;
        totalStaked -= amount;

        // Transfer tokens TO msg.sender
        require(stakingToken.transfer(msg.sender, amount), "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Claim accumulated rewards
     */
    function claimRewards() external nonReentrant {
        _updateRewards(msg.sender);

        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards");
        require(rewardsPool >= reward, "Insufficient rewards pool");

        rewards[msg.sender] = 0;
        rewardsPool -= reward;

        require(stakingToken.transfer(msg.sender, reward), "Transfer failed");

        emit RewardClaimed(msg.sender, reward);
    }

    /**
     * @notice Fund the rewards pool
     */
    function fundRewardsPool(uint256 amount) external {
        require(amount > 0, "Cannot fund 0");

        require(
            stakingToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        rewardsPool += amount;

        emit RewardsFunded(amount);
    }

    /**
     * @notice Get user's stake info
     */
    function getStakeInfo(
        address user
    ) external view returns (uint256 stakedAmount, uint256 pendingRewards) {
        stakedAmount = stakes[user];

        // Simple reward calculation: 10% APR
        if (totalStaked > 0) {
            pendingRewards = rewards[user] + (stakes[user] * 10) / 100;
        } else {
            pendingRewards = rewards[user];
        }
    }

    /**
     * @notice Update rewards for a user
     */
    function _updateRewards(address user) internal {
        if (stakes[user] > 0 && totalStaked > 0) {
            // Simple reward: 10% of stake
            uint256 reward = (stakes[user] * 10) / 100;
            if (rewardsPool >= reward) {
                rewards[user] += reward;
            }
        }
    }
}
