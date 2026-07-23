# AI Game Studio - System Architecture

## Overview

AI Game Studio is a production-ready SaaS platform for AI-powered game development. The architecture follows **Clean Architecture** principles with **SOLID** design patterns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │   Next.js   │ │   Electron  │ │  React Native│               │
│  │   Web App   │ │  Desktop    │ │  Mobile      │               │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    API Gateway (Kong)                      │  │
│  │              Rate Limiting │ Auth │ Routing                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  FastAPI Backend Services                  │  │
│  │                                                            │  │
│  │  Core Modules:                                             │  │
│  │  ├── Authentication & Authorization                        │  │
│  │  ├── User Management                                       │  │
│  │  ├── Asset Management                                      │  │
│  │  ├── Workflow Engine                                       │  │
│  │  ├── Project Management                                    │  │
│  │  ├── AI Generation Services                                │  │
│  │  ├── Export Pipeline                                       │  │
│  │  ├── Payment & Billing                                     │  │
│  │  └── Admin Dashboard                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         INFRASTRUCTURE LAYER                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  PostgreSQL  │ │    Redis     │ │   MinIO/S3   │            │
│  │  (Primary DB)│ │  (Cache/Queue)│ │ (File Storage)│           │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │   Celery     │ │  WebSocket   │ │  Elasticsearch│           │
│  │  (Tasks)     │ │  (Realtime)  │ │  (Search)     │           │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         AI PROVIDERS                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ OpenAI  │ │  Flux   │ │ ComfyUI │ │ Meshy   │ │ Tripo   │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Rodin   │ │ Hunyuan │ │ Trellis │ │ Runway  │ │  Luma   │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                          │
│  │ Stable  │ │Replicate│ │Custom   │                          │
│  │ Diffus  │ │         │ │Models   │                          │
│  └─────────┘ └─────────┘ └─────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

## Design Principles

### 1. Clean Architecture
- **Dependency Rule**: Dependencies point inward
- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Business logic is independent of frameworks and UI

### 2. SOLID Principles
- **Single Responsibility**: Each class/module has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Child classes can replace parent classes
- **Interface Segregation**: Many specific interfaces > one general interface
- **Dependency Inversion**: Depend on abstractions, not concretions

### 3. Microservices-Ready
- Modular monolith initially
- Easy to extract modules into microservices
- Event-driven communication
- API Gateway pattern

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS 3.x + Shadcn UI
- **State Management**: Zustand + TanStack Query
- **Node Editor**: React Flow 11.x
- **Animations**: Framer Motion 10.x
- **Forms**: React Hook Form + Zod
- **Realtime**: Socket.io Client

### Backend
- **Framework**: FastAPI 0.109+
- **Language**: Python 3.11+
- **Database**: PostgreSQL 16
- **Cache**: Redis 7.x
- **Task Queue**: Celery 5.x + Flower
- **WebSocket**: FastAPI WebSocket
- **ORM**: SQLAlchemy 2.0 + Alembic
- **Validation**: Pydantic 2.x

### Infrastructure
- **Container**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **Storage**: MinIO (dev) / S3 (prod)
- **CDN**: Cloudflare
- **Search**: Elasticsearch 8.x
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

### Security
- **Authentication**: JWT + OAuth 2.0
- **Authorization**: RBAC (Role-Based Access Control)
- **Rate Limiting**: Redis-based
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Audit Logs**: Immutable event sourcing

## Core Modules

### 1. Authentication Module
- JWT-based authentication
- OAuth 2.0 (Google, GitHub)
- API Key management
- Session management
- Password reset
- 2FA support

### 2. User Management
- User profiles
- Organization/Team support
- Role management
- Permission system
- Credit system

### 3. Asset Management
- Asset CRUD operations
- Folder organization
- Tagging system
- Search & filtering
- Version control
- Metadata management

### 4. Workflow Engine
- Visual node editor
- Node templates
- Workflow execution
- Parallel processing
- Error handling
- History tracking

### 5. Project Management
- Project CRUD
- Scene management
- Collaboration (real-time)
- Comments & reviews
- Version history
- Autosave

### 6. AI Generation Services
- Image Generation (Text2Img, Img2Img)
- 3D Generation (Text23D, Img23D)
- Animation (Rigging, Motion)
- Audio (Music, SFX, Voice)
- Code Generation (Unity, Unreal, Godot)
- NPC AI (Personality, Dialogue)

### 7. Export Pipeline
- Format conversion
- Platform-specific exports
- Batch processing
- Quality settings
- Download management

### 8. Payment & Billing
- Stripe integration
- Subscription plans
- Credit system
- Usage tracking
- Invoicing

### 9. Admin Dashboard
- User management
- System monitoring
- Analytics
- Content moderation
- Support tickets

## Database Schema Overview

```
┌─────────────────┐       ┌─────────────────┐
│      users      │       │  organizations  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ email           │       │ name            │
│ password_hash   │       │ slug            │
│ display_name    │       │ owner_id (FK)   │
│ avatar_url      │       │ plan            │
│ credits         │       │ credits         │
│ role            │       │ created_at      │
│ organization_id │       │ updated_at      │
│ created_at      │       └─────────────────┘
│ updated_at      │              │
└─────────────────┘              │
        │                        │
        │                        │
        ▼                        ▼
┌─────────────────┐       ┌─────────────────┐
│   api_keys      │       │    projects     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ organization_id │
│ name            │       │ name            │
│ key_hash        │       │ description     │
│ permissions     │       │ settings        │
│ last_used_at    │       │ created_by (FK) │
│ expires_at      │       │ created_at      │
│ created_at      │       │ updated_at      │
└─────────────────┘       └─────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     scenes      │       │    assets       │       │   workflows     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ project_id (FK) │       │ project_id (FK) │       │ project_id (FK) │
│ name            │       │ type            │       │ name            │
│ data (JSONB)    │       │ name            │       │ nodes (JSONB)   │
│ created_at      │       │ file_path       │       │ connections     │
│ updated_at      │       │ metadata        │       │ created_at      │
└─────────────────┘       │ tags (ARRAY)    │       │ updated_at      │
                          │ created_by (FK) │       └─────────────────┘
                          │ created_at      │
                          └─────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  asset_versions │       │  asset_comments │       │  asset_favorites│
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ asset_id (FK)   │       │ asset_id (FK)   │       │ asset_id (FK)   │
│ version         │       │ user_id (FK)    │       │ user_id (FK)    │
│ file_path       │       │ content         │       │ created_at      │
│ metadata        │       │ created_at      │       └─────────────────┘
│ created_at      │       └─────────────────┘
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  generations    │       │  export_jobs    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ user_id (FK)    │
│ type            │       │ asset_ids       │
│ provider        │       │ format          │
│ status          │       │ status          │
│ input_data      │       │ output_path     │
│ output_data     │       │ created_at      │
│ credits_used    │       │ completed_at    │
│ created_at      │       └─────────────────┘
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  subscriptions  │       │   transactions  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ user_id (FK)    │
│ stripe_id       │       │ amount          │
│ plan            │       │ type            │
│ status          │       │ description     │
│ current_period  │       │ created_at      │
│ created_at      │       └─────────────────┘
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│   audit_logs    │       │  rate_limits    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ user_id (PK)    │
│ user_id (FK)    │       │ endpoint        │
│ action          │       │ count           │
│ resource        │       │ window_start    │
│ ip_address      │       └─────────────────┘
│ created_at      │
└─────────────────┘
```

## API Design

### RESTful Endpoints

```
/api/v1
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh
│   ├── POST /forgot-password
│   ├── POST /reset-password
│   └── GET  /oauth/:provider
│
├── /users
│   ├── GET    /me
│   ├── PUT    /me
│   ├── GET    /me/credits
│   └── DELETE /me
│
├── /projects
│   ├── GET    /           (list)
│   ├── POST   /           (create)
│   ├── GET    /:id        (get)
│   ├── PUT    /:id        (update)
│   ├── DELETE /:id        (delete)
│   └── POST   /:id/duplicate
│
├── /assets
│   ├── GET    /           (list with filters)
│   ├── POST   /           (upload)
│   ├── GET    /:id        (get)
│   ├── PUT    /:id        (update)
│   ├── DELETE /:id        (delete)
│   ├── POST   /:id/version (create version)
│   └── GET    /:id/versions (list versions)
│
├── /workflows
│   ├── GET    /           (list)
│   ├── POST   /           (create)
│   ├── GET    /:id        (get)
│   ├── PUT    /:id        (update)
│   ├── DELETE /:id        (delete)
│   └── POST   /:id/execute (run workflow)
│
├── /generations
│   ├── POST   /image      (generate image)
│   ├── POST   /3d         (generate 3D)
│   ├── POST   /animation  (generate animation)
│   ├── POST   /audio      (generate audio)
│   ├── POST   /code       (generate code)
│   └── GET    /:id        (get status)
│
├── /exports
│   ├── POST   /           (create export job)
│   ├── GET    /:id        (get status)
│   └── GET    /:id/download
│
├── /payments
│   ├── GET    /plans      (list plans)
│   ├── POST   /subscribe  (create subscription)
│   ├── GET    /subscription (get current)
│   └── POST   /webhook    (Stripe webhook)
│
└── /admin
    ├── GET    /users      (list all users)
    ├── GET    /stats      (system stats)
    ├── GET    /logs       (audit logs)
    └── PUT    /users/:id  (update user)
```

### WebSocket Events

```
Client → Server:
- join_project: { project_id }
- leave_project: { project_id }
- update_asset: { asset_id, data }
- add_comment: { asset_id, content }
- cursor_update: { x, y, user_id }

Server → Client:
- user_joined: { user_id, user_name }
- user_left: { user_id }
- asset_updated: { asset_id, data }
- comment_added: { comment }
- cursor_moved: { x, y, user_id }
- generation_complete: { generation_id, result }
```

## Security Architecture

### Authentication Flow
```
1. User registers/logs in
2. Server validates credentials
3. Server generates JWT (access + refresh)
4. Access token: 15 min expiry
5. Refresh token: 7 days expiry (stored in DB)
6. Client stores tokens (httpOnly cookie for refresh)
7. Client sends access token in Authorization header
8. Server validates JWT signature + expiry
9. On expiry, client uses refresh token to get new access token
```

### Authorization (RBAC)
```
Roles:
- admin: Full system access
- organization_owner: Full org access + billing
- organization_member: Project access based on permissions
- viewer: Read-only access

Permissions:
- project:create, project:read, project:update, project:delete
- asset:create, asset:read, asset:update, asset:delete
- workflow:create, workflow:read, workflow:update, workflow:delete
- generation:create, generation:read
- export:create, export:read
- billing:read, billing:update
```

### Rate Limiting
```
- Global: 1000 requests/hour
- Auth endpoints: 10 requests/minute
- Generation endpoints: 5 requests/minute
- Export endpoints: 10 requests/hour
- WebSocket: 100 messages/minute

Implementation: Redis-based sliding window
```

### Data Encryption
```
- At rest: AES-256 (database, file storage)
- In transit: TLS 1.3
- Passwords: bcrypt (cost factor 12)
- API keys: SHA-256 hash
- Sensitive data: Field-level encryption
```

## Scalability Strategy

### Horizontal Scaling
- Stateless API servers behind load balancer
- Database read replicas
- Redis cluster for caching
- Celery workers auto-scaling
- CDN for static assets

### Vertical Scaling
- Increase database instance size
- Increase Redis memory
- Increase worker resources

### Caching Strategy
```
- User data: 5 min cache
- Project data: 1 min cache
- Asset metadata: 5 min cache
- Generation results: 1 hour cache
- Static assets: CDN (1 year cache)
```

## Monitoring & Observability

### Metrics (Prometheus)
- Request rate
- Error rate
- Response time (p50, p95, p99)
- Database query time
- Cache hit rate
- Queue length
- Worker utilization
- Generation success rate

### Logging (ELK Stack)
- Application logs
- Access logs
- Error logs
- Audit logs
- Security logs

### Tracing (Jaeger)
- Request tracing across services
- Performance bottleneck identification
- Dependency mapping

## Deployment Strategy

### Development
- Docker Compose (local)
- Hot reload enabled
- Mock AI providers

### Staging
- Kubernetes cluster
- Production-like environment
- Full AI provider integration
- Load testing

### Production
- Multi-region Kubernetes
- Auto-scaling enabled
- 99.9% uptime SLA
- Blue-green deployment
- Automated rollback

## Disaster Recovery

### Backup Strategy
- Database: Daily full backup + hourly incremental
- File storage: Versioned buckets
- Configuration: Git versioned
- Secrets: Encrypted backup

### Recovery Time Objective (RTO)
- Critical services: < 1 hour
- Non-critical: < 4 hours

### Recovery Point Objective (RPO)
- Database: < 1 hour data loss
- File storage: < 24 hour data loss