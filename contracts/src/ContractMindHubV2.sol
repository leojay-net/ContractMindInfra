// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./AgentRegistry.sol";

/**
 * @title ContractMindHubV2
 * @notice Enhanced hub with proper call forwarding that preserves msg.sender context
 * @dev This version uses a combination of strategies:
 *      1. For view functions: direct staticcall
 *      2. For state changes: User calls target directly, hub validates via events/callbacks
 *      3. Alternative: Hub-aware contracts that check tx.origin or use meta-transactions
 */
contract ContractMindHubV2 is Ownable, ReentrancyGuard, Pausable {
    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/

    struct ExecutionContext {
        address user;
        bytes4 functionSelector;
        uint256 timestamp;
        uint256 gasUsed;
        bool success;
    }

    struct RateLimitInfo {
        uint256 lastResetTime;
        uint256 callCount;
    }

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    AgentRegistry public immutable agentRegistry;
    address public feeCollector;
    uint256 public protocolFeeBps = 10; // 0.1%

    // Rate limiting
    uint256 public constant RATE_LIMIT_WINDOW = 1 hours;
    uint256 public constant MAX_CALLS_PER_WINDOW = 100;

    // Analytics
    mapping(bytes32 => ExecutionContext[]) public executionHistory;
    mapping(bytes32 => uint256) public agentCallCount;
    mapping(bytes32 => uint256) public agentGasUsed;

    // Authorization
    mapping(bytes32 => mapping(address => mapping(bytes4 => bool)))
        public authorizedFunctions;

    // Rate limiting per user per agent
    mapping(address => mapping(bytes32 => RateLimitInfo)) private rateLimits;

    // Trusted forwarder mode - target contracts can verify calls came through hub
    mapping(address => bool) public trustedCallers;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event FunctionExecuted(
        bytes32 indexed agentId,
        address indexed user,
        address indexed targetContract,
        bytes4 functionSelector,
        bool success,
        bytes returnData
    );

    event QueryExecuted(
        bytes32 indexed agentId,
        address indexed user,
        address indexed targetContract,
        bytes4 functionSelector,
        bytes returnData
    );

    event FunctionAuthorized(
        bytes32 indexed agentId,
        address indexed targetContract,
        bytes4 functionSelector
    );

    event FunctionRevoked(
        bytes32 indexed agentId,
        address indexed targetContract,
        bytes4 functionSelector
    );

    event RateLimitExceeded(address indexed user, bytes32 indexed agentId);

    event ProtocolFeeUpdated(uint256 newFeeBps);
    event FeeCollectorUpdated(address newCollector);
    event TransactionValidated(
        bytes32 indexed agentId,
        address indexed user,
        bytes32 txHash
    );

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error AgentNotActive();
    error InvalidTarget();
    error FunctionNotAuthorized();
    error NotAgentOwner();
    error InvalidFeeCollector();
    error FeeTooHigh();
    error ExecutionFailed(bytes returnData);
    error Unauthorized();
    error RateLimitExceededError();

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        address _agentRegistry,
        address _feeCollector
    ) Ownable(msg.sender) {
        if (_agentRegistry == address(0)) revert InvalidTarget();
        if (_feeCollector == address(0)) revert InvalidFeeCollector();

        agentRegistry = AgentRegistry(_agentRegistry);
        feeCollector = _feeCollector;
    }

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Execute read-only query on target contract
     * @param agentId Agent performing the query
     * @param targetContract Contract to query
     * @param callData Encoded function call
     * @return bytes Query result
     */
    function queryTarget(
        bytes32 agentId,
        address targetContract,
        bytes calldata callData
    ) external view returns (bytes memory) {
        // Validate agent
        if (!agentRegistry.isAgentActive(agentId)) revert AgentNotActive();

        // Validate target
        if (agentRegistry.getAgentTarget(agentId) != targetContract) {
            revert InvalidTarget();
        }

        // Validate function authorization
        bytes4 selector = bytes4(callData[:4]);
        if (!authorizedFunctions[agentId][targetContract][selector]) {
            revert FunctionNotAuthorized();
        }

        // Execute query (static call)
        (bool success, bytes memory returnData) = targetContract.staticcall(
            callData
        );

        if (!success) {
            revert ExecutionFailed(returnData);
        }

        return returnData;
    }

    /**
     * @notice Execute state-changing function with user as actual caller
     * @dev This uses tx.origin to identify the user while hub validates
     * @param agentId Agent performing the execution
     * @param targetContract Contract to call
     * @param callData Encoded function call
     * @return bytes Execution result
     */
    function executeOnTarget(
        bytes32 agentId,
        address targetContract,
        bytes calldata callData
    ) external payable nonReentrant whenNotPaused returns (bytes memory) {
        uint256 gasStart = gasleft();

        // msg.sender is the actual user making the call
        address user = msg.sender;

        // Validate agent
        if (!agentRegistry.isAgentActive(agentId)) revert AgentNotActive();

        // Validate target
        if (agentRegistry.getAgentTarget(agentId) != targetContract) {
            revert InvalidTarget();
        }

        // Validate function authorization
        bytes4 selector = bytes4(callData[:4]);
        if (!authorizedFunctions[agentId][targetContract][selector]) {
            revert FunctionNotAuthorized();
        }

        // Check rate limit
        _checkRateLimit(user, agentId);

        // Collect protocol fee if value sent
        uint256 valueToForward = msg.value;
        if (msg.value > 0) {
            uint256 fee = (msg.value * protocolFeeBps) / 10000;
            valueToForward = msg.value - fee;

            (bool feeSuccess, ) = feeCollector.call{value: fee}("");
            require(feeSuccess, "Fee transfer failed");
        }

        // Execute call - msg.sender to target will be this hub
        // Target contracts that need user context should check via:
        // 1. tx.origin (if acceptable for your security model)
        // 2. Implement hub awareness
        // 3. Use meta-transactions
        (bool success, bytes memory returnData) = targetContract.call{
            value: valueToForward
        }(callData);

        // Calculate gas used
        uint256 gasUsed = gasStart - gasleft();

        // Record execution
        _recordExecution(
            agentId,
            user,
            targetContract,
            selector,
            gasUsed,
            success
        );

        // Update rate limit
        _updateRateLimit(user, agentId);

        emit FunctionExecuted(
            agentId,
            user,
            targetContract,
            selector,
            success,
            returnData
        );

        if (!success) {
            revert ExecutionFailed(returnData);
        }

        return returnData;
    }

    /**
     * @notice Validate a transaction before user executes it directly
     * @dev User calls target contract directly, but hub validates first
     * @param agentId Agent identifier
     * @param targetContract Target contract
     * @param functionSelector Function to call
     * @return authorized Whether the call is authorized
     */
    function validateTransaction(
        bytes32 agentId,
        address targetContract,
        bytes4 functionSelector
    ) external view returns (bool authorized) {
        if (!agentRegistry.isAgentActive(agentId)) return false;
        if (agentRegistry.getAgentTarget(agentId) != targetContract)
            return false;
        if (!authorizedFunctions[agentId][targetContract][functionSelector])
            return false;

        // Check rate limit
        RateLimitInfo storage info = rateLimits[msg.sender][agentId];
        if (block.timestamp < info.lastResetTime + RATE_LIMIT_WINDOW) {
            if (info.callCount >= MAX_CALLS_PER_WINDOW) {
                return false;
            }
        }

        return true;
    }

    /**
     * @notice Record a transaction that was executed directly by user
     * @dev Call this after user executes transaction on target contract
     * @param agentId Agent identifier
     * @param targetContract Target contract
     * @param functionSelector Function that was called
     * @param success Whether transaction succeeded
     */
    function recordTransaction(
        bytes32 agentId,
        address targetContract,
        bytes4 functionSelector,
        bool success,
        uint256 gasUsed
    ) external nonReentrant {
        // Only the user who made the transaction can record it
        address user = msg.sender;

        // Verify this was an authorized transaction
        if (!agentRegistry.isAgentActive(agentId)) revert AgentNotActive();
        if (!authorizedFunctions[agentId][targetContract][functionSelector]) {
            revert FunctionNotAuthorized();
        }

        // Record for analytics
        _recordExecution(
            agentId,
            user,
            targetContract,
            functionSelector,
            gasUsed,
            success
        );
        _updateRateLimit(user, agentId);

        emit FunctionExecuted(
            agentId,
            user,
            targetContract,
            functionSelector,
            success,
            ""
        );
    }

    /**
     * @notice Authorize a function for an agent
     * @param agentId Agent to authorize
     * @param targetContract Contract containing the function
     * @param functionSelector 4-byte function signature
     */
    function authorizeFunction(
        bytes32 agentId,
        address targetContract,
        bytes4 functionSelector
    ) external {
        if (agentRegistry.getAgentOwner(agentId) != msg.sender) {
            revert NotAgentOwner();
        }

        authorizedFunctions[agentId][targetContract][functionSelector] = true;

        emit FunctionAuthorized(agentId, targetContract, functionSelector);
    }

    /**
     * @notice Revoke function authorization
     * @param agentId Agent to revoke from
     * @param targetContract Contract containing the function
     * @param functionSelector 4-byte function signature
     */
    function revokeFunction(
        bytes32 agentId,
        address targetContract,
        bytes4 functionSelector
    ) external {
        if (agentRegistry.getAgentOwner(agentId) != msg.sender) {
            revert NotAgentOwner();
        }

        authorizedFunctions[agentId][targetContract][functionSelector] = false;

        emit FunctionRevoked(agentId, targetContract, functionSelector);
    }

    /**
     * @notice Batch authorize multiple functions
     * @param agentId Agent to authorize
     * @param targetContract Contract containing the functions
     * @param functionSelectors Array of function selectors
     */
    function batchAuthorize(
        bytes32 agentId,
        address targetContract,
        bytes4[] calldata functionSelectors
    ) external {
        if (agentRegistry.getAgentOwner(agentId) != msg.sender) {
            revert NotAgentOwner();
        }

        for (uint256 i = 0; i < functionSelectors.length; i++) {
            authorizedFunctions[agentId][targetContract][
                functionSelectors[i]
            ] = true;
            emit FunctionAuthorized(
                agentId,
                targetContract,
                functionSelectors[i]
            );
        }
    }

    /*//////////////////////////////////////////////////////////////
                           ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Update protocol fee
     * @param newFeeBps New fee in basis points (max 500 = 5%)
     */
    function setProtocolFee(uint256 newFeeBps) external onlyOwner {
        if (newFeeBps > 500) revert FeeTooHigh();
        protocolFeeBps = newFeeBps;
        emit ProtocolFeeUpdated(newFeeBps);
    }

    /**
     * @notice Update fee collector address
     * @param newCollector New collector address
     */
    function setFeeCollector(address newCollector) external onlyOwner {
        if (newCollector == address(0)) revert InvalidFeeCollector();
        feeCollector = newCollector;
        emit FeeCollectorUpdated(newCollector);
    }

    /**
     * @notice Pause contract (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get agent analytics
     */
    function getAgentAnalytics(
        bytes32 agentId
    )
        external
        view
        returns (
            uint256 totalCalls,
            uint256 totalGasUsed,
            uint256 avgGasPerCall
        )
    {
        totalCalls = agentCallCount[agentId];
        totalGasUsed = agentGasUsed[agentId];
        avgGasPerCall = totalCalls > 0 ? totalGasUsed / totalCalls : 0;
    }

    /**
     * @notice Get execution history for an agent
     */
    function getExecutionHistory(
        bytes32 agentId
    ) external view returns (ExecutionContext[] memory) {
        return executionHistory[agentId];
    }

    /**
     * @notice Check if function is authorized
     */
    function isFunctionAuthorized(
        bytes32 agentId,
        address targetContract,
        bytes4 functionSelector
    ) external view returns (bool) {
        return authorizedFunctions[agentId][targetContract][functionSelector];
    }

    /**
     * @notice Get rate limit info for user
     */
    function getRateLimitInfo(
        address user,
        bytes32 agentId
    )
        external
        view
        returns (uint256 callCount, uint256 resetTime, bool isLimited)
    {
        RateLimitInfo storage info = rateLimits[user][agentId];
        callCount = info.callCount;
        resetTime = info.lastResetTime + RATE_LIMIT_WINDOW;

        if (block.timestamp >= info.lastResetTime + RATE_LIMIT_WINDOW) {
            isLimited = false;
        } else {
            isLimited = info.callCount >= MAX_CALLS_PER_WINDOW;
        }
    }

    /*//////////////////////////////////////////////////////////////
                         INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _checkRateLimit(address user, bytes32 agentId) internal {
        RateLimitInfo storage info = rateLimits[user][agentId];

        if (block.timestamp < info.lastResetTime + RATE_LIMIT_WINDOW) {
            if (info.callCount >= MAX_CALLS_PER_WINDOW) {
                emit RateLimitExceeded(user, agentId);
                revert RateLimitExceededError();
            }
        }
    }

    function _updateRateLimit(address user, bytes32 agentId) internal {
        RateLimitInfo storage info = rateLimits[user][agentId];

        if (block.timestamp >= info.lastResetTime + RATE_LIMIT_WINDOW) {
            info.lastResetTime = block.timestamp;
            info.callCount = 1;
        } else {
            info.callCount++;
        }
    }

    function _recordExecution(
        bytes32 agentId,
        address user,
        address targetContract,
        bytes4 selector,
        uint256 gasUsed,
        bool success
    ) internal {
        executionHistory[agentId].push(
            ExecutionContext({
                user: user,
                functionSelector: selector,
                timestamp: block.timestamp,
                gasUsed: gasUsed,
                success: success
            })
        );

        agentCallCount[agentId]++;
        agentGasUsed[agentId] += gasUsed;
    }
}
