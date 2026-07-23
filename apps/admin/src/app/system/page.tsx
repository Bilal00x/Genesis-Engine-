"""
System Admin Page
"""

import { useState } from "react";
import Link from "next/link";

export default function SystemPage() {
  const [activeTab, setActiveTab] = useState("settings");
  
  const aiProviders = [
    { id: "openai", name: "OpenAI", enabled: true, status: "online" },
    { id: "flux", name: "Flux", enabled: true, status: "online" },
    { id: "comfyui", name: "ComfyUI", enabled: true, status: "online" },
    { id: "meshy", name: "Meshy", enabled: true, status: "online" },
    { id: "tripo", name: "Tripo", enabled: true, status: "online" },
    { id: "rodin", name: "Rodin", enabled: false, status: "offline" },
    { id: "hunyuan", name: "Hunyuan", enabled: false, status: "offline" },
    { id: "trellis", name: "Trellis", enabled: true, status: "online" },
    { id: "runway", name: "Runway", enabled: true, status: "online" },
    { id: "luma", name: "Luma", enabled: true, status: "online" },
    { id: "stable_diffusion", name: "Stable Diffusion", enabled: true, status: "online" }
  ];

  const systemSettings = [
    { key: "generation_credits.free", label: "Free Plan Credits", value: "100/month", description: "Monthly credit limit for free users" },
    { key: "generation_credits.starter", label: "Starter Plan Credits", value: "500/month", description: "Monthly credit limit for starter users" },
    { key: "generation_credits.pro", label: "Pro Plan Credits", value: "Unlimited", description: "Monthly credit limit for pro users" },
    { key: "export_limits.free", label: "Free Plan Export Limits", value: "1024px", description: "Maximum resolution for free users" },
    { key: "export_limits.starter", label: "Starter Plan Export Limits", value: "2048px", description: "Maximum resolution for starter users" },
    { key: "export_limits.pro", label: "Pro Plan Export Limits", value: "4096px", description: "Maximum resolution for pro users" },
    { key: "ai_providers.enabled", label: "Enabled AI Providers", value: "10/11", description: "Number of enabled AI providers" },
    { key: "system.maintenance_mode", label: "Maintenance Mode", value: "Off", description: "System maintenance mode" }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">System</h1>
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Backup
        </button>
      </div>
      
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "settings" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Settings
        </button>
        
        <button 
          onClick={() => setActiveTab("providers")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "providers" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          AI Providers
        </button>
        
        <button 
          onClick={() => setActiveTab("monitoring")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "monitoring" 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-text'
          }`}
        >
          Monitoring
        </button>
      </div>
      
      <div className="flex-1">
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Settings */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">System Settings</h2>
              
              <div className="space-y-6">
                {systemSettings.map(setting => (
                  <div key={setting.key} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">{setting.label}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{setting.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{setting.value}</span>
                      <button className="text-xs text-primary hover:text-primary/80">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Storage Settings */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Storage Settings</h2>
              
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Storage Type</h3>
                  <p className="text-sm text-muted-foreground mb-1">Current storage backend</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">MinIO</span>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Change
                    </button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Storage Usage</h3>
                  <p className="text-sm text-muted-foreground mb-1">Current storage usage</p>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">45% used (2.3 TB / 5 TB)</span>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Expand
                    </button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Backup Settings</h3>
                  <p className="text-sm text-muted-foreground mb-1">Automatic backup configuration</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Daily at 2:00 AM</span>
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "providers" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">AI Providers</h2>
            
            <div className="space-y-4">
              {aiProviders.map(provider => (
                <div 
                  key={provider.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-bold">{provider.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.status === "online" ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Enabled</span>
                      <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        provider.enabled ? 'bg-primary' : 'bg-muted'
                      }`}>
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          provider.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <button className="text-xs text-primary hover:text-primary/80">
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === "monitoring" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Status */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">System Status</h2>
              
              <div className="space-y-4">
                {[
                  { name: "Database", status: "online", uptime: "99.9%", response_time: "45ms" },
                  { name: "Redis", status: "online", uptime: "99.9%", response_time: "12ms" },
                  { name: "MinIO", status: "online", uptime: "99.8%", response_time: "32ms" },
                  { name: "Celery", status: "online", uptime: "99.7%", response_time: "28ms" },
                  { name: "WebSocket", status: "online", uptime: "99.9%", response_time: "18ms" }
                ].map(service => (
                  <div key={service.name} className="p-3 rounded-md border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === "online" ? "bg-green-500" : "bg-red-500"
                        }`}></div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">{service.response_time}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{service.uptime}</span>
                      <span className="text-xs text-muted-foreground">{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">API Response Time</h3>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>65ms</span>
                    <span>Fast</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Generation Success Rate</h3>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "98%" }}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>98%</span>
                    <span>Excellent</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Queue Length</h3>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>40</span>
                    <span>Normal</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resource Usage */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Resource Usage</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">CPU Usage</h3>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "55%" }}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>55%</span>
                    <span>Normal</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Memory Usage</h3>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>78%</span>
                    <span>Normal</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Network I/O</h3>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>45 Mbps</span>
                    <span>Normal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}