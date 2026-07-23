"""
Payment Service
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
import uuid
from datetime import datetime, timedelta

from app.models.user import User
from app.models.payment import (
    Subscription,
    SubscriptionPlan,
    SubscriptionStatus,
    CreditTransaction,
    PaymentTransaction,
)
from app.schemas.payment import (
    SubscriptionResponse,
    CreditTransactionResponse,
    PaymentTransactionResponse,
    SubscribeRequest,
)


class PaymentService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def subscribe(
        self,
        user: User,
        plan_id: str,
        payment_method_id: str,
        coupon_code: Optional[str] = None,
    ) -> Subscription:
        """Subscribe to a plan"""
        # Validate plan
        if plan_id not in [p.value for p in SubscriptionPlan]:
            raise ValueError("Invalid plan")
        
        # Check if user already has active subscription
        result = await self.db.execute(
            select(Subscription)
            .where(Subscription.user_id == user.id)
            .where(Subscription.status == SubscriptionStatus.active)
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            # Update existing subscription
            existing.plan = plan_id
            existing.status = SubscriptionStatus.active
            existing.current_period_start = datetime.utcnow()
            existing.current_period_end = datetime.utcnow() + timedelta(days=30)
            existing.cancel_at_period_end = False
            
            # Add credits based on plan
            from app.models.system_settings import system_settings
            
            # In real implementation, charge payment method via Stripe
            payment_transaction = PaymentTransaction(
                user_id=user.id,
                stripe_payment_intent_id="pi_123456789",
                amount=self._get_plan_price(plan_id),
                currency="usd",
                status="succeeded",
                description=f"Subscription to {plan_id} plan",
            )
            
            self.db.add(payment_transaction)
            
            # Add credits
            credit_transaction = CreditTransaction(
                user_id=user.id,
                type="purchase",
                amount=self._get_plan_credits(plan_id),
                balance_after=user.credits + self._get_plan_credits(plan_id),
                description=f"Subscription to {plan_id} plan",
            )
            
            self.db.add(credit_transaction)
            
            await self.db.commit()
            await self.db.refresh(existing)
            
            return existing
        
        # Create new subscription
        subscription = Subscription(
            user_id=user.id,
            organization_id=user.organization_id,
            plan=plan_id,
            status=SubscriptionStatus.active,
            current_period_start=datetime.utcnow(),
            current_period_end=datetime.utcnow() + timedelta(days=30),
            cancel_at_period_end=False,
        )
        
        self.db.add(subscription)
        
        # Add payment transaction
        payment_transaction = PaymentTransaction(
            user_id=user.id,
            stripe_payment_intent_id="pi_123456789",
            amount=self._get_plan_price(plan_id),
            currency="usd",
            status="succeeded",
            description=f"Subscription to {plan_id} plan",
        )
        
        self.db.add(payment_transaction)
        
        # Add credits
        credit_transaction = CreditTransaction(
            user_id=user.id,
            type="purchase",
            amount=self._get_plan_credits(plan_id),
            balance_after=user.credits + self._get_plan_credits(plan_id),
            description=f"Subscription to {plan_id} plan",
        )
        
        self.db.add(credit_transaction)
        
        await self.db.commit()
        await self.db.refresh(subscription)
        
        return subscription
    
    async def get_subscription(self, user: User) -> Optional[Subscription]:
        """Get current subscription"""
        result = await self.db.execute(
            select(Subscription)
            .where(Subscription.user_id == user.id)
            .where(Subscription.status == SubscriptionStatus.active)
        )
        return result.scalar_one_or_none()
    
    async def cancel_subscription(
        self,
        user: User,
        cancel_at_period_end: bool,
    ):
        """Cancel subscription"""
        result = await self.db.execute(
            select(Subscription)
            .where(Subscription.user_id == user.id)
            .where(Subscription.status == SubscriptionStatus.active)
        )
        subscription = result.scalar_one_or_none()
        
        if not subscription:
            raise ValueError("No active subscription found")
        
        subscription.cancel_at_period_end = cancel_at_period_end
        
        await self.db.commit()
        await self.db.refresh(subscription)
    
    async def list_transactions(
        self,
        user_id: uuid.UUID,
        limit: int = 20,
        offset: int = 0,
    ) -> List[CreditTransaction]:
        """List credit transactions"""
        result = await self.db.execute(
            select(CreditTransaction)
            .where(CreditTransaction.user_id == user_id)
            .order_by(CreditTransaction.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def list_payments(
        self,
        user_id: uuid.UUID,
        limit: int = 20,
        offset: int = 0,
    ) -> List[PaymentTransaction]:
        """List payment history"""
        result = await self.db.execute(
            select(PaymentTransaction)
            .where(PaymentTransaction.user_id == user_id)
            .order_by(PaymentTransaction.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all()
    
    def _get_plan_price(self, plan_id: str) -> int:
        """Get price for plan in cents"""
        prices = {
            "free": 0,
            "starter": 2900,
            "pro": 9900,
            "enterprise": 29900,
        }
        return prices.get(plan_id, 0)
    
    def _get_plan_credits(self, plan_id: str) -> int:
        """Get credits for plan"""
        credits = {
            "free": 100,
            "starter": 500,
            "pro": -1,  # unlimited
            "enterprise": -1,  # unlimited
        }
        return credits.get(plan_id, 0)