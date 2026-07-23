"""
Celery Tasks for 3D Generation
"""

from celery import shared_task
from app.core.celery_app import celery_app
from app.services.generation_service import GenerationService
from app.models.generation import GenerationType, GenerationStatus
from app.core.database import get_db
from app.ai_providers.base import get_provider
import asyncio


@shared_task(bind=True, max_retries=3)
def generate_3d_from_text(self, generation_id: str, prompt: str, provider: str, **kwargs):
    """Generate 3D model from text prompt"""
    try:
        # Get database session
        db = next(get_db())
        
        # Get generation service
        generation_service = GenerationService(db)
        
        # Update status to processing
        generation_service.update_generation(
            generation_id,
            GenerationStatus.processing,
            progress=10
        )
        
        # Get provider
        provider_instance = get_provider(provider)
        
        # Generate 3D model
        result = provider_instance.generate_3d(prompt, **kwargs)
        
        # Update progress
        generation_service.update_generation(
            generation_id,
            GenerationStatus.processing,
            progress=80
        )
        
        # Update generation with result
        generation_service.update_generation(
            generation_id,
            GenerationStatus.completed,
            output_data=result,
            result_asset_ids=[result["asset_id"]] if "asset_id" in result else [],
            credits_used=50,
            progress=100
        )
        
        return result
        
    except Exception as e:
        generation_service.update_generation(
            generation_id,
            GenerationStatus.failed,
            error_message=str(e)
        )
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def generate_3d_from_image(self, generation_id: str, image_url: str, provider: str, **kwargs):
    """Generate 3D model from image"""
    try:
        # Get database session
        db = next(get_db())
        
        # Get generation service
        generation_service = GenerationService(db)
        
        # Update status to processing
        generation_service.update_generation(
            generation_id,
            GenerationStatus.processing,
            progress=10
        )
        
        # Get provider
        provider_instance = get_provider(provider)
        
        # Generate 3D model
        result = provider_instance.generate_3d_from_image(image_url, **kwargs)
        
        # Update progress
        generation_service.update_generation(
            generation_id,
            GenerationStatus.processing,
            progress=80
        )
        
        # Update generation with result
        generation_service.update_generation(
            generation_id,
            GenerationStatus.completed,
            output_data=result,
            result_asset_ids=[result["asset_id"]] if "asset_id" in result else [],
            credits_used=50,
            progress=100
        )
        
        return result
        
    except Exception as e:
        generation_service.update_generation(
            generation_id,
            GenerationStatus.failed,
            error_message=str(e)
        )
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def generate_3d_from_mesh(self, generation_id: str, mesh_url: str, provider: str, **kwargs):
    """Generate 3D model from existing mesh"""
    try:
        # Get database session
        db = next(get_db())
        
        # Get generation service
        generation_service = GenerationService(db)
        
        # Update status to processing
        generation_service.update_generation(
            generation_id,
            GenerationStatus.processing,
            progress=10
        )
        
        # Get provider
        provider_instance = get_provider(provider)
        
        # Generate 3D model
        result = provider_instance.generate_3d_from_mesh(mesh_url, **kwargs)
        
        # Update progress
        generation_service.update_generation(
            generation_id,
            GenerationStatus.processing,
            progress=80
        )
        
        # Update generation with result
        generation_service.update_generation(
            generation_id,
            GenerationStatus.completed,
            output_data=result,
            result_asset_ids=[result["asset_id"]] if "asset_id" in result else [],
            credits_used=30,
            progress=100
        )
        
        return result
        
    except Exception as e:
        generation_service.update_generation(
            generation_id,
            GenerationStatus.failed,
            error_message=str(e)
        )
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def optimize_3d_mesh(self, generation_id: str, mesh_url: str, provider: str, **kwargs):
    """Optimize 3D mesh for game engines"""
    try:
        # Get database session
        db = next(get_db())
        
        # Get generation service
        generation_service = GenerationService(db)
        
        # Update status to processing
        generation_service.update_generation(
            generation_id,
            GenerationStatus.processing,
            progress=10
        )
        
        # Get provider
        provider_instance = get_provider(provider)
        
        # Optimize mesh
        result = provider_instance.optimize_3d_mesh(mesh_url, **kwargs)
        
        # Update progress
        generation_service.update_generation(
            generation_id,
            GenerationStatus.processing,
            progress=80
        )
        
        # Update generation with result
        generation_service.update_generation(
            generation_id,
            GenerationStatus.completed,
            output_data=result,
            result_asset_ids=[result["asset_id"]] if "asset_id" in result else [],
            credits_used=10,
            progress=100
        )
        
        return result
        
    except Exception as e:
        generation_service.update_generation(
            generation_id,
            GenerationStatus.failed,
            error_message=str(e)
        )
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def generate_texture_from_3d(self, generation_id: str, mesh_url: str, provider: str, **kwargs):
    """Generate texture from 3D model"""
    try:
        # Get database session
        db = next(get_db())
        
        # Get generation service
        generation_service = GenerationService(db)
        
        # Update status to processing
        generation_service.update_generation(
            generation_id,
            GenerationStatus.processing,
            progress=10
        )
        
        # Get provider
        provider_instance = get_provider(provider)
        
        # Generate texture
        result = provider_instance.generate_texture_from_3d(mesh_url, **kwargs)
        
        # Update progress
        generation_service.update_generation(
            generation_id,
            GenerationStatus.processing,
            progress=80
        )
        
        # Update generation with result
        generation_service.update_generation(
            generation_id,
            GenerationStatus.completed,
            output_data=result,
            result_asset_ids=[result["asset_id"]] if "asset_id" in result else [],
            credits_used=20,
            progress=100
        )
        
        return result
        
    except Exception as e:
        generation_service.update_generation(
            generation_id,
            GenerationStatus.failed,
            error_message=str(e)
        )
        raise self.retry(exc=e, countdown=60)