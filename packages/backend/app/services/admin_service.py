"""
Admin Service
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List
import uuid

from app.models.user import User, UserRole
from app.models.organization import Organization
from app.models.audit import AuditLog, AuditAction
from app.schemas.user import UserResponse


class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_users(
        self,
        role: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> List[UserResponse]:
        """List all users"""
        query = select(User)
        
        if role:
            query = query.where(User.role == role)
        
        query = query.offset(offset).limit(limit).order_by(User.created_at.desc())
        
        result = await self.db.execute(query)
        users = result.scalars().all()
        
        return [UserResponse.from_orm(user) for user in users]
    
    async def get_system_stats(self) -> dict:
        """Get system statistics"""
        # Get total users
        users_result = await self.db.execute(select(func.count()).select_from(User))
        total_users = users_result.scalar()
        
        # Get active users (last 30 days)
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        active_users_result = await self.db.execute(
            select(func.count()).select_from(User).where(User.last_login_at >= thirty_days_ago)
        )
        active_users = active_users_result.scalar()
        
        # Get total assets
        assets_result = await self.db.execute(select(func.count()).select_from(User))
        total_assets = assets_result.scalar()
        
        # Get total generations
        generations_result = await self.db.execute(select(func.count()).select_from(User))
        total_generations = generations_result.scalar()
        
        # Get total exports
        exports_result = await self.db.execute(select(func.count()).select_from(User))
        total_exports = exports_result.scalar()
        
        # Get total revenue
        revenue_result = await self.db.execute(
            select(func.sum(PaymentTransaction.amount)).select_from(PaymentTransaction)
        )
        total_revenue = revenue_result.scalar() or 0
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "total_assets": total_assets,
            "total_generations": total_generations,
            "total_exports": total_exports,
            "total_revenue": total_revenue,
        }
    
    async def get_audit_logs(
        self,
        action: Optional[str] = None,
        resource_type: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> List[AuditLog]:
        """Get audit logs"""
        query = select(AuditLog)
        
        if action:
            query = query.where(AuditLog.action == action)
        if resource_type:
            query = query.where(AuditLog.resource_type == resource_type)
        
        query = query.offset(offset).limit(limit).order_by(AuditLog.created_at.desc())
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def update_user_role(
        self,
        user_id: uuid.UUID,
        role: UserRole,
    ) -> User:
        """Update user role"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise ValueError("User not found")
        
        user.role = role
        await self.db.commit()
        await self.db.refresh(user)
        
        return user