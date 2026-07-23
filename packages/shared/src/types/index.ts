export type UserRole = "owner" | "admin" | "member" | "viewer";

export type SubscriptionPlan = "free" | "starter" | "pro" | "enterprise";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export type AssetType =
  | "image"
  | "model_3d"
  | "texture"
  | "audio"
  | "video"
  | "animation"
  | "script"
  | "other";

export type AssetFormat =
  | "png"
  | "jpg"
  | "jpeg"
  | "gif"
  | "webp"
  | "svg"
  | "obj"
  | "fbx"
  | "gltf"
  | "glb"
  | "usdz"
  | "stl"
  | "blend"
  | "mp3"
  | "wav"
  | "ogg"
  | "mp4"
  | "webm";

export type GenerationStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type GenerationType =
  | "image"
  | "image_edit"
  | "inpainting"
  | "outpainting"
  | "upscale"
  | "texture"
  | "3d_model"
  | "3d_texture"
  | "animation"
  | "audio"
  | "video";

export type ExportFormat =
  | "png"
  | "jpg"
  | "webp"
  | "obj"
  | "fbx"
  | "gltf"
  | "glb"
  | "usdz"
  | "stl"
  | "blend"
  | "unity_package"
  | "unreal_pak";

export type ExportStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type PaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "canceled"
  | "requires_action"
  | "requires_confirmation"
  | "requires_payment_method";

export type CreditTransactionType =
  | "purchase"
  | "subscription_grant"
  | "generation_use"
  | "export_use"
  | "refund"
  | "bonus"
  | "admin_adjustment";

export type AuditAction =
  | "user.login"
  | "user.logout"
  | "user.register"
  | "user.update_profile"
  | "user.change_password"
  | "user.delete_account"
  | "project.create"
  | "project.update"
  | "project.delete"
  | "project.share"
  | "asset.upload"
  | "asset.update"
  | "asset.delete"
  | "asset.download"
  | "generation.create"
  | "generation.cancel"
  | "generation.delete"
  | "export.create"
  | "export.cancel"
  | "export.delete"
  | "payment.create"
  | "payment.update"
  | "payment.refund"
  | "subscription.create"
  | "subscription.update"
  | "subscription.cancel"
  | "api_key.create"
  | "api_key.revoke"
  | "admin.user_update"
  | "admin.project_update"
  | "admin.system_config_update";

export type WorkflowNodeType =
  | "text_input"
  | "image_input"
  | "model_input"
  | "noise_generator"
  | "sampler"
  | "scheduler"
  | "control_net"
  | "img2img"
  | "inpainting"
  | "upscaler"
  | "style_transfer"
  | "face_restoration"
  | "background_removal"
  | "image_merge"
  | "image_crop"
  | "image_resize"
  | "color_correction"
  | "output_image"
  | "output_model"
  | "3d_generator"
  | "texture_generator"
  | "animation_generator";

export type AIProvider =
  | "openai"
  | "flux"
  | "comfyui"
  | "meshy"
  | "tripo"
  | "rodin"
  | "hunyuan3d"
  | "trellis"
  | "runway"
  | "luma"
  | "stability";

export type ExportTarget =
  | "unity"
  | "unreal"
  | "godot"
  | "blender"
  | "maya"
  | "cinema4d"
  | "custom";

export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  credits: number;
  monthly_credits: number;
  used_credits: number;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  plan: SubscriptionPlan;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  owner_id: string;
  organization_id?: string;
  is_public: boolean;
  tags: string[];
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Scene {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  name: string;
  description?: string;
  file_url: string;
  thumbnail_url?: string;
  file_size: number;
  file_type: AssetType;
  file_format: AssetFormat;
  width?: number;
  height?: number;
  depth?: number;
  duration?: number;
  project_id?: string;
  owner_id: string;
  tags: string[];
  metadata: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  owner_id: string;
  project_id?: string;
  is_template: boolean;
  is_public: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface Generation {
  id: string;
  type: GenerationType;
  status: GenerationStatus;
  prompt: string;
  negative_prompt?: string;
  parameters: Record<string, unknown>;
  input_asset_id?: string;
  output_asset_id?: string;
  project_id?: string;
  owner_id: string;
  provider: AIProvider;
  credits_used: number;
  error_message?: string;
  progress?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ExportJob {
  id: string;
  status: ExportStatus;
  source_type: "asset" | "project" | "generation";
  source_id: string;
  format: ExportFormat;
  target: ExportTarget;
  parameters: Record<string, unknown>;
  output_url?: string;
  file_size?: number;
  owner_id: string;
  credits_used: number;
  error_message?: string;
  progress?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  credits: number;
  used_credits: number;
  remaining_credits: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  type: CreditTransactionType;
  amount: number;
  balance_after: number;
  description: string;
  reference_id?: string;
  user_id: string;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  stripe_payment_id?: string;
  stripe_invoice_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  rate_limit: number;
  user_id: string;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  resource_type?: string;
  resource_id?: string;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  user_id: string;
  organization_id?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface APIError {
  detail: string;
  code?: string;
  field?: string;
}
