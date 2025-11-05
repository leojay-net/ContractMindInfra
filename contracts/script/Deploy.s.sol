// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AgentRegistry.sol";
import "../src/ContractMindHubV2.sol";
import "../src/HubAwareStaking.sol";
import "../src/TestToken.sol";

/**
 * @title Deploy
 * @notice Deployment script for ContractMind infrastructure
 * @dev Run with: forge script script/Deploy.s.sol:Deploy --rpc-url $RPC_URL --broadcast
 */
contract Deploy is Script {
    // Deployment addresses will be logged
    AgentRegistry public agentRegistry;
    ContractMindHubV2 public hub;
    TestToken public testToken;
    HubAwareStaking public staking;
    address internal _deployer;

    function run() external {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        _deployer = deployer;

        // Get fee collector (or use deployer as default)
        address feeCollector = vm.envOr("FEE_COLLECTOR", deployer);

        console.log("========================================");
        console.log("ContractMind Deployment Script");
        console.log("========================================");
        console.log("Deployer:", deployer);
        console.log("Fee Collector:", feeCollector);
        console.log("========================================");

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy AgentRegistry
        console.log("\n1. Deploying AgentRegistry...");
        agentRegistry = new AgentRegistry();
        console.log("   AgentRegistry deployed at:", address(agentRegistry));

        // 2. Deploy ContractMindHub
        console.log("\n2. Deploying ContractMindHubV2...");
        hub = new ContractMindHubV2(address(agentRegistry), feeCollector);
        console.log("   ContractMindHubV2 deployed at:", address(hub));

        // 3. Deploy TestToken (for testing)
        console.log("\n3. Deploying TestToken...");
        testToken = new TestToken(
            "Test SOMI",
            "TSOMI",
            1_000_000 * 10 ** 18 // 1 million tokens
        );
        console.log("   TestToken deployed at:", address(testToken));

        // 4. Deploy HubAwareStaking
        console.log("\n4. Deploying HubAwareStaking...");
        staking = new HubAwareStaking(address(testToken), address(hub));
        console.log("   HubAwareStaking deployed at:", address(staking));

        // 5. Setup: Fund staking contract with rewards
        console.log("\n5. Setting up staking contract...");
        uint256 rewardsAmount = 100_000 * 10 ** 18; // 100k tokens for rewards
        testToken.approve(address(staking), rewardsAmount);
        staking.fundRewardsPool(rewardsAmount);
        console.log(
            "   Funded staking with",
            rewardsAmount / 10 ** 18,
            "tokens"
        );

        vm.stopBroadcast();

        // Print summary
        console.log("\n========================================");
        console.log("Deployment Summary");
        console.log("========================================");
        console.log("AgentRegistry:", address(agentRegistry));
        console.log("ContractMindHubV2:", address(hub));
        console.log("TestToken:", address(testToken));
        console.log("HubAwareStaking:", address(staking));
        console.log("========================================");
        console.log("\nNext Steps:");
        console.log("1. Save these addresses to your .env file");
        console.log("2. Verify contracts on block explorer");
        console.log("3. Update backend configuration");
        console.log("========================================");

        // Write deployment info to file
        _writeDeploymentInfo();
    }

    function _writeDeploymentInfo() internal {
        // Build JSON in parts to avoid stack too deep
        string memory part1 = string(
            abi.encodePacked(
                "{\n",
                '  "network": "',
                _getNetworkName(),
                '",\n',
                '  "timestamp": "',
                vm.toString(block.timestamp),
                '",\n'
            )
        );

        string memory part2 = string(
            abi.encodePacked(
                '  "deployer": "',
                vm.toString(_deployer),
                '",\n',
                '  "contracts": {\n'
            )
        );

        string memory part3 = string(
            abi.encodePacked(
                '    "AgentRegistry": "',
                vm.toString(address(agentRegistry)),
                '",\n',
                '    "ContractMindHubV2": "',
                vm.toString(address(hub)),
                '",\n'
            )
        );

        string memory part4 = string(
            abi.encodePacked(
                '    "TestToken": "',
                vm.toString(address(testToken)),
                '",\n',
                '    "HubAwareStaking": "',
                vm.toString(address(staking)),
                '"\n',
                "  }\n",
                "}\n"
            )
        );

        string memory deploymentInfo = string(
            abi.encodePacked(part1, part2, part3, part4)
        );

        // Ensure deployments directory exists then write file
        vm.createDir("deployments", true);
        vm.writeFile("deployments/latest.json", deploymentInfo);
        console.log("\nDeployment info saved to: deployments/latest.json");
    }

    function _getNetworkName() internal view returns (string memory) {
        uint256 chainId = block.chainid;

        if (chainId == 1) return "mainnet";
        if (chainId == 11155111) return "sepolia";
        if (chainId == 50312) return "somnia-testnet";
        if (chainId == 31337) return "localhost";

        return vm.toString(chainId);
    }
}
