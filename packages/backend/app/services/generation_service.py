"""
Generation Service
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, Any
import uuid
from datetime import datetime

from app.models.user import User
from app.models.generation import Generation, GenerationType, GenerationStatus
from app.models.asset import Asset, AssetType
from app.schemas.generation import (
    ImageGenerationRequest,
    TextTo3DRequest,
    ImageTo3DRequest,
    AnimationRequest,
    AudioGenerationRequest,
    CodeGenerationRequest,
)


class GenerationService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def check_credits(self, user_id: uuid.UUID, required: int):
        """Check if user has enough credits"""
        from app.models.user import User
        
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one()
        
        if user.credits < required:
            raise ValueError(f"Insufficient credits. Required: {required}, Available: {user.credits}")
    
    async def create_generation(
        self,
        user: User,
        generation_type: str,
        provider: str,
        input_data: dict,
        project_id: Optional[uuid.UUID] = None,
    ) -> Generation:
        """Create generation job"""
        generation = Generation(
            user_id=user.id,
            organization_id=user.organization_id,
            project_id=project_id,
            type=getattr(GenerationType, generation_type),
            provider=provider,
            status=GenerationStatus.pending,
            input_data=input_data,
            credits_used=0,
        )
        
        self.db.add(generation)
        await self.db.commit()
        await self.db.refresh(generation)
        
        return generation
    
    async def get_generation(self, generation_id: uuid.UUID, user: User) -> Optional[Generation]:
        """Get generation by ID"""
        result = await self.db.execute(
            select(Generation).where(Generation.id == generation_id)
        )
        return result.scalar_one_or_none()
    
    async def update_generation(
        self,
        generation_id: uuid.UUID,
        status: GenerationStatus,
        output_data: Optional[dict] = None,
        progress: int = 0,
        error_message: Optional[str] = None,
        credits_used: int = 0,
    ):
        """Update generation status"""
        result = await self.db.execute(
            select(Generation).where(Generation.id == generation_id)
        )
        generation = result.scalar_one()
        
        generation.status = status
        generation.progress = progress
        generation.credits_used = credits_used
        
        if output_data:
            generation.output_data = output_data
        if error_message:
            generation.error_message = error_message
        if status == GenerationStatus.completed:
            generation.completed_at = datetime.utcnow()
        elif status == GenerationStatus.processing and not generation.started_at:
            generation.started_at = datetime.utcnow()
        
        await self.db.commit()
    
    async def process_image_generation(
        self,
        generation_id: uuid.UUID,
        request: ImageGenerationRequest,
    ):
        """Process image generation"""
        from app.ai_providers.base import get_provider
        
        try:
            # Update status to processing
            await self.update_generation(
                generation_id,
                GenerationStatus.processing,
                progress=10,
            )
            
            # Get AI provider
            provider = get_provider(request.provider)
            
            # Generate image
            await self.update_generation(generation_id, GenerationStatus.processing, progress=50)
            
            result = await provider.generate_image(
                prompt=request.prompt,
                negative_prompt=request.negative_prompt,
                width=request.width,
                height=request.height,
                steps=request.steps,
                guidance_scale=request.guidance_scale,
                seed=request.seed,
            )
            
            await self.update_generation(generation_id, GenerationStatus.processing, progress=90)
            
            # Create asset
            generation = await self.get_generation(generation_id, User(id=uuid.UUID("00000000-0000-0000-0000-000000000000")))
            
            # In real implementation, save image to storage
            asset = Asset(
                type=AssetType.image,
                name=f"Generated Image {generation_id}",
                file_path=result["url"],
                width=request.width,
                height=request.height,
                metadata={"seed": request.seed, "prompt": request.prompt},
                created_by=generation.user_id,
            )
            
            self.db.add(asset)
            await self.db.commit()
            await self.db.refresh(asset)
            
            # Complete generation
            await self.update_generation(
                generation_id,
                GenerationStatus.completed,
                output_data={"asset_id": str(asset.id)},
                result_asset_ids=[asset.id],
                credits_used=10,
                progress=100,
            )
            
            # Deduct credits from user
            await self.db.execute(
                f"UPDATE users SET credits = credits - 10 WHERE id = '{generation.user_id}'"
            )
            await self.db.commit()
            
        except Exception as e:
            await self.update_generation(
                generation_id,
                GenerationStatus.failed,
                error_message=str(e),
            )
    
    async def process_3d_generation(
        self,
        generation_id: uuid.UUID,
        request: TextTo3DRequest | ImageTo3DRequest,
    ):
        """Process 3D generation"""
        try:
            await self.update_generation(generation_id, GenerationStatus.processing, progress=10)
            
            from app.ai_providers.base import get_provider
            provider = get_provider(request.provider)
            
            await self.update_generation(generation_id, GenerationStatus.processing, progress=50)
            
            # Generate 3D model
            result = await provider.generate_3d(
                prompt=request.prompt if isinstance(request, TextTo3DRequest) else None,
                image_url=request.image_url if isinstance(request, ImageTo3DRequest) else None,
                quality=request.quality,
                format=request.format,
            )
            
            await self.update_generation(generation_id, GenerationStatus.processing, progress=90)
            
            # Create asset
            asset = Asset(
                type=AssetType.model_3d,
                name=f"Generated 3D Model {generation_id}",
                file_path=result["url"],
                metadata={"format": request.format},
                created_by=generation_id,
            )
            
            self.db.add(asset)
            await self.db.commit()
            
            await self.update_generation(
                generation_id,
                GenerationStatus.completed,
                output_data={"asset_id": str(asset.id)},
                result_asset_ids=[asset.id],
                credits_used=50,
                progress=100,
            )
            
        except Exception as e:
            await self.update_generation(
                generation_id,
                GenerationStatus.failed,
                error_message=str(e),
            )
    
    async def process_animation(
        self,
        generation_id: uuid.UUID,
        request: AnimationRequest,
    ):
        """Process animation generation"""
        try:
            await self.update_generation(generation_id, GenerationStatus.processing, progress=10)
            
            from app.ai_providers.base import get_provider
            provider = get_provider(request.provider)
            
            await self.update_generation(generation_id, GenerationStatus.processing, progress=50)
            
            result = await provider.generate_animation(
                model_url=request.model_url,
                animation_type=request.animation_type,
                duration=request.duration,
            )
            
            await self.update_generation(generation_id, GenerationStatus.processing, progress=90)
            
            asset = Asset(
                type=AssetType.animation,
                name=f"Generated Animation {generation_id}",
                file_path=result["url"],
                duration=int(request.duration * 1000),
                created_by=generation_id,
            )
            
            self.db.add(asset)
            await self.db.commit()
            
            await self.update_generation(
                generation_id,
                GenerationStatus.completed,
                output_data={"asset_id": str(asset.id)},
                result_asset_ids=[asset.id],
                credits_used=30,
                progress=100,
            )
            
        except Exception as e:
            await self.update_generation(
                generation_id,
                GenerationStatus.failed,
                error_message=str(e),
            )
    
    async def process_audio_generation(
        self,
        generation_id: uuid.UUID,
        request: AudioGenerationRequest,
    ):
        """Process audio generation"""
        try:
            await self.update_generation(generation_id, GenerationStatus.processing, progress=10)
            
            from app.ai_providers.base import get_provider
            provider = get_provider(request.provider)
            
            await self.update_generation(generation_id, GenerationStatus.processing, progress=50)
            
            result = await provider.generate_audio(
                prompt=request.prompt,
                audio_type=request.type,
                duration=request.duration,
            )
            
            await self.update_generation(generation_id, GenerationStatus.processing, progress=90)
            
            asset = Asset(
                type=AssetType.music if request.type == "music" else AssetType.sfx,
                name=f"Generated Audio {generation_id}",
                file_path=result["url"],
                duration=int(request.duration * 1000),
                created_by=generation_id,
            )
            
            self.db.add(asset)
            await self.db.commit()
            
            await self.update_generation(
                generation_id,
                GenerationStatus.completed,
                output_data={"asset_id": str(asset.id)},
                result_asset_ids=[asset.id],
                credits_used=20,
                progress=100,
            )
            
        except Exception as e:
            await self.update_generation(
                generation_id,
                GenerationStatus.failed,
                error_message=str(e),
            )
    
    async def process_code_generation(
        self,
        generation_id: uuid.UUID,
        request: CodeGenerationRequest,
    ):
        """Process code generation"""
        try:
            await self.update_generation(generation_id, GenerationStatus.processing, progress=10)
            
            from app.ai_providers.openai_provider import OpenAIProvider
            provider = OpenAIProvider()
            
            await self.update_generation(generation_id, GenerationStatus.processing, progress=50)
            
            result = await provider.generate_code(
                prompt=request.prompt,
                language=request.language,
                framework=request.framework,
                context=request.context,
            )
            
            await self.update_generation(generation_id, GenerationStatus.processing, progress=90)
            
            # Create asset with code content
            asset = Asset(
                type=AssetType.code,
                name=f"Generated Code {generation_id}",
                file_path="generated_code.txt",  # In reality, save to storage
                metadata={"language": request.language, "framework": request.framework},
                created_by=generation_id,
            )
            
            self.db.add(asset)
            await self.db.commit()
            
            await self.update_generation(
                generation_id,
                GenerationStatus.completed,
                output_data={
                    "asset_id": str(asset.id),
                    "code": result,
                },
                result_asset_ids=[asset.id],
                credits_used=5,
                progress=100,
            )
            
        except Exception as e:
            await self.update_generation(
                generation_id,
                GenerationStatus.failed,
                error_message=str(e),
            )