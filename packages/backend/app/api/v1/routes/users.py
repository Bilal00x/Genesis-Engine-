"""
User Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserUpdate, UserResponse, UserCreditsResponse, APIKeyCreate, APIKeyResponse, APIKeyWithSecret
from app.services.user_service import UserService
from app.services.auth_service import AuthService

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Get current user"""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Update current user"""
    user_service = UserService(db)
    user = await user_service.update(current_user.id, user_data)
    return user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Delete current user account"""
    user_service = UserService(db)
    await user_service.delete(current_user.id)
    return None


@router.get("/me/credits", response_model=UserCreditsResponse)
async def get_user_credits(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Get user credits"""
    user_service = UserService(db)
    credits = await user_service.get_credits(current_user.id)
    return credits


@router.get("/me/api-keys", response_model=List[APIKeyResponse])
async def list_api_keys(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """List API keys"""
    user_service = UserService(db)
    keys = await user_service.list_api_keys(current_user.id)
    return keys


@router.post("/me/api-keys", response_model=APIKeyWithSecret)
async def create_api_key(
    key_data: APIKeyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Create API key"""
    user_service = UserService(db)
    api_key = await user_service.create_api_key(
        current_user.id,
        key_data.name,
        key_data.expires_in_days,
    )
    return api_key


@router.delete("/me/api-keys/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_api_key(
    key_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Revoke API key"""
    user_service = UserService(db)
    await user_service.revoke_api_key(current_user.id, key_id)
    return None