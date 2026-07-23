"""
User Schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import uuid

from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    display_name: str = Field(..., min_length=2, max_length=100)
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: uuid.UUID
    role: UserRole
    credits: int
    organization_id: Optional[uuid.UUID] = None
    email_verified: bool = False
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserCreditsResponse(BaseModel):
    available: int
    used_this_month: int
    reset_date: datetime


class APIKeyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    expires_in_days: Optional[int] = Field(None, ge=1, le=365)


class APIKeyResponse(BaseModel):
    id: uuid.UUID
    name: str
    last_used_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime


class APIKeyWithSecret(APIKeyResponse):
    key: str  # Only shown once on creation