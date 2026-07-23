"""
Admin Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid

from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.organization import Organization
from app.models.audit import AuditLog
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.services.admin_service import AdminService

router = APIRouter()


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    role: str = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """List all users (admin only)"""
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    
    admin_service = AdminService(db)
    users = await admin_service.list_users(role, limit, offset)
    return users


@router.get("/stats")
async def get_system_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Get system statistics"""
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    
    admin_service = AdminService(db)
    stats = await admin_service.get_system_stats()
    return stats


@router.get("/logs")
async def get_audit_logs(
    action: str = None,
    resource_type: str = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Get audit logs"""
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    
    admin_service = AdminService(db)
    logs = await admin_service.get_audit_logs(action, resource_type, limit, offset)
    return logs


@router.put("/users/{user_id}")
async def update_user(
    user_id: uuid.UUID,
    role: UserRole,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Update user role (admin only)"""
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    
    admin_service = AdminService(db)
    user = await admin_service.update_user_role(user_id, role)
    return user