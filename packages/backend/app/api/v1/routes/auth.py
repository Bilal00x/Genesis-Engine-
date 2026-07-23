"""
Authentication Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from app.models.user import User
from app.models.organization import Organization
from app.schemas.auth import LoginResponse, RegisterRequest, TokenRefreshRequest
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter()


@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: Request,
    register_data: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user"""
    auth_service = AuthService(db)
    
    # Check if user already exists
    existing_user = await auth_service.get_user_by_email(register_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    
    # Create user and optionally organization
    user = await auth_service.create_user(
        email=register_data.email,
        password=register_data.password,
        display_name=register_data.display_name,
        organization_name=register_data.organization_name,
    )
    
    # Generate tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="Bearer",
        expires_in=timedelta(minutes=15).seconds,
        user=user,
    )


@router.post("/login", response_model=LoginResponse)
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """Login user"""
    auth_service = AuthService(db)
    
    # Find user
    user = await auth_service.get_user_by_email(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    await auth_service.update_last_login(user, request.client.host if request.client else None)
    
    # Generate tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="Bearer",
        expires_in=timedelta(minutes=15).seconds,
        user=user,
    )


@router.post("/logout")
async def logout(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Logout user"""
    # In a real implementation, you would blacklist the token
    return {"message": "Logged out successfully"}


@router.post("/refresh", response_model=LoginResponse)
async def refresh_token(
    token_data: TokenRefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    """Refresh access token"""
    # Decode refresh token
    payload = decode_token(token_data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    # Get user
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    user_service = UserService(db)
    user = await user_service.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    # Generate new tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="Bearer",
        expires_in=timedelta(minutes=15).seconds,
        user=user,
    )


@router.get("/oauth/{provider}")
async def oauth_login(provider: str, request: Request):
    """OAuth login"""
    if provider not in ["google", "github"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OAuth provider",
        )
    
    # In a real implementation, redirect to OAuth provider
    return {"provider": provider, "url": f"https://{provider}.com/oauth/authorize"}


@router.post("/forgot-password")
async def forgot_password(
    email: str,
    db: AsyncSession = Depends(get_db),
):
    """Request password reset"""
    auth_service = AuthService(db)
    user = await auth_service.get_user_by_email(email)
    
    # Always return success to prevent email enumeration
    if user:
        # Send reset email (implement email service)
        pass
    
    return {"message": "If the email exists, a reset link has been sent"}


@router.post("/reset-password")
async def reset_password(
    token: str,
    new_password: str,
    db: AsyncSession = Depends(get_db),
):
    """Reset password with token"""
    auth_service = AuthService(db)
    
    # Decode and validate token
    payload = decode_token(token)
    if not payload or payload.get("type") != "password_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token",
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token",
        )
    
    # Update password
    await auth_service.reset_password(user_id, new_password)
    
    return {"message": "Password reset successfully"}