"""
Project Management Page
"""

import { useState } from "react";
import Link from "next/link";

export default function ProjectManagementPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  const projects = [
    { 
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
      team: ["Jane Smith", "Mike Johnson", "Sarah Wilson"] 
    },
    { 
      id: "2", 
      name: "Cyberpunk City", 
      description: "Urban dystopia with advanced lighting and physics", 
      thumbnail: "/assets/thumbnails/cyberpunk.jpg", 
      assets: 89, 
      scenes: 12, 
      workflows: 12, 
      created: "1 week ago", 
      updated: "3 hours ago", 
      owner: "Jane Smith", 
      team: ["John Doe", "Alex Chen", "Emily Davis"] 
    },
    { 
      id: "3", 
      name: "Fantasy Realm", 
      description: "Magic world with mythical creatures and environments", 
      thumbnail: "/assets/thumbnails/fantasy.jpg", 
      assets: 63, 
      scenes: 15, 
      workflows: 8, 
      created: "2 weeks ago", 
      updated: "1 week ago", 
      owner: "Mike Johnson", 
      team: ["Sarah Wilson", "David Lee", "Lisa Brown"] 
    },
    { 
      id: "4", 
      name: "Space Odyssey", 
      description: "Interstellar exploration with procedural generation", 
      thumbnail: "/assets/thumbnails/space.jpg", 
      assets: 34, 
      scenes: 6, 
      workflows: 3, 
      created: "3 weeks ago", 
      updated: "2 days ago", 
      owner: "Sarah Wilson", 
      team: ["John Doe", "Alex Chen"] 
    },
    { 
      id: "5", 
      name: "Retro Arcade", 
      description: "Classic 8-bit style game with modern AI enhancements", 
      thumbnail: "/assets/thumbnails/retro.jpg", 
      assets: 22, 
      scenes: 4, 
      workflows: 2, 
      created: "1 month ago", 
      updated: "1 week ago", 
      owner: "Alex Chen", 
      team: ["John Doe"] 
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === "all" || 
      (activeTab === "recent" && project.updated === "3 hours ago") ||
      (activeTab === "popular" && project.assets > 50);
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="btn btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Project
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 lg:mb-0">
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "all" 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            All Projects ({projects.length})
          </button>
          
          <button 
            onClick={() => setActiveTab("recent")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "recent" 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            Recent ({projects.filter(p => p.updated === "3 hours ago").length})
          </button>
          
          <button 
            onClick={() => setActiveTab("popular")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              activeTab === "popular" 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            Popular ({projects.filter(p => p.assets > 50).length})
          </button>
        </div>
        
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-background text-text"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="absolute left-3 top-2.5 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div 
            key={project.id} 
            className="card hover:shadow-lg transition-shadow group"
          >
            <div className="relative">
              <img 
                src={project.thumbnail} 
                alt={project.name} 
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-2">{project.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-2 bg-muted rounded-md">
                  <div className="text-sm font-medium">{project.assets}</div>
                  <div className="text-xs text-muted-foreground">Assets</div>
                </div>
                <div className="text-center p-2 bg-muted rounded-md">
                  <div className="text-sm font-medium">{project.scenes}</div>
                  <div className="text-xs text-muted-foreground">Scenes</div>
                </div>
                <div className="text-center p-2 bg-muted rounded-md">
                  <div className="text-sm font-medium">{project.workflows}</div>
                  <div className="text-xs text-muted-foreground">Workflows</div>
                </div>
                <div className="text-center p-2 bg-muted rounded-md">
                  <div className="text-sm font-medium">{project.team.length}</div>
                  <div className="text-xs text-muted-foreground">Team</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>Created {project.created}</span>
                <span>Updated {project.updated}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/assets/avatars/john.jpg" 
                    alt="John Doe" 
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{project.owner}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-xs text-primary hover:text-primary/80">
                    View
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-text">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-4">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground">Create your first project to get started</p>
        </div>
      )}
      
      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">New Project</h2>
              <button 
                onClick={() => setShowNewProjectModal(false)}
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
                <label htmlFor="name" className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter project name"
                  className="w-full px-3 py-2 rounded-md border bg-background text-text"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="description"
                  placeholder="Describe your project..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border bg-background text-text"
                />
              </div>
              
              <div>
                <label htmlFor="template" className="block text-sm font-medium mb-1">Template</label>
                <select
                  id="template"
                  className="w-full px-3 py-2 rounded-md border bg-background text-text"
                >
                  <option value="">None (empty project)</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="horror">Horror</option>
                  <option value="retro">Retro</option>
                </select>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn btn-primary"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}