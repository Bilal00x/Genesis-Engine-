"""
User Model
"""

from sqlalchemy import String, Boolean, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime
import uuid
import enum

from app.models.base import BaseModel


class UserRole(str, enum.Enum):
    admin = "admin"
    user = "user"
    viewer = "viewer"


class User(BaseModel):
    __tablename__ = "users"
    
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255))
    display_name: Mapped[str] = mapped_column(String(100))
    avatar_url: Mapped[str | None] = mapped_column(String)
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole),
        default=UserRole.user,
        index=True,
    )
    credits: Mapped[int] = mapped_column(Integer, default=100)
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("organizations.id", ondelete="SET NULL"),
        index=True,
    )
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    two_factor_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    last_login_at: Mapped[datetime | None]
    last_login_ip: Mapped[str | None]
    
    # Relationships
    organization = relationship("Organization", back_populates="users")
    api_keys = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="created_by_user", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="creator", cascade="all, delete-orphan")
    workflows = relationship("Workflow", back_populates="creator", cascade="all, delete-orphan")
    generations = relationship("Generation", back_populates="user", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<User {self.email}>"