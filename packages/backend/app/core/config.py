"""
Application Configuration
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    app_name: str = "AI Game Studio"
    app_version: str = "1.0.0"
    debug: bool = False
    environment: str = "development"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/ai_game_studio"
    database_pool_size: int = 10
    database_max_overflow: int = 20
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    redis_cache_url: str = "redis://localhost:6379/1"
    
    # JWT
    jwt_secret_key: str = "super-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    
    # OAuth - Google
    google_client_id: str | None = None
    google_client_secret: str | None = None
    google_redirect_uri: str = "http://localhost:3000/auth/callback/google"
    
    # OAuth - GitHub
    github_client_id: str | None = None
    github_client_secret: str | None = None
    github_redirect_uri: str = "http://localhost:3000/auth/callback/github"
    
    # Storage
    storage_type: str = "minio"
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "ai-game-studio"
    minio_use_ssl: bool = False
    
    # AWS S3
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None
    aws_region: str = "us-east-1"
    aws_s3_bucket: str | None = None
    
    # Celery
    celery_broker_url: str = "redis://localhost:6379/2"
    celery_result_backend: str = "redis://localhost:6379/3"
    
    # AI Providers
    openai_api_key: str | None = None
    flux_api_key: str | None = None
    comfyui_url: str = "http://localhost:8188"
    meshy_api_key: str | None = None
    tripo_api_key: str | None = None
    rodin_api_key: str | None = None
    hunyuan_api_key: str | None = None
    trellis_api_key: str | None = None
    runway_api_key: str | None = None
    luma_api_key: str | None = None
    stable_diffusion_api_key: str | None = None
    
    # Stripe
    stripe_secret_key: str | None = None
    stripe_webhook_secret: str | None = None
    stripe_publishable_key: str | None = None
    
    # Rate Limiting
    rate_limit_global: int = 1000
    rate_limit_auth: int = 10
    rate_limit_generation: int = 5
    
    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    cors_allow_credentials: bool = True
    
    # Email
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    email_from: str = "noreply@aigamestudio.com"
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "json"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()