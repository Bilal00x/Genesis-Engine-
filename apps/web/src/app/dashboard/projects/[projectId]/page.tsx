"""
Project Detail Page
"""

import { useState } from "react";
import Link from "next/link";

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddSceneModal, setShowAddSceneModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const project = {
    id: "1",
    name: "Project Nexus",
    description: "Sci-fi adventure game with AI-generated assets",
    thumbnail: "/assets/thumbnails/nexus.jpg",
    assets: 47,
    scenes: 8,
    workflows: 5,
    created: "2 days ago",
    updated: "1 day ago",
    owner: "John Doe",
    team: [
      { name: "John Doe", role: "Owner", avatar: "/assets/avatars/john.jpg" },
      { name: "Jane Smith", role: "Artist", avatar: "/assets/avatars/jane.jpg" },
      { name: "Mike Johnson", role: "Developer", avatar: "/assets/avatars/mike.jpg" },
      { name: "Sarah Wilson", role: "Designer", avatar: "/assets/avatars/sarah.jpg" }
    ],
    scenes: [
      { id: "1", name: "City Center", thumbnail: "/assets/thumbnails/city.jpg", assets: 15 },
      { id: "2", name: "Spaceport", thumbnail: "/assets/thumbnails/spaceport.jpg", assets: 12 },
      { id: "3", name: "Underground Lab", thumbnail: "/assets/thumbnails/lab.jpg", assets: 8 },
      { id: "4", name: "Alien Forest", thumbnail: "/assets/thumbnails/forest.jpg", assets: 10 },
      { id: "5", name: "Control Room", thumbnail: "/assets/thumbnails/control.jpg", assets: 5 }
    ],
    workflows: [
      { id: "1", name: "Character Generation", type: "image", status: "completed", created: "2 days ago" },
      { id: "2", name: "City Environment", type: "3d", status: "completed", created: "1 day ago" },
      { id: "3", name: "UI Design", type: "image", status: "in_progress", created: "12 hours ago" },
      { id: "4", name: "Animation Pipeline", type: "animation", status: "pending", created: "6 hours ago" },
      { id: "5", name: "Export to Unity", type: "export", status: "pending", created: "3 hours ago" }
    ]
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 8v8M8 12h8" />
            </svg>
            Edit
          </button>
          
          <button 
            onClick={() => setShowInviteModal(true)}
            className="btn btn-outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Invite
          </button>
          
          <button className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Scene
          </button>
        </div>
      </div>
      
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "overview" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Overview
        </button>
        
        <button 
          onClick={() => setActiveTab("scenes")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "scenes" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Scenes ({project.scenes.length})
        </button>
        
        <button 
          onClick={() => setActiveTab("assets")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "assets" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Assets ({project.assets})
        </button>
        
        <button 
          onClick={() => setActiveTab("workflows")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "workflows" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Workflows ({project.workflows.length})
        </button>
        
        <button 
          onClick={() => setActiveTab("collaborators")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "collaborators" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Collaborators ({project.team.length})
        </button>
      </div>
      
      <div className="flex-1">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Info */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{project.created}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{project.updated}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="font-medium">{project.owner}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium text-green-500">Active</p>
                  </div>
                </div>
                
                <h3 className="font-medium mb-3">Team Members</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.team.map(member => (
                    <div key={member.name} className="flex items-center space-x-2 bg-muted rounded-lg p-2">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="text-primary hover:text-primary/80 text-sm">
                  View all team members
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Assets</span>
                    <span className="font-medium">{project.assets}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Scenes</span>
                    <span className="font-medium">{project.scenes.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Workflows</span>
                    <span className="font-medium">{project.workflows.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">AI Generations</span>
                    <span className="font-medium">124</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Export Jobs</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                
                <div className="space-y-3">
                  {[
                    { action: "Generated character", user: "Jane Smith", time: "2 hours ago" },
                    { action: "Created new workflow", user: "John Doe", time: "4 hours ago" },
                    { action: "Updated scene", user: "Sarah Wilson", time: "1 day ago" },
                    { action: "Exported to Unity", user: "Mike Johnson", time: "1 day ago" }
                  ].map(activity => (
                    <div key={activity.action} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-sm font-bold">{activity.user.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">by {activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "scenes" && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Scenes ({project.scenes.length})</h2>
              <button 
                onClick={() => setShowAddSceneModal(true)}
                className="btn btn-outline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New Scene
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.scenes.map(scene => (
                <div 
                  key={scene.id} 
                  className="border rounded-lg overflow-hidden hover:border-primary transition-colors"
                >
                  <img 
                    src={scene.thumbnail} 
                    alt={scene.name} 
                    className="w-full h-32 object-cover"
                  />
                  
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{scene.name}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{scene.assets} assets</span>
                      <span>Created 3 days ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <button className="text-xs text-primary hover:text-primary/80">
                        Open
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-text">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "assets" && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Assets ({project.assets})</h2>
              <button className="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="group relative bg-card rounded-lg overflow-hidden border hover:border-primary transition-colors"
                >
                  <div className="relative">
                    <img 
                      src={`/assets/thumbnails/asset${i + 1}.jpg`} 
                      alt="Asset" 
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">Asset {i + 1}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Image</span>
                      <span>2.4 MB</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button className="text-xs text-primary hover:text-primary/80">
                        View
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-text">
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "workflows" && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Workflows ({project.workflows.length})</h2>
              <button className="btn btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New Workflow
              </button>
            </div>
            
            <div className="space-y-4">
              {project.workflows.map(workflow => (
                <div 
                  key={workflow.id} 
                  className="border rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-sm font-bold">
                          {workflow.type === "image" ? "I" : 
                           workflow.type === "3d" ? "3D" : 
                           workflow.type === "animation" ? "A" : 
                           workflow.type === "export" ? "E" : "W"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{workflow.name}</h3>
                        <p className="text-sm text-muted-foreground">{workflow.type.charAt(0).toUpperCase() + workflow.type.slice(1)} workflow</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        workflow.status === "completed" ? "bg-green-100 text-green-800" : 
                        workflow.status === "in_progress" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {workflow.status.replace('_', ' ')}
                      </span>
                      
                      <button className="text-xs text-muted-foreground hover:text-text">
                        Run
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Created {workflow.created}</span>
                    <span>12 nodes • 8 connections</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "collaborators" && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Collaborators ({project.team.length})</h2>
              <button 
                onClick={() => setShowInviteModal(true)}
                className="btn btn-outline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Invite
              </button>
            </div>
            
            <div className="space-y-4">
              {project.team.map(member => (
                <div 
                  key={member.name} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">Member</span>
                    
                    <button className="text-xs text-muted-foreground hover:text-text">
                      Edit
                    </button>
                    
                    <button className="text-xs text-destructive hover:text-destructive/80">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Add Scene Modal */}
      {showAddSceneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">New Scene</h2>
              <button 
                onClick={() => setShowAddSceneModal(false)}
                className="text-muted-foreground hover:text-text"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Scene Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter scene name"
                  className="w-full px-3 py-2 rounded-md border bg-background text-text"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="description"
                  placeholder="Describe your scene..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border bg-background text-text"
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddSceneModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn btn-primary"
                >
                  Create Scene
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Invite Collaborators</h2>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-muted-foreground hover:text-text"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 rounded-md border bg-background text-text"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                <select
                  id="role"
                  className="w-full px-3 py-2 rounded-md border bg-background text-text"
                >
                  <option value="member">Member</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn btn-primary"
                >
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}