// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TestToken.sol";

contract DeployTestToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy TestToken with initial supply
        TestToken token = new TestToken(
            "Test Token",
            "TEST",
            1000000 * 10 ** 18 // 1 million tokens with 18 decimals
        );

        console.log("TestToken deployed at:", address(token));
        console.log("Token name:", token.name());
        console.log("Token symbol:", token.symbol());
        console.log("Initial supply:", token.totalSupply());

        vm.stopBroadcast();
    }
}
