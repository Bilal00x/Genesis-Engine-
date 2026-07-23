"""
Generation Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.database import get_db
from app.models.user import User
from app.schemas.generation import (
    GenerationResponse,
    ImageGenerationRequest,
    ImageToImageRequest,
    TextTo3DRequest,
    ImageTo3DRequest,
    AnimationRequest,
    AudioGenerationRequest,
    CodeGenerationRequest,
)
from app.services.generation_service import GenerationService
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/image", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_image(
    request: ImageGenerationRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Generate image from text prompt"""
    generation_service = GenerationService(db)
    
    # Check credits
    await generation_service.check_credits(current_user.id, 10)
    
    # Create generation job
    generation = await generation_service.create_generation(
        user=current_user,
        generation_type="text_to_image",
        provider=request.provider,
        input_data=request.model_dump(),
    )
    
    # Queue async task
    background_tasks.add_task(
        generation_service.process_image_generation,
        generation_id=generation.id,
        request=request,
    )
    
    return generation


@router.post("/image-to-image", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_image_to_image(
    request: ImageToImageRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Generate image from image"""
    generation_service = GenerationService(db)
    
    await generation_service.check_credits(current_user.id, 10)
    
    generation = await generation_service.create_generation(
        user=current_user,
        generation_type="image_to_image",
        provider=request.provider,
        input_data=request.model_dump(),
    )
    
    background_tasks.add_task(
        generation_service.process_image_generation,
        generation_id=generation.id,
        request=request,
    )
    
    return generation


@router.post("/3d", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_3d(
    request: TextTo3DRequest | ImageTo3DRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Generate 3D model"""
    generation_service = GenerationService(db)
    
    await generation_service.check_credits(current_user.id, 50)
    
    generation_type = "text_to_3d" if isinstance(request, TextTo3DRequest) else "image_to_3d"
    
    generation = await generation_service.create_generation(
        user=current_user,
        generation_type=generation_type,
        provider=request.provider,
        input_data=request.model_dump(),
    )
    
    background_tasks.add_task(
        generation_service.process_3d_generation,
        generation_id=generation.id,
        request=request,
    )
    
    return generation


@router.post("/animation", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_animation(
    request: AnimationRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Generate animation"""
    generation_service = GenerationService(db)
    
    await generation_service.check_credits(current_user.id, 30)
    
    generation = await generation_service.create_generation(
        user=current_user,
        generation_type="animation",
        provider=request.provider,
        input_data=request.model_dump(),
    )
    
    background_tasks.add_task(
        generation_service.process_animation,
        generation_id=generation.id,
        request=request,
    )
    
    return generation


@router.post("/audio", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_audio(
    request: AudioGenerationRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Generate audio"""
    generation_service = GenerationService(db)
    
    await generation_service.check_credits(current_user.id, 20)
    
    generation = await generation_service.create_generation(
        user=current_user,
        generation_type="music" if request.type == "music" else "sfx",
        provider=request.provider,
        input_data=request.model_dump(),
    )
    
    background_tasks.add_task(
        generation_service.process_audio_generation,
        generation_id=generation.id,
        request=request,
    )
    
    return generation


@router.post("/code", response_model=GenerationResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_code(
    request: CodeGenerationRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Generate code"""
    generation_service = GenerationService(db)
    
    await generation_service.check_credits(current_user.id, 5)
    
    generation = await generation_service.create_generation(
        user=current_user,
        generation_type=f"code_{request.framework}",
        provider="openai",
        input_data=request.model_dump(),
    )
    
    background_tasks.add_task(
        generation_service.process_code_generation,
        generation_id=generation.id,
        request=request,
    )
    
    return generation


@router.get("/{generation_id}", response_model=GenerationResponse)
async def get_generation(
    generation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Get generation status"""
    generation_service = GenerationService(db)
    generation = await generation_service.get_generation(generation_id, current_user)
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found",
        )
    
    return generation