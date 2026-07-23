"""
Home Page
"""

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          AI Game Studio
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional AI-powered workspace for game developers, indie studios, artists, and 3D creators.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-4xl">
        <div className="card text-center">
          <h3 className="text-2xl font-bold mb-4">AI Image Generation</h3>
          <p className="text-muted-foreground mb-6">
            Generate concept art, characters, environments, and UI elements with AI.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Get Started
          </Link>
        </div>
        
        <div className="card text-center">
          <h3 className="text-2xl font-bold mb-4">AI 3D Generation</h3>
          <p className="text-muted-foreground mb-6">
            Create 3D models, textures, and animations from text or images.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Get Started
          </Link>
        </div>
        
        <div className="card text-center">
          <h3 className="text-2xl font-bold mb-4">AI Code Generation</h3>
          <p className="text-muted-foreground mb-6">
            Generate Unity, Unreal, and Godot scripts automatically.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-muted-foreground">
          Join thousands of game developers using AI to create amazing games faster.
        </p>
      </div>
    </div>
  );
}