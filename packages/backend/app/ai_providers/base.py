"""
AI Provider Base Interface
"""

from typing import Protocol, Dict, Any, Optional
from abc import ABC, abstractmethod


class AIProvider(Protocol):
    """Base protocol for all AI providers"""
    
    @abstractmethod
    async def generate_image(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate image from text prompt"""
        pass
    
    @abstractmethod
    async def generate_3d(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate 3D model from text prompt"""
        pass
    
    @abstractmethod
    async def generate_animation(self, model_url: str, **kwargs) -> Dict[str, Any]:
        """Generate animation from 3D model"""
        pass
    
    @abstractmethod
    async def generate_audio(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate audio from text prompt"""
        pass
    
    @abstractmethod
    async def generate_code(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate code from text prompt"""
        pass


class BaseProvider(ABC):
    """Base implementation for AI providers"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
    
    @abstractmethod
    async def generate_image(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate image from text prompt"""
        pass
    
    @abstractmethod
    async def generate_3d(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate 3D model from text prompt"""
        pass
    
    @abstractmethod
    async def generate_animation(self, model_url: str, **kwargs) -> Dict[str, Any]:
        """Generate animation from 3D model"""
        pass
    
    @abstractmethod
    async def generate_audio(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate audio from text prompt"""
        pass
    
    @abstractmethod
    async def generate_code(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate code from text prompt"""
        pass


def get_provider(provider_name: str):
    """Factory function to get provider by name"""
    from app.ai_providers.openai_provider import OpenAIProvider
    from app.ai_providers.flux_provider import FluxProvider
    from app.ai_providers.comfyui_provider import ComfyUIProvider
    from app.ai_providers.meshy_provider import MeshyProvider
    from app.ai_providers.tripo_provider import TripoProvider
    from app.ai_providers.stable_diffusion_provider import StableDiffusionProvider
    
    providers = {
        "openai": OpenAIProvider,
        "flux": FluxProvider,
        "comfyui": ComfyUIProvider,
        "meshy": MeshyProvider,
        "tripo": TripoProvider,
        "stable_diffusion": StableDiffusionProvider,
    }
    
    provider_class = providers.get(provider_name.lower())
    if not provider_class:
        raise ValueError(f"Unknown provider: {provider_name}")
    
    return provider_class()