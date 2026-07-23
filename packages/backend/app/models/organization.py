"""
Organization Model
"""

from sqlalchemy import String, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
import enum

from app.models.base import BaseModel


class SubscriptionPlan(str, enum.Enum):
    free = "free"
    starter = "starter"
    pro = "pro"
    enterprise = "enterprise"


class Organization(BaseModel):
    __tablename__ = "organizations"
    
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    owner_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    plan: Mapped[SubscriptionPlan] = mapped_column(
        SQLEnum(SubscriptionPlan),
        default=SubscriptionPlan.free,
    )
    credits: Mapped[int] = mapped_column(Integer, default=0)
    stripe_customer_id: Mapped[str | None] = mapped_column(String(255))
    settings: Mapped[dict] = mapped_column(JSONB, default=dict)
    
    # Relationships
    users = relationship("User", back_populates="organization")
    projects = relationship("Project", back_populates="organization", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="organization", cascade="all, delete-orphan")
    workflows = relationship("Workflow", back_populates="organization", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Organization {self.slug}>"