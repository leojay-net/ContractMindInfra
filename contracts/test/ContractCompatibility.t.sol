// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AgentRegistry.sol";
import "../src/ContractMindHubV2.sol";
import "../src/HubAwareStaking.sol";
import "../src/RegularStaking.sol";
import "../src/TestToken.sol";

/**
 * @title ContractCompatibilityTest
 * @notice Tests to demonstrate hub works with BOTH regular and hub-aware contracts
 */
contract ContractCompatibilityTest is Test {
    AgentRegistry public registry;
    ContractMindHubV2 public hub;
    TestToken public token;

    // Two types of staking contracts
    HubAwareStaking public hubAwareStaking; // Knows about hub, uses tx.origin
    RegularStaking public regularStaking; // Standard contract, uses msg.sender

    address public owner = address(1);
    address public feeCollector = address(2);
    address public user = address(3);

    bytes32 public hubAwareAgentId = keccak256("HUB_AWARE_AGENT");
    bytes32 public regularAgentId = keccak256("REGULAR_AGENT");

    function setUp() public {
        vm.deal(owner, 100 ether);
        vm.deal(user, 100 ether);

        // Deploy infrastructure
        vm.startPrank(owner);
        registry = new AgentRegistry();
        hub = new ContractMindHubV2(address(registry), feeCollector);
        token = new TestToken("Test Token", "TEST", 1_000_000 * 10 ** 18);
        vm.stopPrank();

        // Deploy both types of staking contracts
        vm.startPrank(owner);
        hubAwareStaking = new HubAwareStaking(address(token), address(hub));
        regularStaking = new RegularStaking(address(token));

        // Fund both staking contracts with rewards
        token.approve(address(hubAwareStaking), 100_000 * 10 ** 18);
        hubAwareStaking.fundRewardsPool(100_000 * 10 ** 18);

        token.approve(address(regularStaking), 100_000 * 10 ** 18);
        regularStaking.fundRewardsPool(100_000 * 10 ** 18);
        vm.stopPrank();

        // Register agents
        vm.startPrank(owner);
        hubAwareAgentId = registry.registerAgent(
            address(hubAwareStaking),
            "Hub-Aware Staking Agent",
            "ipfs://hub-aware-config"
        );

        regularAgentId = registry.registerAgent(
            address(regularStaking),
            "Regular Staking Agent",
            "ipfs://regular-config"
        );
        vm.stopPrank();

        // Authorize staking functions
        bytes4[] memory selectors = _getStakingSelectors();

        vm.startPrank(owner);
        for (uint i = 0; i < selectors.length; i++) {
            hub.authorizeFunction(
                hubAwareAgentId,
                address(hubAwareStaking),
                selectors[i]
            );
        }

        for (uint i = 0; i < selectors.length; i++) {
            hub.authorizeFunction(
                regularAgentId,
                address(regularStaking),
                selectors[i]
            );
        }
        vm.stopPrank();

        // Give user tokens
        vm.prank(owner);
        token.transfer(user, 10_000 * 10 ** 18);
    }

    /**
     * @notice Test hub-aware contract - User context is PRESERVED
     */
    function test_HubAwareContract_PreservesUserContext() public {
        uint256 stakeAmount = 1000 * 10 ** 18;

        // User approves the staking contract (NOT hub)
        vm.prank(user);
        token.approve(address(hubAwareStaking), stakeAmount);

        // User stakes through hub
        bytes memory stakeCall = abi.encodeWithSelector(
            HubAwareStaking.stake.selector,
            stakeAmount
        );

        vm.prank(user, user); // Set both msg.sender and tx.origin
        hub.executeOnTarget(
            hubAwareAgentId,
            address(hubAwareStaking),
            stakeCall
        );

        // Verify: User's stake is recorded (NOT hub's stake)
        (uint256 userStake, , , ) = hubAwareStaking.getStakeInfo(user);
        assertEq(userStake, stakeAmount, "User stake should be recorded");

        // Verify: Hub has NO stake
        (uint256 hubStake, , , ) = hubAwareStaking.getStakeInfo(address(hub));
        assertEq(hubStake, 0, "Hub should have no stake");

        console.log("Hub-aware: User stake =", userStake / 10 ** 18, "tokens");
        console.log("Hub-aware: Hub stake =", hubStake, "tokens");
    }

    /**
     * @notice Test regular contract - Shows the LIMITATION
     * @dev This test demonstrates why regular contracts don't work well with the hub
     */
    function test_RegularContract_ShowsLimitation() public {
        uint256 stakeAmount = 1000 * 10 ** 18;

        // The problem: Regular contract expects msg.sender to have tokens
        // But when called through hub, msg.sender = hub address
        // Hub doesn't have user's tokens!

        // Even if user approves hub...
        vm.prank(user);
        token.approve(address(hub), stakeAmount);

        // ...hub would need to first pull tokens from user
        // Then approve staking contract
        // Then call stake (which pulls from hub)
        // This is complex and gas-inefficient!

        // For demonstration, let's fund the hub with tokens
        vm.prank(user);
        token.transfer(address(hub), stakeAmount);

        // Now hub needs to approve the staking contract
        // But hub can't do this in executeOnTarget!
        // This is the core limitation.

        console.log(
            "LIMITATION: Regular contracts expect tokens from msg.sender"
        );
        console.log("When hub calls, msg.sender = hub, not user");
        console.log("Solution: Use hub-aware pattern OR direct execution");
    }

    /**
     * @notice Test regular contract with WRAPPER pattern solution
     */
    function test_RegularContract_WithWrapperSolution() public {
        uint256 stakeAmount = 1000 * 10 ** 18;

        // SOLUTION: User interacts directly with regular contract
        // Hub only provides: intent parsing, validation, UI
        // Actual transaction: user -> regular contract (bypassing hub)

        vm.startPrank(user);

        // 1. Hub validates the transaction (off-chain or pre-check)
        bool authorized = hub.validateTransaction(
            regularAgentId,
            address(regularStaking),
            RegularStaking.stake.selector
        );
        assertTrue(authorized, "Transaction should be authorized");

        // 2. User executes directly on regular contract
        token.approve(address(regularStaking), stakeAmount);
        regularStaking.stake(stakeAmount);

        vm.stopPrank();

        // Note: Hub V2 doesn't have recordDirectExecution yet
        // This would be a future feature for tracking off-chain executed transactions

        // Verify: User's stake is recorded correctly
        (uint256 userStake, ) = regularStaking.getStakeInfo(user);
        assertEq(userStake, stakeAmount, "User stake recorded correctly");

        console.log(
            "Wrapper pattern: User stake =",
            userStake / 10 ** 18,
            "tokens"
        );
    }

    /**
     * @notice Compare gas costs between hub-aware and regular contracts
     */
    function test_CompareGasCosts() public {
        uint256 stakeAmount = 1000 * 10 ** 18;

        // Hub-aware contract
        vm.prank(user);
        token.approve(address(hubAwareStaking), stakeAmount);

        bytes memory stakeCall = abi.encodeWithSelector(
            HubAwareStaking.stake.selector,
            stakeAmount
        );

        uint256 gasBefore = gasleft();
        vm.prank(user, user);
        hub.executeOnTarget(
            hubAwareAgentId,
            address(hubAwareStaking),
            stakeCall
        );
        uint256 hubAwareGas = gasBefore - gasleft();

        // Regular contract - direct call (best case)
        vm.startPrank(user);
        token.approve(address(regularStaking), stakeAmount);

        gasBefore = gasleft();
        regularStaking.stake(stakeAmount);
        uint256 regularGas = gasBefore - gasleft();
        vm.stopPrank();

        console.log("Gas comparison:");
        console.log("  Hub-aware through hub:", hubAwareGas);
        console.log("  Regular direct call:", regularGas);
        console.log("  Overhead:", hubAwareGas - regularGas);
    }

    /**
     * @notice Demonstrate the RECOMMENDED architecture
     */
    function test_RecommendedArchitecture() public {
        console.log("\n=== RECOMMENDED ARCHITECTURE ===\n");
        console.log("1. HUB-AWARE contracts:");
        console.log(
            "   - Use for user-centric protocols (staking, lending, etc.)"
        );
        console.log("   - Preserves user context via tx.origin");
        console.log("   - Users approve target contract, not hub");
        console.log("   - Gas overhead: ~100-200k gas\n");

        console.log("2. REGULAR contracts:");
        console.log("   - Option A: User executes directly, hub validates");
        console.log(
            "   - Option B: Accept hub as intermediary (aggregation use case)"
        );
        console.log("   - Option C: Hub batches multiple user transactions\n");

        console.log("3. HYBRID approach:");
        console.log("   - Hub provides: AI parsing, validation, analytics, UI");
        console.log(
            "   - Execution: Hub-aware for new contracts, direct for existing"
        );
        console.log("   - Result: Best of both worlds");
    }

    function _getStakingSelectors() internal pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](3);
        selectors[0] = bytes4(keccak256("stake(uint256)"));
        selectors[1] = bytes4(keccak256("withdraw(uint256)"));
        selectors[2] = bytes4(keccak256("claimRewards()"));
        return selectors;
    }
}
