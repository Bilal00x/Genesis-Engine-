"""
Asset Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

from app.models.asset import AssetType


class AssetBase(BaseModel):
    type: AssetType
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)


class AssetCreate(AssetBase):
    file_path: str
    project_id: Optional[uuid.UUID] = None
    metadata: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    folder_path: Optional[str] = None


class AssetUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    metadata: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    folder_path: Optional[str] = None
    is_favorite: Optional[bool] = None
    is_public: Optional[bool] = None


class AssetResponse(AssetBase):
    id: uuid.UUID
    project_id: Optional[uuid.UUID] = None
    organization_id: Optional[uuid.UUID] = None
    file_path: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[int] = None
    metadata: Dict[str, Any] = {}
    tags: List[str] = []
    folder_path: Optional[str] = None
    is_favorite: bool = False
    is_public: bool = False
    license: str = "all-rights-reserved"
    source_generation_id: Optional[uuid.UUID] = None
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AssetListParams(BaseModel):
    type: Optional[AssetType] = None
    project_id: Optional[uuid.UUID] = None
    folder_path: Optional[str] = None
    tags: Optional[List[str]] = None
    search: Optional[str] = None
    is_favorite: Optional[bool] = None
    sort_by: str = "created_at"
    sort_order: str = "desc"
    limit: int = Field(20, ge=1, le=100)
    offset: int = Field(0, ge=0)


class AssetListResponse(BaseModel):
    items: List[AssetResponse]
    total: int
    limit: int
    offset: int
    has_more: bool