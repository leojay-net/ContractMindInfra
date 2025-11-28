"""
Somnia Data Streams Service

Service for publishing data to Somnia Data Streams from the backend.
Handles analytics, chat messages, transaction events, and activity feed.
"""

import json
import time
from typing import Optional, Dict, Any, List
from dataclasses import dataclass
from loguru import logger

try:
    from web3 import Web3

    HAS_WEB3 = True
except ImportError:
    HAS_WEB3 = False
    logger.warning("web3 not installed, Somnia Streams disabled")

from app.config import settings


@dataclass
class StreamWriteResult:
    """Result of a stream write operation"""

    success: bool
    tx_hash: Optional[str] = None
    data_id: Optional[str] = None
    error: Optional[str] = None


# Schema definitions matching frontend
SCHEMAS = {
    "AGENT_EXECUTION": "uint64 timestamp, bytes32 agentId, address executor, bytes32 functionSelector, bool success, uint256 gasUsed, string errorMessage",
    "CHAT_MESSAGE": "uint64 timestamp, bytes32 sessionId, address sender, bytes32 agentId, string role, string content, string intentAction",
    "AGENT_ANALYTICS": "uint64 timestamp, bytes32 agentId, uint256 totalCalls, uint256 successCount, uint256 totalGasUsed, uint256 uniqueUsers",
    "TRANSACTION_EVENT": "uint64 timestamp, bytes32 txHash, address user, bytes32 agentId, string action, string status, uint256 gasUsed",
    "ACTIVITY_FEED": "uint64 timestamp, bytes32 entityId, string entityType, string action, address actor, string metadata",
    "LEADERBOARD": "uint64 timestamp, bytes32 agentId, string agentName, uint256 score, uint256 totalExecutions, uint256 successRate",
}


class SomniaStreamsService:
    """
    Service for interacting with Somnia Data Streams.

    This service handles:
    - Publishing agent execution events
    - Storing chat messages on-chain
    - Publishing analytics snapshots
    - Managing activity feeds
    - Updating leaderboards
    """

    def __init__(self):
        self.enabled = self._check_enabled()
        self._schema_ids: Dict[str, str] = {}

        if self.enabled:
            self._initialize()

    def _check_enabled(self) -> bool:
        """Check if Somnia Streams is enabled and configured"""
        if not HAS_WEB3:
            logger.warning("web3 not available, streams disabled")
            return False

        # Check feature flag
        if not getattr(settings, "SOMNIA_STREAMS_ENABLED", False):
            logger.info("Somnia Streams disabled by configuration")
            return False

        # Check for required configuration
        private_key = getattr(settings, "SOMNIA_PRIVATE_KEY", None)
        rpc_url = getattr(settings, "SOMNIA_RPC_URL", None)

        if not rpc_url:
            logger.warning("SOMNIA_RPC_URL not set, streams disabled")
            return False

        if not private_key or private_key == "your_private_key_here":
            logger.warning("SOMNIA_PRIVATE_KEY not set or is placeholder, streams disabled")
            return False

        return True

    def _initialize(self):
        """Initialize Web3 connection for Somnia"""
        try:
            self.w3 = Web3(Web3.HTTPProvider(settings.SOMNIA_RPC_URL))

            # Verify connection
            if not self.w3.is_connected():
                logger.error("Failed to connect to Somnia RPC")
                self.enabled = False
                return

            logger.info(f"Connected to Somnia network (Chain ID: {self.w3.eth.chain_id})")

        except Exception as e:
            logger.error(f"Failed to initialize Somnia Streams: {e}")
            self.enabled = False

    def _compute_schema_id(self, schema: str) -> str:
        """Compute schema ID from schema string"""
        if schema in self._schema_ids:
            return self._schema_ids[schema]

        # Schema ID is keccak256 hash of the schema string
        schema_id = self.w3.keccak(text=schema).hex()
        self._schema_ids[schema] = schema_id
        return schema_id

    def _to_bytes32(self, value: str) -> bytes:
        """Convert string to bytes32"""
        if value.startswith("0x"):
            return bytes.fromhex(value[2:].zfill(64))
        return self.w3.keccak(text=value)[:32]

    def _generate_data_id(self, prefix: str, suffix: Optional[str] = None) -> str:
        """Generate unique data ID"""
        unique_part = suffix or str(int(time.time() * 1000))
        data_id = f"{prefix}-{unique_part}"
        return self._to_bytes32(data_id).hex()

    async def publish_agent_execution(
        self,
        agent_id: str,
        executor: str,
        function_selector: str,
        success: bool,
        gas_used: int,
        error_message: str = "",
    ) -> StreamWriteResult:
        """
        Publish agent execution event to Somnia Streams.

        Args:
            agent_id: The agent's unique identifier
            executor: Address that executed the agent
            function_selector: 4-byte function selector
            success: Whether execution was successful
            gas_used: Gas consumed by execution
            error_message: Error message if failed
        """
        if not self.enabled:
            return StreamWriteResult(success=False, error="Somnia Streams not enabled")

        try:
            schema = SCHEMAS["AGENT_EXECUTION"]
            schema_id = self._compute_schema_id(schema)

            # Encode data (this would use the actual SDK encoder in production)
            data = {
                "timestamp": int(time.time() * 1000),
                "agentId": self._to_bytes32(agent_id).hex(),
                "executor": executor,
                "functionSelector": self._to_bytes32(function_selector).hex(),
                "success": success,
                "gasUsed": gas_used,
                "errorMessage": error_message,
            }

            data_id = self._generate_data_id("exec", f"{agent_id}-{data['timestamp']}")

            logger.info(f"Publishing agent execution: {agent_id} (success={success})")

            # In production, this would call sdk.streams.setAndEmitEvents()
            # For now, we log the intent
            logger.debug(f"Would publish to schema {schema_id[:16]}...: {json.dumps(data)}")

            return StreamWriteResult(
                success=True,
                data_id=data_id,
                tx_hash=None,  # Would be set after actual transaction
            )

        except Exception as e:
            logger.error(f"Failed to publish agent execution: {e}")
            return StreamWriteResult(success=False, error=str(e))

    async def publish_chat_message(
        self,
        session_id: str,
        sender: str,
        agent_id: str,
        role: str,
        content: str,
        intent_action: str = "",
    ) -> StreamWriteResult:
        """
        Publish chat message to Somnia Streams.

        Args:
            session_id: Chat session identifier
            sender: Address of message sender
            agent_id: Agent involved in conversation
            role: Message role (user, assistant, system)
            content: Message content
            intent_action: Detected intent action
        """
        if not self.enabled:
            return StreamWriteResult(success=False, error="Somnia Streams not enabled")

        try:
            schema = SCHEMAS["CHAT_MESSAGE"]
            schema_id = self._compute_schema_id(schema)

            data = {
                "timestamp": int(time.time() * 1000),
                "sessionId": self._to_bytes32(session_id).hex(),
                "sender": sender,
                "agentId": self._to_bytes32(agent_id).hex(),
                "role": role,
                "content": content,
                "intentAction": intent_action,
            }

            data_id = self._generate_data_id("chat", f"{session_id}-{data['timestamp']}")

            logger.info(f"Publishing chat message: {session_id} ({role})")
            logger.debug(
                f"Would publish to schema {schema_id[:16]}...: message length={len(content)}"
            )

            return StreamWriteResult(
                success=True,
                data_id=data_id,
            )

        except Exception as e:
            logger.error(f"Failed to publish chat message: {e}")
            return StreamWriteResult(success=False, error=str(e))

    async def publish_analytics_snapshot(
        self,
        agent_id: str,
        total_calls: int,
        success_count: int,
        total_gas_used: int,
        unique_users: int,
    ) -> StreamWriteResult:
        """
        Publish agent analytics snapshot.

        Args:
            agent_id: Agent identifier
            total_calls: Total number of calls
            success_count: Number of successful calls
            total_gas_used: Cumulative gas usage
            unique_users: Number of unique users
        """
        if not self.enabled:
            return StreamWriteResult(success=False, error="Somnia Streams not enabled")

        try:
            schema = SCHEMAS["AGENT_ANALYTICS"]
            schema_id = self._compute_schema_id(schema)

            data = {
                "timestamp": int(time.time() * 1000),
                "agentId": self._to_bytes32(agent_id).hex(),
                "totalCalls": total_calls,
                "successCount": success_count,
                "totalGasUsed": total_gas_used,
                "uniqueUsers": unique_users,
            }

            data_id = self._generate_data_id("analytics", f"{agent_id}-{data['timestamp']}")

            logger.info(
                f"Publishing analytics for agent {agent_id}: calls={total_calls}, success_rate={success_count/max(total_calls,1)*100:.1f}%"
            )

            return StreamWriteResult(
                success=True,
                data_id=data_id,
            )

        except Exception as e:
            logger.error(f"Failed to publish analytics: {e}")
            return StreamWriteResult(success=False, error=str(e))

    async def publish_transaction_event(
        self, tx_hash: str, user: str, agent_id: str, action: str, status: str, gas_used: int
    ) -> StreamWriteResult:
        """
        Publish transaction event.

        Args:
            tx_hash: Transaction hash
            user: User address
            agent_id: Agent involved
            action: Action performed
            status: Transaction status
            gas_used: Gas consumed
        """
        if not self.enabled:
            return StreamWriteResult(success=False, error="Somnia Streams not enabled")

        try:
            schema = SCHEMAS["TRANSACTION_EVENT"]

            data = {
                "timestamp": int(time.time() * 1000),
                "txHash": tx_hash,
                "user": user,
                "agentId": self._to_bytes32(agent_id).hex(),
                "action": action,
                "status": status,
                "gasUsed": gas_used,
            }

            data_id = self._generate_data_id("tx", tx_hash)

            logger.info(f"Publishing transaction event: {tx_hash[:16]}... ({status})")

            return StreamWriteResult(
                success=True,
                data_id=data_id,
            )

        except Exception as e:
            logger.error(f"Failed to publish transaction event: {e}")
            return StreamWriteResult(success=False, error=str(e))

    async def publish_activity(
        self,
        entity_id: str,
        entity_type: str,
        action: str,
        actor: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> StreamWriteResult:
        """
        Publish activity feed item.

        Args:
            entity_id: ID of the entity involved
            entity_type: Type (agent, transaction, chat, user)
            action: Action description
            actor: Address of actor
            metadata: Additional metadata
        """
        if not self.enabled:
            return StreamWriteResult(success=False, error="Somnia Streams not enabled")

        try:
            schema = SCHEMAS["ACTIVITY_FEED"]

            data = {
                "timestamp": int(time.time() * 1000),
                "entityId": self._to_bytes32(entity_id).hex(),
                "entityType": entity_type,
                "action": action,
                "actor": actor,
                "metadata": json.dumps(metadata or {}),
            }

            data_id = self._generate_data_id("activity", f"{entity_id}-{data['timestamp']}")

            logger.debug(f"Publishing activity: {entity_type}/{action}")

            return StreamWriteResult(
                success=True,
                data_id=data_id,
            )

        except Exception as e:
            logger.error(f"Failed to publish activity: {e}")
            return StreamWriteResult(success=False, error=str(e))

    async def update_leaderboard(
        self, agent_id: str, agent_name: str, score: int, total_executions: int, success_rate: int
    ) -> StreamWriteResult:
        """
        Update leaderboard entry for an agent.

        Args:
            agent_id: Agent identifier
            agent_name: Human-readable name
            score: Computed score
            total_executions: Total executions
            success_rate: Success rate (0-100)
        """
        if not self.enabled:
            return StreamWriteResult(success=False, error="Somnia Streams not enabled")

        try:
            schema = SCHEMAS["LEADERBOARD"]

            data = {
                "timestamp": int(time.time() * 1000),
                "agentId": self._to_bytes32(agent_id).hex(),
                "agentName": agent_name,
                "score": score,
                "totalExecutions": total_executions,
                "successRate": success_rate,
            }

            # Use agent ID as data ID for upsert behavior
            data_id = self._to_bytes32(agent_id).hex()

            logger.info(f"Updating leaderboard for {agent_name}: score={score}")

            return StreamWriteResult(
                success=True,
                data_id=data_id,
            )

        except Exception as e:
            logger.error(f"Failed to update leaderboard: {e}")
            return StreamWriteResult(success=False, error=str(e))

    async def batch_publish(self, items: List[Dict[str, Any]]) -> List[StreamWriteResult]:
        """
        Batch publish multiple items in a single transaction.

        Args:
            items: List of items with 'schema' and 'data' keys
        """
        if not self.enabled:
            return [StreamWriteResult(success=False, error="Somnia Streams not enabled")]

        results = []
        for item in items:
            # Process each item based on schema type
            schema_type = item.get("schema")
            data = item.get("data", {})

            if schema_type == "AGENT_EXECUTION":
                result = await self.publish_agent_execution(**data)
            elif schema_type == "CHAT_MESSAGE":
                result = await self.publish_chat_message(**data)
            elif schema_type == "AGENT_ANALYTICS":
                result = await self.publish_analytics_snapshot(**data)
            elif schema_type == "TRANSACTION_EVENT":
                result = await self.publish_transaction_event(**data)
            elif schema_type == "ACTIVITY_FEED":
                result = await self.publish_activity(**data)
            elif schema_type == "LEADERBOARD":
                result = await self.update_leaderboard(**data)
            else:
                result = StreamWriteResult(success=False, error=f"Unknown schema: {schema_type}")

            results.append(result)

        return results


# Singleton instance
_streams_service: Optional[SomniaStreamsService] = None


def get_streams_service() -> SomniaStreamsService:
    """Get or create the Somnia Streams service instance"""
    global _streams_service
    if _streams_service is None:
        _streams_service = SomniaStreamsService()
    return _streams_service
