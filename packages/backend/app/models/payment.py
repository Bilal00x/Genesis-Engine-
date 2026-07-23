"""
Payment and Subscription Models
"""

from sqlalchemy import String, ForeignKey, Integer, Boolean, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import uuid
import enum

from app.models.base import BaseModel


class SubscriptionStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    canceled = "canceled"
    past_due = "past_due"
    trialing = "trialing"


class Subscription(BaseModel):
    __tablename__ = "subscriptions"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("organizations.id", ondelete="SET NULL"),
        index=True,
    )
    stripe_subscription_id: Mapped[str | None] = mapped_column(String(255), unique=True)
    stripe_customer_id: Mapped[str | None] = mapped_column(String(255))
    plan: Mapped[str] = mapped_column(String(50), default="free")
    status: Mapped[SubscriptionStatus] = mapped_column(
        default=SubscriptionStatus.inactive,
        index=True,
    )
    current_period_start: Mapped[datetime | None]
    current_period_end: Mapped[datetime | None]
    cancel_at_period_end: Mapped[bool] = mapped_column(Boolean, default=False)
    canceled_at: Mapped[datetime | None]
    trial_start: Mapped[datetime | None]
    trial_end: Mapped[datetime | None]
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict)
    
    # Relationships
    user = relationship("User", back_populates="subscriptions")
    organization = relationship("Organization")
    
    def __repr__(self) -> str:
        return f"<Subscription {self.user_id} {self.plan}>"


class CreditTransaction(BaseModel):
    __tablename__ = "credit_transactions"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("organizations.id", ondelete="SET NULL"),
        index=True,
    )
    type: Mapped[str] = mapped_column(String(50))  # purchase, generation, export, refund, bonus
    amount: Mapped[int] = mapped_column(Integer)
    balance_after: Mapped[int] = mapped_column(Integer)
    description: Mapped[str] = mapped_column()
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict)
    generation_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("generations.id"))
    export_job_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("export_jobs.id"))
    
    # Relationships
    user = relationship("User")
    organization = relationship("Organization")
    generation = relationship("Generation")
    export_job = relationship("ExportJob")
    
    def __repr__(self) -> str:
        return f"<CreditTransaction {self.type} {self.amount}>"


class PaymentTransaction(BaseModel):
    __tablename__ = "payment_transactions"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("organizations.id", ondelete="SET NULL"),
        index=True,
    )
    stripe_payment_intent_id: Mapped[str | None] = mapped_column(String(255), unique=True)
    amount: Mapped[int] = mapped_column(Integer)  # cents
    currency: Mapped[str] = mapped_column(String(3), default="usd")
    status: Mapped[str] = mapped_column(String(50))
    description: Mapped[str | None] = mapped_column()
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict)
    
    # Relationships
    user = relationship("User")
    organization = relationship("Organization")
    
    def __repr__(self) -> str:
        return f"<PaymentTransaction {self.amount} {self.currency}>"