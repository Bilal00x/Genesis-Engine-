"""
Workflow Models
"""

from sqlalchemy import String, Boolean, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
import enum

from app.models.base import BaseModel


class GenerationStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"
    cancelled = "cancelled"


class Workflow(BaseModel):
    __tablename__ = "workflows"
    
    project_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("projects.id", ondelete="SET NULL"),
        index=True,
    )
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("organizations.id", ondelete="SET NULL"),
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    thumbnail_url: Mapped[str | None] = mapped_column(String)
    nodes: Mapped[dict] = mapped_column(JSONB, default=list)
    connections: Mapped[dict] = mapped_column(JSONB, default=list)
    settings: Mapped[dict] = mapped_column(JSONB, default=dict)
    is_template: Mapped[bool] = mapped_column(Boolean, default=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    created_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id"),
        index=True,
    )
    
    # Relationships
    project = relationship("Project", back_populates="workflows")
    organization = relationship("Organization", back_populates="workflows")
    creator = relationship("User", back_populates="workflows")
    executions = relationship("WorkflowExecution", back_populates="workflow", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Workflow {self.name}>"


class WorkflowExecution(BaseModel):
    __tablename__ = "workflow_executions"
    
    workflow_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("workflows.id", ondelete="CASCADE"),
        index=True,
    )
    status: Mapped[GenerationStatus] = mapped_column(
        default=GenerationStatus.pending,
        index=True,
    )
    started_at: Mapped[uuid.UUID | None]
    completed_at: Mapped[uuid.UUID | None]
    error_message: Mapped[str | None] = mapped_column(Text)
    result_asset_ids: Mapped[list[uuid.UUID] | None]
    credits_used: Mapped[int] = mapped_column(Integer, default=0)
    created_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    
    # Relationships
    workflow = relationship("Workflow", back_populates="executions")
    logs = relationship("WorkflowExecutionLog", back_populates="execution", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<WorkflowExecution {self.id}>"


class WorkflowExecutionLog(BaseModel):
    __tablename__ = "workflow_execution_logs"
    
    execution_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("workflow_executions.id", ondelete="CASCADE"),
        index=True,
    )
    node_id: Mapped[str] = mapped_column(String(100), index=True)
    node_type: Mapped[str] = mapped_column(String(100))
    status: Mapped[GenerationStatus] = mapped_column(default=GenerationStatus.pending)
    input_data: Mapped[dict | None] = mapped_column(JSONB)
    output_data: Mapped[dict | None] = mapped_column(JSONB)
    error_message: Mapped[str | None] = mapped_column(Text)
    duration_ms: Mapped[int | None] = mapped_column(Integer)
    credits_used: Mapped[int] = mapped_column(Integer, default=0)
    completed_at: Mapped[uuid.UUID | None]
    
    # Relationships
    execution = relationship("WorkflowExecution", back_populates="logs")
    
    def __repr__(self) -> str:
        return f"<WorkflowExecutionLog {self.node_id}>"