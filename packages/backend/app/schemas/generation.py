"""
Generation Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

from app.models.generation import GenerationType, GenerationStatus


class GenerationBase(BaseModel):
    type: GenerationType
    provider: str


class GenerationCreate(GenerationBase):
    input_data: Dict[str, Any]
    project_id: Optional[uuid.UUID] = None
    webhook_url: Optional[str] = None


class GenerationResponse(GenerationBase):
    id: uuid.UUID
    user_id: uuid.UUID
    organization_id: Optional[uuid.UUID] = None
    project_id: Optional[uuid.UUID] = None
    status: GenerationStatus
    input_data: Dict[str, Any]
    output_data: Optional[Dict[str, Any]] = None
    progress: int = 0
    error_message: Optional[str] = None
    result_asset_ids: Optional[List[uuid.UUID]] = None
    credits_used: int = 0
    metadata: Dict[str, Any] = {}
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ImageGenerationRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = None
    provider: str = "stable_diffusion"
    style: Optional[str] = None
    width: int = 1024
    height: int = 1024
    steps: int = 30
    guidance_scale: float = 7.5
    seed: Optional[int] = None
    variations: int = 1


class ImageToImageRequest(ImageGenerationRequest):
    image_url: str
    strength: float = 0.75


class TextTo3DRequest(BaseModel):
    prompt: str
    provider: str = "meshy"
    quality: str = "standard"
    format: str = "glb"


class ImageTo3DRequest(BaseModel):
    image_url: str
    provider: str = "meshy"
    quality: str = "standard"
    format: str = "glb"


class AnimationRequest(BaseModel):
    model_url: str
    animation_type: str
    duration: float = 5.0
    provider: str = "runway"


class AudioGenerationRequest(BaseModel):
    prompt: str
    type: str = "music"
    duration: float = 30.0
    provider: str = "stable_audio"


class CodeGenerationRequest(BaseModel):
    prompt: str
    language: str = "csharp"
    framework: str = "unity"
    context: Optional[str] = None