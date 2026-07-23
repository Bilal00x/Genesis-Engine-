"""
Asset Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
import uuid

from app.core.database import get_db
from app.models.user import User
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse, AssetListResponse, AssetListParams, AssetType
from app.services.asset_service import AssetService
from app.services.auth_service import AuthService

router = APIRouter()


@router.get("", response_model=AssetListResponse)
async def list_assets(
    type: Optional[AssetType] = Query(None),
    project_id: Optional[uuid.UUID] = Query(None),
    folder_path: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    is_favorite: Optional[bool] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """List assets with filters"""
    asset_service = AssetService(db)
    
    params = AssetListParams(
        type=type,
        project_id=project_id,
        folder_path=folder_path,
        search=search,
        is_favorite=is_favorite,
        sort_by=sort_by,
        sort_order=sort_order,
        limit=limit,
        offset=offset,
    )
    
    assets, total = await asset_service.list_assets(params, current_user)
    
    return AssetListResponse(
        items=assets,
        total=total,
        limit=limit,
        offset=offset,
        has_more=offset + len(assets) < total,
    )


@router.post("", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
async def upload_asset(
    file: UploadFile = File(...),
    name: str = Form(...),
    type: AssetType = Form(...),
    description: Optional[str] = Form(None),
    project_id: Optional[uuid.UUID] = Form(None),
    tags: Optional[str] = Form(None),
    folder_path: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Upload asset"""
    asset_service = AssetService(db)
    
    # Parse tags
    tag_list = None
    if tags:
        tag_list = [t.strip() for t in tags.split(",")]
    
    asset = await asset_service.create_asset(
        user=current_user,
        file=file,
        name=name,
        asset_type=type,
        description=description,
        project_id=project_id,
        tags=tag_list,
        folder_path=folder_path,
    )
    
    return asset


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(
    asset_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Get asset"""
    asset_service = AssetService(db)
    asset = await asset_service.get_asset(asset_id, current_user)
    
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found",
        )
    
    return asset


@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(
    asset_id: uuid.UUID,
    asset_data: AssetUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Update asset"""
    asset_service = AssetService(db)
    asset = await asset_service.update_asset(asset_id, current_user, asset_data)
    return asset


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(
    asset_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Delete asset"""
    asset_service = AssetService(db)
    await asset_service.delete_asset(asset_id, current_user)
    return None


@router.post("/{asset_id}/favorite", response_model=AssetResponse)
async def toggle_favorite(
    asset_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Toggle asset favorite"""
    asset_service = AssetService(db)
    asset = await asset_service.toggle_favorite(asset_id, current_user)
    return asset


@router.get("/{asset_id}/versions")
async def list_versions(
    asset_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """List asset versions"""
    asset_service = AssetService(db)
    versions = await asset_service.list_versions(asset_id, current_user)
    return {"versions": versions}