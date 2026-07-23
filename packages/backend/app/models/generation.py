"""
Generation and Export Models
"""

from sqlalchemy import String, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
import enum

from app.models.base import BaseModel


class GenerationType(str, enum.Enum):
    text_to_image = "text_to_image"
    image_to_image = "image_to_image"
    image_to_3d = "image_to_3d"
    text_to_3d = "text_to_3d"
    animation = "animation"
    rigging = "rigging"
    motion = "motion"
    facial_animation = "facial_animation"
    lip_sync = "lip_sync"
    music = "music"
    sfx = "sfx"
    voice = "voice"
    dialogue = "dialogue"
    code_unity = "code_unity"
    code_unreal = "code_unreal"
    code_godot = "code_godot"
    shader = "shader"
    npc_personality = "npc_personality"
    npc_behavior = "npc_behavior"
    npc_dialogue = "npc_dialogue"


class ExportFormat(str, enum.Enum):
    fbx = "fbx"
    obj = "obj"
    gltf = "gltf"
    glb = "glb"
    usd = "usd"
    usda = "usda"
    usdc = "usdc"
    png = "png"
    jpg = "jpg"
    jpeg = "jpeg"
    psd = "psd"
    webp = "webp"
    mp3 = "mp3"
    wav = "wav"
    ogg = "ogg"
    cs = "cs"
    cpp = "cpp"
    gd = "gd"
    hlsl = "hlsl"
    glsl = "glsl"


class ExportStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class Generation(BaseModel):
    __tablename__ = "generations"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("organizations.id", ondelete="SET NULL"),
        index=True,
    )
    project_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("projects.id", ondelete="SET NULL"),
        index=True,
    )
    type: Mapped[GenerationType] = mapped_column(index=True)
    provider: Mapped[str] = mapped_column(String(100), index=True)
    status: Mapped[GenerationStatus] = mapped_column(
        default=GenerationStatus.pending,
        index=True,
    )
    input_data: Mapped[dict] = mapped_column(JSONB)
    output_data: Mapped[dict | None] = mapped_column(JSONB)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    error_message: Mapped[str | None] = mapped_column(Text)
    result_asset_ids: Mapped[list[uuid.UUID] | None] = mapped_column(ARRAY(String))
    credits_used: Mapped[int] = mapped_column(Integer, default=0)
    metadata: Mapped[dict] = mapped_column(JSONB, default=dict)
    started_at: Mapped[uuid.UUID | None]
    completed_at: Mapped[uuid.UUID | None]
    
    # Relationships
    user = relationship("User", back_populates="generations")
    organization = relationship("Organization")
    project = relationship("Project")
    assets = relationship("Asset", back_populates="source_generation")
    
    def __repr__(self) -> str:
        return f"<Generation {self.type} {self.status}>"


class ExportJob(BaseModel):
    __tablename__ = "export_jobs"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
    )
    organization_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("organizations.id", ondelete="SET NULL"),
        index=True,
    )
    project_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("projects.id", ondelete="SET NULL"),
        index=True,
    )
    asset_ids: Mapped[list[uuid.UUID]] = mapped_column(ARRAY(String))
    format: Mapped[ExportFormat] = mapped_column()
    settings: Mapped[dict] = mapped_column(JSONB, default=dict)
    status: Mapped[ExportStatus] = mapped_column(
        default=ExportStatus.pending,
        index=True,
    )
    output_path: Mapped[str | None] = mapped_column(String)
    file_size: Mapped[int | None] = mapped_column()
    error_message: Mapped[str | None] = mapped_column(Text)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    credits_used: Mapped[int] = mapped_column(Integer, default=0)
    started_at: Mapped[uuid.UUID | None]
    completed_at: Mapped[uuid.UUID | None]
    
    # Relationships
    user = relationship("User")
    organization = relationship("Organization")
    project = relationship("Project")
    
    def __repr__(self) -> str:
        return f"<ExportJob {self.format} {self.status}>"