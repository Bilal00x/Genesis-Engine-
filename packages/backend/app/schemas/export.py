"""
Export Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

from app.models.generation import ExportFormat, ExportStatus


class ExportBase(BaseModel):
    asset_ids: List[uuid.UUID]
    format: ExportFormat


class ExportCreate(ExportBase):
    settings: Optional[Dict[str, Any]] = None
    project_id: Optional[uuid.UUID] = None


class ExportResponse(ExportBase):
    id: uuid.UUID
    user_id: uuid.UUID
    organization_id: Optional[uuid.UUID] = None
    project_id: Optional[uuid.UUID] = None
    status: ExportStatus
    settings: Dict[str, Any] = {}
    output_path: Optional[str] = None
    file_size: Optional[int] = None
    error_message: Optional[str] = None
    progress: int = 0
    credits_used: int = 0
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True