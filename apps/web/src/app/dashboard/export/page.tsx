"""
Export Page
"""

import { useState } from "react";
import Link from "next/link";

export default function ExportPage() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>("fbx");
  const [showExportModal, setShowExportModal] = useState(false);
  
  const exportFormats = [
    { id: "fbx", name: "FBX", description: "Standard format for 3D models", compatible: ["Unity", "Unreal", "Blender"] },
    { id: "glb", name: "GLB", description: "Binary GL Transmission Format", compatible: ["Unity", "WebGL", "Three.js"] },
    { id: "obj", name: "OBJ", description: "Wavefront Object format", compatible: ["Blender", "Maya", "3ds Max"] },
    { id: "usd", name: "USD", description: "Universal Scene Description", compatible: ["Houdini", "Maya", "Katana"] },
    { id: "png", name: "PNG", description: "High-quality image format", compatible: ["All"] },
    { id: "jpg", name: "JPG", description: "Compressed image format", compatible: ["All"] },
    { id: "psd", name: "PSD", description: "Adobe Photoshop format", compatible: ["Photoshop"] },
    { id: "mp3", name: "MP3", description: "Audio format", compatible: ["All"] }
  ];
  
  const assets = [
    { id: "1", name: "Futuristic City", type: "model_3d", size: "12.5 MB", thumbnail: "/assets/thumbnails/city.jpg" },
    { id: "2", name: "Space Warrior", type: "character", size: "8.2 MB", thumbnail: "/assets/thumbnails/warrior.jpg" },
    { id: "3", name: "Epic Battle Music", type: "audio", size: "5.1 MB", thumbnail: "/assets/thumbnails/music.jpg" },
    { id: "4", name: "Fire Particle", type: "vfx", size: "3.8 MB", thumbnail: "/assets/thumbnails/fire.jpg" },
    { id: "5", name: "Character Rig", type: "animation", size: "15.7 MB", thumbnail: "/assets/thumbnails/rig.jpg" },
    { id: "6", name: "UI Button", type: "ui_element", size: "1.2 MB", thumbnail: "/assets/thumbnails/button.jpg" },
    { id: "7", name: "Forest Environment", type: "environment", size: "22.4 MB", thumbnail: "/assets/thumbnails/forest.jpg" },
    { id: "8", name: "Laser Weapon", type: "weapon", size: "9.6 MB", thumbnail: "/assets/thumbnails/laser.jpg" }
  ];

  const toggleAsset = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleExport = () => {
    if (selectedAssets.length === 0) return;
    setShowExportModal(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Export Assets</h1>
        <button 
          onClick={handleExport}
          disabled={selectedAssets.length === 0}
          className="btn btn-primary disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Export ({selectedAssets.length})
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Selection */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Select Assets</h2>
            
            <div className="space-y-4">
              {assets.map(asset => (
                <div 
                  key={asset.id} 
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedAssets.includes(asset.id) 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted hover:border-primary'
                  }`}
                  onClick={() => toggleAsset(asset.id)}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border">
                    <input 
                      type="checkbox" 
                      checked={selectedAssets.includes(asset.id)}
                      onChange={() => toggleAsset(asset.id)}
                      className="hidden"
                    />
                    {selectedAssets.includes(asset.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  
                  <img 
                    src={asset.thumbnail} 
                    alt={asset.name} 
                    className="w-16 h-16 rounded object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{asset.name}</h3>
                    <p className="text-sm text-muted-foreground">{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} • {asset.size}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedAssets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Select assets to export
              </div>
            )}
          </div>
        </div>
        
        {/* Export Settings */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Export Settings</h2>
            
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Format</label>
                
                <div className="space-y-2">
                  {exportFormats.map(format => (
                    <div 
                      key={format.id} 
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        selectedFormat === format.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-muted hover:border-primary'
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs font-bold">{format.id.toUpperCase().substring(0, 2)}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{format.name}</h3>
                            <p className="text-xs text-muted-foreground">{format.description}</p>
                          </div>
                        </div>
                        
                        {selectedFormat === format.id && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Compatibility */}
              <div>
                <h3 className="font-medium mb-3">Compatible With</h3>
                
                <div className="flex flex-wrap gap-2">
                  {exportFormats.find(f => f.id === selectedFormat)?.compatible.map(platform => (
                    <span 
                      key={platform} 
                      className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Quality Settings */}
              <div>
                <h3 className="font-medium mb-3">Quality Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Resolution</label>
                    <select className="w-full px-3 py-2 rounded-md border bg-background text-text">
                      <option>High (4K)</option>
                      <option>Medium (2K)</option>
                      <option>Low (1K)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Compression</label>
                    <select className="w-full px-3 py-2 rounded-md border bg-background text-text">
                      <option>None</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Optimization</label>
                    <select className="w-full px-3 py-2 rounded-md border bg-background text-text">
                      <option>Standard</option>
                      <option>High</option>
                      <option>Maximum</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Export Credits */}
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Credits Required</h3>
                <p className="text-2xl font-bold">{selectedAssets.length * 2}</p>
                <p className="text-xs text-muted-foreground">* {selectedAssets.length} assets × 2 credits each</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Export {selectedAssets.length} Assets</h2>
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
            
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Export Details</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Format:</span>
                    <span className="font-medium">{exportFormats.find(f => f.id === selectedFormat)?.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Assets:</span>
                    <span className="font-medium">{selectedAssets.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Credits:</span>
                    <span className="font-medium">{selectedAssets.length * 2}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Export Queue</h3>
                
                <div className="space-y-2">
                  {assets.filter(a => selectedAssets.includes(a.id)).map(asset => (
                    <div key={asset.id} className="flex items-center justify-between text-sm">
                      <span>{asset.name}</span>
                      <span className="text-muted-foreground">Pending</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button className="flex-1 btn btn-primary">
                  Start Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}