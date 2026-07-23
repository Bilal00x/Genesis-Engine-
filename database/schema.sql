-- AI Game Studio Database Schema
-- PostgreSQL 16+

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('admin', 'user', 'viewer');
CREATE TYPE organization_role AS ENUM ('owner', 'member', 'viewer');
CREATE TYPE asset_type AS ENUM (
    'image', 'texture', 'model_3d', 'animation', 
    'audio', 'music', 'voice', 'sfx',
    'code', 'shader', 'script',
    'vfx', 'material', 'prefab',
    'character', 'weapon', 'building', 'vehicle',
    'environment', 'ui_element', 'concept_art'
);
CREATE TYPE generation_type AS ENUM (
    'text_to_image', 'image_to_image', 'image_to_3d', 'text_to_3d',
    'animation', 'rigging', 'motion', 'facial_animation', 'lip_sync',
    'music', 'sfx', 'voice', 'dialogue',
    'code_unity', 'code_unreal', 'code_godot', 'shader',
    'npc_personality', 'npc_behavior', 'npc_dialogue'
);
CREATE TYPE generation_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE export_format AS ENUM (
    'fbx', 'obj', 'gltf', 'glb', 'usd', 'usda', 'usdc',
    'png', 'jpg', 'jpeg', 'psd', 'webp',
    'mp3', 'wav', 'ogg',
    'cs', 'cpp', 'gd', 'hlsl', 'glsl'
);
CREATE TYPE export_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'canceled', 'past_due', 'trialing');
CREATE TYPE subscription_plan AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE audit_action AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'generate');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),  -- NULL for OAuth users
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    credits INTEGER DEFAULT 100,
    organization_id UUID,
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan subscription_plan DEFAULT 'free',
    credits INTEGER DEFAULT 0,
    stripe_customer_id VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_owner ON organizations(owner_id);

-- Add foreign key to users table
ALTER TABLE users ADD CONSTRAINT fk_users_organization 
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;

-- Organization members (many-to-many)
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role organization_role DEFAULT 'member',
    permissions JSONB DEFAULT '[]',
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    joined_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(organization_id, user_id)
);

CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);

-- API Keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '[]',
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- ============================================================================
-- PROJECT MANAGEMENT
-- ============================================================================

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    settings JSONB DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_projects_created_by ON projects(created_by);

-- Project members (for collaboration)
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role organization_role DEFAULT 'member',
    permissions JSONB DEFAULT '[]',
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);

-- Scenes
CREATE TABLE scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    data JSONB DEFAULT '{}',  -- Scene graph, camera positions, etc.
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scenes_project ON scenes(project_id);
CREATE INDEX idx_scenes_created_by ON scenes(created_by);

-- Scene versions (for version control)
CREATE TABLE scene_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    data JSONB NOT NULL,
    change_summary TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scene_versions_scene ON scene_versions(scene_id);
CREATE INDEX idx_scene_versions_version ON scene_versions(scene_id, version);

-- ============================================================================
-- ASSET MANAGEMENT
-- ============================================================================

-- Assets
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    type asset_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,  -- S3/MinIO path
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    duration INTEGER,  -- For audio/video in milliseconds
    metadata JSONB DEFAULT '{}',  -- Type-specific metadata
    tags TEXT[] DEFAULT '{}',
    folder_path TEXT,  -- Virtual folder structure
    is_favorite BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    license VARCHAR(100) DEFAULT 'all-rights-reserved',
    source_generation_id UUID,  -- If generated by AI
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assets_project ON assets(project_id);
CREATE INDEX idx_assets_org ON assets(organization_id);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_tags ON assets USING GIN(tags);
CREATE INDEX idx_assets_folder ON assets(folder_path);
CREATE INDEX idx_assets_created_by ON assets(created_by);
CREATE INDEX idx_assets_name_search ON assets USING gin(name gin_trgm_ops);

-- Asset versions
CREATE TABLE asset_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    metadata JSONB DEFAULT '{}',
    change_summary TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_versions_asset ON asset_versions(asset_id);
CREATE INDEX idx_asset_versions_version ON asset_versions(asset_id, version);

-- Asset comments
CREATE TABLE asset_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES asset_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp_ms INTEGER,  -- For timestamped comments (audio/video)
    position_x REAL,  -- For spatial comments (images/3D)
    position_y REAL,
    position_z REAL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_asset_comments_asset ON asset_comments(asset_id);
CREATE INDEX idx_asset_comments_parent ON asset_comments(parent_id);
CREATE INDEX idx_asset_comments_user ON asset_comments(user_id);

-- Asset favorites
CREATE TABLE asset_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(asset_id, user_id)
);

CREATE INDEX idx_asset_favorites_asset ON asset_favorites(asset_id);
CREATE INDEX idx_asset_favorites_user ON asset_favorites(user_id);

-- Asset collections (user-defined groups)
CREATE TABLE asset_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7),  -- Hex color
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_collection_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL REFERENCES asset_collections(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(collection_id, asset_id)
);

CREATE INDEX idx_collection_items_collection ON asset_collection_items(collection_id);
CREATE INDEX idx_collection_items_asset ON asset_collection_items(asset_id);

-- ============================================================================
-- WORKFLOW SYSTEM
-- ============================================================================

-- Workflows
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    nodes JSONB NOT NULL DEFAULT '[]',  -- Array of node definitions
    connections JSONB NOT NULL DEFAULT '[]',  -- Array of node connections
    settings JSONB DEFAULT '{}',
    is_template BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflows_project ON workflows(project_id);
CREATE INDEX idx_workflows_org ON workflows(organization_id);
CREATE INDEX idx_workflows_created_by ON workflows(created_by);
CREATE INDEX idx_workflows_tags ON workflows USING GIN(tags);

-- Workflow executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    status generation_status DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    result_asset_ids UUID[],  -- Generated assets
    credits_used INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_workflow_executions_created_by ON workflow_executions(created_by);

-- Workflow execution logs (per node)
CREATE TABLE workflow_execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    node_id VARCHAR(100) NOT NULL,
    node_type VARCHAR(100) NOT NULL,
    status generation_status DEFAULT 'pending',
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    duration_ms INTEGER,
    credits_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_workflow_logs_execution ON workflow_execution_logs(execution_id);
CREATE INDEX idx_workflow_logs_node ON workflow_execution_logs(node_id);

-- ============================================================================
-- AI GENERATIONS
-- ============================================================================

-- Generations
CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    type generation_type NOT NULL,
    provider VARCHAR(100) NOT NULL,  -- e.g., 'openai', 'flux', 'meshy'
    status generation_status DEFAULT 'pending',
    input_data JSONB NOT NULL,  -- Prompts, images, settings
    output_data JSONB,  -- Generated results
    progress INTEGER DEFAULT 0,  -- 0-100
    error_message TEXT,
    result_asset_ids UUID[],  -- Generated assets
    credits_used INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_generations_user ON generations(user_id);
CREATE INDEX idx_generations_org ON generations(organization_id);
CREATE INDEX idx_generations_project ON generations(project_id);
CREATE INDEX idx_generations_type ON generations(type);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_provider ON generations(provider);

-- Generation variations (for A/B testing)
CREATE TABLE generation_variations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generation_id UUID NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    seed INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gen_variations_generation ON generation_variations(generation_id);
CREATE INDEX idx_gen_variations_asset ON generation_variations(asset_id);

-- ============================================================================
-- EXPORT SYSTEM
-- ============================================================================

-- Export jobs
CREATE TABLE export_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    asset_ids UUID[] NOT NULL,
    format export_format NOT NULL,
    settings JSONB DEFAULT '{}',  -- Format-specific settings
    status export_status DEFAULT 'pending',
    output_path TEXT,
    file_size BIGINT,
    error_message TEXT,
    progress INTEGER DEFAULT 0,
    credits_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_export_jobs_user ON export_jobs(user_id);
CREATE INDEX idx_export_jobs_org ON export_jobs(organization_id);
CREATE INDEX idx_export_jobs_project ON export_jobs(project_id);
CREATE INDEX idx_export_jobs_status ON export_jobs(status);

-- ============================================================================
-- PAYMENTS & BILLING
-- ============================================================================

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    plan subscription_plan NOT NULL DEFAULT 'free',
    status subscription_status NOT NULL DEFAULT 'inactive',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Credit transactions
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,  -- 'purchase', 'generation', 'export', 'refund', 'bonus'
    amount INTEGER NOT NULL,  -- Positive for credits added, negative for spent
    balance_after INTEGER NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    generation_id UUID REFERENCES generations(id),
    export_job_id UUID REFERENCES export_jobs(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_org ON credit_transactions(organization_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);

-- Payment transactions
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    amount INTEGER NOT NULL,  -- In cents
    currency VARCHAR(3) DEFAULT 'usd',
    status VARCHAR(50) NOT NULL,  -- Stripe payment status
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_transactions_user ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_org ON payment_transactions(organization_id);
CREATE INDEX idx_payment_transactions_stripe ON payment_transactions(stripe_payment_intent_id);

-- ============================================================================
-- AUDIT & SECURITY
-- ============================================================================

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- NULL for system actions
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    resource_type VARCHAR(100) NOT NULL,  -- e.g., 'user', 'project', 'asset'
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    request_data JSONB,
    response_data JSONB,
    status_code INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Rate limiting
CREATE TABLE rate_limits (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    count INTEGER DEFAULT 0,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, endpoint)
);

-- Sessions (for managing active sessions)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token_hash);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================================================
-- SYSTEM & UTILITIES
-- ============================================================================

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token_hash);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token_hash);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System settings
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create audit log on asset creation
CREATE OR REPLACE FUNCTION log_asset_creation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, request_data)
    VALUES (NEW.created_by, NEW.organization_id, 'create', 'asset', NEW.id, row_to_json(NEW));
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_log_asset_creation AFTER INSERT ON assets
    FOR EACH ROW EXECUTE FUNCTION log_asset_creation();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
    ('generation_credits.free', '{"daily": 10, "monthly": 100}', 'Free plan credit limits'),
    ('generation_credits.starter', '{"daily": 50, "monthly": 500}', 'Starter plan credit limits'),
    ('generation_credits.pro', '{"daily": 200, "monthly": 2000}', 'Pro plan credit limits'),
    ('generation_credits.enterprise', '{"daily": -1, "monthly": -1}', 'Enterprise plan credit limits (-1 = unlimited)'),
    ('export_limits.free', '{"max_resolution": 1024, "max_file_size": 10485760}', 'Free plan export limits'),
    ('export_limits.starter', '{"max_resolution": 2048, "max_file_size": 52428800}', 'Starter plan export limits'),
    ('export_limits.pro', '{"max_resolution": 4096, "max_file_size": 104857600}', 'Pro plan export limits'),
    ('export_limits.enterprise', '{"max_resolution": -1, "max_file_size": -1}', 'Enterprise plan export limits'),
    ('ai_providers.enabled', '["openai", "flux", "stable_diffusion"]', 'Enabled AI providers'),
    ('system.maintenance_mode', 'false', 'System-wide maintenance mode');

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE users IS 'User accounts with authentication and profile data';
COMMENT ON TABLE organizations IS 'Organizations/teams for multi-user collaboration';
COMMENT ON TABLE projects IS 'Game development projects';
COMMENT ON TABLE scenes IS 'Scenes within projects containing asset arrangements';
COMMENT ON TABLE assets IS 'Game assets (images, 3D models, audio, code, etc.)';
COMMENT ON TABLE workflows IS 'Visual node-based workflows for asset generation';
COMMENT ON TABLE generations IS 'AI generation jobs and their results';
COMMENT ON TABLE export_jobs IS 'Export jobs for converting assets to various formats';
COMMENT ON TABLE subscriptions IS 'User subscriptions and billing information';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for security and compliance';