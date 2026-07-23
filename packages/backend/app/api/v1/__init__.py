"""
API v1 Router
"""

from fastapi import APIRouter

from app.api.v1.routes import auth, users, projects, assets, workflows, generations, exports, payments, admin

api_router = APIRouter()

# Authentication
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Users
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Projects
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])

# Assets
api_router.include_router(assets.router, prefix="/assets", tags=["Assets"])

# Workflows
api_router.include_router(workflows.router, prefix="/workflows", tags=["Workflows"])

# Generations
api_router.include_router(generations.router, prefix="/generations", tags=["Generations"])

# Exports
api_router.include_router(exports.router, prefix="/exports", tags=["Exports"])

# Payments
api_router.include_router(payments.router, prefix="/payments", tags=["Payments"])

# Admin
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])