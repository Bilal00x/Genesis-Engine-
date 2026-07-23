# AI Game Studio - Monorepo Structure

```
ai-game-studio/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── cd-staging.yml
│   │   └── cd-production.yml
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── .vscode/
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
│
├── apps/
│   │
│   ├── web/                          # Next.js Web Application
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router
│   │   │   │   ├── (auth)/           # Auth routes (login, register)
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── forgot-password/
│   │   │   │   ├── (dashboard)/      # Dashboard routes
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx      # Dashboard home
│   │   │   │   │   ├── projects/
│   │   │   │   │   ├── assets/
│   │   │   │   │   ├── workflows/
│   │   │   │   │   ├── generations/
│   │   │   │   │   ├── settings/
│   │   │   │   │   └── billing/
│   │   │   │   ├── (editor)/         # Editor routes
│   │   │   │   │   ├── editor/
│   │   │   │   │   │   ├── [projectId]/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   ├── workflow/
│   │   │   │   │   │   │   ├── asset/
│   │   │   │   │   │   │   └── scene/
│   │   │   │   ├── api/              # API routes (Next.js API)
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Base UI components (Shadcn)
│   │   │   │   ├── layout/           # Layout components
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   └── MobileNav.tsx
│   │   │   │   ├── auth/             # Auth components
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── RegisterForm.tsx
│   │   │   │   │   └── OAuthButtons.tsx
│   │   │   │   ├── dashboard/        # Dashboard components
│   │   │   │   │   ├── ProjectCard.tsx
│   │   │   │   │   ├── AssetGrid.tsx
│   │   │   │   │   ├── StatsCard.tsx
│   │   │   │   │   └── RecentActivity.tsx
│   │   │   │   ├── editor/           # Editor components
│   │   │   │   │   ├── NodeEditor.tsx
│   │   │   │   │   ├── Toolbar.tsx
│   │   │   │   │   ├── PropertiesPanel.tsx
│   │   │   │   │   ├── AssetPreview.tsx
│   │   │   │   │   └── Timeline.tsx
│   │   │   │   ├── nodes/            # Node types
│   │   │   │   │   ├── PromptNode.tsx
│   │   │   │   │   ├── ImageGenNode.tsx
│   │   │   │   │   ├── ImageEditNode.tsx
│   │   │   │   │   ├── _3DGenNode.tsx
│   │   │   │   │   ├── AnimationNode.tsx
│   │   │   │   │   └── ExportNode.tsx
│   │   │   │   ├── assets/           # Asset components
│   │   │   │   │   ├── AssetCard.tsx
│   │   │   │   │   ├── AssetModal.tsx
│   │   │   │   │   ├── AssetUploader.tsx
│   │   │   │   │   └── FolderTree.tsx
│   │   │   │   ├── workflows/        # Workflow components
│   │   │   │   │   ├── WorkflowCard.tsx
│   │   │   │   │   ├── WorkflowRunner.tsx
│   │   │   │   │   └── TemplateGallery.tsx
│   │   │   │   ├── generations/      # Generation components
│   │   │   │   │   ├── GenerationForm.tsx
│   │   │   │   │   ├── GenerationResult.tsx
│   │   │   │   │   └── GenerationHistory.tsx
│   │   │   │   └── shared/           # Shared components
│   │   │   │       ├── CommandPalette.tsx
│   │   │   │       ├── SearchBar.tsx
│   │   │   │       ├── LoadingSpinner.tsx
│   │   │   │       └── ErrorBoundary.tsx
│   │   │   ├── lib/
│   │   │   │   ├── api/              # API client
│   │   │   │   │   ├── client.ts
│   │   │   │   │   ├── auth.ts
│   │   │   │   │   ├── projects.ts
│   │   │   │   │   ├── assets.ts
│   │   │   │   │   └── generations.ts
│   │   │   │   ├── hooks/            # Custom hooks
│   │   │   │   │   ├── useAuth.ts
│   │   │   │   │   ├── useProjects.ts
│   │   │   │   │   ├── useAssets.ts
│   │   │   │   │   ├── useWebSocket.ts
│   │   │   │   │   └── useGenerations.ts
│   │   │   │   ├── stores/           # Zustand stores
│   │   │   │   │   ├── authStore.ts
│   │   │   │   │   ├── projectStore.ts
│   │   │   │   │   ├── assetStore.ts
│   │   │   │   │   └── editorStore.ts
│   │   │   │   ├── utils/            # Utility functions
│   │   │   │   │   ├── cn.ts
│   │   │   │   │   ├── formatters.ts
│   │   │   │   │   └── validators.ts
│   │   │   │   └── constants/        # Constants
│   │   │   │       ├── nodeTypes.ts
│   │   │   │       ├── assetTypes.ts
│   │   │   │       └── generationTypes.ts
│   │   │   ├── styles/
│   │   │   │   ├── globals.css
│   │   │   │   └── themes/
│   │   │   │       └── dark.ts
│   │   │   ├── types/
│   │   │   │   ├── api.ts
│   │   │   │   ├── models.ts
│   │   │   │   └── editor.ts
│   │   │   └── config/
│   │   │       ├── site.ts
│   │   │       └── navigation.ts
│   │   ├── public/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   ├── tsconfig.json
│   │   └── .env.local.example
│   │
│   └── admin/                        # Admin Dashboard (Next.js)
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── lib/
│       │   └── types/
│       ├── package.json
│       └── next.config.js
│
├── packages/
│   │
│   ├── backend/                      # FastAPI Backend
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── main.py               # FastAPI app entry
│   │   │   ├── api/                  # API Routes
│   │   │   │   ├── __init__.py
│   │   │   │   ├── deps.py           # Dependencies
│   │   │   │   ├── v1/
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── auth.py
│   │   │   │   │   ├── users.py
│   │   │   │   │   ├── projects.py
│   │   │   │   │   ├── assets.py
│   │   │   │   │   ├── workflows.py
│   │   │   │   │   ├── generations.py
│   │   │   │   │   ├── exports.py
│   │   │   │   │   ├── payments.py
│   │   │   │   │   └── admin.py
│   │   │   ├── core/                 # Core modules
│   │   │   │   ├── __init__.py
│   │   │   │   ├── config.py         # Configuration
│   │   │   │   ├── security.py       # Security utilities
│   │   │   │   ├── database.py       # Database connection
│   │   │   │   ├── redis.py          # Redis connection
│   │   │   │   └── celery_app.py     # Celery configuration
│   │   │   ├── models/               # SQLAlchemy Models
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py
│   │   │   │   ├── user.py
│   │   │   │   ├── organization.py
│   │   │   │   ├── project.py
│   │   │   │   ├── asset.py
│   │   │   │   ├── workflow.py
│   │   │   │   ├── generation.py
│   │   │   │   ├── export_job.py
│   │   │   │   ├── subscription.py
│   │   │   │   └── audit_log.py
│   │   │   ├── schemas/              # Pydantic Schemas
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── user.py
│   │   │   │   ├── project.py
│   │   │   │   ├── asset.py
│   │   │   │   ├── workflow.py
│   │   │   │   ├── generation.py
│   │   │   │   └── export.py
│   │   │   ├── services/             # Business Logic
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth_service.py
│   │   │   │   ├── user_service.py
│   │   │   │   ├── project_service.py
│   │   │   │   ├── asset_service.py
│   │   │   │   ├── workflow_service.py
│   │   │   │   ├── generation_service.py
│   │   │   │   ├── export_service.py
│   │   │   │   └── payment_service.py
│   │   │   ├── repositories/         # Data Access Layer
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py
│   │   │   │   ├── user_repo.py
│   │   │   │   ├── project_repo.py
│   │   │   │   ├── asset_repo.py
│   │   │   │   └── generation_repo.py
│   │   │   ├── ai_providers/         # AI Provider Abstraction
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py           # Base provider interface
│   │   │   │   ├── openai_provider.py
│   │   │   │   ├── flux_provider.py
│   │   │   │   ├── comfyui_provider.py
│   │   │   │   ├── meshy_provider.py
│   │   │   │   ├── tripo_provider.py
│   │   │   │   ├── rodin_provider.py
│   │   │   │   ├── hunyuan_provider.py
│   │   │   │   ├── trellis_provider.py
│   │   │   │   ├── runway_provider.py
│   │   │   │   ├── luma_provider.py
│   │   │   │   └── stable_diffusion_provider.py
│   │   │   ├── tasks/                # Celery Tasks
│   │   │   │   ├── __init__.py
│   │   │   │   ├── image_generation.py
│   │   │   │   ├── _3d_generation.py
│   │   │   │   ├── animation.py
│   │   │   │   ├── audio_generation.py
│   │   │   │   └── export_tasks.py
│   │   │   ├── websocket/            # WebSocket Handlers
│   │   │   │   ├── __init__.py
│   │   │   │   ├── manager.py
│   │   │   │   └── handlers.py
│   │   │   └── middleware/           # Middleware
│   │   │       ├── __init__.py
│   │   │       ├── auth.py
│   │   │       ├── rate_limit.py
│   │   │       ├── cors.py
│   │   │       └── audit_log.py
│   │   ├── tests/
│   │   │   ├── __init__.py
│   │   │   ├── conftest.py
│   │   │   ├── test_auth.py
│   │   │   ├── test_projects.py
│   │   │   ├── test_assets.py
│   │   │   └── test_generations.py
│   │   ├── alembic/
│   │   │   ├── versions/
│   │   │   ├── env.py
│   │   │   └── script.py.mako
│   │   ├── package.json
│   │   ├── requirements.txt
│   │   ├── requirements-dev.txt
│   │   ├── pyproject.toml
│   │   └── .env.example
│   │
│   ├── shared/                       # Shared TypeScript types/utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── api.ts
│   │   │   │   ├── models.ts
│   │   │   │   ├── events.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   ├── assetTypes.ts
│   │   │   │   ├── nodeTypes.ts
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   │       ├── validation.ts
│   │   │       └── formatters.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/                           # Shared UI Components
│       ├── src/
│       │   ├── components/
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Modal.tsx
│       │   │   └── ...
│       │   ├── hooks/
│       │   └── utils/
│       ├── package.json
│       ├── tailwind.config.js
│       └── tsconfig.json
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.frontend
│   │   └── Dockerfile.worker
│   ├── kubernetes/
│   │   ├── base/
│   │   │   ├── backend-deployment.yaml
│   │   │   ├── frontend-deployment.yaml
│   │   │   ├── worker-deployment.yaml
│   │   │   ├── postgres-statefulset.yaml
│   │   │   ├── redis-statefulset.yaml
│   │   │   └── minio-statefulset.yaml
│   │   └── overlays/
│   │       ├── development/
│   │       ├── staging/
│   │       └── production/
│   ├── terraform/
│   │   ├── modules/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── prod/
│   │   └── backend.tf
│   └── helm/
│       └── ai-game-studio/
│
├── docs/
│   ├── api/
│   │   └── openapi.yaml
│   ├── architecture/
│   ├── guides/
│   │   ├── development.md
│   │   ├── deployment.md
│   │   └── contributing.md
│   └── ai-providers/
│       └── integration-guide.md
│
├── scripts/
│   ├── setup.sh
│   ├── dev.sh
│   ├── test.sh
│   ├── build.sh
│   └── deploy.sh
│
├── docker-compose.yml
├── docker-compose.dev.yml
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── README.md
└── LICENSE
```

## Key Design Decisions

### 1. Monorepo with Turborepo
- Shared code between packages
- Efficient caching and parallel builds
- Type safety across packages

### 2. Feature-Based Backend Structure
- Each feature is self-contained
- Easy to extract into microservices
- Clear separation of concerns

### 3. AI Provider Abstraction
- All providers implement the same interface
- Easy to add new providers
- No changes to existing code when adding providers

### 4. Event-Driven Architecture
- WebSocket for real-time updates
- Celery for async tasks
- Redis PubSub for inter-service communication

### 5. Database Per Service (Future-Proof)
- Currently single PostgreSQL (modular monolith)
- Easy to split into separate databases per service
- Clear boundaries between modules