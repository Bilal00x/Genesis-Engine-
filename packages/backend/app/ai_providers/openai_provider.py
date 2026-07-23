"""
OpenAI Provider Implementation
"""

import aiohttp
import os
from typing import Dict, Any, Optional
from app.ai_providers.base import BaseProvider


class OpenAIProvider(BaseProvider):
    """OpenAI provider implementation"""
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(api_key or os.getenv("OPENAI_API_KEY"))
        self.base_url = "https://api.openai.com/v1"
        
    async def generate_image(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate image from text prompt using DALL-E"""
        url = f"{self.base_url}/images/generations"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "prompt": prompt,
            "n": 1,
            "size": kwargs.get("size", "1024x1024"),
            "response_format": "url"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"OpenAI API error: {response.status} - {error_text}")
                
                result = await response.json()
                return {
                    "url": result["data"][0]["url"],
                    "revised_prompt": result["data"][0].get("revised_prompt", prompt)
                }
    
    async def generate_3d(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate 3D model from text prompt"""
        # OpenAI doesn't have direct 3D generation, so we'll use DALL-E and convert
        # In real implementation, this would use a different service
        image_result = await self.generate_image(prompt, **kwargs)
        return {
            "url": image_result["url"],
            "format": "png",
            "message": "OpenAI generates 2D images, which can be converted to 3D with other tools"
        }
    
    async def generate_animation(self, model_url: str, **kwargs) -> Dict[str, Any]:
        """Generate animation from 3D model"""
        # OpenAI doesn't have animation generation
        raise NotImplementedError("OpenAI provider doesn't support animation generation")
    
    async def generate_audio(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate audio from text prompt"""
        # Use OpenAI's TTS
        url = f"{self.base_url}/audio/speech"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "tts-1",
            "voice": kwargs.get("voice", "alloy"),
            "input": prompt,
            "response_format": "mp3"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"OpenAI API error: {response.status} - {error_text}")
                
                # Get audio data
                audio_data = await response.read()
                
                # In production, save to storage and return URL
                # For now, return base64 encoded data
                import base64
                return {
                    "url": "data:audio/mp3;base64," + base64.b64encode(audio_data).decode('utf-8'),
                    "format": "mp3"
                }
    
    async def generate_code(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate code from text prompt using GPT"""
        url = f"{self.base_url}/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        system_prompt = f"""You are an expert programmer specializing in game development.
        Generate clean, well-documented code for {kwargs.get('framework', 'Unity')} in {kwargs.get('language', 'C#')}.
        Focus on game-specific functionality and best practices."""
        
        data = {
            "model": "gpt-4",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"OpenAI API error: {response.status} - {error_text}")
                
                result = await response.json()
                return {
                    "code": result["choices"][0]["message"]["content"],
                    "language": kwargs.get("language", "csharp"),
                    "framework": kwargs.get("framework", "unity")
                }