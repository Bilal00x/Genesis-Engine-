"""
Tripo Provider Implementation
"""

import aiohttp
import os
from typing import Dict, Any, Optional
from app.ai_providers.base import BaseProvider


class TripoProvider(BaseProvider):
    """Tripo provider implementation"""
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(api_key or os.getenv("TRIPO_API_KEY"))
        self.base_url = "https://api.tripo.ai/v1"
        
    async def generate_image(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate image from text prompt using Tripo"""
        # Tripo is primarily for 3D, but can generate images
        url = f"{self.base_url}/text-to-image"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "prompt": prompt,
            "model": kwargs.get("model", "tripo-1"),
            "width": kwargs.get("width", 1024),
            "height": kwargs.get("height", 1024),
            "num_images": kwargs.get("num_images", 1),
            "seed": kwargs.get("seed"),
            "style": kwargs.get("style", "realistic")
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Tripo API error: {response.status} - {error_text}")
                
                result = await response.json()
                return {
                    "url": result["images"][0]["url"],
                    "seed": result["images"][0].get("seed"),
                    "model": result["images"][0].get("model")
                }
    
    async def generate_3d(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate 3D model from text prompt"""
        url = f"{self.base_url}/text-to-3d"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "prompt": prompt,
            "model": kwargs.get("model", "tripo-3d"),
            "quality": kwargs.get("quality", "standard"),
            "format": kwargs.get("format", "glb"),
            "seed": kwargs.get("seed"),
            "num_images": kwargs.get("num_images", 1)
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Tripo API error: {response.status} - {error_text}")
                
                result = await response.json()
                return {
                    "url": result["model_url"],
                    "format": result["format"],
                    "seed": result.get("seed"),
                    "model": result.get("model")
                }
    
    async def generate_animation(self, model_url: str, **kwargs) -> Dict[str, Any]:
        """Generate animation from 3D model"""
        # Tripo can generate animations from 3D models
        url = f"{self.base_url}/3d-to-animation"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model_url": model_url,
            "animation_type": kwargs.get("animation_type", "walk_cycle"),
            "duration": kwargs.get("duration", 5.0),
            "frame_rate": kwargs.get("frame_rate", 24)
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Tripo API error: {response.status} - {error_text}")
                
                result = await response.json()
                return {
                    "url": result["animation_url"],
                    "format": "glb",
                    "duration": result.get("duration"),
                    "frame_rate": result.get("frame_rate")
                }
    
    async def generate_audio(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate audio from text prompt"""
        # Tripo doesn't have audio generation
        raise NotImplementedError("Tripo provider doesn't support audio generation")
    
    async def generate_code(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate code from text prompt"""
        # Tripo doesn't have code generation
        raise NotImplementedError("Tripo provider doesn't support code generation")