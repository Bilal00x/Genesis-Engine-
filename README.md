# AI Game Studio

A professional AI-powered workspace for game developers, indie studios, artists, and 3D creators. Think Figma + ComfyUI + Unreal Blueprint + Notion combined into one application.

## Features

- **AI Image Generation** - Generate concept art, textures, and sprites with multiple AI providers (OpenAI, Flux, Stable Diffusion)
- **AI 3D Model Generation** - Create 3D models and textures using Meshy, Tripo, and other providers
- **Visual Node Editor** - Build custom AI workflows with a React Flow-based node editor
- **Asset Library** - Organize and manage all your game assets in one place
- **Project Management** - Collaborate with your team on game projects
- **Export Pipeline** - Export assets to Unity, Unreal Engine, Godot, Blender, and more
- **Payment System** - Stripe-integrated subscription and credits system
- **Admin Dashboard** - Monitor system health, users, and audit logs

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, React Flow
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy, Celery
- **Database**: PostgreSQL 16, Redis 7
- **Storage**: S3-compatible (AWS S3 / MinIO)
- **Payments**: Stripe
- **Infrastructure**: Docker, Kubernetes, Terraform
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/ai-game-studio.git
cd ai-game-studio
```

### 2. Install dependencies

```bash
pnpm install
cd packages/backend && pip install -r requirements.txt && cd ../..
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start the development servers

```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or start individually
pnpm run dev
```

### 5. Access the applications

- **Web App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Project Structure

```
ai-game-studio/
├── apps/
│   ├── web/                    # Next.js web application
│   └── admin/                  # Next.js admin dashboard
├── packages/
│   ├── backend/                # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/            # API routes
│   │   │   ├── core/           # Core configuration
│   │   │   ├── models/         # SQLAlchemy models
│   │   │   ├── schemas/        # Pydantic schemas
│   │   │   ├── services/       # Business logic
│   │   │   ├── ai_providers/   # AI provider integrations
│   │   │   └── tasks/          # Celery tasks
│   │   └── requirements.txt
│   └── shared/                 # Shared TypeScript types/utils
├── infrastructure/
│   ├── docker/                 # Docker configurations
│   └── kubernetes/             # Kubernetes manifests
├── database/
│   └── schema.sql              # PostgreSQL schema
├── docs/
│   └── api/                    # API documentation
└── .github/workflows/          # CI/CD pipelines
```

## Development

### Backend

```bash
cd packages/backend

# Run migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Start a Celery worker
celery -A app.core.celery worker --loglevel=info

# Start Celery Beat (scheduled tasks)
celery -A app.core.celery beat --loglevel=info
```

### Frontend

```bash
cd apps/web

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run linting
pnpm run lint
```

### Database

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://localhost:5432/ai_game_studio` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `JWT_SECRET_KEY` | Secret key for JWT tokens | Required |
| `STRIPE_SECRET_KEY` | Stripe secret API key | Required for payments |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 | Required for file storage |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 | Required for file storage |
| `AWS_S3_BUCKET` | S3 bucket name | `ai-game-studio` |

## API Documentation

The API is documented using OpenAPI 3.0. Access the interactive documentation at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Deployment

### Docker

```bash
# Build images
docker build -t ai-game-studio-backend -f packages/backend/Dockerfile packages/backend
docker build -t ai-game-studio-frontend apps/web

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

```bash
# Apply base manifests
kubectl apply -k infrastructure/kubernetes/base

# Apply production overlay
kubectl apply -k infrastructure/kubernetes/overlays/production
```

### Terraform

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs.aigamestudio.com](https://docs.aigamestudio.com)
- Email: support@aigamestudio.com
- Discord: [Join our community](https://discord.gg/aigamestudio)
