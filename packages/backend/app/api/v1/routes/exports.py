"""
Export Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.database import get_db
from app.models.user import User
from app.schemas.export import ExportCreate, ExportResponse
from app.services.export_service import ExportService
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("", response_model=ExportResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_export(
    export_data: ExportCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Create export job"""
    export_service = ExportService(db)
    
    # Check credits
    await export_service.check_credits(current_user.id, len(export_data.asset_ids) * 2)
    
    # Create export job
    export_job = await export_service.create_export(
        user=current_user,
        export_data=export_data,
    )
    
    # Queue async task
    background_tasks.add_task(
        export_service.process_export,
        export_job_id=export_job.id,
        export_data=export_data,
    )
    
    return export_job


@router.get("/{export_id}", response_model=ExportResponse)
async def get_export(
    export_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Get export status"""
    export_service = ExportService(db)
    export_job = await export_service.get_export(export_id, current_user)
    
    if not export_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Export job not found",
        )
    
    return export_job


@router.get("/{export_id}/download")
async def download_export(
    export_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Download exported file"""
    export_service = ExportService(db)
    export_job = await export_service.get_export(export_id, current_user)
    
    if not export_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Export job not found",
        )
    
    if export_job.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Export not completed yet",
        )
    
    # In real implementation, return file download
    return {"download_url": export_job.output_path}