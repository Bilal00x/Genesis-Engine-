"""
Auth Service
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import uuid

from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.organization import Organization
from app.schemas.user import UserUpdate

security = HTTPBearer()


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_user_by_email(self, email: str) -> User | None:
        """Get user by email"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_id(self, user_id: uuid.UUID) -> User | None:
        """Get user by ID"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def create_user(
        self,
        email: str,
        password: str,
        display_name: str,
        organization_name: str | None = None,
    ) -> User:
        """Create new user"""
        # Create organization if name provided
        organization = None
        if organization_name:
            organization = Organization(
                name=organization_name,
                slug=organization_name.lower().replace(" ", "-"),
                owner_id=None,  # Will be set after user creation
            )
            self.db.add(organization)
            await self.db.flush()
        
        # Create user
        user = User(
            email=email,
            password_hash=get_password_hash(password),
            display_name=display_name,
            role=UserRole.user,
            organization_id=organization.id if organization else None,
        )
        self.db.add(user)
        await self.db.flush()
        
        # Set organization owner
        if organization:
            organization.owner_id = user.id
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def update_last_login(self, user: User, ip_address: str | None):
        """Update user last login"""
        user.last_login_at = datetime.utcnow()
        user.last_login_ip = ip_address
        await self.db.commit()
    
    async def reset_password(self, user_id: uuid.UUID, new_password: str):
        """Reset user password"""
        user = await self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        user.password_hash = get_password_hash(new_password)
        await self.db.commit()
    
    @staticmethod
    async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: AsyncSession = Depends(get_db),
    ) -> User:
        """Get current authenticated user"""
        from app.core.security import decode_token
        
        token = credentials.credentials
        payload = decode_token(token)
        
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user
        result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user