"""
Asset Models
"""

from sqlalchemy import String, Integer, Boolean, ForeignKey, Text, Real, BigInteger, ARRAY
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.models.base import BaseModel


class AssetType(str, enum.Enum):
    image = "image"
    texture = "texture"
    model_3d = "model_3d"
    animation = "animation"
    audio = "audio"
    music = "music"
    voice = "voice"
    sfx = "sfx"
    code = "code"
    shader = "shader"
    script = "script"
    vfx = "vfx"
    material = "material"
    prefab = "prefab"
    character = "character"
    weapon = "weapon"
    building = "building"
    vehicle = "vehicle"
    environment = "environment"
    ui_element = "ui_element"
    concept_art = "concept_art"


class Asset(BaseModel):
    __tablename__ = "assets"
    
    project_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("projects.id", ondelete="SET NULL"),
        index=True,
    )
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("organizations.id", ondelete="SET NULL"),
        index=True,
    )
    type: Mapped[AssetType] = mapped_column()
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    file_path: Mapped[str] = mapped_column(String)
    file_size: Mapped[int | None] = mapped_column(BigInteger)
    mime_type: Mapped[str | None] = mapped_column(String(100))
    width: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[int | None] = mapped_column(Integer)
    duration: Mapped[int | None] = mapped_column(Integer)  # milliseconds
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    folder_path: Mapped[str | None] = mapped_column(String, index=True)
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    license: Mapped[str] = mapped_column(String(100), default="all-rights-reserved")
    source_generation_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("generations.id"))
    created_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"),
        index=True,
    )
    
    # Relationships
    project = relationship("Project", back_populates="assets")
    organization = relationship("Organization", back_populates="assets")
    creator = relationship("User", back_populates="assets")
    versions = relationship("AssetVersion", back_populates="asset", cascade="all, delete-orphan")
    comments = relationship("AssetComment", back_populates="asset", cascade="all, delete-orphan")
    favorites = relationship("AssetFavorite", back_populates="asset", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Asset {self.name}>"


class AssetVersion(BaseModel):
    __tablename__ = "asset_versions"
    
    asset_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("assets.id", ondelete="CASCADE"),
        index=True,
    )
    version: Mapped[int] = mapped_column()
    file_path: Mapped[str] = mapped_column(String)
    file_size: Mapped[int | None] = mapped_column(BigInteger)
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict)
    change_summary: Mapped[str | None] = mapped_column(Text)
    created_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    
    # Relationships
    asset = relationship("Asset", back_populates="versions")
    
    def __repr__(self) -> str:
        return f"<AssetVersion {self.asset_id} v{self.version}>"


class AssetComment(BaseModel):
    __tablename__ = "asset_comments"
    
    asset_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("asset_comments.id", ondelete="CASCADE"),
        index=True,
    )
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("asset_comments.id", ondelete="CASCADE"),
        index=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    content: Mapped[str] = mapped_column()
    timestamp_ms: Mapped[int | None] = mapped_column(Integer)
    position_x: Mapped[float | None] = mapped_column(Real)
    position_y: Mapped[float | None] = mapped_column(Real)
    position_z: Mapped[float | None] = mapped_column(Real)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relationships
    asset = relationship("Asset", back_populates="comments")
    user = relationship("User")
    replies = relationship("AssetComment", remote_side="AssetComment.id")
    
    def __repr__(self) -> str:
        return f"<AssetComment {self.id}>"


class AssetFavorite(BaseModel):
    __tablename__ = "asset_favorites"
    
    asset_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("assets.id", ondelete="CASCADE"),
        index=True,
        unique=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    
    # Relationships
    asset = relationship("Asset", back_populates="favorites")
    user = relationship("User")
    
    def __repr__(self) -> str:
        return f"<AssetFavorite {self.asset_id}>"


class AssetCollection(BaseModel):
    __tablename__ = "asset_collections"
    
    organization_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    color: Mapped[str | None] = mapped_column(String(7))
    created_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    
    # Relationships
    items = relationship("AssetCollectionItem", back_populates="collection", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<AssetCollection {self.name}>"


class AssetCollectionItem(BaseModel):
    __tablename__ = "asset_collection_items"
    
    collection_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("asset_collections.id", ondelete="CASCADE"),
        index=True,
    )
    asset_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("assets.id", ondelete="CASCADE"),
        index=True,
    )
    
    # Relationships
    collection = relationship("AssetCollection", back_populates="items")
    asset = relationship("Asset")
    
    def __repr__(self) -> str:
        return f"<AssetCollectionItem {self.collection_id}:{self.asset_id}>"