"""
3D Generation Service
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, Any
import uuid
from datetime import datetime

from app.models.user import User
from app.models.generation import Generation, GenerationType, GenerationStatus
from app.models.asset import Asset, AssetType
from app.ai_providers.base import get_provider
from app.tasks._3d_generation import (
    generate_3d_from_text,
    generate_3d_from_image,
    generate_3d_from_mesh,
    optimize_3d_mesh,
    generate_texture_from_3d
)


class ThreeDGenerationService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def generate_3d_from_text(
        self,
        user: User,
        prompt: str,
        provider: str = "meshy",
        quality: str = "standard",
        format: str = "glb",
        project_id: Optional[uuid.UUID] = None,
    ) -> Generation:
        """Generate 3D model from text prompt"""
        # Check credits
        await self.check_credits(user.id, 50)
        
        # Create generation job
        generation = await self.create_generation(
            user=user,
            generation_type="text_to_3d",
            provider=provider,
            input_data={
                "prompt": prompt,
                "quality": quality,
                "format": format
            },
            project_id=project_id
        )
        
        # Queue async task
        generate_3d_from_text.delay(
            generation_id=str(generation.id),
            prompt=prompt,
            provider=provider,
            quality=quality,
            format=format
        )
        
        return generation
    
    async def generate_3d_from_image(
        self,
        user: User,
        image_url: str,
        provider: str = "meshy",
        quality: str = "standard",
        format: str = "glb",
        project_id: Optional[uuid.UUID] = None,
    ) -> Generation:
        """Generate 3D model from image"""
        # Check credits
        await self.check_credits(user.id, 50)
        
        # Create generation job
        generation = await self.create_generation(
            user=user,
            generation_type="image_to_3d",
            provider=provider,
            input_data={
                "image_url": image_url,
                "quality": quality,
                "format": format
            },
            project_id=project_id
        )
        
        # Queue async task
        generate_3d_from_image.delay(
            generation_id=str(generation.id),
            image_url=image_url,
            provider=provider,
            quality=quality,
            format=format
        )
        
        return generation
    
    async def generate_3d_from_mesh(
        self,
        user: User,
        mesh_url: str,
        provider: str = "meshy",
        optimize: bool = True,
        project_id: Optional[uuid.UUID] = None,
    ) -> Generation:
        """Generate 3D model from existing mesh"""
        # Check credits
        await self.check_credits(user.id, 30)
        
        # Create generation job
        generation = await self.create_generation(
            user=user,
            generation_type="mesh_to_3d",
            provider=provider,
            input_data={
                "mesh_url": mesh_url,
                "optimize": optimize
            },
            project_id=project_id
        )
        
        # Queue async task
        generate_3d_from_mesh.delay(
            generation_id=str(generation.id),
            mesh_url=mesh_url,
            provider=provider,
            optimize=optimize
        )
        
        return generation
    
    async def optimize_3d_mesh(
        self,
        user: User,
        mesh_url: str,
        provider: str = "meshy",
        target_polygons: int = 10000,
        project_id: Optional[uuid.UUID] = None,
    ) -> Generation:
        """Optimize 3D mesh for game engines"""
        # Check credits
        await self.check_credits(user.id, 10)
        
        # Create generation job
        generation = await self.create_generation(
            user=user,
            generation_type="optimize_mesh",
            provider=provider,
            input_data={
                "mesh_url": mesh_url,
                "target_polygons": target_polygons
            },
            project_id=project_id
        )
        
        # Queue async task
        optimize_3d_mesh.delay(
            generation_id=str(generation.id),
            mesh_url=mesh_url,
            provider=provider,
            target_polygons=target_polygons
        )
        
        return generation
    
    async def generate_texture_from_3d(
        self,
        user: User,
        mesh_url: str,
        provider: str = "meshy",
        resolution: int = 2048,
        project_id: Optional[uuid.UUID] = None,
    ) -> Generation:
        """Generate texture from 3D model"""
        # Check credits
        await self.check_credits(user.id, 20)
        
        # Create generation job
        generation = await self.create_generation(
            user=user,
            generation_type="texture_from_3d",
            provider=provider,
            input_data={
                "mesh_url": mesh_url,
                "resolution": resolution
            },
            project_id=project_id
        )
        
        # Queue async task
        generate_texture_from_3d.delay(
            generation_id=str(generation.id),
            mesh_url=mesh_url,
            provider=provider,
            resolution=resolution
        )
        
        return generation
    
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