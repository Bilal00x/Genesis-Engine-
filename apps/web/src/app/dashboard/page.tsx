"""
Dashboard Page
"""

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome to AI Game Studio</h1>
        <p className="text-muted-foreground mt-2">
          Start creating amazing games with AI-powered tools.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/projects" className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold">Projects</h3>
          <p className="text-muted-foreground mt-2">Create and manage your game projects</p>
        </Link>
        
        <Link href="/dashboard/assets" className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold">Assets</h3>
          <p className="text-muted-foreground mt-2">Browse and manage your game assets</p>
        </Link>
        
        <Link href="/dashboard/workflows" className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold">Workflows</h3>
          <p className="text-muted-foreground mt-2">Create and save AI generation workflows</p>
        </Link>
        
        <Link href="/dashboard/generations" className="card hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold">Generations</h3>
          <p className="text-muted-foreground mt-2">View your AI-generated assets</p>
        </Link>
      </div>
      
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary">+</span>
            </div>
            <div>
              <p className="font-medium">Created new project</p>
              <p className="text-muted-foreground text-sm">3 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="text-secondary">🎨</span>
            </div>
            <div>
              <p className="font-medium">Generated character art</p>
              <p className="text-muted-foreground text-sm">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-accent">🚀</span>
            </div>
            <div>
              <p className="font-medium">Exported to Unity</p>
              <p className="text-muted-foreground text-sm">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}