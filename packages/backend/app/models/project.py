"""
Project and Scene Models
"""

from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

from app.models.base import BaseModel


class Project(BaseModel):
    __tablename__ = "projects"
    
    organization_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"),
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    thumbnail_url: Mapped[str | None] = mapped_column(String)
    settings: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"),
        index=True,
    )
    
    # Relationships
    organization = relationship("Organization", back_populates="projects")
    created_by_user = relationship("User", back_populates="projects")
    scenes = relationship("Scene", back_populates="project", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="project", cascade="all, delete-orphan")
    workflows = relationship("Workflow", back_populates="project", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Project {self.name}>"


class Scene(BaseModel):
    __tablename__ = "scenes"
    
    project_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"),
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    thumbnail_url: Mapped[str | None] = mapped_column(String)
    data: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"),
        index=True,
    )
    
    # Relationships
    project = relationship("Project", back_populates="scenes")
    versions = relationship("SceneVersion", back_populates="scene", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Scene {self.name}>"


class SceneVersion(BaseModel):
    __tablename__ = "scene_versions"
    
    scene_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("scenes.id", ondelete="CASCADE"),
        index=True,
    )
    version: Mapped[int] = mapped_column()
    data: Mapped[dict] = mapped_column(JSONB)
    change_summary: Mapped[str | None] = mapped_column(Text)
    created_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    
    # Relationships
    scene = relationship("Scene", back_populates="versions")
    
    def __repr__(self) -> str:
        return f"<SceneVersion {self.scene_id} v{self.version}>"