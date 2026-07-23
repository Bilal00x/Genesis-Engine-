export const APP_NAME = "AI Game Studio";
export const APP_DESCRIPTION = "AI-powered game development platform";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    monthly_credits: 100,
    max_resolution: 1024,
    max_file_size: 10 * 1024 * 1024,
    projects: 5,
    storage_gb: 1,
    features: [
      "100 AI generations per month",
      "Basic 3D generation",
      "1GB storage",
      "Community support",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 29,
    monthly_credits: 500,
    max_resolution: 2048,
    max_file_size: 50 * 1024 * 1024,
    projects: 20,
    storage_gb: 10,
    features: [
      "500 AI generations per month",
      "Advanced 3D generation",
      "10GB storage",
      "Priority support",
      "Team collaboration",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 99,
    monthly_credits: -1,
    max_resolution: 4096,
    max_file_size: 100 * 1024 * 1024,
    projects: -1,
    storage_gb: 100,
    features: [
      "Unlimited AI generations",
      "Enterprise 3D generation",
      "100GB storage",
      "Dedicated support",
      "Team collaboration",
      "Custom AI models",
      "API access",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    monthly_credits: -1,
    max_resolution: -1,
    max_file_size: -1,
    projects: -1,
    storage_gb: -1,
    features: [
      "Unlimited AI generations",
      "Custom AI models",
      "Unlimited storage",
      "Dedicated support",
      "On-premise deployment",
      "SLA guarantee",
      "White-labeling",
    ],
  },
} as const;

export const CREDIT_COSTS = {
  image_generation: 1,
  image_edit: 2,
  inpainting: 2,
  outpainting: 2,
  upscale: 1,
  texture_generation: 3,
  "3d_model": 10,
  "3d_texture": 5,
  animation: 8,
  audio: 2,
  video: 5,
  export_png: 0,
  export_jpg: 0,
  export_webp: 0,
  export_obj: 1,
  export_fbx: 2,
  export_gltf: 2,
  export_glb: 2,
  export_usdz: 3,
  export_stl: 1,
  export_blend: 2,
  export_unity_package: 3,
  export_unreal_pak: 3,
} as const;

export const PROVIDER_NAMES: Record<string, string> = {
  openai: "OpenAI",
  flux: "Flux",
  comfyui: "ComfyUI",
  meshy: "Meshy",
  tripo: "Tripo",
  rodin: "Rodin",
  hunyuan3d: "Hunyuan3D",
  trellis: "Trellis",
  runway: "Runway",
  luma: "Luma",
  stability: "Stable Diffusion",
};

export const ASSET_TYPE_LABELS: Record<string, string> = {
  image: "Image",
  model_3d: "3D Model",
  texture: "Texture",
  audio: "Audio",
  video: "Video",
  animation: "Animation",
  script: "Script",
  other: "Other",
};

export const EXPORT_TARGET_LABELS: Record<string, string> = {
  unity: "Unity",
  unreal: "Unreal Engine",
  godot: "Godot",
  blender: "Blender",
  maya: "Maya",
  cinema4d: "Cinema 4D",
  custom: "Custom",
};

export const MAX_UPLOAD_SIZE = 100 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
];

export const ALLOWED_3D_TYPES = [
  "model/obj",
  "model/fbx",
  "model/gltf",
  "application/octet-stream",
];

export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
];

export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];
export const DEFAULT_PAGE_SIZE = 24;
