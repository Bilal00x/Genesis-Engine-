"""
Asset Upload Page
"""

import { useState } from "react";

export default function AssetUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>("image");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [folder, setFolder] = useState("/");
  const [isUploading, setIsUploading] = useState(false);
  
  const assetTypes = [
    { id: "image", name: "Image", icon: "🖼️" },
    { id: "model_3d", name: "3D Model", icon: "🪵" },
    { id: "animation", name: "Animation", icon: "🎬" },
    { id: "audio", name: "Audio", icon: "🎵" },
    { id: "code", name: "Code", icon: "💻" },
    { id: "material", name: "Material", icon: "🎨" },
    { id: "prefab", name: "Prefab", icon: "🧩" },
    { id: "character", name: "Character", icon: "👤" },
    { id: "weapon", name: "Weapon", icon: "🔫" },
    { id: "building", name: "Building", icon: "🏗️" },
    { id: "vehicle", name: "Vehicle", icon: "🚗" },
    { id: "environment", name: "Environment", icon: "🌳" },
    { id: "ui_element", name: "UI Element", icon: "📱" },
    { id: "concept_art", name: "Concept Art", icon: "✏️" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setIsUploading(true);
    
    // In real implementation, upload file to server
    // For now, simulate upload
    setTimeout(() => {
      setIsUploading(false);
      // Reset form
      setFile(null);
      setName("");
      setDescription("");
      setTags("");
      // Show success message
      alert("Asset uploaded successfully!");
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Upload Asset</h1>
        <button className="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Back to Library
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Upload Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">File</label>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="*/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer"
                >
                  {file ? (
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{file.size} bytes</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="text-sm text-muted-foreground">Drag and drop your file here, or click to browse</p>
                      <p className="text-xs text-muted-foreground">Supports all file types</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            {/* Asset Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Asset Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {assetTypes.map(typeItem => (
                  <button
                    key={typeItem.id}
                    type="button"
                    onClick={() => setType(typeItem.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      type === typeItem.id 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-muted hover:border-primary hover:bg-muted'
                    }`}
                  >
                    <div className="text-lg mb-1">{typeItem.icon}</div>
                    <div className="text-xs font-medium">{typeItem.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter asset name"
                className="w-full px-3 py-2 rounded-md border bg-background text-text"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this asset..."
                rows={3}
                className="w-full px-3 py-2 rounded-md border bg-background text-text"
              />
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="character, sci-fi, futuristic..."
                className="w-full px-3 py-2 rounded-md border bg-background text-text"
              />
            </div>
            
            {/* Folder */}
            <div>
              <label htmlFor="folder" className="block text-sm font-medium mb-1">Folder</label>
              <select
                id="folder"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full px-3 py-2 rounded-md border bg-background text-text"
              >
                <option value="/">/ (Root)</option>
                <option value="/characters">/characters</option>
                <option value="/environments">/environments</option>
                <option value="/props">/props</option>
                <option value="/animations">/animations</option>
                <option value="/audio">/audio</option>
                <option value="/code">/code</option>
                <option value="/materials">/materials</option>
              </select>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || isUploading}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload Asset"
              )}
            </button>
          </form>
        </div>
        
        {/* Preview */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Preview</h2>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-muted rounded-lg h-48 flex items-center justify-center">
              {file ? (
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground mb-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="text-sm text-muted-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size} bytes</p>
                </div>
              ) : (
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground mb-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="text-sm text-muted-foreground">Upload a file to see preview</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Type</h3>
                <p className="text-sm">
                  {assetTypes.find(t => t.id === type)?.name || "Select a type"}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Name</h3>
                <p className="text-sm">
                  {name || "Enter a name"}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Folder</h3>
                <p className="text-sm">
                  {folder}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}