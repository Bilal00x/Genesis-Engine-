"""
ComfyUI Provider Implementation
"""

import aiohttp
import os
import json
from typing import Dict, Any, Optional
from app.ai_providers.base import BaseProvider


class ComfyUIProvider(BaseProvider):
    """ComfyUI provider implementation"""
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(api_key)
        self.base_url = os.getenv("COMFYUI_URL", "http://localhost:8188")
        
    async def generate_image(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate image from text prompt using ComfyUI"""
        # ComfyUI uses workflow JSON
        workflow = {
            "3": {
                "inputs": {
                    "text": prompt,
                    "clip": ["4", 0]
                },
                "class_type": "CLIPTextEncode",
                "_meta": {
                    "title": "CLIP Text Encode (Prompt)"
                }
            },
            "4": {
                "inputs": {
                    "model_name": "sd_xl_base_1.0.safetensors"
                },
                "class_type": "UNETLoader",
                "_meta": {
                    "title": "Load UNET Model"
                }
            },
            "5": {
                "inputs": {
                    "width": kwargs.get("width", 1024),
                    "height": kwargs.get("height", 1024),
                    "batch_size": kwargs.get("batch_size", 1)
                },
                "class_type": "EmptyLatentImage",
                "_meta": {
                    "title": "Empty Latent Image"
                }
            },
            "6": {
                "inputs": {
                    "samples": ["9", 0],
                    "vae": ["7", 0]
                },
                "class_type": "VAEDecode",
                "_meta": {
                    "title": "VAE Decode"
                }
            },
            "7": {
                "inputs": {
                    "vae_name": "vae-ft-mse-840000-ema-pruned.safetensors"
                },
                "class_type": "VAELoader",
                "_meta": {
                    "title": "Load VAE"
                }
            },
            "8": {
                "inputs": {
                    "ckpt_name": "sd_xl_base_1.0.safetensors"
                },
                "class_type": "CheckpointLoaderSimple",
                "_meta": {
                    "title": "Load Checkpoint"
                }
            },
            "9": {
                "inputs": {
                    "noise_seed": kwargs.get("seed", 0),
                    "steps": kwargs.get("steps", 30),
                    "cfg": kwargs.get("guidance_scale", 7.5),
                    "sampler_name": "euler",
                    "scheduler": "normal",
                    "denoise": 1.0,
                    "model": ["4", 0],
                    "positive": ["3", 0],
                    "negative": ["10", 0],
                    "latent_image": ["5", 0]
                },
                "class_type": "KSampler",
                "_meta": {
                    "title": "KSampler"
                }
            },
            "10": {
                "inputs": {
                    "text": kwargs.get("negative_prompt", ""),
                    "clip": ["4", 0]
                },
                "class_type": "CLIPTextEncode",
                "_meta": {
                    "title": "CLIP Text Encode (Negative Prompt)"
                }
            },
            "11": {
                "inputs": {
                    "filename_prefix": "ComfyUI",
                    "images": ["6", 0]
                },
                "class_type": "SaveImage",
                "_meta": {
                    "title": "Save Image"
                }
            }
        }
        
        # Connect nodes
        workflow["3"]["inputs"]["clip"] = ["8", 1]
        workflow["4"]["inputs"]["model_name"] = "sd_xl_base_1.0.safetensors"
        workflow["5"]["inputs"]["width"] = kwargs.get("width", 1024)
        workflow["5"]["inputs"]["height"] = kwargs.get("height", 1024)
        workflow["6"]["inputs"]["vae"] = ["7", 0]
        workflow["7"]["inputs"]["vae_name"] = "vae-ft-mse-840000-ema-pruned.safetensors"
        workflow["8"]["inputs"]["ckpt_name"] = "sd_xl_base_1.0.safetensors"
        workflow["9"]["inputs"]["model"] = ["4", 0]
        workflow["9"]["inputs"]["positive"] = ["3", 0]
        workflow["9"]["inputs"]["negative"] = ["10", 0]
        workflow["9"]["inputs"]["latent_image"] = ["5", 0]
        workflow["10"]["inputs"]["clip"] = ["8", 1]
        workflow["11"]["inputs"]["images"] = ["6", 0]
        
        url = f"{self.base_url}/prompt"
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json={"prompt": workflow}) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"ComfyUI API error: {response.status} - {error_text}")
                
                result = await response.json()
                
                # Get image URL
                # In ComfyUI, we need to get the filename from the SaveImage node
                # This is simplified - in production, we'd track the workflow execution
                
                return {
                    "url": f"{self.base_url}/view?filename=ComfyUI_00001.png&subfolder=&type=output",
                    "seed": workflow["9"]["inputs"]["noise_seed"]
                }
    
    async def generate_3d(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate 3D model from text prompt"""
        # ComfyUI doesn't have direct 3D generation
        # In real implementation, this would use a different service
        image_result = await self.generate_image(prompt, **kwargs)
        return {
            "url": image_result["url"],
            "format": "png",
            "message": "ComfyUI generates 2D images, which can be converted to 3D with other tools"
        }
    
    async def generate_animation(self, model_url: str, **kwargs) -> Dict[str, Any]:
        """Generate animation from 3D model"""
        # ComfyUI doesn't have animation generation
        raise NotImplementedError("ComfyUI provider doesn't support animation generation")
    
    async def generate_audio(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate audio from text prompt"""
        # ComfyUI doesn't have audio generation
        raise NotImplementedError("ComfyUI provider doesn't support audio generation")
    
    async def generate_code(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Generate code from text prompt"""
        # ComfyUI doesn't have code generation
        raise NotImplementedError("ComfyUI provider doesn't support code generation")