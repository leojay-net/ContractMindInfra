// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HubAwareStaking
 * @notice Hub-aware staking contract that works with ContractMind Hub
 * @dev Accepts calls from trusted hub contract and uses tx.origin for user identification
 *      SECURITY NOTE: tx.origin is generally discouraged, but acceptable here because:
 *      1. Only trusted hub can call
 *      2. User explicitly initiates transaction
 *      3. Alternative is meta-transactions or EIP-2771
 */
contract HubAwareStaking is ReentrancyGuard, Ownable {
    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint256 totalRewardsClaimed;
    }

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    IERC20 public immutable stakingToken;
    uint256 public constant APY = 1250; // 12.5% APY in basis points
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;

    // Hub integration
    address public trustedHub;
    bool public hubModeEnabled;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event HubUpdated(address indexed hub, bool enabled);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidAmount();
    error InsufficientStake();
    error NoRewards();
    error TransferFailed();
    error NotAuthorized();
    error InvalidHub();

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address _stakingToken, address _hub) Ownable(msg.sender) {
        if (_stakingToken == address(0)) revert InvalidAmount();
        stakingToken = IERC20(_stakingToken);
        trustedHub = _hub;
        hubModeEnabled = true;
    }

    /*//////////////////////////////////////////////////////////////
                              MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get the actual user - either msg.sender or tx.origin if called via hub
     */
    function _getUser() internal view returns (address) {
        if (hubModeEnabled && msg.sender == trustedHub) {
            // Called via hub - use tx.origin as the actual user
            return tx.origin;
        }
        // Direct call - use msg.sender
        return msg.sender;
    }

    /**
     * @notice Verify caller is authorized (either user directly or hub on behalf of user)
     */
    modifier onlyAuthorized() {
        if (hubModeEnabled && msg.sender == trustedHub) {
            // Hub is calling - this is OK
            _;
        } else if (msg.sender == _getUser()) {
            // Direct user call - this is OK
            _;
        } else {
            revert NotAuthorized();
        }
    }

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Stake tokens
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant onlyAuthorized {
        if (amount == 0) revert InvalidAmount();

        address user = _getUser();
        StakeInfo storage userStake = stakes[user];

        // Claim pending rewards if any
        if (userStake.amount > 0) {
            _claimRewards(user);
        }

        // Transfer tokens from actual user (not hub)
        bool success = stakingToken.transferFrom(user, address(this), amount);
        if (!success) revert TransferFailed();

        // Update stake
        if (userStake.amount == 0) {
            userStake.startTime = block.timestamp;
        }
        userStake.amount += amount;
        userStake.lastClaimTime = block.timestamp;

        totalStaked += amount;

        emit Staked(user, amount);
    }

    /**
     * @notice Withdraw staked tokens
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant onlyAuthorized {
        address user = _getUser();
        StakeInfo storage userStake = stakes[user];

        if (amount == 0) revert InvalidAmount();
        if (userStake.amount < amount) revert InsufficientStake();

        // Claim pending rewards
        _claimRewards(user);

        // Update stake
        userStake.amount -= amount;
        totalStaked -= amount;

        // Transfer tokens to actual user
        bool success = stakingToken.transfer(user, amount);
        if (!success) revert TransferFailed();

        emit Withdrawn(user, amount);
    }

    /**
     * @notice Claim accumulated rewards
     */
    function claimRewards() external nonReentrant onlyAuthorized {
        address user = _getUser();
        _claimRewards(user);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Calculate pending rewards for a user
     * @param user User address
     * @return uint256 Pending rewards amount
     */
    function pendingRewards(address user) public view returns (uint256) {
        StakeInfo storage userStake = stakes[user];

        if (userStake.amount == 0) {
            return 0;
        }

        uint256 stakingDuration = block.timestamp - userStake.lastClaimTime;
        uint256 rewards = (userStake.amount * APY * stakingDuration) /
            (10000 * SECONDS_PER_YEAR);

        return rewards;
    }

    /**
     * @notice Get complete stake information for a user
     */
    function getStakeInfo(
        address user
    )
        external
        view
        returns (
            uint256 stakedAmount,
            uint256 rewards,
            uint256 stakingDuration,
            uint256 apy
        )
    {
        StakeInfo storage userStake = stakes[user];

        stakedAmount = userStake.amount;
        rewards = pendingRewards(user);
        stakingDuration = userStake.amount > 0
            ? block.timestamp - userStake.startTime
            : 0;
        apy = APY;
    }

    /**
     * @notice Get current APY
     */
    function getCurrentAPY() external pure returns (uint256) {
        return APY;
    }

    /**
     * @notice Get total value locked
     */
    function getTVL() external view returns (uint256) {
        return totalStaked;
    }

    /**
     * @notice Get user's staked balance
     */
    function balanceOf(address user) external view returns (uint256) {
        return stakes[user].amount;
    }

    /*//////////////////////////////////////////////////////////////
                         INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Internal function to claim rewards
     */
    function _claimRewards(address user) internal {
        uint256 rewards = pendingRewards(user);

        if (rewards == 0) return;

        StakeInfo storage userStake = stakes[user];
        userStake.lastClaimTime = block.timestamp;
        userStake.totalRewardsClaimed += rewards;

        // Transfer rewards
        bool success = stakingToken.transfer(user, rewards);
        if (!success) revert TransferFailed();

        emit RewardsClaimed(user, rewards);
    }

    /*//////////////////////////////////////////////////////////////
                           ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Update trusted hub address
     */
    function setTrustedHub(address newHub) external onlyOwner {
        if (newHub == address(0)) revert InvalidHub();
        trustedHub = newHub;
        emit HubUpdated(newHub, hubModeEnabled);
    }

    /**
     * @notice Enable/disable hub mode
     */
    function setHubMode(bool enabled) external onlyOwner {
        hubModeEnabled = enabled;
        emit HubUpdated(trustedHub, enabled);
    }

    /**
     * @notice Admin function to fund rewards pool
     */
    function fundRewardsPool(uint256 amount) external onlyOwner {
        bool success = stakingToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!success) revert TransferFailed();
    }
}
