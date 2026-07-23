"""
Redis Configuration
"""

import redis.asyncio as redis
from app.core.config import settings

# Redis client for caching
redis_cache = redis.from_url(
    settings.redis_cache_url,
    encoding="utf-8",
    decode_responses=True,
)

# Redis client for pub/sub
redis_pubsub = redis.from_url(
    settings.redis_url,
    encoding="utf-8",
    decode_responses=True,
)


async def get_redis_cache() -> redis.Redis:
    """Get Redis cache client"""
    return redis_cache


async def get_redis_pubsub() -> redis.Redis:
    """Get Redis pub/sub client"""
    return redis_pubsub