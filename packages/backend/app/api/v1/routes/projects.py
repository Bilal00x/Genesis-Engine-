"""
Project Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import uuid

from app.core.database import get_db
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
from app.services.project_service import ProjectService
from app.services.auth_service import AuthService

router = APIRouter()


@router.get("", response_model=ProjectListResponse)
async def list_projects(
    organization_id: Optional[uuid.UUID] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """List projects"""
    project_service = ProjectService(db)
    projects, total = await project_service.list_projects(
        user=current_user,
        organization_id=organization_id,
        search=search,
        limit=limit,
        offset=offset,
    )
    
    return ProjectListResponse(
        items=projects,
        total=total,
        limit=limit,
        offset=offset,
        has_more=offset + len(projects) < total,
    )


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Create project"""
    project_service = ProjectService(db)
    project = await project_service.create_project(
        user=current_user,
        project_data=project_data,
    )
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Get project"""
    project_service = ProjectService(db)
    project = await project_service.get_project(project_id, current_user)
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )
    
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: uuid.UUID,
    project_data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Update project"""
    project_service = ProjectService(db)
    project = await project_service.update_project(
        project_id=project_id,
        user=current_user,
        project_data=project_data,
    )
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Delete project"""
    project_service = ProjectService(db)
    await project_service.delete_project(project_id, current_user)
    return None


@router.post("/{project_id}/duplicate", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def duplicate_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Duplicate project"""
    project_service = ProjectService(db)
    project = await project_service.duplicate_project(project_id, current_user)
    return project