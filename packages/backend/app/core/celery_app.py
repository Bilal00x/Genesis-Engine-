"""
Celery Configuration
"""

from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "ai_game_studio",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=[
        "app.tasks.image_generation",
        "app.tasks._3d_generation",
        "app.tasks.animation",
        "app.tasks.audio_generation",
        "app.tasks.export_tasks",
    ],
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour max
    task_soft_time_limit=3300,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)