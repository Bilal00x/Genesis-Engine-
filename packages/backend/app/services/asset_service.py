"""
Asset Service
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, Tuple, List
import uuid
from datetime import datetime

from app.models.user import User
from app.models.asset import Asset, AssetType, AssetVersion, AssetFavorite
from app.models.project import Project
from app.schemas.asset import AssetListParams, AssetUpdate


class AssetService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_assets(
        self,
        params: AssetListParams,
        user: User,
    ) -> Tuple[List[Asset], int]:
        """List assets with filters"""
        # Build query
        query = select(Asset)
        
        # Apply filters
        if params.type:
            query = query.where(Asset.type == params.type)
        if params.project_id:
            query = query.where(Asset.project_id == params.project_id)
        if params.folder_path:
            query = query.where(Asset.folder_path == params.folder_path)
        if params.is_favorite is not None:
            query = query.where(Asset.is_favorite == params.is_favorite)
        
        # Search
        if params.search:
            query = query.where(Asset.name.ilike(f"%{params.search}%"))
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply sorting
        sort_column = getattr(Asset, params.sort_by)
        if params.sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
        
        # Apply pagination
        query = query.offset(params.offset).limit(params.limit)
        
        result = await self.db.execute(query)
        assets = result.scalars().all()
        
        return list(assets), total
    
    async def get_asset(self, asset_id: uuid.UUID, user: User) -> Optional[Asset]:
        """Get asset by ID"""
        result = await self.db.execute(
            select(Asset).where(Asset.id == asset_id)
        )
        return result.scalar_one_or_none()
    
    async def create_asset(
        self,
        user: User,
        file,
        name: str,
        asset_type: AssetType,
        description: Optional[str] = None,
        project_id: Optional[uuid.UUID] = None,
        tags: Optional[List[str]] = None,
        folder_path: Optional[str] = None,
    ) -> Asset:
        """Create new asset"""
        # In a real implementation, upload file to S3/MinIO
        # and get file metadata
        file_path = f"assets/{user.id}/{uuid.uuid4()}/{file.filename}"
        
        # Read file to get size
        content = await file.read()
        file_size = len(content)
        
        # Get mime type
        mime_type = file.content_type or "application/octet-stream"
        
        asset = Asset(
            project_id=project_id,
            organization_id=user.organization_id,
            type=asset_type,
            name=name,
            description=description,
            file_path=file_path,
            file_size=file_size,
            mime_type=mime_type,
            tags=tags or [],
            folder_path=folder_path,
            created_by=user.id,
        )
        
        self.db.add(asset)
        await self.db.commit()
        await self.db.refresh(asset)
        
        return asset
    
    async def update_asset(
        self,
        asset_id: uuid.UUID,
        user: User,
        asset_data: AssetUpdate,
    ) -> Asset:
        """Update asset"""
        asset = await self.get_asset(asset_id, user)
        if not asset:
            raise ValueError("Asset not found")
        
        update_data = asset_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(asset, field, value)
        
        asset.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(asset)
        return asset
    
    async def delete_asset(self, asset_id: uuid.UUID, user: User):
        """Delete asset"""
        asset = await self.get_asset(asset_id, user)
        if not asset:
            raise ValueError("Asset not found")
        
        await self.db.delete(asset)
        await self.db.commit()
    
    async def toggle_favorite(self, asset_id: uuid.UUID, user: User) -> Asset:
        """Toggle asset favorite"""
        asset = await self.get_asset(asset_id, user)
        if not asset:
            raise ValueError("Asset not found")
        
        asset.is_favorite = not asset.is_favorite
        await self.db.commit()
        await self.db.refresh(asset)
        
        return asset
    
    async def list_versions(self, asset_id: uuid.UUID, user: User) -> List[AssetVersion]:
        """List asset versions"""
        result = await self.db.execute(
            select(AssetVersion)
            .where(AssetVersion.asset_id == asset_id)
            .order_by(AssetVersion.version.desc())
        )
        return result.scalars().all()