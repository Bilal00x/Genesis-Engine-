"""
Project Service
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, Tuple, List
import uuid
from datetime import datetime

from app.models.user import User
from app.models.project import Project, Scene
from app.models.organization import Organization
from app.models.asset import Asset
from app.models.workflow import Workflow
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def list_projects(
        self,
        user: User,
        organization_id: Optional[uuid.UUID] = None,
        search: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Tuple[List[Project], int]:
        """List projects with filters"""
        # Build query
        query = select(Project).where(
            (Project.organization_id == organization_id) if organization_id else True
        )
        
        # Add search
        if search:
            query = query.where(Project.name.ilike(f"%{search}%"))
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination
        query = query.offset(offset).limit(limit).order_by(Project.created_at.desc())
        
        result = await self.db.execute(query)
        projects = result.scalars().all()
        
        return list(projects), total
    
    async def get_project(self, project_id: uuid.UUID, user: User) -> Optional[Project]:
        """Get project by ID"""
        result = await self.db.execute(
            select(Project).where(Project.id == project_id)
        )
        return result.scalar_one_or_none()
    
    async def create_project(
        self,
        user: User,
        project_data: ProjectCreate,
    ) -> Project:
        """Create new project"""
        project = Project(
            organization_id=user.organization_id,
            name=project_data.name,
            description=project_data.description,
            settings=project_data.settings or {},
            created_by=user.id,
        )
        
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        
        return project
    
    async def update_project(
        self,
        project_id: uuid.UUID,
        user: User,
        project_data: ProjectUpdate,
    ) -> Project:
        """Update project"""
        project = await self.get_project(project_id, user)
        if not project:
            raise ValueError("Project not found")
        
        update_data = project_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(project, field, value)
        
        project.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(project)
        return project
    
    async def delete_project(self, project_id: uuid.UUID, user: User):
        """Delete project"""
        project = await self.get_project(project_id, user)
        if not project:
            raise ValueError("Project not found")
        
        await self.db.delete(project)
        await self.db.commit()
    
    async def duplicate_project(self, project_id: uuid.UUID, user: User) -> Project:
        """Duplicate project with all assets and workflows"""
        original = await self.get_project(project_id, user)
        if not original:
            raise ValueError("Project not found")
        
        # Create new project
        new_project = Project(
            organization_id=user.organization_id,
            name=f"{original.name} (Copy)",
            description=original.description,
            thumbnail_url=original.thumbnail_url,
            settings=original.settings.copy() if original.settings else {},
            created_by=user.id,
        )
        
        self.db.add(new_project)
        await self.db.flush()
        
        # Duplicate scenes
        for scene in original.scenes:
            new_scene = Scene(
                project_id=new_project.id,
                name=f"{scene.name} (Copy)",
                description=scene.description,
                thumbnail_url=scene.thumbnail_url,
                data=scene.data.copy() if scene.data else {},
                created_by=user.id,
            )
            self.db.add(new_scene)
        
        # Duplicate workflows
        for workflow in original.workflows:
            new_workflow = Workflow(
                project_id=new_project.id,
                name=f"{workflow.name} (Copy)",
                description=workflow.description,
                nodes=workflow.nodes.copy() if workflow.nodes else {},
                connections=workflow.connections.copy() if workflow.connections else {},
                settings=workflow.settings.copy() if workflow.settings else {},
                created_by=user.id,
            )
            self.db.add(new_workflow)
        
        await self.db.commit()
        await self.db.refresh(new_project)
        
        return new_project