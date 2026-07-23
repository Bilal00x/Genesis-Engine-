"""
Asset Library Page
"""

import { useState } from "react";
import Link from "next/link";

export default function AssetLibraryPage() {
  const [activeType, setActiveType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("/");

  const assetTypes = [
    { id: "all", name: "All Assets", icon: "📦" },
    { id: "image", name: "Images", icon: "🖼️" },
    { id: "model_3d", name: "3D Models", icon: "🪵" },
    { id: "animation", name: "Animations", icon: "🎬" },
    { id: "audio", name: "Audio", icon: "🎵" },
    { id: "code", name: "Code", icon: "💻" },
    { id: "material", name: "Materials", icon: "🎨" },
    { id: "prefab", name: "Prefabs", icon: "🧩" },
    { id: "character", name: "Characters", icon: "👤" },
    { id: "weapon", name: "Weapons", icon: "🔫" },
    { id: "building", name: "Buildings", icon: "🏗️" },
    { id: "vehicle", name: "Vehicles", icon: "🚗" },
    { id: "environment", name: "Environments", icon: "🌳" },
    { id: "ui_element", name: "UI Elements", icon: "📱" },
    { id: "concept_art", name: "Concept Art", icon: "✏️" }
  ];

  const assets = [
    { id: 1, name: "Futuristic City", type: "model_3d", size: "12.5 MB", created: "2 days ago", thumbnail: "/assets/thumbnails/city.jpg", tags: ["city", "futuristic", "building"] },
    { id: 2, name: "Space Warrior", type: "character", size: "8.2 MB", created: "1 week ago", thumbnail: "/assets/thumbnails/warrior.jpg", tags: ["character", "space", "warrior"] },
    { id: 3, name: "Epic Battle Music", type: "audio", size: "5.1 MB", created: "3 days ago", thumbnail: "/assets/thumbnails/music.jpg", tags: ["music", "epic", "battle"] },
    { id: 4, name: "Fire Particle", type: "vfx", size: "3.8 MB", created: "1 day ago", thumbnail: "/assets/thumbnails/fire.jpg", tags: ["vfx", "fire", "particle"] },
    { id: 5, name: "Character Rig", type: "animation", size: "15.7 MB", created: "1 week ago", thumbnail: "/assets/thumbnails/rig.jpg", tags: ["rig", "character", "animation"] },
    { id: 6, name: "UI Button", type: "ui_element", size: "1.2 MB", created: "2 days ago", thumbnail: "/assets/thumbnails/button.jpg", tags: ["ui", "button", "interface"] },
    { id: 7, name: "Forest Environment", type: "environment", size: "22.4 MB", created: "5 days ago", thumbnail: "/assets/thumbnails/forest.jpg", tags: ["environment", "forest", "nature"] },
    { id: 8, name: "Laser Weapon", type: "weapon", size: "9.6 MB", created: "3 days ago", thumbnail: "/assets/thumbnails/laser.jpg", tags: ["weapon", "laser", "sci-fi"] },
    { id: 9, name: "Character Animation", type: "animation", size: "18.3 MB", created: "1 week ago", thumbnail: "/assets/thumbnails/animation.jpg", tags: ["animation", "walk", "character"] },
    { id: 10, name: "Shader Script", type: "code", size: "2.1 MB", created: "4 days ago", thumbnail: "/assets/thumbnails/code.jpg", tags: ["shader", "unity", "hlsl"] }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesType = activeType === "all" || asset.type === activeType;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Asset Library</h1>
        <div className="flex items-center space-x-4">
          <button className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Asset
          </button>
          <button className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M12 8v8M8 12h8" />
            </svg>
            Import
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-6">
          {/* Folder Navigation */}
          <div>
            <h2 className="font-semibold mb-3">Folders</h2>
            <div className="space-y-1">
              <button 
                onClick={() => setSelectedFolder("/")}
                className={`w-full text-left p-2 rounded-md ${selectedFolder === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
              >
                / (Root)
              </button>
              <button 
                onClick={() => setSelectedFolder("/characters")}
                className={`w-full text-left p-2 rounded-md ${selectedFolder === '/characters' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
              >
                /characters
              </button>
              <button 
                onClick={() => setSelectedFolder("/environments")}
                className={`w-full text-left p-2 rounded-md ${selectedFolder === '/environments' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
              >
                /environments
              </button>
              <button 
                onClick={() => setSelectedFolder("/props")}
                className={`w-full text-left p-2 rounded-md ${selectedFolder === '/props' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
              >
                /props
              </button>
              <button 
                onClick={() => setSelectedFolder("/animations")}
                className={`w-full text-left p-2 rounded-md ${selectedFolder === '/animations' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
              >
                /animations
              </button>
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <h2 className="font-semibold mb-3">Tags</h2>
            <div className="flex flex-wrap gap-1">
              {['character', 'environment', 'weapon', 'vehicle', 'vfx', 'audio', 'code', 'ui'].map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Collections */}
          <div>
            <h2 className="font-semibold mb-3">Collections</h2>
            <div className="space-y-1">
              <button className="w-full text-left p-2 rounded-md hover:bg-muted">
                Favorites
              </button>
              <button className="w-full text-left p-2 rounded-md hover:bg-muted">
                Recent
              </button>
              <button className="w-full text-left p-2 rounded-md hover:bg-muted">
                For Unity
              </button>
              <button className="w-full text-left p-2 rounded-md hover:bg-muted">
                For Unreal
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {assetTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    activeType === type.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
            
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search assets..."
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
          
          {/* Asset Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAssets.map(asset => (
              <div 
                key={asset.id} 
                className="group relative bg-card rounded-lg overflow-hidden border hover:border-primary transition-colors"
              >
                <div className="relative">
                  <img 
                    src={asset.thumbnail} 
                    alt={asset.name} 
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
                  <h3 className="font-medium text-sm mb-1 truncate">{asset.name}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{asset.size}</span>
                    <span>{asset.created}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {asset.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
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
          
          {filteredAssets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-4">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No assets found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}