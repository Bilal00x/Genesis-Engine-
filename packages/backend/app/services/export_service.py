"""
Export Service
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, Any
import uuid
from datetime import datetime

from app.models.user import User
from app.models.export import ExportJob, ExportFormat, ExportStatus
from app.models.asset import Asset
from app.models.generation import Generation


class ExportService:
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
    
    async def create_export(
        self,
        user: User,
        export_data: Any,
    ) -> ExportJob:
        """Create export job"""
        export_job = ExportJob(
            user_id=user.id,
            organization_id=user.organization_id,
            project_id=export_data.project_id,
            asset_ids=export_data.asset_ids,
            format=export_data.format,
            settings=export_data.settings or {},
            status=ExportStatus.pending,
            credits_used=len(export_data.asset_ids) * 2,
        )
        
        self.db.add(export_job)
        await self.db.commit()
        await self.db.refresh(export_job)
        
        return export_job
    
    async def get_export(self, export_id: uuid.UUID, user: User) -> Optional[ExportJob]:
        """Get export job by ID"""
        result = await self.db.execute(
            select(ExportJob).where(ExportJob.id == export_id)
        )
        return result.scalar_one_or_none()
    
    async def update_export(
        self,
        export_id: uuid.UUID,
        status: ExportStatus,
        output_path: Optional[str] = None,
        file_size: Optional[int] = None,
        error_message: Optional[str] = None,
        progress: int = 0,
    ):
        """Update export job status"""
        result = await self.db.execute(
            select(ExportJob).where(ExportJob.id == export_id)
        )
        export_job = result.scalar_one()
        
        export_job.status = status
        export_job.progress = progress
        
        if output_path:
            export_job.output_path = output_path
        if file_size:
            export_job.file_size = file_size
        if error_message:
            export_job.error_message = error_message
        if status == ExportStatus.completed:
            export_job.completed_at = datetime.utcnow()
        elif status == ExportStatus.processing and not export_job.started_at:
            export_job.started_at = datetime.utcnow()
        
        await self.db.commit()
    
    async def process_export(
        self,
        export_job_id: uuid.UUID,
        export_data: Any,
    ):
        """Process export job"""
        try:
            await self.update_export(export_job_id, ExportStatus.processing, progress=10)
            
            # Get assets
            assets = []
            for asset_id in export_data.asset_ids:
                result = await self.db.execute(
                    select(Asset).where(Asset.id == asset_id)
                )
                asset = result.scalar_one()
                assets.append(asset)
            
            # Process based on format
            await self.update_export(export_job_id, ExportStatus.processing, progress=50)
            
            # In real implementation, convert assets to target format
            # This would involve calling external libraries like Blender, Unity, etc.
            
            # For demo, create a placeholder file
            output_path = f"exports/{export_job_id}.{export_data.format}"
            
            await self.update_export(export_job_id, ExportStatus.processing, progress=90)
            
            # Complete export
            await self.update_export(
                export_job_id,
                ExportStatus.completed,
                output_path=output_path,
                file_size=1024,
                progress=100,
            )
            
            # Deduct credits from user
            result = await self.db.execute(
                select(ExportJob).where(ExportJob.id == export_job_id)
            )
            export_job = result.scalar_one()
            
            await self.db.execute(
                f"UPDATE users SET credits = credits - {export_job.credits_used} WHERE id = '{export_job.user_id}'"
            )
            await self.db.commit()
            
        except Exception as e:
            await self.update_export(
                export_job_id,
                ExportStatus.failed,
                error_message=str(e),
            )
    
    async def get_export_url(self, export_id: uuid.UUID, user: User) -> Optional[str]:
        """Get export file URL"""
        export_job = await self.get_export(export_id, user)
        if not export_job:
            return None
        
        if export_job.status != ExportStatus.completed:
            return None
        
        # In real implementation, generate a signed URL for the exported file
        return export_job.output_path