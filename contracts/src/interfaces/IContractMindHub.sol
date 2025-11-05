// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IContractMindHub
 * @notice Interface for ContractMind Hub
 */
interface IContractMindHub {
    function executeOnTarget(
        bytes32 agentId,
        address targetContract,
        bytes calldata callData
    ) external payable returns (bytes memory);

    function queryTarget(
        bytes32 agentId,
        address targetContract,
        bytes calldata callData
    ) external view returns (bytes memory);
}
