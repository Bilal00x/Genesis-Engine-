"""
Payment Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

from app.models.payment import SubscriptionPlan, SubscriptionStatus


class SubscriptionPlanResponse(BaseModel):
    id: SubscriptionPlan
    name: str
    price: int  # cents
    currency: str = "usd"
    description: str
    features: list[str]
    limits: Dict[str, Any]


class SubscriptionResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    organization_id: Optional[uuid.UUID] = None
    plan: SubscriptionPlan
    status: SubscriptionStatus
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool
    created_at: datetime
    updated_at: datetime


class CreditTransactionResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    organization_id: Optional[uuid.UUID] = None
    type: str  # purchase, generation, export, refund, bonus
    amount: int
    balance_after: int
    description: str
    created_at: datetime


class PaymentTransactionResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    organization_id: Optional[uuid.UUID] = None
    stripe_payment_intent_id: Optional[str] = None
    amount: int  # cents
    currency: str = "usd"
    status: str
    description: Optional[str] = None
    created_at: datetime


class SubscribeRequest(BaseModel):
    plan_id: SubscriptionPlan
    payment_method_id: str
    coupon_code: Optional[str] = None


class CancelSubscriptionRequest(BaseModel):
    cancel_at_period_end: bool = True