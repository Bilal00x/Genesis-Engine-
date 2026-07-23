"""
Payment Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.database import get_db
from app.models.user import User
from app.schemas.payment import (
    SubscriptionPlanResponse,
    SubscriptionResponse,
    CreditTransactionResponse,
    PaymentTransactionResponse,
    SubscribeRequest,
    CancelSubscriptionRequest,
)
from app.services.payment_service import PaymentService
from app.services.stripe_service import StripeService
from app.services.auth_service import AuthService

router = APIRouter()
stripe_service = StripeService()


@router.get("/plans", response_model=list[SubscriptionPlanResponse])
async def list_plans():
    """List subscription plans"""
    # In real implementation, get from database or Stripe
    return [
        SubscriptionPlanResponse(
            id="free",
            name="Free",
            price=0,
            currency="usd",
            description="Perfect for getting started",
            features=[
                "100 AI generations per month",
                "Basic 3D generation",
                "1GB storage",
                "Community support",
            ],
            limits={
                "monthly_credits": 100,
                "max_resolution": 1024,
                "max_file_size": 10485760,
                "projects": 5,
                "storage_gb": 1,
            }
        ),
        SubscriptionPlanResponse(
            id="starter",
            name="Starter",
            price=2900,
            currency="usd",
            description="Perfect for indie developers",
            features=[
                "500 AI generations per month",
                "Advanced 3D generation",
                "10GB storage",
                "Priority support",
                "Team collaboration",
            ],
            limits={
                "monthly_credits": 500,
                "max_resolution": 2048,
                "max_file_size": 52428800,
                "projects": 20,
                "storage_gb": 10,
            }
        ),
        SubscriptionPlanResponse(
            id="pro",
            name="Pro",
            price=9900,
            currency="usd",
            description="For professional studios",
            features=[
                "Unlimited AI generations",
                "Enterprise 3D generation",
                "100GB storage",
                "Dedicated support",
                "Team collaboration",
                "Custom AI models",
                "API access",
            ],
            limits={
                "monthly_credits": -1,
                "max_resolution": 4096,
                "max_file_size": 104857600,
                "projects": -1,
                "storage_gb": 100,
            }
        ),
        SubscriptionPlanResponse(
            id="enterprise",
            name="Enterprise",
            price=29900,
            currency="usd",
            description="For large studios and companies",
            features=[
                "Unlimited AI generations",
                "Custom AI models",
                "Unlimited storage",
                "Dedicated support",
                "On-premise deployment",
                "SLA guarantee",
                "White-labeling",
            ],
            limits={
                "monthly_credits": -1,
                "max_resolution": -1,
                "max_file_size": -1,
                "projects": -1,
                "storage_gb": -1,
            }
        ),
    ]


@router.post("/subscribe", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def subscribe(
    subscribe_data: SubscribeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Subscribe to a plan"""
    payment_service = PaymentService(db)
    
    # Check if user has Stripe customer ID
    if not current_user.stripe_customer_id:
        # Create Stripe customer
        customer_id = await stripe_service.create_customer(current_user, current_user.email)
        
        # Update user with Stripe customer ID
        current_user.stripe_customer_id = customer_id
        await db.commit()
        await db.refresh(current_user)
    
    # Create checkout session
    checkout_session_id = await stripe_service.create_checkout_session(
        user=current_user,
        plan_id=subscribe_data.plan_id,
        success_url="https://aigamestudio.com/dashboard/settings/billing",
        cancel_url="https://aigamestudio.com/dashboard/settings/billing"
    )
    
    # Return redirect URL
    return {"checkout_url": f"https://checkout.stripe.com/pay/{checkout_session_id}"}


@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Get current subscription"""
    payment_service = PaymentService(db)
    subscription = await payment_service.get_subscription(current_user)
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found",
        )
    
    return subscription


@router.post("/cancel-subscription")
async def cancel_subscription(
    cancel_data: CancelSubscriptionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """Cancel subscription"""
    payment_service = PaymentService(db)
    await payment_service.cancel_subscription(current_user, cancel_data.cancel_at_period_end)
    
    return {"message": "Subscription cancellation requested"}


@router.get("/transactions", response_model=list[CreditTransactionResponse])
async def list_transactions(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """List credit transactions"""
    payment_service = PaymentService(db)
    transactions = await payment_service.list_transactions(current_user.id, limit, offset)
    return transactions


@router.get("/payment-history", response_model=list[PaymentTransactionResponse])
async def list_payment_history(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user),
):
    """List payment history"""
    payment_service = PaymentService(db)
    payments = await payment_service.list_payments(current_user.id, limit, offset)
    return payments


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Stripe webhook endpoint"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe signature")
    
    try:
        result = await stripe_service.handle_webhook(payload, sig_header)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))