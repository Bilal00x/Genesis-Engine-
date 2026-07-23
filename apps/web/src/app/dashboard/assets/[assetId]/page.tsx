"""
Asset Detail Page
"""

import { useState } from "react";
import Link from "next/link";

export default function AssetDetailPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [showExportModal, setShowExportModal] = useState(false);
  
  const asset = {
    id: "1",
    name: "Futuristic City",
    type: "model_3d",
    size: "12.5 MB",
    created: "2 days ago",
    updated: "1 day ago",
    thumbnail: "/assets/thumbnails/city.jpg",
    file_path: "/assets/models/futuristic_city.glb",
    tags: ["city", "futuristic", "building", "urban"],
    description: "A detailed futuristic cityscape with skyscrapers, flying vehicles, and neon lighting. Perfect for sci-fi games.",
    format: "glb",
    resolution: "1024x1024",
    polygons: "15,240",
    materials: "8",
    textures: "4",
    license: "All Rights Reserved",
    creator: "John Doe",
    project: "Project Nexus",
    version: "1.2",
    downloads: 124
  };

  const exportFormats = [
    { id: "fbx", name: "FBX", description: "Standard format for 3D models", size: "12.5 MB", compatible: ["Unity", "Unreal", "Blender"] },
    { id: "glb", name: "GLB", description: "Binary GL Transmission Format", size: "8.7 MB", compatible: ["Unity", "WebGL", "Three.js"] },
    { id: "obj", name: "OBJ", description: "Wavefront Object format", size: "9.2 MB", compatible: ["Blender", "Maya", "3ds Max"] },
    { id: "usd", name: "USD", description: "Universal Scene Description", size: "10.1 MB", compatible: ["Houdini", "Maya", "Katana"] }
  ];

  const versions = [
    { id: "1.2", date: "2 days ago", changes: "Added lighting and textures", size: "12.5 MB" },
    { id: "1.1", date: "1 week ago", changes: "Optimized polygons", size: "14.8 MB" },
    { id: "1.0", date: "2 weeks ago", changes: "Initial upload", size: "18.3 MB" }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{asset.name}</h1>
          <p className="text-muted-foreground mt-1">{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} • {asset.size}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Export
          </button>
          
          <button className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 8v8M8 12h8" />
            </svg>
            Use in Project
          </button>
          
          <button className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7.5 20.5 2 22l1.5-5.5L9.5 14l11.5-11.5" />
            </svg>
            Download
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Preview</h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Version {asset.version}</span>
                <span>•</span>
                <span>{asset.downloads} downloads</span>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden bg-card">
              <img 
                src={asset.thumbnail} 
                alt={asset.name} 
                className="w-full h-64 object-cover"
              />
              
              <div className="p-4 bg-muted">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</span>
                    <span className="text-sm">{asset.format.toUpperCase()}</span>
                    <span className="text-sm">{asset.resolution}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">{asset.polygons} polygons</span>
                    <span className="text-sm">{asset.materials} materials</span>
                    <span className="text-sm">{asset.textures} textures</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-4">Asset Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{asset.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Metadata</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{asset.created}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span>{asset.updated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creator</span>
                    <span>{asset.creator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project</span>
                    <span>{asset.project}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License</span>
                    <span>{asset.license}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {asset.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Versions */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Versions</h2>
            
            <div className="space-y-3">
              {versions.map(version => (
                <div 
                  key={version.id} 
                  className="p-3 rounded-md border hover:border-primary cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{version.id}</span>
                    <span className="text-xs text-muted-foreground">{version.size}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{version.changes}</p>
                  <p className="text-xs text-muted-foreground">{version.date}</p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 text-sm text-primary hover:text-primary/80">
              View all versions
            </button>
          </div>
          
          {/* Related Assets */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Related Assets</h2>
            
            <div className="space-y-3">
              {[
                { name: "Futuristic Road", type: "model_3d", thumbnail: "/assets/thumbnails/road.jpg" },
                { name: "Neon Sign", type: "model_3d", thumbnail: "/assets/thumbnails/sign.jpg" },
                { name: "City Lights", type: "material", thumbnail: "/assets/thumbnails/light.jpg" }
              ].map(asset => (
                <div 
                  key={asset.name} 
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                >
                  <img 
                    src={asset.thumbnail} 
                    alt={asset.name} 
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            
            <div className="space-y-3">
              <button className="w-full text-left p-2 rounded-md hover:bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 inline">
                  <path d="M12 8v8M8 12h8" />
                </svg>
                Use in Project
              </button>
              
              <button className="w-full text-left p-2 rounded-md hover:bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 inline">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Export
              </button>
              
              <button className="w-full text-left p-2 rounded-md hover:bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 inline">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7.5 20.5 2 22l1.5-5.5L9.5 14l11.5-11.5" />
                </svg>
                Download
              </button>
              
              <button className="w-full text-left p-2 rounded-md hover:bg-muted text-destructive">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 inline">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Export Asset</h2>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-muted-foreground hover:text-text"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {exportFormats.map(format => (
                <div 
                  key={format.id} 
                  className="p-4 border rounded-md hover:border-primary cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{format.name}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">{format.size}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {format.compatible.map(platform => (
                        <span 
                          key={platform} 
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{format.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button 
                onClick={() => setShowExportModal(false)}
                className="flex-1 btn btn-outline"
              >
                Cancel
              </button>
              <button className="flex-1 btn btn-primary">
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}