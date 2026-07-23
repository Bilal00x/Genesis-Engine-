"""
Audit and Security Models
"""

from sqlalchemy import String, ForeignKey, Integer, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB, INET
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import uuid
import enum

from app.models.base import BaseModel


class AuditAction(str, enum.Enum):
    create = "create"
    read = "read"
    update = "update"
    delete = "delete"
    login = "login"
    logout = "logout"
    export = "export"
    generate = "generate"


class AuditLog(BaseModel):
    __tablename__ = "audit_logs"
    
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
    )
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("organizations.id", ondelete="SET NULL"),
        index=True,
    )
    action: Mapped[AuditAction] = mapped_column(SQLEnum(AuditAction), index=True)
    resource_type: Mapped[str] = mapped_column(String(100), index=True)
    resource_id: Mapped[uuid.UUID | None] = mapped_column(index=True)
    ip_address: Mapped[str | None] = mapped_column(INET)
    user_agent: Mapped[str | None] = mapped_column(String)
    request_data: Mapped[dict | None] = mapped_column(JSONB)
    response_data: Mapped[dict | None] = mapped_column(JSONB)
    status_code: Mapped[int | None] = mapped_column(Integer)
    error_message: Mapped[str | None] = mapped_column()
    
    # Relationships
    user = relationship("User")
    organization = relationship("Organization")
    
    def __repr__(self) -> str:
        return f"<AuditLog {self.action} {self.resource_type}>"


class RateLimit(BaseModel):
    __tablename__ = "rate_limits"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    endpoint: Mapped[str] = mapped_column(String(255), primary_key=True)
    count: Mapped[int] = mapped_column(Integer, default=0)
    window_start: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<RateLimit {self.user_id} {self.endpoint}>"


class Session(BaseModel):
    __tablename__ = "sessions"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    ip_address: Mapped[str | None] = mapped_column(INET)
    user_agent: Mapped[str | None] = mapped_column(String)
    expires_at: Mapped[datetime] = mapped_column(index=True)
    
    def __repr__(self) -> str:
        return f"<Session {self.user_id}>"


class RefreshToken(BaseModel):
    __tablename__ = "refresh_tokens"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(index=True)
    revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    revoked_at: Mapped[datetime | None]
    
    def __repr__(self) -> str:
        return f"<RefreshToken {self.user_id}>"


class APIKey(BaseModel):
    __tablename__ = "api_keys"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    name: Mapped[str] = mapped_column(String(100))
    key_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    permissions: Mapped[dict] = mapped_column(JSONB, default=list)
    last_used_at: Mapped[datetime | None]
    expires_at: Mapped[datetime | None]
    
    # Relationships
    user = relationship("User", back_populates="api_keys")
    
    def __repr__(self) -> str:
        return f"<APIKey {self.name}>"