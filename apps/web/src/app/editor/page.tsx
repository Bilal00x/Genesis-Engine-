"""
Editor Home Page
"""

import Link from "next/link";

export default function EditorPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Visual Node Editor
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect AI tools to create powerful game asset generation workflows
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/editor/new" className="btn btn-primary px-8">
              Create New Workflow
            </Link>
            
            <Link href="/editor/templates" className="btn btn-outline px-8">
              Browse Templates
            </Link>
          </div>
        </div>
      </div>
      
      <div className="border-t bg-card p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Add Nodes</h3>
              <p className="text-muted-foreground">
                Drag and drop AI tools from the sidebar
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-secondary text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Connect Nodes</h3>
              <p className="text-muted-foreground">
                Link nodes to create your workflow
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-accent text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Run & Export</h3>
              <p className="text-muted-foreground">
                Execute your workflow and export assets
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}