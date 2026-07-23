"""
Stable Diffusion Provider Implementation
"""

import aiohttp
import os
from typing import Dict, Any, Optional
from app.ai_providers.base import BaseProvider


class StableDiffusionProvider(BaseProvider):
    """Stable Diffusion provider implementation"""
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(api_key or os.getenv("STABLE_DIFFUSION_API_KEY"))
        self.base_url = "https://api.stability.ai/v1"
        
    async def generate_image(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate image from text prompt using Stable Diffusion"""
        url = f"{self.base_url}/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "text_prompts": [
                {
                    "text": prompt,
                    "weight": 1.0
                }
            ],
            "cfg_scale": kwargs.get("guidance_scale", 7.0),
            "clip_guidance_preset": kwargs.get("clip_guidance_preset", "NONE"),
            "height": kwargs.get("height", 1024),
            "width": kwargs.get("width", 1024),
            "samples": kwargs.get("num_images", 1),
            "steps": kwargs.get("steps", 50),
            "seed": kwargs.get("seed"),
            "style_preset": kwargs.get("style_preset", "none")
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Stable Diffusion API error: {response.status} - {error_text}")
                
                result = await response.json()
                return {
                    "url": result["artifacts"][0]["url"],
                    "seed": result["artifacts"][0].get("seed"),
                    "model": "stable-diffusion-xl-1024-v1-0"
                }
    
    async def generate_3d(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate 3D model from text prompt"""
        # Stable Diffusion doesn't have direct 3D generation
        # In real implementation, this would use a different service
        image_result = await self.generate_image(prompt, **kwargs)
        return {
            "url": image_result["url"],
            "format": "png",
            "message": "Stable Diffusion generates 2D images, which can be converted to 3D with other tools"
        }
    
    async def generate_animation(self, model_url: str, **kwargs) -> Dict[str, Any]:
        """Generate animation from 3D model"""
        # Stable Diffusion doesn't have animation generation
        raise NotImplementedError("Stable Diffusion provider doesn't support animation generation")
    
    async def generate_audio(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate audio from text prompt"""
        # Stable Diffusion doesn't have audio generation
        raise NotImplementedError("Stable Diffusion provider doesn't support audio generation")
    
    async def generate_code(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate code from text prompt"""
        # Stable Diffusion doesn't have code generation
        raise NotImplementedError("Stable Diffusion provider doesn't support code generation")