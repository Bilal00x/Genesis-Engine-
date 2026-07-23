"""
SQLAlchemy Base Model
"""

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
import uuid

from app.core.database import Base


class BaseModel(Base):
    """Base model with common fields"""
    
    __abstract__ = True
    
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )