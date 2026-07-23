"""
3D Generation Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.database import get_db
from app.models.user import User
from app.schemas.generation import (
    TextTo3DRequest,
    ImageTo3DRequest,
    GenerationResponse,
)
from app.services._3d_generation_service import ThreeDGenerationService
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/3d", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_3d(
    request: TextTo3DRequest | ImageTo3DRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Generate 3D model"""
    generation_service = ThreeDGenerationService(db)
    
    if isinstance(request, TextTo3DRequest):
        generation = await generation_service.generate_3d_from_text(
            user=current_user,
            prompt=request.prompt,
            provider=request.provider,
            quality=request.quality,
            format=request.format,
            project_id=request.project_id
        )
    else:  # ImageTo3DRequest
        generation = await generation_service.generate_3d_from_image(
            user=current_user,
            image_url=request.image_url,
            provider=request.provider,
            quality=request.quality,
            format=request.format,
            project_id=request.project_id
        )
    
    return generation


@router.post("/3d/optimize", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def optimize_3d_mesh(
    mesh_url: str,
    provider: str = "meshy",
    target_polygons: int = 10000,
    project_id: Optional[uuid.UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Optimize 3D mesh for game engines"""
    generation_service = ThreeDGenerationService(db)
    
    generation = await generation_service.optimize_3d_mesh(
        user=current_user,
        mesh_url=mesh_url,
        provider=provider,
        target_polygons=target_polygons,
        project_id=project_id
    )
    
    return generation


@router.post("/3d/texture", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_texture_from_3d(
    mesh_url: str,
    provider: str = "meshy",
    resolution: int = 2048,
    project_id: Optional[uuid.UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Generate texture from 3D model"""
    generation_service = ThreeDGenerationService(db)
    
    generation = await generation_service.generate_texture_from_3d(
        user=current_user,
        mesh_url=mesh_url,
        provider=provider,
        resolution=resolution,
        project_id=project_id
    )
    
    return generation


@router.get("/3d/{generation_id}", response_model=GenerationResponse)
async def get_3d_generation(
    generation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Get 3D generation status"""
    generation_service = ThreeDGenerationService(db)
    generation = await generation_service.get_generation(generation_id, current_user)
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="3D Generation not found",
        )
    
    return generation