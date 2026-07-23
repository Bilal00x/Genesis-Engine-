"""
User Service
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
import uuid
import secrets
import hashlib

from app.models.user import User, APIKey
from app.models.organization import Organization
from app.schemas.user import UserUpdate


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        """Get user by ID"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def update(self, user_id: uuid.UUID, user_data: UserUpdate) -> User:
        """Update user"""
        user = await self.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        update_data = user_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def delete(self, user_id: uuid.UUID):
        """Delete user"""
        user = await self.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        await self.db.delete(user)
        await self.db.commit()
    
    async def get_credits(self, user_id: uuid.UUID) -> dict:
        """Get user credits"""
        user = await self.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        # Calculate usage this month
        from app.models.generation import Generation
        from app.models.payment import CreditTransaction
        
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Get credits used this month from generations
        result = await self.db.execute(
            select(Generation)
            .where(Generation.user_id == user_id)
            .where(Generation.created_at >= month_start)
        )
        generations = result.scalars().all()
        used_this_month = sum(g.credits_used for g in generations)
        
        # Calculate reset date (first day of next month)
        if now.month == 12:
            reset_date = now.replace(year=now.year + 1, month=1, day=1)
        else:
            reset_date = now.replace(month=now.month + 1, day=1)
        
        return {
            "available": user.credits,
            "used_this_month": used_this_month,
            "reset_date": reset_date,
        }
    
    async def list_api_keys(self, user_id: uuid.UUID) -> list[APIKey]:
        """List user API keys"""
        result = await self.db.execute(
            select(APIKey)
            .where(APIKey.user_id == user_id)
            .where(APIKey.expires_at == None or APIKey.expires_at > datetime.utcnow())
            .order_by(APIKey.created_at.desc())
        )
        return result.scalars().all()
    
    async def create_api_key(
        self,
        user_id: uuid.UUID,
        name: str,
        expires_in_days: int | None = None,
    ) -> APIKey:
        """Create API key"""
        # Generate random key
        raw_key = secrets.token_urlsafe(32)
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
        
        # Calculate expiry
        expires_at = None
        if expires_in_days:
            expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
        
        api_key = APIKey(
            user_id=user_id,
            name=name,
            key_hash=key_hash,
            expires_at=expires_at,
        )
        
        self.db.add(api_key)
        await self.db.commit()
        await self.db.refresh(api_key)
        
        # Return with raw key (only shown once)
        api_key.key = raw_key  # type: ignore
        return api_key
    
    async def revoke_api_key(self, user_id: uuid.UUID, key_id: uuid.UUID):
        """Revoke API key"""
        result = await self.db.execute(
            select(APIKey)
            .where(APIKey.id == key_id)
            .where(APIKey.user_id == user_id)
        )
        api_key = result.scalar_one_or_none()
        
        if not api_key:
            raise ValueError("API key not found")
        
        await self.db.delete(api_key)
        await self.db.commit()