// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgentRegistry
 * @notice Registry contract for managing ContractMind AI agents
 * @dev Stores agent configurations and metadata for the ContractMind platform
 */
contract AgentRegistry is Ownable, ReentrancyGuard {
    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/

    struct Agent {
        address owner; // Agent creator/owner
        address targetContract; // Primary contract this agent interacts with
        string name; // Agent display name
        string configIPFS; // IPFS hash of full configuration
        bool active; // Is agent currently active
        uint256 createdAt; // Creation timestamp
        uint256 updatedAt; // Last update timestamp
    }

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    mapping(bytes32 => Agent) public agents;
    mapping(address => bytes32[]) public agentsByOwner;
    mapping(address => bytes32[]) public agentsByContract;

    uint256 public agentCount;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event AgentRegistered(
        bytes32 indexed agentId,
        address indexed owner,
        address indexed targetContract,
        string name
    );

    event AgentUpdated(bytes32 indexed agentId, string configIPFS);

    event AgentDeactivated(bytes32 indexed agentId);
    event AgentReactivated(bytes32 indexed agentId);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidTarget();
    error NameRequired();
    error ConfigRequired();
    error AgentNotFound();
    error NotAgentOwner();
    error AgentAlreadyExists();

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() Ownable(msg.sender) {}

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Register a new AI agent
     * @param targetContract The contract the agent will interact with
     * @param name Display name for the agent
     * @param configIPFS IPFS hash containing full configuration (ABI, personality, etc.)
     * @return agentId Unique identifier for the agent
     */
    function registerAgent(
        address targetContract,
        string calldata name,
        string calldata configIPFS
    ) external nonReentrant returns (bytes32 agentId) {
        if (targetContract == address(0)) revert InvalidTarget();
        if (bytes(name).length == 0) revert NameRequired();
        if (bytes(configIPFS).length == 0) revert ConfigRequired();

        // Generate unique agent ID
        agentId = keccak256(
            abi.encodePacked(
                msg.sender,
                targetContract,
                name,
                block.timestamp,
                agentCount
            )
        );

        // Check if agent already exists
        if (agents[agentId].owner != address(0)) revert AgentAlreadyExists();

        // Create agent
        agents[agentId] = Agent({
            owner: msg.sender,
            targetContract: targetContract,
            name: name,
            configIPFS: configIPFS,
            active: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        // Update indexes
        agentsByOwner[msg.sender].push(agentId);
        agentsByContract[targetContract].push(agentId);
        agentCount++;

        emit AgentRegistered(agentId, msg.sender, targetContract, name);
    }

    /**
     * @notice Update agent configuration
     * @param agentId Agent identifier
     * @param configIPFS New IPFS configuration hash
     */
    function updateAgent(bytes32 agentId, string calldata configIPFS) external {
        Agent storage agent = agents[agentId];
        if (agent.owner == address(0)) revert AgentNotFound();
        if (agent.owner != msg.sender) revert NotAgentOwner();
        if (bytes(configIPFS).length == 0) revert ConfigRequired();

        agent.configIPFS = configIPFS;
        agent.updatedAt = block.timestamp;

        emit AgentUpdated(agentId, configIPFS);
    }

    /**
     * @notice Deactivate an agent
     * @param agentId Agent identifier
     */
    function deactivateAgent(bytes32 agentId) external {
        Agent storage agent = agents[agentId];
        if (agent.owner == address(0)) revert AgentNotFound();
        if (agent.owner != msg.sender) revert NotAgentOwner();

        agent.active = false;
        agent.updatedAt = block.timestamp;

        emit AgentDeactivated(agentId);
    }

    /**
     * @notice Reactivate an agent
     * @param agentId Agent identifier
     */
    function reactivateAgent(bytes32 agentId) external {
        Agent storage agent = agents[agentId];
        if (agent.owner == address(0)) revert AgentNotFound();
        if (agent.owner != msg.sender) revert NotAgentOwner();

        agent.active = true;
        agent.updatedAt = block.timestamp;

        emit AgentReactivated(agentId);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Check if an agent is active
     * @param agentId Agent identifier
     * @return bool Active status
     */
    function isAgentActive(bytes32 agentId) external view returns (bool) {
        return agents[agentId].active;
    }

    /**
     * @notice Get agent owner
     * @param agentId Agent identifier
     * @return address Owner address
     */
    function getAgentOwner(bytes32 agentId) external view returns (address) {
        return agents[agentId].owner;
    }

    /**
     * @notice Get agent target contract
     * @param agentId Agent identifier
     * @return address Target contract address
     */
    function getAgentTarget(bytes32 agentId) external view returns (address) {
        return agents[agentId].targetContract;
    }

    /**
     * @notice Get all agents owned by an address
     * @param owner Owner address
     * @return bytes32[] Array of agent IDs
     */
    function getAgentsByOwner(
        address owner
    ) external view returns (bytes32[] memory) {
        return agentsByOwner[owner];
    }

    /**
     * @notice Get all agents for a specific contract
     * @param contractAddr Contract address
     * @return bytes32[] Array of agent IDs
     */
    function getAgentsByContract(
        address contractAddr
    ) external view returns (bytes32[] memory) {
        return agentsByContract[contractAddr];
    }

    /**
     * @notice Get full agent details
     * @param agentId Agent identifier
     * @return agent Agent struct
     */
    function getAgent(
        bytes32 agentId
    ) external view returns (Agent memory agent) {
        return agents[agentId];
    }
}
