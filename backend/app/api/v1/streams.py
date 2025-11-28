"""
Somnia Data Streams API Endpoints

REST API endpoints for interacting with Somnia Data Streams.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from loguru import logger

from app.services.streams_service import get_streams_service


router = APIRouter(prefix="/streams", tags=["Somnia Streams"])


# ============================================
# Request/Response Models
# ============================================


class StreamStatusResponse(BaseModel):
    """Stream service status"""

    enabled: bool
    connected: bool
    chain_id: Optional[int] = None
    schemas: List[str] = []


class PublishAgentExecutionRequest(BaseModel):
    """Request to publish agent execution event"""

    agent_id: str = Field(..., description="Agent identifier")
    executor: str = Field(..., description="Executor address")
    function_selector: str = Field(..., description="Function selector (4 bytes)")
    success: bool = Field(..., description="Whether execution succeeded")
    gas_used: int = Field(..., ge=0, description="Gas consumed")
    error_message: str = Field(default="", description="Error message if failed")


class PublishChatMessageRequest(BaseModel):
    """Request to publish chat message"""

    session_id: str = Field(..., description="Chat session ID")
    sender: str = Field(..., description="Sender address")
    agent_id: str = Field(..., description="Agent ID")
    role: str = Field(..., description="Message role (user/assistant/system)")
    content: str = Field(..., description="Message content")
    intent_action: str = Field(default="", description="Detected intent action")


class PublishAnalyticsRequest(BaseModel):
    """Request to publish analytics snapshot"""

    agent_id: str = Field(..., description="Agent identifier")
    total_calls: int = Field(..., ge=0, description="Total calls")
    success_count: int = Field(..., ge=0, description="Successful calls")
    total_gas_used: int = Field(..., ge=0, description="Total gas used")
    unique_users: int = Field(..., ge=0, description="Unique user count")


class PublishTransactionEventRequest(BaseModel):
    """Request to publish transaction event"""

    tx_hash: str = Field(..., description="Transaction hash")
    user: str = Field(..., description="User address")
    agent_id: str = Field(..., description="Agent ID")
    action: str = Field(..., description="Action performed")
    status: str = Field(..., description="Transaction status")
    gas_used: int = Field(..., ge=0, description="Gas consumed")


class PublishActivityRequest(BaseModel):
    """Request to publish activity feed item"""

    entity_id: str = Field(..., description="Entity ID")
    entity_type: str = Field(..., description="Entity type")
    action: str = Field(..., description="Action description")
    actor: str = Field(..., description="Actor address")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Additional metadata")


class UpdateLeaderboardRequest(BaseModel):
    """Request to update leaderboard entry"""

    agent_id: str = Field(..., description="Agent identifier")
    agent_name: str = Field(..., description="Agent name")
    score: int = Field(..., ge=0, description="Computed score")
    total_executions: int = Field(..., ge=0, description="Total executions")
    success_rate: int = Field(..., ge=0, le=100, description="Success rate (0-100)")


class BatchPublishItem(BaseModel):
    """Single item for batch publish"""

    schema_type: str = Field(..., alias="schema", description="Schema type")
    data: Dict[str, Any] = Field(..., description="Data to publish")

    class Config:
        populate_by_name = True


class BatchPublishRequest(BaseModel):
    """Request for batch publishing"""

    items: List[BatchPublishItem] = Field(..., description="Items to publish")


class StreamWriteResponse(BaseModel):
    """Response from stream write operation"""

    success: bool
    tx_hash: Optional[str] = None
    data_id: Optional[str] = None
    error: Optional[str] = None


class BatchWriteResponse(BaseModel):
    """Response from batch write operation"""

    total: int
    successful: int
    failed: int
    results: List[StreamWriteResponse]


# ============================================
# Endpoints
# ============================================


@router.get("/status", response_model=StreamStatusResponse)
async def get_streams_status():
    """
    Get Somnia Data Streams service status.

    Returns connection status and available schemas.
    """
    service = get_streams_service()

    return StreamStatusResponse(
        enabled=service.enabled,
        connected=service.enabled and hasattr(service, "w3") and service.w3.is_connected(),
        chain_id=service.w3.eth.chain_id if service.enabled and hasattr(service, "w3") else None,
        schemas=list(service._schema_ids.keys()) if service.enabled else [],
    )


@router.post("/publish/execution", response_model=StreamWriteResponse)
async def publish_agent_execution(request: PublishAgentExecutionRequest):
    """
    Publish an agent execution event to Somnia Streams.

    Records agent execution metrics including success status and gas usage.
    """
    service = get_streams_service()

    if not service.enabled:
        raise HTTPException(status_code=503, detail="Somnia Streams not enabled")

    result = await service.publish_agent_execution(
        agent_id=request.agent_id,
        executor=request.executor,
        function_selector=request.function_selector,
        success=request.success,
        gas_used=request.gas_used,
        error_message=request.error_message,
    )

    return StreamWriteResponse(
        success=result.success,
        tx_hash=result.tx_hash,
        data_id=result.data_id,
        error=result.error,
    )


@router.post("/publish/chat", response_model=StreamWriteResponse)
async def publish_chat_message(request: PublishChatMessageRequest):
    """
    Publish a chat message to Somnia Streams.

    Stores chat messages on-chain for history and analytics.
    """
    service = get_streams_service()

    if not service.enabled:
        raise HTTPException(status_code=503, detail="Somnia Streams not enabled")

    result = await service.publish_chat_message(
        session_id=request.session_id,
        sender=request.sender,
        agent_id=request.agent_id,
        role=request.role,
        content=request.content,
        intent_action=request.intent_action,
    )

    return StreamWriteResponse(
        success=result.success,
        tx_hash=result.tx_hash,
        data_id=result.data_id,
        error=result.error,
    )


@router.post("/publish/analytics", response_model=StreamWriteResponse)
async def publish_analytics_snapshot(request: PublishAnalyticsRequest):
    """
    Publish an analytics snapshot to Somnia Streams.

    Records agent performance metrics for dashboards and leaderboards.
    """
    service = get_streams_service()

    if not service.enabled:
        raise HTTPException(status_code=503, detail="Somnia Streams not enabled")

    result = await service.publish_analytics_snapshot(
        agent_id=request.agent_id,
        total_calls=request.total_calls,
        success_count=request.success_count,
        total_gas_used=request.total_gas_used,
        unique_users=request.unique_users,
    )

    return StreamWriteResponse(
        success=result.success,
        tx_hash=result.tx_hash,
        data_id=result.data_id,
        error=result.error,
    )


@router.post("/publish/transaction", response_model=StreamWriteResponse)
async def publish_transaction_event(request: PublishTransactionEventRequest):
    """
    Publish a transaction event to Somnia Streams.

    Records transaction details for tracking and analytics.
    """
    service = get_streams_service()

    if not service.enabled:
        raise HTTPException(status_code=503, detail="Somnia Streams not enabled")

    result = await service.publish_transaction_event(
        tx_hash=request.tx_hash,
        user=request.user,
        agent_id=request.agent_id,
        action=request.action,
        status=request.status,
        gas_used=request.gas_used,
    )

    return StreamWriteResponse(
        success=result.success,
        tx_hash=result.tx_hash,
        data_id=result.data_id,
        error=result.error,
    )


@router.post("/publish/activity", response_model=StreamWriteResponse)
async def publish_activity(request: PublishActivityRequest):
    """
    Publish an activity feed item to Somnia Streams.

    Records platform activity for real-time feeds.
    """
    service = get_streams_service()

    if not service.enabled:
        raise HTTPException(status_code=503, detail="Somnia Streams not enabled")

    result = await service.publish_activity(
        entity_id=request.entity_id,
        entity_type=request.entity_type,
        action=request.action,
        actor=request.actor,
        metadata=request.metadata,
    )

    return StreamWriteResponse(
        success=result.success,
        tx_hash=result.tx_hash,
        data_id=result.data_id,
        error=result.error,
    )


@router.post("/publish/leaderboard", response_model=StreamWriteResponse)
async def update_leaderboard(request: UpdateLeaderboardRequest):
    """
    Update a leaderboard entry in Somnia Streams.

    Updates agent rankings and performance scores.
    """
    service = get_streams_service()

    if not service.enabled:
        raise HTTPException(status_code=503, detail="Somnia Streams not enabled")

    result = await service.update_leaderboard(
        agent_id=request.agent_id,
        agent_name=request.agent_name,
        score=request.score,
        total_executions=request.total_executions,
        success_rate=request.success_rate,
    )

    return StreamWriteResponse(
        success=result.success,
        tx_hash=result.tx_hash,
        data_id=result.data_id,
        error=result.error,
    )


@router.post("/publish/batch", response_model=BatchWriteResponse)
async def batch_publish(request: BatchPublishRequest):
    """
    Batch publish multiple items to Somnia Streams.

    Efficiently publishes multiple data items in fewer transactions.
    """
    service = get_streams_service()

    if not service.enabled:
        raise HTTPException(status_code=503, detail="Somnia Streams not enabled")

    items = [{"schema": item.schema_type, "data": item.data} for item in request.items]
    results = await service.batch_publish(items)

    responses = [
        StreamWriteResponse(
            success=r.success,
            tx_hash=r.tx_hash,
            data_id=r.data_id,
            error=r.error,
        )
        for r in results
    ]

    successful = sum(1 for r in results if r.success)

    return BatchWriteResponse(
        total=len(results),
        successful=successful,
        failed=len(results) - successful,
        results=responses,
    )


@router.get("/schemas")
async def get_schemas():
    """
    Get available data stream schemas.

    Returns schema definitions used for data encoding.
    """
    from app.services.streams_service import SCHEMAS

    service = get_streams_service()
    schema_ids = {}

    if service.enabled:
        for name, schema in SCHEMAS.items():
            schema_ids[name] = service._compute_schema_id(schema)

    return {
        "schemas": SCHEMAS,
        "schema_ids": schema_ids,
    }
