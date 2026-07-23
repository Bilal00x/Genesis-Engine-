"""
Stripe Service
"""

import stripe
import os
from typing import Optional, Dict, Any
import uuid
from datetime import datetime

from app.models.user import User
from app.models.payment import Subscription, SubscriptionPlan, SubscriptionStatus
from app.models.payment import CreditTransaction, PaymentTransaction
from app.core.database import get_db


class StripeService:
    def __init__(self):
        self.stripe_api_key = os.getenv("STRIPE_SECRET_KEY")
        if not self.stripe_api_key:
            raise ValueError("STRIPE_SECRET_KEY environment variable not set")
        
        stripe.api_key = self.stripe_api_key
        
    async def create_customer(self, user: User, email: str) -> str:
        """Create a Stripe customer"""
        customer = stripe.Customer.create(
            email=email,
            name=user.display_name,
            metadata={"user_id": str(user.id)}
        )
        
        return customer.id
    
    async def create_checkout_session(
        self,
        user: User,
        plan_id: str,
        success_url: str,
        cancel_url: str
    ) -> str:
        """Create a Stripe checkout session"""
        
        # Get plan prices
        prices = {
            "free": 0,
            "starter": 2900,  # $29
            "pro": 9900,      # $99
            "enterprise": 29900 # $299
        }
        
        price_id = f"price_{plan_id}"
        
        # Create product if it doesn't exist
        product = stripe.Product.create(
            name=f"AI Game Studio {plan_id.title()} Plan",
            description=f"{plan_id.title()} subscription plan for AI Game Studio",
            metadata={"plan_id": plan_id}
        )
        
        # Create price
        price = stripe.Price.create(
            product=product.id,
            unit_amount=prices[plan_id],
            currency="usd",
            recurring={"interval": "month"}
        )
        
        # Create checkout session
        session = stripe.checkout.Session.create(
            customer=user.stripe_customer_id if user.stripe_customer_id else None,
            payment_method_types=["card"],
            line_items=[
                {
                    "price": price.id,
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=f"{success_url}?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=cancel_url,
            metadata={
                "user_id": str(user.id),
                "plan_id": plan_id
            }
        )
        
        return session.id
    
    async def create_portal_session(self, user: User) -> str:
        """Create a Stripe customer portal session"""
        if not user.stripe_customer_id:
            raise ValueError("No Stripe customer ID found")
        
        session = stripe.billing_portal.Session.create(
            customer=user.stripe_customer_id,
            return_url="https://aigamestudio.com/dashboard/settings/billing"
        )
        
        return session.url
    
    async def handle_webhook(self, payload: bytes, sig_header: str) -> Dict[str, Any]:
        """Handle Stripe webhook events"""
        endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        if not endpoint_secret:
            raise ValueError("STRIPE_WEBHOOK_SECRET environment variable not set")
        
        event = None
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            # Invalid payload
            raise e
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            raise e
        
        # Handle the event
        if event.type == "customer.subscription.created":
            subscription = event.data.object
            await self.handle_subscription_created(subscription)
        elif event.type == "customer.subscription.updated":
            subscription = event.data.object
            await self.handle_subscription_updated(subscription)
        elif event.type == "customer.subscription.deleted":
            subscription = event.data.object
            await self.handle_subscription_deleted(subscription)
        elif event.type == "invoice.payment_succeeded":
            invoice = event.data.object
            await self.handle_invoice_payment_succeeded(invoice)
        
        return {"received": True}
    
    async def handle_subscription_created(self, subscription: Dict[str, Any]):
        """Handle subscription created event"""
        # Get user ID from metadata
        user_id = subscription.metadata.get("user_id")
        if not user_id:
            return
        
        # Get database session
        db = next(get_db())
        
        # Update user with Stripe customer ID
        customer_id = subscription.customer
        
        # Create subscription record
        subscription_record = Subscription(
            user_id=uuid.UUID(user_id),
            organization_id=None,
            stripe_subscription_id=subscription.id,
            stripe_customer_id=customer_id,
            plan=subscription.items.data[0].price.product.name.split()[1].lower(),
            status=SubscriptionStatus.active,
            current_period_start=datetime.fromtimestamp(subscription.current_period_start),
            current_period_end=datetime.fromtimestamp(subscription.current_period_end),
            cancel_at_period_end=False
        )
        
        db.add(subscription_record)
        await db.commit()
        
        # Add credits based on plan
        plan_id = subscription.items.data[0].price.product.name.split()[1].lower()
        credits = self._get_plan_credits(plan_id)
        
        credit_transaction = CreditTransaction(
            user_id=uuid.UUID(user_id),
            type="purchase",
            amount=credits,
            balance_after=credits,
            description=f"Subscription to {plan_id} plan",
            metadata={"stripe_subscription_id": subscription.id}
        )
        
        db.add(credit_transaction)
        await db.commit()
    
    async def handle_subscription_updated(self, subscription: Dict[str, Any]):
        """Handle subscription updated event"""
        # Update subscription status
        db = next(get_db())
        
        subscription_record = await db.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == subscription.id)
        )
        subscription_record = subscription_record.scalar_one_or_none()
        
        if subscription_record:
            subscription_record.status = SubscriptionStatus.active if subscription.status == "active" else SubscriptionStatus.inactive
            subscription_record.current_period_start = datetime.fromtimestamp(subscription.current_period_start)
            subscription_record.current_period_end = datetime.fromtimestamp(subscription.current_period_end)
            subscription_record.cancel_at_period_end = subscription.cancel_at_period_end
            
            db.add(subscription_record)
            await db.commit()
    
    async def handle_subscription_deleted(self, subscription: Dict[str, Any]):
        """Handle subscription deleted event"""
        db = next(get_db())
        
        subscription_record = await db.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == subscription.id)
        )
        subscription_record = subscription_record.scalar_one_or_none()
        
        if subscription_record:
            subscription_record.status = SubscriptionStatus.canceled
            subscription_record.canceled_at = datetime.utcnow()
            
            db.add(subscription_record)
            await db.commit()
    
    async def handle_invoice_payment_succeeded(self, invoice: Dict[str, Any]):
        """Handle invoice payment succeeded event"""
        # Create payment transaction record
        db = next(get_db())
        
        payment_transaction = PaymentTransaction(
            user_id=uuid.UUID(invoice.metadata.get("user_id")),
            organization_id=None,
            stripe_payment_intent_id=invoice.payment_intent,
            amount=invoice.amount_paid,
            currency=invoice.currency,
            status="succeeded",
            description=f"Payment for subscription {invoice.subscription}",
            metadata={"invoice_id": invoice.id}
        )
        
        db.add(payment_transaction)
        await db.commit()
    
    def _get_plan_credits(self, plan_id: str) -> int:
        """Get credits for plan"""
        credits = {
            "free": 100,
            "starter": 500,
            "pro": -1,  # unlimited
            "enterprise": -1,  # unlimited
        }
        return credits.get(plan_id, 0)